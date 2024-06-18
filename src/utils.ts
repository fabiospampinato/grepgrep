
/* IMPORT */

import memoize from 'lomemo-one';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {text as stream2text} from 'node:stream/consumers';
import makeCounterPromise from 'promise-make-counter';
import {exit} from 'specialist';
import escapeRegex from 'string-escape-regex';
import readdir from 'tiny-readdir-glob-gitignore';
import {NO_STATS} from './constants';
import type {Matcher, Options, TargetUnresolved, TargetResolved, Target} from './types';

/* MAIN */

const binarySearch = ( start: number, end: number, comparator: ( index: number ) => -1 | 0 | 1 ): number => {

  let low = 0;
  let high = ( end - start );

  while ( low < high ) {

    const mid = Math.floor ( ( low + high ) / 2 );
    const index = ( mid + start );
    const result = comparator ( index );

    if ( result < 0 ) {

      low = mid + 1;

    } else if ( result > 0 ) {

      high = mid;

    } else {

      return index;

    }

  }

  return -1;

};

const comparePaths = ( a: string, b: string ): -1 | 0 | 1 => {

  for ( let i = 0, al = a.length, bl = b.length; i < al; i++ ) {

    if ( i >= bl ) return 1;

    const ac = a.charCodeAt ( i );
    const bc = b.charCodeAt ( i );

    if ( ac === bc ) continue;
    if ( ac === 47 || ac === 92 ) return -1; // / or \
    if ( bc === 47 || bc === 92 ) return 1; // / or \
    if ( ac < bc ) return -1;
    if ( ac > bc ) return 1;

  }

  return 0;

};

const getMatcher = memoize ( ( pattern: string, isCaseInsensitive?: boolean, isFixed?: boolean ): Matcher => {

  const [source, flags] = getRegexParts ( pattern );

  if ( !isCaseInsensitive && !flags && ( isFixed || isRegexStatic ( source ) ) ) {

    return getMatcherString ( source );

  } else {

    const re = getRegex ( pattern, isCaseInsensitive, isFixed );

    return getMatcherRegex ( re );

  }

});

const getMatcherRegex = ( pattern: RegExp ): Matcher => {

  let pos = 0;

  const matcher: Matcher = ( value, initial ) => {

    pos = initial ? 0 : pos;

    pattern.lastIndex = pos;

    const match = pattern.exec ( value );

    if ( !match ) return;

    const start = match.index;
    const end = start + match[0].length;

    pos = end;

    return [start, end];

  };

  matcher.multiline = true; //TODO: Be more strict about this, inspecting the actual regex itself

  return matcher;

};

const getMatcherString = ( pattern: string ): Matcher => {

  let pos = 0;

  const matcher: Matcher = ( value, initial ) => {

    pos = initial ? 0 : pos;

    const start = value.indexOf ( pattern, pos );

    if ( start === -1 ) return;

    const end = start + pattern.length;

    pos = end;

    return [start, end];

  };

  matcher.multiline = /\r?\n|\r/.test ( pattern );

  return matcher;

};

const getPathExtension = ( filePath: string ): string => {

  const re = /\.([^\\\/\.]+)$/;
  const match = filePath.match ( re );

  if ( !match ) return '';

  return match[1];

};

const getPathRelative = ( fromPath: string, toPath: string ): string => {

  if ( toPath.startsWith ( fromPath ) ) {

    if ( toPath[fromPath.length] === path.sep ) {

      return toPath.slice ( fromPath.length + 1 );

    }

  }

  return path.relative ( fromPath, toPath );

};

const getReaddir = ( globs: string[], options: Options ) => {

  return readdir ( globs, {
    cwd: process.cwd (),
    depth: options.maxDepth,
    limit: Infinity,
    followSymlinks: false,
    ignoreFiles: options.ignore ? ( options.ignoreDot ? ( options.ignoreVcs ? ['.gitignore', '.ignore', '.rgignore'] : ['.ignore', '.rgignore'] ) : ( options.ignoreVcs ? ['.gitignore'] : [] ) ) : [],
    ignoreFilesFindAbove: options.ignoreParent,
    ignoreFilesFindBetween: true,
    ignoreFilesStrictly: false,
    ignore: filePath => {
      if ( options.hidden ) return false;
      const hiddenRe = /[\\\/]\.[^\\\/]*$/;
      const isHidden = hiddenRe.test ( filePath );
      return isHidden;
    }
  });

};

const getRegex = ( pattern: string, isCaseInsensitive?: boolean, isFixed?: boolean ): RegExp => {

  const flagsAlways = isCaseInsensitive ? 'gi' : 'g';

  if ( isFixed ) {

    const source = escapeRegex ( pattern );
    const re = new RegExp ( source, flagsAlways );

    return re;

  } else {

    const [source, flagsCustom] = getRegexParts ( pattern );
    const flags = uniq ( `${flagsAlways}${flagsCustom}`.split ( '' ) ).join ( '' );
    const re = new RegExp ( source, flags );

    return re;

  }

};

const getRegexParts = ( pattern: string ): [source: string, flags: string] => {

  const regexRe = /^\/(.*)\/([a-z]*)$/;
  const match = pattern.match ( regexRe );

  if ( !match ) return [pattern, ''];

  const source = match[1];
  const flags = match[2];

  return [source, flags];

};

const getSize = ( value?: string ): number | undefined => {

  if ( !value ) return;

  const match = /^(\d+)([kmg]?b?|b)$/i.exec ( value );

  if ( !match ) return;

  const [_, sizeRaw, unitRaw] = match;
  const size = parseInt ( sizeRaw );
  const unit = unitRaw.toLowerCase ()[0];
  const multiplier = unit === 'g' ? 1024 ** 3 : unit === 'm' ? 1024 ** 2 : unit === 'k' ? 1024 : 1;
  const bytes = size * multiplier;

  return bytes;

};

const getStdin = async (): Promise<string | undefined> => {

  if ( !hasStdin () ) return;

  return stream2text ( process.stdin );

};

const hasStdin = (): boolean => {

  // Without a TTY, the process is likely, but not certainly, being piped

  return !process.stdin.isTTY;

};

const isBinaryPath = (() => {

  //TODO: Switch back to is-binary-path or something more reliable (buffer-based) for this

  const binaryExtensionsSet = new Set ([ '3dm', '3ds', '3g2', '3gp', '7z', 'a', 'aac', 'adp', 'afdesign', 'afphoto', 'afpub', 'ai', 'aif', 'aiff', 'alz', 'ape', 'apk', 'appimage', 'ar', 'arj', 'asf', 'au', 'avi', 'bak', 'baml', 'bh', 'bin', 'bk', 'bmp', 'btif', 'bz2', 'bzip2', 'cab', 'caf', 'cgm', 'class', 'cmx', 'cpio', 'cr2', 'cur', 'dat', 'dcm', 'deb', 'dex', 'djvu', 'dll', 'dmg', 'dng', 'doc', 'docm', 'docx', 'dot', 'dotm', 'dra', 'DS_Store', 'dsk', 'dts', 'dtshd', 'dvb', 'dwg', 'dxf', 'ecelp4800', 'ecelp7470', 'ecelp9600', 'egg', 'eol', 'eot', 'epub', 'exe', 'f4v', 'fbs', 'fh', 'fla', 'flac', 'flatpak', 'fli', 'flv', 'fpx', 'fst', 'fvt', 'g3', 'gh', 'gif', 'graffle', 'gz', 'gzip', 'h261', 'h263', 'h264', 'icns', 'ico', 'ief', 'img', 'ipa', 'iso', 'jar', 'jpeg', 'jpg', 'jpgv', 'jpm', 'jxr', 'key', 'ktx', 'lha', 'lib', 'lvp', 'lz', 'lzh', 'lzma', 'lzo', 'm3u', 'm4a', 'm4v', 'mar', 'mdi', 'mht', 'mid', 'midi', 'mj2', 'mka', 'mkv', 'mmr', 'mng', 'mobi', 'mov', 'movie', 'mp3', 'mp4', 'mp4a', 'mpeg', 'mpg', 'mpga', 'mxu', 'nef', 'npx', 'numbers', 'nupkg', 'o', 'odp', 'ods', 'odt', 'oga', 'ogg', 'ogv', 'otf', 'ott', 'pages', 'pbm', 'pcx', 'pdb', 'pdf', 'pea', 'pgm', 'pic', 'png', 'pnm', 'pot', 'potm', 'potx', 'ppa', 'ppam', 'ppm', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'psd', 'pya', 'pyc', 'pyo', 'pyv', 'qt', 'rar', 'ras', 'raw', 'resources', 'rgb', 'rip', 'rlc', 'rmf', 'rmvb', 'rpm', 'rtf', 'rz', 's3m', 's7z', 'scpt', 'sgi', 'shar', 'snap', 'sil', 'sketch', 'slk', 'smv', 'snk', 'so', 'stl', 'suo', 'sub', 'swf', 'tar', 'tbz', 'tbz2', 'tga', 'tgz', 'thmx', 'tif', 'tiff', 'tlz', 'ttc', 'ttf', 'txz', 'udf', 'uvh', 'uvi', 'uvm', 'uvp', 'uvs', 'uvu', 'viv', 'vob', 'war', 'wav', 'wax', 'wbmp', 'wdp', 'weba', 'webm', 'webp', 'whl', 'wim', 'wm', 'wma', 'wmv', 'wmx', 'woff', 'woff2', 'wrm', 'wvx', 'xbm', 'xif', 'xla', 'xlam', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx', 'xm', 'xmind', 'xpi', 'xpm', 'xwd', 'xz', 'z', 'zip', 'zipx', 'wasm' ]);

  return ( filePath: string ): boolean => {

    const extension = getPathExtension ( filePath );
    const isBinary = binaryExtensionsSet.has ( extension );

    return isBinary;

  };

})();

const isLineBoundaryRange = ( value: string, start: number, end: number ): boolean => {

  if ( start === 0 || end === value.length ) return true;

  const leftCharCode = value.charCodeAt ( start - 1 );

  if ( leftCharCode !== 10 && leftCharCode !== 13 ) return false; // \n or \r

  const rightCharCode = value.charCodeAt ( end );

  if ( rightCharCode !== 10 && rightCharCode !== 13 ) return false; // \n or \r

  return true;

};

const isRegexStatic = ( pattern: string ): boolean => {

  return /^[^\\^$.*+?()[\]{}|]*$/i.test ( pattern );

};

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

const isUndefined = ( value: unknown ): value is undefined => {

  return value === undefined;

};

const isWordBoundary = ( leftChar: string, rightChar: string ): boolean => {

  if ( !leftChar || !rightChar ) return true;

  const wordRe = /^\w$/;
  const isBoundary = wordRe.test ( leftChar ) !== wordRe.test ( rightChar );

  return isBoundary;

};

const isWordBoundaryRange = ( value: string, start: number, end: number ): boolean => {

  if ( start === 0 || end === value.length ) return true;

  const startLeftChar = value[start - 1];
  const startRightChar = value[start];

  if ( !isWordBoundary ( startLeftChar, startRightChar ) ) return false;

  const endLeftChar = value[end - 1];
  const endRightChar = value[end];

  if ( !isWordBoundary ( endLeftChar, endRightChar ) ) return false;

  return true;

};

const processTargetsFromPaths = async ( globs: string[], options: Options, onTarget: ( target: TargetUnresolved ) => Promise<string | undefined>, onResult: ( result: string ) => void ): Promise<string[]> => {

  /* FILTERING - TYPE */

  let {files} = await getReaddir ( globs, options );

  if ( options.type?.length || options.typeNot?.length ) {

    const allowed = new Set ( options.type ?? [] );
    const disallowed = new Set ( options.typeNot ?? [] );

    files = files.filter ( filePath => {

      const ext = getPathExtension ( filePath );

      if ( allowed.size && !allowed.has ( ext ) ) return false;
      if ( disallowed.size && disallowed.has ( ext ) ) return false;

      return true;

    });

  }

  /* FILTERING - BINARY */

  if ( !options.files && !options.binary ) {

    files = files.filter ( filePath => !isBinaryPath ( filePath ) );

  }

  /* STATTING */

  let needsStatting = !!options.maxFilesize || !!options.minFilesize || ( !!options.sort && options.sort !== 'path' ) || ( !!options.sortr && options.sortr !== 'path' );
  let filesData = files.map ( filePath => ({ filePath, fileStats: NO_STATS, result: <string | undefined> undefined }) );

  if ( needsStatting ) {

    const statting = makeCounterPromise ();

    filesData.forEach ( fileDatum => {

      statting.increment ();

      fs.stat ( fileDatum.filePath, ( error, fileStats ) => {

        if ( error ) exit ( error.toString () );

        fileDatum.fileStats = fileStats;

        statting.decrement ();

      });

    });

    await statting.promise;

  }

  /* FILTERING - SIZE */

  const maxFilesize = getSize ( options.maxFilesize ) ?? Infinity;

  if ( maxFilesize >= 0 && maxFilesize < Infinity ) {

    filesData = filesData.filter ( ({ fileStats }) => fileStats.size <= maxFilesize );

  }

  const minFileSize = getSize ( options.minFilesize ) ?? 0;

  if ( minFileSize >= 0 && minFileSize < Infinity ) {

    filesData = filesData.filter ( ({ fileStats }) => fileStats.size >= minFileSize );

  }

  /* PROCESSING */

  const cwd = process.cwd ();
  const processing = makeCounterPromise ();

  filesData.forEach ( fileDatum => {

    processing.increment ();

    const {filePath} = fileDatum;
    const name = getPathRelative ( cwd, filePath );
    const target = { name, filePath };

    onTarget ( target ).then ( result => {

      if ( isString ( result ) ) {

        onResult ( result );

        fileDatum.result = result;

      }

      processing.decrement ();

    });

  });

  await processing.promise;

  /* FILTERING - RESULT */

  filesData = filesData.filter ( ({ result }) => isString ( result ) );

  /* SORTING */

  const sortDimension = options.sort || options.sortr;
  const sortReversed = !!options.sortr;

  if ( sortDimension === 'accessed' ) {

    filesData.sort ( ( a, b ) => a.fileStats.atimeMs - b.fileStats.atimeMs );

  } else if ( sortDimension === 'created' ) {

    filesData.sort ( ( a, b ) => a.fileStats.birthtimeMs - b.fileStats.birthtimeMs );

  } else if ( sortDimension === 'modified' ) {

    filesData.sort ( ( a, b ) => a.fileStats.mtimeMs - b.fileStats.mtimeMs );

  } else if ( sortDimension === 'path' || !sortDimension ) { // This is the default sort dimension

    filesData.sort ( ( a, b ) => comparePaths ( a.filePath, b.filePath ) );

  } else if ( sortDimension === 'size' ) {

    filesData.sort ( ( a, b ) => a.fileStats.size - b.fileStats.size );

  }

  if ( sortReversed ) {

    filesData.reverse ();

  }

  /* RETURNING */

  const results = filesData.map ( ({ result }) => result || '' );

  return results;

};

const processTargetsFromStdin = async ( onTarget: ( target: TargetResolved ) => Promise<string | undefined>, onResult: ( result: string ) => void ): Promise<string[]> => {

  const name = '<stdin>';
  const content = await getStdin ();

  if ( !isString ( content ) ) return [];

  const target = { name, content };
  const output = await onTarget ( target );

  if ( isUndefined ( output ) ) return [];

  onResult ( output );

  return [output];

};

const resolveTarget = async ( options: Options, target: Target ): Promise<TargetResolved> => {

  if ( 'content' in target ) { // Resolved

    return target;

  } else if ( options.files ) { // Unresolved, but no need to actually resolve it

    const {name} = target;
    const content = '';

    return { name, content };

  } else { // Unresolved, and we need to actually resolve it

    const {name, filePath} = target;
    const content = await fs.promises.readFile ( filePath, 'utf8' ); //TODO: We could already know the file size, no need to have the file statted again under the hood, potentially

    return { name, content };

  }

};

const uniq = <T> ( values: T[] ): T[] => {

  return [...new Set ( values )];

};

/* EXPORT */

export {binarySearch, comparePaths, getMatcher, getMatcherRegex, getMatcherString, getPathExtension, getPathRelative, getReaddir, getRegex, getRegexParts, getSize, getStdin, hasStdin, isBinaryPath, isLineBoundaryRange, isRegexStatic, isString, isUndefined, isWordBoundary, isWordBoundaryRange, processTargetsFromPaths, processTargetsFromStdin, resolveTarget, uniq};
