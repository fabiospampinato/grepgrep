#!/usr/bin/env node

/* IMPORT */

import process from 'node:process';
import {bin} from 'specialist';
import color from 'tiny-colors';
import {run} from './index.js';
import type {Options} from './types';

/* MAIN */

bin ( 'gg', 'A grep-like command that uses JavaScript-flavored regular expressions.' )
  .autoExit ( false )
  .autoUpdateNotifier ( false )
  .usage ( `gg ${color.yellow ( '<pattern>' )} ${color.yellow ( '[targets...]' )}` )
  .usage ( `gg ${color.yellow ( 'needle' )} ${color.yellow ( 'src' )}` )
  .usage ( `gg ${color.yellow ( '/^needle/mi' )} ${color.yellow ( 'src' )} ${color.green ( '--max-filesize' )} ${color.blue ( '50K' )}` )
  .usage ( `gg ${color.yellow ( 'needle' )} ${color.yellow ( 'src' )} ${color.green ( '-i' )}` )
  .usage ( `gg ${color.yellow ( 'needle' )} ${color.yellow ( "'node_modules/**/*.js'" )}` )
  .usage ( `gg ${color.yellow ( "$'ascii" )}${color.cyan ( "\\'" )}${color.yellow ( "string'" )} ${color.yellow ( 'src' )} ${color.green ( '--no-ignore' )} ${color.green ( '--hidden' )}` )
  .option ( '--after-context, -A <number>', 'Print this number of lines after each match' )
  .option ( '--before-context, -B <number>', 'Print this number of lines before each match' )
  .option ( '--binary', 'Search into binary files too' )
  .option ( '--byte-offset, -b', 'Print the byte offset for each match' )
  .option ( '--context, -C <number>', 'Print this number of lines before and after each match' )
  .option ( '--context-separator <string>', 'The string to print between non-adjacent output lines' )
  .option ( '--count, -c', 'Print only the number of line matches' )
  .option ( '--count-matches', 'Print only the number of individual matches' )
  .option ( '--field-context-separator <string>', 'The string to print in the gutter for context lines' )
  .option ( '--field-match-separator <string>', 'The string to print in the gutter for matching lines' )
  .option ( '--files', 'Print the paths of files that would be searched into' )
  .option ( '--files-with-match, -l', 'Print only the paths of files with matches' )
  .option ( '--files-without-match, -L', 'Print only the paths of files without matches' )
  .option ( '--fixed-strings, -F', 'Treat the pattern as a literal string instead of a regex' )
  .option ( '--hidden, -.', 'Search into hidden files and hidden directories too' )
  .option ( '--ignore-case, -i', 'Ignore the casing when searching' )
  .option ( '--line-number, -n', 'Print the line number for each match', { default: true } )
  .option ( '--line-regexp, -x', 'Consider only matches surrounded by line boundaries' )
  .option ( '--max-count, -m <number>', 'Maximum number of matching lines to print' )
  .option ( '--max-depth, -d <number>', 'Maximum directories depth to search into' )
  .option ( '--max-filesize <number+suffix?>', 'Maximum size of each file to search into, with optional G/M/K/B suffix' )
  .option ( '--min-filesize <number+suffix?>', 'Minimum size of each file to search into, with optional G/M/K/B suffix' )
  .option ( '--no-ignore', 'Do not respect .gitignore, .ignore and .rgignore files', { default: true } )
  .option ( '--no-ignore-dot', 'Do not respect .ignore and .rgignore files', { default: true } )
  .option ( '--no-ignore-parent', 'Do not look for ignore files above the current work directory', { default: true } )
  .option ( '--no-ignore-vcs', 'Do not respect .gitignore files', { default: true } )
  .option ( '--only-matching, -o', 'Print only the matched parts in each line, individually' )
  .option ( '--passthru', 'Print all lines in each file' )
  .option ( '--quiet, -q', 'Do not print anything to stdout' )
  .option ( '--sort <dimension>', 'Sort results ascendingly by accessed/created/modified/path/size', { enum: ['accessed', 'created', 'modified', 'path', 'size'] } )
  .option ( '--sortr <dimension>', 'Sort results descendingly by accessed/created/modified/path/size', { enum: ['accessed', 'created', 'modified', 'path', 'size'] } )
  .option ( '--threads, -j <number>', 'Number of worker threads to use for searching' )
  .option ( '--type, -t <extensions...>', 'Search only into files with the specified extensions' )
  .option ( '--type-not, -T <extensions...>', 'Do not search into files with the specified extensions' )
  .option ( '--with-filename, -H', 'Print file names before each match', { default: process.stdin.isTTY } )
  .option ( '--word-regexp, -w', 'Consider only matches surrounded by word boundaries' )
  .argument ( '[pattern]', 'The JavaScript regex to search for' )
  .argument ( '[targets...]', 'The files or directories to search into, or globs' )
  .action ( async ( opts, args ) => {
    const options = opts as Options; //TSC
    if ( options.files ) {
      const pattern = '';
      const paths = args.length ? args : ['.'];
      await run ( options, pattern, paths );
    } else {
      const pattern = args[0];
      const paths = args.slice ( 1 );
      await run ( options, pattern, paths );
    }
  })
  .run ();
