
/* IMPORT */

import memoize from 'lomemo';
import os from 'node:os';
import process from 'node:process';
import color from 'tiny-colors';
import WorkTank from 'worktank';
import Lines from './lines';
import {HAS_COLORS} from './constants';
import {getMatcher, isLineBoundaryRange, isString, isUndefined, isWordBoundaryRange, processTargets, resolveTarget} from './utils';
import type {Matcher, Options, Result, TargetUnresolved, TargetResolved, Target} from './types';

/* MAIN */

//TODO: --ignore-file (to override the list of gitignore-like files?)
//TODO: --max-columns -M
//TODO: --invert-match

//TODO: Support operating on raw buffers directly also, for simple search patterns (once perf on that becomes sane)
//TODO: More memory-efficient matches map (just a single contiguous array of numbers)
//TODO: Maybe discover also files in parallel
//TODO: Clean up the functions in this file, they are probably uglier than necessary

const run = async ( options: Options, pattern: string, paths: string[] ): Promise<void> => {

  const onTargetSerial = ( target: Target ) => searchAndPrint ( options, pattern, target );
  const onTargetParallal = ( target: Target ) => searchAndPrintParallel ( options, pattern, target );
  const onTarget = isString ( options.threads ) ? onTargetParallal : onTargetSerial;
  const onResult = () => options.quiet && process.exit ( 0 );

  const outputs = await processTargets ( paths, options, onTarget, onResult );
  const outputsSeparator = options.files || options.filesWithMatch || options.filesWithoutMatch || options.count || options.countMatches ? '' : '\n';

  process.stdout['_handle']?.setBlocking?.( true );
  process.stdout.write ( outputs.join ( outputsSeparator ) );
  process.exitCode = outputs.length ? 0 : 1;
  process.exit ();

};

const print = ( options: Options, result: Result ): string => {

  const {lines, matchesIndexes, matchesRanges, matchesCount, matchesLineCount, target} = result;
  const {name} = target;

  if ( options.countMatches || ( options.count && options.onlyMatching ) ) { // Count-matches-only output

    const prefixName = options.withFilename ? `${color.magenta ( name )}:` : '';
    const count = matchesCount || 0;

    return `${prefixName}${count}\n`;

  } else if ( options.count ) { // Count-only output

    const prefixName = options.withFilename ? `${color.magenta ( name )}:` : '';
    const count = matchesLineCount || 0;

    return `${prefixName}${count}\n`;

  } else { // Full output

    const beforeLines = Number ( options.passthru ? Infinity : options.beforeContext || options.context || 0 ) || 0;
    const afterLines = Number ( options.passthru ? Infinity : options.afterContext || options.context || 0 ) || 0;

    let output = '';
    let countContextual = 0;
    let lineIndexPrev = -1;

    if ( options.withFilename || options.files || options.filesWithMatch || options.filesWithoutMatch ) { // File name header

      output += `${color.magenta ( name )}\n`;

    }

    if ( lines && matchesIndexes && matchesRanges && !options.files && !options.filesWithMatch && !options.filesWithoutMatch ) { // Lines

      const linesIndexes = matchesIndexes;
      const linesRanges = matchesRanges;

      for ( let li = 0, ll = linesIndexes.length; li <= ll; li++ ) {

        if ( li > 0 && afterLines ) { // Contextual lines after

          let startIndex = linesIndexes[li - 1] + 1;
          let endIndex = Math.min ( lines.length, startIndex + afterLines, linesIndexes[li] ? linesIndexes[li] - beforeLines : lines.length );

          for ( let ai = startIndex, al = endIndex; ai < al; ai++ ) {

            countContextual += 1;

            const [start] = lines.getLineRange ( ai );
            const line = lines.getLineAtIndex ( ai );
            const prefixKindSeparator = options.fieldContextSeparator ?? '-';
            const prefixLineNumber = options.lineNumber ? `${color.green ( `${ai + 1}` )}${prefixKindSeparator}` : '';
            const prefixByteOffset = options.byteOffset ? `${color.green ( `${start}` )}${prefixKindSeparator}` : '';
            const lineProcessed = `${prefixLineNumber}${prefixByteOffset}${line}\n`;

            output += lineProcessed;
            lineIndexPrev = ai;

          }

        }

        if ( li === ll ) break;

        if ( beforeLines ) { // Contextual lines before

          let endIndex = linesIndexes[li];
          let startIndex = Math.max ( lineIndexPrev + 1, 0, endIndex - beforeLines, linesIndexes[li - 1] ?? 0 );

          for ( let bi = startIndex, bl = endIndex; bi < bl; bi++ ) {

            countContextual += 1;

            const [start] = lines.getLineRange ( bi );
            const line = lines.getLineAtIndex ( bi );
            const prefixBlockSeparator = countContextual && lineIndexPrev >= 0 && bi > lineIndexPrev + 1 ? `${options.contextSeparator ?? '--'}\n` : '';
            const prefixKindSeparator = options.fieldContextSeparator ?? '-';
            const prefixLineNumber = options.lineNumber ? `${color.green ( `${bi + 1}` )}${prefixKindSeparator}` : '';
            const prefixByteOffset = options.byteOffset ? `${color.green ( `${start}` )}${prefixKindSeparator}` : '';
            const lineProcessed = `${prefixBlockSeparator}${prefixLineNumber}${prefixByteOffset}${line}\n`;

            output += lineProcessed;
            lineIndexPrev = bi;

          }

        }

        if ( options.onlyMatching ) { // Individual matches only

          const lineIndex = linesIndexes[li];
          const ranges = linesRanges[li];

          for ( let ri = 0, rl = ranges.length; ri < rl; ri += 2 ) {

            const start = ranges[ri];
            const end = ranges[ri + 1];
            const match = color.red ( target.content.slice ( start, end ) );
            const prefixKindSeparator = options.fieldMatchSeparator ?? ':';
            const prefixLineNumber = options.lineNumber ? `${color.green ( `${lineIndex + 1}` )}${prefixKindSeparator}` : '';
            const prefixByteOffset = options.byteOffset ? `${color.green ( `${start}` )}${prefixKindSeparator}` : '';
            const lineProcessed = `${prefixLineNumber}${prefixByteOffset}${match}\n`;

            output += lineProcessed;

          }

          lineIndexPrev = lineIndex;

        } else { // Entire line with matches

          const lineIndex = linesIndexes[li];
          const lineRange = lines.getLineRange ( lineIndex );
          const ranges = linesRanges[li];
          const line = lines.getLineHighlightedAtRange ( lineRange, ranges, color.red );
          const prefixBlockSeparator = countContextual && lineIndexPrev >= 0 && lineIndex > lineIndexPrev + 1 ? `${options.contextSeparator ?? '--'}\n` : '';
          const prefixKindSeparator = options.fieldMatchSeparator ?? ':';
          const prefixLineNumber = options.lineNumber ? `${color.green ( `${lineIndex + 1}` )}${prefixKindSeparator}` : '';
          const prefixByteOffset = options.byteOffset ? `${color.green ( `${lineRange[0]}` )}${prefixKindSeparator}` : '';
          const linePrefixed = `${prefixBlockSeparator}${prefixLineNumber}${prefixByteOffset}${line}\n`;

          output += linePrefixed;
          lineIndexPrev = lineIndex;

        }

      }

    }

    return output;

  }

};

const search = ( options: Options, target: TargetResolved, matcher: Matcher ): Result | undefined => {

  if ( options.files ) return { target };

  const multiMatches = !options.files && !options.filesWithMatch && !options.filesWithoutMatch;
  const maxMatchesLine = Number ( !multiMatches ? 1 : options.passthru ? Infinity : options.maxCount ?? Infinity );

  if ( maxMatchesLine <= 0 ) return;

  let content = target.content;
  let lines: Lines | undefined;
  let matchesIndexes: number[] | undefined;
  let matchesRanges: number[][] | undefined;

  let matchInitial = true;
  let matchLineIndexPrev = -1;
  let matchesCount = 0;
  let matchesLineCount = 0;

  while ( true ) {

    const match = matcher ( content, matchInitial );

    if ( !match ) break;

    const [matchStart, matchEnd] = match;

    matchInitial = false;

    if ( options.lineRegexp && !isLineBoundaryRange ( content, matchStart, matchEnd ) ) continue;

    if ( options.wordRegexp && !isWordBoundaryRange ( content, matchStart, matchEnd ) ) continue;

    if ( options.filesWithMatch ) return { target };

    if ( options.filesWithoutMatch ) return;

    lines ||= new Lines ( content );
    matchesIndexes ||= [];
    matchesRanges ||= [];
    matchesCount += 1;

    const matchLineIndex = lines.getLineIndex ( matchStart );

    if ( matchLineIndex !== matchLineIndexPrev ) { // Out of limit check

      if ( matchesLineCount >= maxMatchesLine ) break;

    }

    if ( matcher.multiline ) { // Potential multi-line match, generalized logic

      const matchContent = content.slice ( matchStart, matchEnd );
      const matchLines = new Lines ( matchContent );
      const matchRanges = matchLines.ranges;

      for ( let ri = 0, rl = matchRanges.length; ri < rl; ri += 2 ) {

        const start = matchStart + matchRanges[ri];
        const end = matchStart + matchRanges[ri + 1];
        const lineIndex = ri ? lines.getLineIndex ( start ) : matchLineIndex;

        if ( lineIndex === matchLineIndexPrev ) {

          matchesRanges[matchesRanges.length - 1].push ( start, end );

        } else {

          matchesIndexes.push ( lineIndex );
          matchesRanges.push ( [start, end] );

        }

      }

    } else { // Guaranteed single-line match, optimized logic

      if ( matchLineIndex === matchLineIndexPrev ) {

        matchesRanges[matchesRanges.length - 1].push ( matchStart, matchEnd );

      } else {

        matchesIndexes.push ( matchLineIndex );
        matchesRanges.push ( [matchStart, matchEnd] );

      }

    }

    if ( matchLineIndex !== matchLineIndexPrev ) { // Out of limit metadata update

      matchesLineCount += 1;
      matchLineIndexPrev = matchLineIndex;

    }

  }

  if ( !lines || !matchesIndexes || !matchesRanges ) {

    if ( options.filesWithoutMatch ) return { target };

    return;

  } else {

    return { lines, matchesIndexes, matchesRanges, matchesCount, matchesLineCount, target };

  }

};

const searchAndPrint = async ( options: Options, pattern: string, t: Target ): Promise<string | undefined> => {

  const matcher = getMatcher ( pattern, options.ignoreCase, options.fixedStrings );
  const target = await resolveTarget ( options, t );
  const result = search ( options, target, matcher );

  if ( isUndefined ( result ) ) return;

  const output = print ( options, result );

  return output;

};

const searchAndPrintParallel = (() => {

  const getPool = memoize ( ( options: Options ) => {
    const COLOR = HAS_COLORS ? '1' : '0';
    return new WorkTank ({
      name: 'grepgrep',
      size: Number ( options.threads || Math.max ( 1, os.cpus ().length - 1 ) ) || 1,
      env: { COLOR },
      methods: new URL ( './index.js', import.meta.url ),
      warmup: false
    });
  });

  return ( options: Options, pattern: string, t: Target ): Promise<string | undefined> => {

    return getPool ( options ).exec ( 'searchAndPrint', [options, pattern, t] );

  };

})();

/* EXPORT */

export {run, print, search, searchAndPrint};
export type {Options, Result, TargetUnresolved, TargetResolved, Target};