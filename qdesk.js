/**
 * Created by danevans on 4/4/20.
 */
(function() {
  function usage() {
    console.log("usage: node %s [-i] [-t] [-k] [-h] [input-files]", 'qdesk.js');
    console.log("  i - interactive mode");
    console.log("  t - trace circuit steps");
    console.log("  k - use ket display when circuit initial value is provided");
    console.log("  h - or no parameters displays this help");
    console.log("  input-files - zero or more input QDesk statement files");
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
    var ix,
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
          if (flags && arg.charAt(0) == '-')
          {
            for (prp in config.flags)
            {
              if (prp == arg.substring(1, prp.length + 1))
              {
                arg = arg.substring(prp.length + 1);
                config[config.flags[prp]] = (0 == arg.length) ? true : arg;
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
  function interpret_cb(src) {
    try
    {
      lex.setSourceLine(src);
      stmt = compiler._stmt();
      if (null !== stmt)
      {
        interp.exec(stmt);
      }
      else
      {
        if (null == src.match(/^ *(#.*)?\r?\n?$/))
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
    if (qd.Symbol.none === tkn.symbol)
      return;
    if (qd.Symbol.eol !== tkn.symbol)
    {
      console.log('logic error (line end) symbol %s', tkn.toString());
    }
  }
  let qd = require('./qdesk_lexer.js'),
      qq = require('./qdesk_compile.js'),
      qi = require('./qdesk_interpret.js');
      //SynErr = qq.Synerr,
  let tkn, ix;
  let lex, compiler, interp, stmt;
  let tt, intro =
      ['Quick Quantum Circuit Simulation\n',
        '  left arrow - move cursor left; right arrow - move cursor right\n',
        '  delete - delete character to the left of the cursor and shift characters left\n',
        '  insert - automatic when cursor is not at end-of-line\n',
        '  up arrow - recall line history\n',
        '  down arrow - reverse history\n',
        '  ctrl-D, ctrl-C - end session\n'];
  let cfg = {
    files: [],
    interactive: false,
    trace: false,
    kdisp: false,
    help: false,
    flags: {
      i: 'interactive',
      t: 'trace',
      k: 'kdisp',
      h: 'help'
    }
  };
  cmdArgs(cfg, usage);
  if (cfg.help)
    usage();
  if (cfg.interactive)
  {
    tt = require('./qdesk_interactive.js');
    lex = new qd.QDeskLexer('interactive');
    interp = new qi.QDeskInterpret({all: cfg.trace, state: cfg.kdisp});
    compiler = new qq.QDeskCompile(lex, qd.Symbol, interp);
    tt.terminal(interpret_cb, intro);
  }
  else
  {
    cfg.skel = false;
    for (ix = 0; ix < cfg.files.length; ++ix)
    {
      console.log('--- file:%s---', cfg.files[ix])
      lex = new qd.QDeskLexer(cfg.files[ix]);
      interp = new qi.QDeskInterpret();
      compiler = new qq.QDeskCompile(lex, qd.Symbol, interp);
      // if (cfg.skel)
      // {
      //   stmt = compiler._pgm();
      //   console.log('---syntax complete---');
      //   return;
      // }
      stmt = compiler._stmt();
      while (null != stmt)
      {
        interp.exec(stmt);
        tkn = lex.next_token();
        if (qd.Symbol.none === tkn.symbol)
          break;
        if (qd.Symbol.eol !== tkn.symbol)
        {
          console.log('logic error symbol %s', tkn.toString());
          break;
        }
        stmt = compiler._stmt();
      }
      console.log('---execution complete---');
    }
  }
})();