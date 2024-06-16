
/* IMPORT */

import {HAS_COLORS} from './constants';
import {binarySearch} from './utils';

/* MAIN */

//TODO: Support lonely "\r" line endings too, for completeness

class Lines {

  /* VARIABLES */

  public readonly length: number;
  public readonly ranges: number[]; // [start1, end1, start2, end2, ...]
  public readonly value: string;

  /* CONSTRUCTOR */

  constructor ( value: string ) {

    this.value = value;
    this.ranges = Lines.getRanges ( value );
    this.length = this.ranges.length / 2;

  }

  /* STATIC API */

  static getRanges ( value: string ): number[] {

    const ranges: number[] = [];

    let pos = 0;
    let length = value.length;

    while ( pos < length ) {

      let startIndex = value.indexOf ( '\n', pos );

      if ( startIndex === -1 ) { // Last line

        ranges.push ( pos, length );

        pos = length;

      } else if ( startIndex > 0 && value.charCodeAt ( startIndex - 1 ) === 13 ) { // \r\n

        ranges.push ( pos, startIndex - 1 );

        pos = startIndex + 1;

      } else { // \n

        ranges.push ( pos, startIndex );

        pos = startIndex + 1;

      }

    }

    return ranges;

  }

  /* API */

  getLineAtIndex ( index: number ): string {

    const range = this.getLineRange ( index );
    const line = this.getLineAtRange ( range );

    return line;

  }

  getLineAtRange ( range: [number, number] ): string {

    const [start, end] = range;
    const line = this.value.slice ( start, end );

    return line;

  }

  getLineHighlightedAtIndex ( index: number, hranges: number[], highlighter: ( value: string ) => string ): string {

    const range = this.getLineRange ( index );
    const line = this.getLineHighlightedAtRange ( range, hranges, highlighter );

    return line;

  }

  getLineHighlightedAtRange ( range: [number, number], hranges: number[], highlighter: ( value: string ) => string ): string {

    const {value} = this;
    const [start, end] = range;

    if ( !HAS_COLORS ) {

      return value.slice ( start, end );

    } else {

      let output = '';
      let pos = start;

      for ( let ri = 0, rl = hranges.length; ri < rl; ri += 2 ) {

        const start = hranges[ri];
        const end = hranges[ri + 1];
        const before = value.slice ( pos, start );
        const current = value.slice ( start, end );
        const highlighted = highlighter ( current );

        output += before + highlighted;
        pos = end;

      }

      output += value.slice ( pos, end );

      return output;

    }

  }

  getLineIndex ( offset: number ): number {

    const {ranges} = this;

    return binarySearch ( 0, this.length, index => {

      const startIndex = index * 2;
      const start = ranges[startIndex];

      if ( offset < start ) return 1;

      const endIndex = startIndex + 1;
      const end = ranges[endIndex];

      if ( offset > end ) return -1;

      return 0;

    });

  }

  getLineRange ( index: number ): [number, number] {

    const {ranges} = this;
    const startIndex = index * 2;
    const start = ranges[startIndex];
    const endIndex = startIndex + 1;
    const end = ranges[endIndex];

    return [start, end];

  }

  getLines (): string[] {

    const {ranges, value} = this;
    const lines: string[] = new Array ( ranges.length / 2 );

    for ( let li = 0, ri = 0, rl = ranges.length; ri < rl; li += 1, ri += 2 ) {

      const start = ranges[ri];
      const end = ranges[ri + 1];
      const line = value.slice ( start, end );

      lines[li] = line;

    }

    return lines;

  }

  getSlice ( start: number, end: number ): string {

    return this.value.slice ( start, end );

  }

}

/* EXPORT */

export default Lines;
