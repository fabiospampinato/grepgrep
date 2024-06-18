
/* IMPORT */

import benchmark from 'benchloop';
import exec from 'nanoexec';
import {TESTS_SHALLOW, TESTS_FILES, TESTS_DEEP} from '../test/fixtures.js';

/* MAIN */

benchmark.config ({
  iterations: 1
});

for ( const command of ['rg', 'gg'] ) {

  benchmark.group ( command, () => {

    for ( const [name, tests] of [['shallow', TESTS_SHALLOW], ['files', TESTS_FILES], ['deep', TESTS_DEEP]] ) {

      benchmark ({
        name: `${name}-${tests.length}`,
        fn: async () => {
          for ( const commands of tests ) {
            await exec ( commands[command], { stdio: ['inherit'], shell: true } );
          }
        }
      });

    }

  });

}

benchmark.summary ();
