/**
 * Created by danevans on 4/18/20.
 */
function usage ()
{
  process.stderr.write('usage: node ' + 'qdesk_tester.js' + ' [input-files]\n');
  process.stderr.write("  input-files - one or more input QQCS statement files\n");
  process.stderr.write("  if no input-files, falls back to require('./test_cases.js')\n");
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
let ql = require('../qdesk_lexer.js'),
    qq = require('../qdesk_compile.js'),
    qi = require('../qdesk_interpret.js');
let tkn, ix;
let tfil, lex, compiler, interp, stmt;
let cfg = {
  files:[],
  kdisp:false,
  trace:false,
  sparse:false,
  ualt:false,
  flags:{k:'kdisp', t:'trace', s:'sparse', u:'ualt'}
};
let tt, tc, tst, tstout, assert, fai, util;
  configReplaceZeroes = cfg.rzeroes
  cmdArgs(cfg, usage);
  if (0 === cfg.files.length)
  {
    assert = require('assert').strict;
    util = require('util');
    tc = require('./test_cases.js');
    interp = new qi.QDeskInterpret({trace: cfg.trace, kdisp: cfg.kdisp, ualt: cfg.ualt, test:true, interactive:true});
    lex = new ql.QDeskLexer('interactive', interp.getCommentProcessor());
    compiler = new qq.QDeskCompile(lex, ql.QlxSymbol, interp);
    fail = 0;
    for (ix = 0; ix < tc.test_cases.length; ++ix)
    {
      tst = tc.test_cases[ix];
      try
      {
        lex.setSourceLine(tst.stmt);
        if (undefined !== tst.flags)
          interp.setFlags(tst.flags);
        // else
        //   interp.clearFlags();
        stmt = compiler._stmt();
        if (null !== stmt)
        // assert.notStrictEqual(stmt, null);
          tstout = interp.exec(stmt);
        else
          tstout = [];
        assert.notStrictEqual(tstout, undefined);
        assert.strictEqual(tstout.join(''), tst.expect);
        tkn = lex.next_token();
        assert.strictEqual(ql.QlxSymbol.none === tkn.symbol || ql.QlxSymbol.eol === tkn.symbol, true,
            util.format('error (line end) symbol %s', tkn.toString()));
      }
      catch (e)
      {
        console.log('error:%s\nid:%d %s', e.message, tst.id, tst.stmt);
        fail += 1;
      }
    }
    console.log('assertion failures:%d, out of %d test cases', fail, tc.test_cases.length);
  }
  else
  {
    interp = new qi.QDeskInterpret({trace: cfg.trace, kdisp: cfg.kdisp, ualt: cfg.ualt, interactive:false});
    for (ix = 0; ix < cfg.files.length; ++ix)
    {
      tfil = cfg.files[ix];
      process.stdout.write('---test file:' + tfil + '---\n')
      lex = new ql.QDeskLexer(tfil, interp.getCommentProcessor());
      compiler = new qq.QDeskCompile(lex, ql.QlxSymbol, interp);
      stmt = compiler._stmt();
      while (null != stmt)
      {
        interp.exec(stmt);
        tkn = lex.next_token();
        if (ql.QlxSymbol['none'] === tkn.symbol)
          break;
        if (ql.QlxSymbol['eol'] !== tkn.symbol)
        {
          process.stdout.write('logic error symbol ' + tkn.toString() + '\n');
          break;
        }
        stmt = compiler._stmt();
      }
      process.stdout.write('---execution complete---\n');
    }
  }
