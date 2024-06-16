
/* IMPORT */

import type Lines from './lines';

/* MAIN */

type Matcher = {
  ( value: string, isInitial: boolean ): [number, number] | undefined,
  multiline: boolean
};

type Options = {
  afterContext?: number,
  beforeContext?: number,
  binary?: boolean,
  byteOffset?: boolean,
  context?: number,
  contextSeparator?: string,
  count?: boolean,
  countMatches?: boolean,
  fieldContextSeparator?: string,
  fieldMatchSeparator?: string,
  files?: boolean,
  filesWithMatch?: boolean,
  filesWithoutMatch?: boolean,
  fixedStrings?: boolean,
  hidden?: boolean,
  ignore?: boolean,
  ignoreCase?: boolean,
  ignoreDot?: boolean,
  ignoreParent?: boolean,
  ignoreVcs?: boolean,
  lineNumber?: boolean,
  lineRegexp?: boolean,
  maxCount?: number,
  maxDepth?: number,
  maxFilesize?: string,
  minFilesize?: string,
  onlyMatching?: boolean,
  passthru?: boolean,
  quiet?: boolean,
  sort: 'accessed' | 'created' | 'modified' | 'path' | 'size',
  sortr: 'accessed' | 'created' | 'modified' | 'path' | 'size',
  threads?: number,
  type?: string[],
  typeNot?: string[],
  withFilename?: boolean,
  wordRegexp?: boolean
};

type Result = {
  lines?: Lines,
  matchesIndexes?: number[],
  matchesRanges?: number[][],
  matchesCount?: number,
  matchesLineCount?: number,
  name: string
};

type Stats = {
  atimeMs: number,
  birthtimeMs: number,
  mtimeMs: number,
  size: number
};

type TargetUnresolved = {
  name: string,
  filePath: string
};

type TargetResolved = {
  name: string,
  content: string
};

type Target = TargetUnresolved | TargetResolved;

/* EXPORT */

export type {Matcher, Options, Result, Stats, TargetUnresolved, TargetResolved, Target};
