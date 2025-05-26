/**
 * Created by danevans on 4/4/20.
 */
(function() {
  function usage() {
    console.log("usage: node %s [-c] [-i] [-h] [-k] [m] [-q] [-r] [-t] [-u] [input-files]", 'qdesk.js');
    console.log("  c - cache oracles when generated");
    console.log("  h - display this help");
    console.log("  i - interactive mode (implied with no files, otherwise batch mode)");
    console.log("  k - use ket display when circuit initial value is provided");
    console.log("  m - suppress the operation of most recent result")
    console.log("  q - number qubits using big-endian subscripts");
    console.log("  r - replace zero elements (0) in sparse matrix displays with periods (.) for better readability");
    console.log("  t - trace circuit steps");
    console.log("  u - use alternate unitary matrix definition for U, Rx, Ry, Rz gates");
    console.log("  input-files - zero or more input QQCS statement files");
    process.exit(1);
  }
  /*
   * a config object has a minimum of two properties:
   * {
   *   files:[],
   *   flags:{}
   * }
   * files - an array into which non-flag args will be stored in left to right order
   * flags - an object whose properties are command line flags, the value of the flags are property names, the
    *       value of the flag will be stored in the named property on the config object; several flags may be
    *       mapped to the same property; a flag's value follows the flag name, not separated by spaces
   */
  function cmdArgs(config, usage) {
    let ix,
        arg,
        prp,
        flags,
        files;

    function showUsage(usage) {
      if ('function' === typeof usage)
        usage();
      return false;
    }

    // if (process.argv.length < 3)
    //   return showUsage(usage);
    files = config.files instanceof Array;
    flags = 'object' == typeof config.flags;
    nextarg:
        for (ix = 2; ix < process.argv.length; ++ix)
        {
          arg = process.argv[ix];
          if (flags && arg.charAt(0) === '-')
          {
            for (prp in config.flags)
            {
              if (!config.flags.hasOwnProperty(prp))
                continue;
              if (prp === arg.substring(1, prp.length + 1))
              {
                arg = arg.substring(prp.length + 1);
                config[config.flags[prp]] = (0 === arg.length) ? true : arg;
                continue nextarg;
              }
            }
            return showUsage(usage);
          }
          else
          {
            if (files)
              config.files.push(arg);
            else
              return showUsage(usage);
          }
        }
    return true;
  }
  function interpret_cbo(src) {
    let stmt, tkn;
    try
    {
      lex.setSourceLine(src);
      stmt = compiler._stmt();
      if (null !== stmt)
      {
        interp.exec([stmt]);
      }
      else
      {
        if (null === src.match(/^ *(#.*)?\r?\n?$/))
        {
          console.log('unrecognized statement');
          // for (let ch of src)
          // {
          //   process.stdout.write(' ' + ch.charCodeAt(0));
          // }
          // process.stdout.write('\n');
        }
      }
    }
    catch (e)
    {
      console.log('error:%s', e.message);
      return;
    }
    tkn = lex.next_token();
    if (qd.QlxSymbol.none === tkn.symbol)
      return;
    if (qd.QlxSymbol.eol !== tkn.symbol)
    {
      console.log('logic error (line end) symbol %s', tkn.toString());
    }
  }
  function interpret_cbx(src) {
    let stmt, tkn;
    try
    {
      lex.setSourceLine(src);
      stmt = compiler._pgm();
      if (null !== stmt)
      {
        tkn = lex.next_token();
        if (qd.QlxSymbol.semi === tkn.symbol)
        {
          tkn = lex.next_token();
          if (qd.QlxSymbol.eol !== tkn.symbol)
            lex.pushBack(tkn);
          stmt.push(stmt);
          return false;
        }
        else if (qd.QlxSymbol.eol === tkn.symbol)
        {
          stmt.push(stmt);
          interp.exec(stmt);
          stmt = [];
        }
        else
        {
          console.log('logic error (line end) symbol %s', tkn.toString());
        }
      }
      else
      {
        if (null === src.match(/^ *(#.*)?\r?\n?$/))
        {
          console.log('unrecognized statement "' + src + '"');
          // for (let ch of src)
          // {
          //   process.stdout.write(' ' + ch.charCodeAt(0));
          // }
          // process.stdout.write('\n');
          stmt = [];
        }
      }
    }
    catch (e)
    {
      console.log('error:%s', e.message);
      stmt = [];
    }
    return true;
  }
  function interpret_cb(src)
  {
    let sstmt, tkn;
    try
    {
      lex.setSourceLine(src);
      sstmt = compiler._pgm();
      if (null !== sstmt)
      {
        interp.exec(sstmt);
      }
      else
      {
        if (null === src.match(/^ *(#.*)?\r?\n?$/))
        {
          console.log('unrecognized statement "' + src + '"');
        }
        else
          interp.exec(null);
      }
    }
    catch (e)
    {
      console.log('error:%s', e.message);
    }
    return true;
  }
  let qd = require('./qdesk_lexer.js'),
      qq = require('./qdesk_compile.js'),
      qi = require('./qdesk_interpret.js');
      //SynErr = qq.Synerr,
  let tkn, ix;
  let lex, compiler, interp, stmt, sstmt;
  let tt, intro =
      ['Quick Quantum Circuit Simulation (v1.5.0)\n',
        '  #$gate - display a gate summary, #$help - display comment switches\n',
        '  left arrow - move cursor left;  right arrow - move cursor right\n',
        '  delete (Mac) - delete the character left of cursor and shift characters left\n',
        '  backspace (Win) - same as delete\n',
        '  insert - automatic when cursor is not at end-of-line\n',
        '  up arrow - recall line history;  down arrow - reverse history\n',
        '  ctrl-D, ctrl-C - end session\n'];
  let cfg = {
    files: [],
    interactive: false,
    trace: false,
    kdisp: false,
    rzeroes: false,
    help: false,
    ualt: false,
    nomrr: false,
    ocache: false,
    qrev: false,
    none:'',
    gate:'',
    flags: {
      i: 'interactive',
      t: 'trace',
      k: 'kdisp',
      m: 'nomrr',
      u: 'ualt',
      r: 'rzeroes',
      o: 'ocache',
      q: 'qrev',
      h: 'help'
    }
  };
  cmdArgs(cfg, usage);
  if (cfg.help)
    usage();
  if (0 === cfg.files.length)
    cfg.interactive = true;
  if (cfg.interactive)
  {
    interp = new qi.QDeskInterpret(cfg);
    lex = new qd.QDeskLexer('interactive', interp.getCommentProcessor());
    compiler = new qq.QDeskCompile(lex, qd.QlxSymbol, interp);
    tt = require('./qdesk_interactive.js');
    stmt = [];
    tt.terminal(interpret_cb, intro);
    return;
  }
  cfg.skel = false;
  for (ix = 0; ix < cfg.files.length; ++ix)
  {
    console.log('--- file:%s---', cfg.files[ix])
    interp = new qi.QDeskInterpret(cfg);
    lex = new qd.QDeskLexer(cfg.files[ix],  interp.getCommentProcessor());
    compiler = new qq.QDeskCompile(lex, qd.QlxSymbol, interp);
    // if (cfg.skel)
    // {
    //   stmt = compiler._pgm();
    //   console.log('---syntax complete---');
    //   return;
    // }
    sstmt = compiler._pgm();
    while (null != sstmt)
    {
      interp.exec(sstmt);
      tkn = lex.lookAhead();
      if (qd.QlxSymbol.none === tkn.symbol)
        break;
      sstmt = compiler._pgm();
    }
    console.log('---execution complete---');
  }
})();
