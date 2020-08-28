/**
 * Created by danevans on 5/4/20.
 */
function SysinReader(callback, intro) {
  let ctl = {src:'', pos:0, lineno:0, history:[], curhist:0, wid:2}
  const IGN = 0, PRV = 1, LFT = 2, RGT = 3, NXT = 4;
  if (process.stdin.isTTY)
  {
    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);
  }
  else
  {
    throw new Error('not invoked in a TTY environment');
  }
  if (arguments.length >= 2 && intro instanceof Array)
  {
    for (let msg of intro)
    {
      process.stdout.write(msg);
    }
  }
  function prompt() {
    let lin, pfx, pad;
    lin = String(++ctl.lineno);
    pad = ctl.wid - lin.length
    //process.stdout.cursorTo(0);
    //process.stdout.moveCursor(0, 1);
    if (pad > 0)
      pfx = '[' + (' '.repeat(pad)) + lin + '] ';
    else
      pfx = '[' + lin + '] ';
    process.stdout.write(pfx);
  }
  function escapeCheck(_src) {
    let ix, ch;
    ix = 0;
    while (ix < _src.length)
    {
      ch = _src.charAt(ix);
      if (ch === '\x1b')
      {
        ch = _src.charAt(ix + 1);
        switch (ch)
        {
        case '[':
          ch = _src.charAt(ix + 2);
          //process.stdout.write('escape [' + ch);
            switch (ch)
            {
            case 'A':
              return PRV;
            case 'B':
              return NXT;
            case 'C':
              return RGT;
            case 'D':
              return LFT;
            }
          ix += 2;
          break;
        default:
          process.stdout.write('escape unknown:' + _src.substring(ix + 1));
          ix += 1;
          break;
        }
      }
      ix += 1;
    }
    return IGN;
  }
  prompt();
  // process.stdin.on('readable', callback);
  process.stdin.on('readable', () => {
    let chunk, ch, esc;
    // Use a loop to make sure we read all available data.
    while ((chunk = process.stdin.read()) !== null)
    {
      // data may include ending newline char
      //process.stdout.write(`data: ${chunk}`);
      ch = chunk.charAt(chunk.length - 1);
      if ('\u0004' === ch || '\u0003' === ch)
      {
        process.stdin.emit('end');
        continue;
      }
      esc = escapeCheck(chunk);
      if (IGN !== esc)
      {
        chunk = process.stdin.read();
        switch (esc)
        {
        case PRV:
          process.stdout.moveCursor(-(ctl.src.length), 0, () =>
            process.stdout.clearLine(1, () => {
              if (ctl.curhist > 0)
              {
                ctl.src = ctl.history[--ctl.curhist];
                ctl.pos = ctl.src.length;
                process.stdout.write(ctl.src);
              }
              else
              {
                ctl.curhist = -1;
                ctl.src = '';
                ctl.pos = ctl.src.length;
              }
            }));
          break;
        case NXT:
          process.stdout.moveCursor(-(ctl.src.length), 0, () =>
            process.stdout.clearLine(1, () => {
              if (ctl.curhist < ctl.history.length - 1)
              {
                ctl.src = ctl.history[++ctl.curhist];
                ctl.pos = ctl.src.length;
                process.stdout.write(ctl.src);
              }
              else
              {
                ctl.curhist = ctl.history.length;
                ctl.src = '';
                ctl.pos = ctl.src.length;
              }
            }));
          break;
        case LFT:
          if (ctl.pos > 0)
          {
            process.stdout.moveCursor(-1, 0, () => ctl.pos -= 1);
          }
          break;
        case RGT:
          if (ctl.pos < ctl.src.length)
          {
            process.stdout.moveCursor(1, 0, () => ctl.pos += 1);
          }
          break;
        default:
          break;
        }
        return;
      }
      if ('\u007f' === ch)  // backspace
      {
        if (ctl.pos > 0)
        {
          if (ctl.pos < ctl.src.length)
          {
            esc = ctl.src.substring(ctl.pos);
            process.stdout.moveCursor(-1, 0, () =>
              process.stdout.clearLine(1, () => {
                ctl.src = ctl.src.substring(0, ctl.pos - 1) + esc;
                process.stdout.write(esc);
                process.stdout.moveCursor(-(esc.length), 0, () => ctl.pos -= 1);
              }));
          }
          else
          {
            process.stdout.moveCursor(-(ctl.src.length), 0, () =>
              process.stdout.clearLine(1, () => {
                ctl.src = ctl.src.substring(0, ctl.src.length - 1);
                ctl.pos -= 1;
                process.stdout.write(ctl.src);
              }));
          }
        }
      }
      else if ('\u000d' === ch)  //  return ('\r')
      {
        process.stdout.write('\n');
        callback(ctl.src + chunk);
        ctl.history.push(ctl.src);
        ctl.curhist = ctl.history.length;
        ctl.src = '';
        ctl.pos = 0;
        prompt();
      }
      else
      {
        if (ctl.pos < ctl.src.length)
        {
          esc = chunk + ctl.src.substring(ctl.pos);
          process.stdout.write(esc);
          process.stdout.moveCursor(-(esc.length - 1), 0, () => ctl.pos += 1);
          ctl.src = ctl.src.substring(0, ctl.pos) + esc;
        }
        else
        {
          ctl.src += chunk;
          ctl.pos += chunk.length;
          process.stdout.write(chunk);
        }
      }
      //process.stdout.write(util.format('code:%d ', ch.charCodeAt(0)));
      // process.stdout.write(typeof chunk);
    }
  });
  /*
  process.stdin.on('readable', () => {
    let stmt, tkn, src, prv, chunk;
    src = '';
    prv = '\0';
    while (prv !== '\n' && (chunk = process.stdin.read()) !== null)
    {
      // data may include ending newline char
      //process.stdout.write(`data: ${chunk}`);
      process.stdout.write(chunk);
      src += chunk;
      prv = chunk;
    }
    // console.log('trace input:"%s"', src);
    // if (0 === src.length || (1 === src.length && src === '\n'))
    //   return;
    if (0 === src.length)
      return;
    switch (escapeCheck(src))
    {
    case PRV:
      src = history[history.length - 1]
      break;
    default:
      break;
    }
    try
    {
      //lex.setSourceLine(src);
      if (history.length > 25)
        history.shift();
      history.push[src];
      //stmt = compile._stmt();
      // if (null == stmt)
      // {
      //   if (null == src.match(/^ *(#.*)?\n$/))
      //     console.log('unrecognized statement');
      //   prompt();
      //   return;
      // }
      //interp.exec(stmt);
    }
    catch (e)
    {
      console.log('error:%s', e.message);
      prompt();
      return;
    }
    // tkn = lex.next_token();
    // if (Symbol['none'] === tkn.symbol)
    //   return;
    // if (Symbol['eol'] !== tkn.symbol)
    // {
    //   console.log('logic error (line end) symbol %s', tkn.toString());
    // }
    prompt();
    return;
  });*/
  process.stdin.on('end', () => {
    //process.stdin.setRawMode(false);
    process.stdout.write('Good-bye\n');
  });
}
// function test() {
//   let intro = ['TTY Tester\n',
//       '  left arrow - move cursor left; right arrow - move cursor right\n',
//       '  delete - delete character to the left of the cursor and shift characters left\n',
//       '  insert - automatic when cursor is not at end-of-line\n',
//       '  up arrow - recall line history\n',
//       '  ctrl-D, ctrl-C - end session\n'];
//   function newLine(src) {
//     //process.stdout.write('newLine:' + src);
//     let ch, str = '';
//     for (ch = 0; ch < src.length; ++ch)
//     {
//       str += src.charCodeAt(ch) + ' ';
//     }
//     console.log(str);
//   }
//   SysinReader(newLine, intro);
// }
// test();
module.exports.terminal = SysinReader;