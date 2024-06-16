
/* MAIN */

const TESTS_SHALLOW = [
  {
    rg: "cat package.json | rg missing",
    gg: "cat package.json | node dist/bin.js missing"
  },
  {
    rg: "cat package.json | rg as",
    gg: "cat package.json | node dist/bin.js as --no-line-number"
  },
  {
    rg: "cat package.json | rg as -n",
    gg: "cat package.json | node dist/bin.js as"
  },
  {
    rg: "cat package.json | rg as -n",
    gg: "cat package.json | node dist/bin.js as -n"
  },
  {
    rg: "cat package.json | rg as -bn",
    gg: "cat package.json | node dist/bin.js as -b"
  },
  {
    rg: "cat package.json | rg as -nH --heading",
    gg: "cat package.json | node dist/bin.js as -H"
  },
  {
    rg: "cat package.json | rg as -bnH --heading",
    gg: "cat package.json | node dist/bin.js as -bnH"
  },
  {
    rg: "cat package.json | rg s. -n",
    gg: "cat package.json | node dist/bin.js s."
  },
  {
    rg: "cat package.json | rg s. -nF",
    gg: "cat package.json | node dist/bin.js s. -F"
  },
  {
    rg: "cat package.json | rg S -n",
    gg: "cat package.json | node dist/bin.js S"
  },
  {
    rg: "cat package.json | rg S -n",
    gg: "cat package.json | node dist/bin.js '/S/'"
  },
  {
    rg: "cat package.json | rg S -in",
    gg: "cat package.json | node dist/bin.js S -i"
  },
  {
    rg: "cat package.json | rg S -in",
    gg: "cat package.json | node dist/bin.js '/S/i'"
  },
  {
    rg: "cat package.json | rg S -in",
    gg: "cat package.json | node dist/bin.js '/S/' -i"
  },
  {
    rg: "cat package.json | rg S -in",
    gg: "cat package.json | node dist/bin.js '/S/i' -i"
  },
  {
    rg: "cat package.json | rg as -n --count-matches",
    gg: "cat package.json | node dist/bin.js as --count-matches"
  },
  {
    rg: "cat package.json | rg as -bnH --count-matches",
    gg: "cat package.json | node dist/bin.js as -bnH --count-matches"
  },
  {
    rg: "cat package.json | rg as -cn",
    gg: "cat package.json | node dist/bin.js as -c"
  },
  {
    rg: "cat package.json | rg as -bnH -c",
    gg: "cat package.json | node dist/bin.js as -bnH -c"
  },
  {
    rg: "cat package.json | rg as -on",
    gg: "cat package.json | node dist/bin.js as -o"
  },
  {
    rg: "cat package.json | rg as -bnH -o --heading",
    gg: "cat package.json | node dist/bin.js as -bnH -o"
  },
  {
    rg: "cat package.json | rg javascript -n",
    gg: "cat package.json | node dist/bin.js javascript"
  },
  {
    rg: "cat package.json | rg javascript -nw",
    gg: "cat package.json | node dist/bin.js javascript -w"
  },
  {
    rg: "cat package.json | rg javascript -nq",
    gg: "cat package.json | node dist/bin.js javascript -q"
  },
  {
    rg: "cat package.json | rg javascript -nq",
    gg: "cat package.json | node dist/bin.js javascript -q -j2"
  },
  {
    rg: "cat package.json | rg missing -nq",
    gg: "cat package.json | node dist/bin.js missing -q"
  },
  {
    rg: "cat package.json | rg missing -nq",
    gg: "cat package.json | node dist/bin.js missing -q -j2"
  },
  {
    rg: "cat package.json | rg javascript -n -m0",
    gg: "cat package.json | node dist/bin.js javascript -m0"
  },
  {
    rg: "cat package.json | rg javascript -n -m1",
    gg: "cat package.json | node dist/bin.js javascript -m1"
  },
  {
    rg: "cat package.json | rg javascript -n -m2",
    gg: "cat package.json | node dist/bin.js javascript -m2"
  },
  {
    rg: "cat package.json | rg javascript -n -m2 --count-matches",
    gg: "cat package.json | node dist/bin.js javascript -m2 --count-matches"
  },
  {
    rg: "cat package.json | rg javascript -n -m3",
    gg: "cat package.json | node dist/bin.js javascript -m3"
  },
  {
    rg: "cat package.json | rg javascript -n -m4",
    gg: "cat package.json | node dist/bin.js javascript -m4"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nU",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript'"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nwU",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -w"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -bnHU --heading",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -bnH"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nU -m0",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -m0"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nU -m1",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -m1"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nU -m2",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -m2"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nU -m2 --count-matches",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -m2 --count-matches"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nU -m3",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -m3"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nU -m4",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -m4"
  },
  {
    rg: "cat package.json | rg $',\\n    \"' -nFU",
    gg: "cat package.json | node dist/bin.js $',\\n    \"' -F"
  },
  {
    rg: "cat package.json | rg s -n -A0",
    gg: "cat package.json | node dist/bin.js s -A0"
  },
  {
    rg: "cat package.json | rg s -n -A1",
    gg: "cat package.json | node dist/bin.js s -A1"
  },
  {
    rg: "cat package.json | rg s -n -A2",
    gg: "cat package.json | node dist/bin.js s -A2"
  },
  {
    rg: "cat package.json | rg s -n -A3",
    gg: "cat package.json | node dist/bin.js s -A3"
  },
  {
    rg: "cat package.json | rg s -n -A4",
    gg: "cat package.json | node dist/bin.js s -A4"
  },
  {
    rg: "cat package.json | rg s -n -B0",
    gg: "cat package.json | node dist/bin.js s -B0"
  },
  {
    rg: "cat package.json | rg s -n -B1",
    gg: "cat package.json | node dist/bin.js s -B1"
  },
  {
    rg: "cat package.json | rg s -n -B2",
    gg: "cat package.json | node dist/bin.js s -B2"
  },
  {
    rg: "cat package.json | rg s -n -B3",
    gg: "cat package.json | node dist/bin.js s -B3"
  },
  {
    rg: "cat package.json | rg s -n -B4",
    gg: "cat package.json | node dist/bin.js s -B4"
  },
  {
    rg: "cat package.json | rg s -n -C0",
    gg: "cat package.json | node dist/bin.js s -C0"
  },
  {
    rg: "cat package.json | rg s -n -C1",
    gg: "cat package.json | node dist/bin.js s -C1"
  },
  {
    rg: "cat package.json | rg s -n -C2",
    gg: "cat package.json | node dist/bin.js s -C2"
  },
  {
    rg: "cat package.json | rg s -n -C3",
    gg: "cat package.json | node dist/bin.js s -C3"
  },
  {
    rg: "cat package.json | rg s -n -C4",
    gg: "cat package.json | node dist/bin.js s -C4"
  },
  {
    rg: "cat package.json | rg s -nboH -C0 --heading",
    gg: "cat package.json | node dist/bin.js s -boH -C0"
  },
  {
    rg: "cat package.json | rg s -nboH -C1 --heading",
    gg: "cat package.json | node dist/bin.js s -boH -C1"
  },
  {
    rg: "cat package.json | rg s -nboH -C2 --heading",
    gg: "cat package.json | node dist/bin.js s -boH -C2"
  },
  {
    rg: "cat package.json | rg s -nboH -C3 --heading",
    gg: "cat package.json | node dist/bin.js s -boH -C3"
  },
  {
    rg: "cat package.json | rg s -nboH -C4 --heading",
    gg: "cat package.json | node dist/bin.js s -boH -C4"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nU -C0",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -C0"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nU -C1",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -C1"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nU -C2",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -C2"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nU -C3",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -C3"
  },
  {
    rg: "cat package.json | rg 'javascript.*\\n.*javascript' -nU -C4",
    gg: "cat package.json | node dist/bin.js 'javascript.*\\n.*javascript' -C4"
  },
  {
    rg: "cat package.json | rg ' *\".+\" *' -nbH -x --heading",
    gg: "cat package.json | node dist/bin.js ' *\".+\" *' -nbH -x",
  },
  {
    rg: "cat package.json | rg ' *\".+\" *' -nboH -x --heading",
    gg: "cat package.json | node dist/bin.js ' *\".+\" *' -nboH -x",
  },
  {
    rg: "cat package.json | rg s -nbH -C1 --heading --context-separator='aaa' --field-context-separator='bbb' --field-match-separator='ccc'",
    gg: "cat package.json | node dist/bin.js s -bH -C1 --context-separator='aaa' --field-context-separator='bbb' --field-match-separator='ccc'"
  },
  {
    rg: "cat package.json | rg s -nboH -C1 --heading --context-separator='aaa' --field-context-separator='bbb' --field-match-separator='ccc'",
    gg: "cat package.json | node dist/bin.js s -boH -C1 --context-separator='aaa' --field-context-separator='bbb' --field-match-separator='ccc'"
  },
  {
    rg: "cat package.json | rg as -nbH --heading --passthru",
    gg: "cat package.json | node dist/bin.js as -nbH --passthru"
  }
];

const TESTS_FILES = [
  {
    rg: "rg --files | sort",
    gg: "node dist/bin.js --files | sort",
  },
  {
    rg: "rg --files | sort",
    gg: "node dist/bin.js . --files | sort",
  },
  {
    rg: "rg node_modules --files | sort",
    gg: "node dist/bin.js node_modules --files | sort",
  },
  {
    rg: "rg dist --files | sort",
    gg: "node dist/bin.js dist --files | sort",
  },
  {
    rg: "rg --files --no-ignore | sort",
    gg: "node dist/bin.js . --files --no-ignore | sort",
  },
  {
    rg: "rg node_modules --files --no-ignore | sort",
    gg: "node dist/bin.js node_modules --files --no-ignore | sort",
  },
  {
    rg: "rg --files --no-ignore-dot | sort",
    gg: "node dist/bin.js --files --no-ignore-dot | sort",
  },
  {
    rg: "rg node_modules --files --no-ignore-dot | sort",
    gg: "node dist/bin.js node_modules --files --no-ignore-dot | sort",
  },
  {
    rg: "cd node_modules && rg . --files --no-ignore-parent | sort | sed 's|^\./||'",
    gg: "cd node_modules && node ../dist/bin.js . --files --no-ignore-parent | sort",
  },
  {
    rg: "rg --files --no-ignore-vcs | sort",
    gg: "node dist/bin.js . --files --no-ignore-vcs | sort",
  },
  {
    rg: "rg node_modules --files --no-ignore-vcs | sort",
    gg: "node dist/bin.js node_modules --files --no-ignore-vcs | sort",
  },
  {
    rg: "rg node_modules --files --max-filesize 1K | sort",
    gg: "node dist/bin.js node_modules --files --max-filesize 1k | sort"
  },
  {
    rg: "rg node_modules --files --max-filesize 1K | sort",
    gg: "node dist/bin.js node_modules --files --max-filesize 1K | sort"
  },
  {
    rg: "rg node_modules --files --max-filesize 2000 | sort",
    gg: "node dist/bin.js node_modules --files --max-filesize 2000 | sort"
  },
  {
    rg: "rg node_modules --files --max-depth 2 | sort",
    gg: "node dist/bin.js node_modules --files --max-depth 2 | sort"
  },
  {
    rg: "rg node_modules/tiny-readdir --files | sort",
    gg: "node dist/bin.js node_modules/tiny-readdir --files | sort"
  },
  // {
  //   rg: "rg node_modules --sort accessed --files",
  //   gg: "node dist/bin.js node_modules --sort accessed --files"
  // },
  {
    rg: "rg node_modules --sort created --files",
    gg: "node dist/bin.js node_modules --sort created --files"
  },
  {
    rg: "rg node_modules --sort modified --files",
    gg: "node dist/bin.js node_modules --sort modified --files"
  },
  {
    rg: "rg node_modules --sort path --files",
    gg: "node dist/bin.js node_modules --sort path --files"
  },
  // {
  //   rg: "rg node_modules --sort size --files",
  //   gg: "node dist/bin.js node_modules --sort size --files"
  // },
  // {
  //   rg: "rg node_modules --sortr accessed --files",
  //   gg: "node dist/bin.js node_modules --sortr accessed --files"
  // },
  {
    rg: "rg node_modules --sortr created --files",
    gg: "node dist/bin.js node_modules --sortr created --files"
  },
  {
    rg: "rg node_modules --sortr modified --files",
    gg: "node dist/bin.js node_modules --sortr modified --files"
  },
  {
    rg: "rg node_modules --sortr path --files",
    gg: "node dist/bin.js node_modules --sortr path --files"
  },
  // {
  //   rg: "rg node_modules --sortr size --files",
  //   gg: "node dist/bin.js node_modules --sortr size --files"
  // },
];

const TESTS_DEEP = [
  {
    rg: "rg as . -nH --heading --files-with-matches | sort | sed 's|^\./||'",
    gg: "node dist/bin.js as . --files-with-match | sort"
  },
  {
    rg: "rg as ./ -nH --heading --files-with-matches | sort | sed 's|^\./||'",
    gg: "node dist/bin.js as ./ --files-with-match | sort"
  },
  {
    rg: "rg as -nH --heading --sort path",
    gg: "node dist/bin.js as --sort path"
  },
  {
    rg: "rg as node_modules --files-with-matches | sort",
    gg: "node dist/bin.js as node_modules --files-with-match | sort"
  },
  {
    rg: "rg as node_modules --files-without-match | sort",
    gg: "node dist/bin.js as node_modules --files-without-match | sort"
  },
  {
    rg: "rg as node_modules --files-with-matches --binary | sort",
    gg: "node dist/bin.js as node_modules --files-with-match --binary | sort"
  },
  {
    rg: "rg as node_modules --files-without-match --binary | sort",
    gg: "node dist/bin.js as node_modules --files-without-match --binary | sort"
  },
  {
    rg: "rg javascript node_modules --sort path -nH --heading",
    gg: "node dist/bin.js javascript node_modules --sort path"
  },
  {
    rg: "rg as node_modules --sort path -nH --heading --count-matches",
    gg: "node dist/bin.js as node_modules --sort path --count-matches"
  },
  {
    rg: "rg as node_modules --sort path -nH --heading",
    gg: "node dist/bin.js as node_modules --sort path"
  },
  {
    rg: "rg as node_modules --sort path -nH --heading -C3",
    gg: "node dist/bin.js as node_modules --sort path -C3"
  },
  {
    rg: 'rg display node_modules --sort path -nH --heading -t json',
    gg: 'node dist/bin.js display node_modules --sort path -t json'
  },
  {
    rg: 'rg display node_modules --sort path -nH --heading -t js',
    gg: 'node dist/bin.js display node_modules --sort path -t js'
  },
  {
    rg: 'rg display node_modules --sort path -nH --heading -t json -t js',
    gg: 'node dist/bin.js display node_modules --sort path -t json -t js'
  },
  {
    rg: 'rg display node_modules --sort path -nH --heading -T json',
    gg: 'node dist/bin.js display node_modules --sort path -T json'
  },
  {
    rg: 'rg display node_modules --sort path -nH --heading -T js',
    gg: 'node dist/bin.js display node_modules --sort path -T js'
  },
  {
    rg: 'rg display node_modules --sort path -nH --heading -T json -T js',
    gg: 'node dist/bin.js display node_modules --sort path -T json -T js'
  },
  {
    rg: 'rg display node_modules > /dev/null',
    gg: 'node dist/bin.js display node_modules > /dev/null'
  }
];

const TESTS_ALL = [
  ...TESTS_SHALLOW,
  ...TESTS_FILES,
  ...TESTS_DEEP
];

/* EXPORT */

export {TESTS_SHALLOW, TESTS_FILES, TESTS_DEEP, TESTS_ALL};
