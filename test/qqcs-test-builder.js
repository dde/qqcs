/**
 * Created by danevans on 4/21/20.
 */
const fs = require('fs'),
    path = require('path');
class Reader
{
  constructor(fs, fn, ofn) {
    let pth = path.parse(fn)
    if (arguments[2] === undefined)
        ofn = path.resolve(pth.dir, pth.name + '.js');
    try
    {
      this.ostrm = fs.createWriteStream(ofn);
    }
    catch (iox)
    {
      console.log(iox.message);
      return;
    }
    try
    {
      this.source = fs.readFileSync(fn, {"encoding":'utf8', "flag":'r'});
    }
    catch (iox)
    {
      console.log(iox.message);
      this.source = '';
    }
      // this.pgm_file = new FileReader(new File(this.fname));
    this.len = this.source.length;
    this._line_no = 0;
    this.fix = 0;
  }
  reset(src)
  {
    this.source = src;
    this.len = this.source.length;
    this._line_no = 0;
    this.fix = 0;
  }
  read_line()
  {
    let ix, strt;
    ++this._line_no;
    ix = strt = this.fix;
    while (ix < this.len && this.source[ix] !== '\n')
    {
      ++ix;
    }
    if (ix < this.len)
      this.fix = ix + 1;
    else
      this.fix = this.len;
    this.current_line = this.source.substring(strt, this.fix - 1);
    return this.current_line;
  }
  isEmpty()
  {
    let mch = this.current.line(/^\s*\n$/);
    return (null != mch);
  }
  close()
  {
    this.source = '';
  }
}
class Texp
{
  constructor(fs, path, fil, ofil)
  {
    this.rdr = new Reader(fs, fil, ofil);
    this.backup(fs, path, ofil);
    this.writeq = [];
    this.draining = false;
  }
  backup(fs, path, nam) {
    let bkn,
        stat,
        pth = path.parse(nam);
    bkn = path.resolve(pth.dir, pth.name + '-1' + pth.ext);
    stat = fs.statSync(bkn, {throwIfNoEntry:false}); // return undefined if doesn't exist
    if (undefined !== stat)
      fs.rmSync(bkn);
    stat = fs.statSync(nam, {throwIfNoEntry:false});
    if (undefined !== stat)
      fs.renameSync(nam, bkn);
  }
  writeExpect(id, cmd, lines) {
    let ix;
    this.write('  {\n');
    this.write('    stmt:"' + cmd + '",\n');
    this.write('    id:"' + id + '",\n');
    if (0 === lines.length)
    {
      this.write('    expect:""\n');
    }
    else if (1 === lines.length)
    {
      this.write('    expect:"' + lines[0] + '\\n"\n');
    }
    else
    {
      this.write('    expect:"' + lines[0] + '\\n" + \n');
      for (ix = 1; ix < lines.length - 1; ++ix)
      {
        this.write('      "' + lines[ix] + '\\n" + \n');
      }
      this.write('      "' + lines[lines.length - 1] + '\\n"\n');
    }
    this.write('  },\n');
  }
  trimComments(ln) {
    let mtch;
    mtch = ln.match(/^(\s*#[^\\]*\\n)/);
    while (null !== mtch)
    {
      ln = ln.substring(mtch[1].length);
      mtch = ln.match(/^(\s*#[^\\]*\\n)/);
    }
    return ln;
  }
  exec()
  {
    let line, id;
    let mtch, cmd, lines;
    line = this.rdr.read_line();
    this.write('exports.test_cases = [\n');
    lines = [];
    id = 0;
    cmd = '';
    while (1 < line.length)
    {
      if (null != (mtch = line.match(/^---execution/)))
      {
      }
      else if (null != (mtch = line.match(/^---test file/)))
      {
        if (0 < lines.length)
        {
          this.writeExpect(++id, cmd, lines);
          lines = [];
          cmd = '';
        }
        this.writeExpect(++id, '#$none\\n', lines);
      }
      else if (null != (mtch = line.match(/^\[ *(\d+)] *(.*)/)))
      {
        if (0 < lines.length)
        {
          this.writeExpect(++id, cmd, lines);
          lines = [];
        }
        else
        {
          // console.log('no lines, cmd:%s', cmd);
          //mtch[2] = cmd + '\\n' + mtch[2];
          if (0 < cmd.length)
          {
            this.writeExpect(++id, cmd + '\\n', lines);
          }
        }
        cmd = mtch[2];
      }
      else
      {
        lines.push(line);
      }
      line = this.rdr.read_line();
    }
    if (0 < lines.length)
      this.writeExpect(++id, cmd, lines);
    this.write('  ];\n');
  }
  write(data)
  {
    let pending;
    function continueWriting()
    {
      // Wait for cb to be called before doing any other write.
      this.draining = false;
      console.log('Write completed.');
    }
    if (this.draining)
    {
      this.writeq.push(data);
      return;
    }
    if (0 < this.writeq.length)
    {
      this.writeq.push(data);
      pending = this.writeq.join('');
      this.writeq = [];
    }
    else
    {
      pending = data;
    }
    if (!this.rdr.ostrm.write(pending))
    {
      this.rdr.ostrm.once('drain', continueWriting);
      this.draining = true;
    }
    // else
    // {
    //   process.nextTick(this.continueWriting);
    // }
  }
  flush()
  {
    let pending;
    if (0 < this.writeq.length)
    {
      pending = this.writeq.join('');
      this.writeq = [];
      this.rdr.ostrm.write(pending);
    }
  }
}
let texp;
// texp = new Texp(fs, path, 'xtestout.txt', 'xtest_cases.js');
texp = new Texp(fs, path, 'qdesk_testout.txt', 'test_cases.js');
texp.exec();
texp.flush();
console.log('completed');