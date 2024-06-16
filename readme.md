
<p align="center">
  <img src="./resources/banner.png" alt="GrepGreps's Banner" width="640px" height="320px">
</p>

# GrepGrep (gg)

A [`grep`](https://www.gnu.org/software/grep)-like command that uses JavaScript-flavored regular expressions.

This is significantly inspired by, and tested against, the wonderful [`ripgrep`](https://github.com/BurntSushi/ripgrep).

## Features

- Regexes are expressed in JavaScript's flavor of regular expressions.
- Regexes that match this regex: `^/(.*)/([a-z]*)$`, will automatically be split into their source and flags parts.
- Regexes are always executed in something equivalent to `ripgrep`'s "multiline" mode.
- Binary files are ignored by default, like in `ripgrep`.
- Hidden files/folders are ignored by default, like in `ripgrep`.
- Ignored files/folders are not searched into by default, like in `ripgrep`.
- Searching inside a folder always automatically searches into it recursively.
- Searching using globs as targets, expressed in [`zeptomatch`](https://github.com/fabiospampinato/zeptomatch)'s flavor, is supported too.
- The sorting order of the output is always deterministic, unlike in `ripgrep`.
- The most common flags from `grep` and `ripgrep` should be supported.

## Misfeatures

- Searching in parallel is supported to some degree, but it's opt-in, since worker threads in JS are pretty bad and they end up making this command slower in many cases...
- Some flags you may be used to could be missing here, please open an issue about what you need.

## Install

```sh
npm install -g grepgrep
```

## Usage

```
gg 0.1.1

USAGE

  gg [pattern] [targets...]
  gg needle src
  gg /^needle/mi src --max-filesize 50K
  gg needle src -i
  gg needle 'node_modules/**/*.js'
  gg $'ascii\'string' src --no-ignore --hidden

ARGUMENTS

  [pattern]     The JavaScript regex to search for
  [targets...]  The files or directories to search into, or globs

OPTIONS

  --help                              Display help for the command
  --version, -v                       Display the version number
  --after-context, -A <number>        Print this number of lines after each match
  --before-context, -B <number>       Print this number of lines before each match
  --binary                            Search into binary files too
  --byte-offset, -b                   Print the byte offset for each match
  --context, -C <number>              Print this number of lines before and after each match
  --context-separator <string>        The string to print between non-adjacent output lines
  --count, -c                         Print only the number of line matches
  --count-matches                     Print only the number of individual matches
  --field-context-separator <string>  The string to print in the gutter for context lines
  --field-match-separator <string>    The string to print in the gutter for matching lines
  --files                             Print the paths of files that would be searched into
  --files-with-match, -l              Print only the paths of files with matches
  --files-without-match, -L           Print only the paths of files without matches
  --fixed-strings, -F                 Treat the pattern as a literal string instead of a regex
  --hidden, -.                        Search into hidden files and hidden directories too
  --ignore-case, -i                   Ignore the casing when searching
  --line-number, -n                   Print the line number for each match
  --line-regexp, -x                   Consider only matches surrounded by line boundaries
  --max-count, -m <number>            Maximum number of matching lines to print
  --max-depth, -d <number>            Maximum directories depth to search into
  --max-filesize <number+suffix?>     Maximum size of each file to search into, with optional G/M/K/B suffix
  --min-filesize <number+suffix?>     Minimum size of each file to search into, with optional G/M/K/B suffix
  --no-ignore                         Do not respect .gitignore, .ignore and .rgignore files
  --no-ignore-dot                     Do not respect .ignore and .rgignore files
  --no-ignore-parent                  Do not look for ignore files above the current work directory
  --no-ignore-vcs                     Do not respect .gitignore files
  --only-matching, -o                 Print only the matched parts in each line, individually
  --passthru                          Print all lines in each file
  --quiet, -q                         Do not print anything to stdout
  --sort <dimension>                  Sort results ascendingly by accessed/created/modified/path/size
  --sortr <dimension>                 Sort results descendingly by accessed/created/modified/path/size
  --threads, -j <number>              Number of worker threads to use for searching
  --type, -t <extensions...>          Search only into files with the specified extensions
  --type-not, -T <extensions...>      Do not search into files with the specified extensions
  --with-filename, -H                 Print file names before each match
  --word-regexp, -w                   Consider only matches surrounded by word boundaries
```

## License

MIT © Fabio Spampinato
