
/* IMPORT */

import {describe} from 'fava';
import fs from 'node:fs';
import exec from 'tiny-exec';
import {TESTS_ALL} from './fixtures.js';

/* HELPERS */

const normalize = str => {
  return str.replaceAll ( '\r\n', '\n' );
};

/* MAIN */

describe ( 'GrepGrep', it => {

  for ( const {rg, gg} of TESTS_ALL ) {

    it ( rg, async t => {

      const result_rg = await exec ( rg, { stdio: ['inherit'], shell: true } );
      const result_gg = await exec ( gg, { stdio: ['inherit'], shell: true } );

      const ok_rg = result_rg.ok;
      const ok_gg = result_gg.ok;

      const stderr_rg = normalize ( result_rg.stderr.toString () );
      const stderr_gg = normalize ( result_gg.stderr.toString () );

      const stdout_rg = normalize ( result_rg.stdout.toString () );
      const stdout_gg = normalize ( result_gg.stdout.toString () );

      if ( stdout_rg !== stdout_gg ) {
        fs.writeFileSync ( 'test_rg_stdout.txt', result_rg.stdout );
        fs.writeFileSync ( 'test_gg_stdout.txt', result_gg.stdout );
      }

      t.is ( ok_rg, ok_gg );
      t.is ( stderr_rg, stderr_gg );
      t.is ( stdout_rg, stdout_gg );

    });

  }

});
