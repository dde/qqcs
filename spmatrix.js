/**
 * Created by danevans on 5/14/20.
 */
"use strict";
let Complex = require('./complex.js').Complex,
    CMatrix = require('./cmatrix.js').CMatrix;
class SpMatrix
{
  // sparse matrix using compressed column format
  constructor(a0, a1, a2) {
    let ix, jx;
    if (a0 instanceof CMatrix)
    {
      this._rows = a0.rows();
      this._cols = a0.columns();
      this.spm = this.ccf(a0, this._rows, this._cols);  // value array, row index, column starts
    }
    else if (typeof a0 === 'number' && typeof a1 === 'number')
    {
      this._rows = a0
      this._cols = a1;
      this.spm = [[], [], []];
      if (typeof a2 === 'boolean' && a2)
      {
        this.ccl = -1;
        this.complete = false;
      }
      else
      {
        for (ix = 0; ix <= this._cols; ++ix)
          this.spm[2][ix] = 0;
      }
    }
    else if (a0 instanceof Array)
    {
      jx = a0.length;
      for (ix = 1; ix < arguments.length; ++ix)
      {
        if (jx !== arguments[ix].length)
          throw new Error('arguments must be N row arrays of the same length');
      }
      this._rows = arguments.length
      this._cols = arguments[0].length;
      this.spm = [[], [], []];
      this.ccl = -1;
      this.complete = false;
      for (jx = 0; jx < a0.length; ++jx)
      {
        for (ix = 0; ix < arguments.length; ++ix)
        {
          this.addccf(arguments[ix][jx].clone(), ix, jx);
        }
      }
      this.addccf(null);
    }
  }
  ccf(cmat, rws, cls) {  // compressed column format
    let rw, cl, v;
    let fmt = [[], [], []];  // value array, row index, column starts
    for (cl = 0; cl < cls; ++cl)
    {
      fmt[2].push(fmt[0].length);  // start of next column in value array
      for (rw = 0; rw < rws; ++rw)  // go down the column looking at each row
      {
        v = cmat.sub(rw, cl);
        if (v.isZero())  // ignore zero elements
          continue;
        fmt[0].push(v);  // add a non-zero element to the value array
        fmt[1].push(rw); // add its row subscript to the row index array
      }
    }
    fmt[2].push(fmt[0].length);  // element after the end of the value array, also total non-zero elements
    return fmt;
  }
  addccf(v, r, c) {
    // add a value at [r][c] to a ccf sparse matrix
    // requires that all values in column n be added in row order before any values in column n+1
    if (v == null)
    {
      while (this.spm[2].length <= this._cols)
      {
        this.spm[2].push(this.spm[0].length);  // element after the end of the value array, also total non-zero elements
      }
      this.complete = true;
      delete this.ccl;
      return;
    }
    while (this.ccl < c)
    {
      this.spm[2].push(this.spm[0].length);  // start of next column in value array
      ++this.ccl;
    }
    if (v.isZero())  // ignore zero elements
      return;
    this.spm[0].push(v);  // add a non-zero element to the value array
    this.spm[1].push(r);  // add its row subscript to the row index array
  }
  crf(cmat, rws, cls) {  // compressed row format
    let rw, cl, v;
    let fmt = [[], [], []];  // value array, column index, row starts
    for (rw = 0; rw < rws; ++rw)
    {
      fmt[2].push(fmt[0].length);  // start of next row in value array
      for (cl = 0; cl < cls; ++cl)  // go across the row looking at each column
      {
        v = cmat.sub(rw, cl);
        if (v.isZero())  // ignore zero elements
          continue;
        fmt[0].push(v);  // add a non-zero element to the value array
        fmt[1].push(cl); // add its column subscript to the column index array
      }
    }
    fmt[2].push(fmt[0].length);  // element after the end of the value array, also total non-zero elements
    return fmt;
  }
  rebuild() {
    let cmj = this.colMajor(),
        m2 = cmj.next(),
        z = new Complex(0),
        cmm = new CMatrix(this._rows, this._cols, z);
    while (!m2.done)
    {
      cmm.sub(m2.value[1], m2.value[2], m2.value[0]);
      m2 = cmj.next();
    }
    return cmm;
  }
  *colMajor1(cl) {
    let st, en, ix;
    st = this.spm[2][cl];
    en = this.spm[2][cl + 1];
    for (ix = st; ix < en; ++ix)
    {
      yield [this.spm[0][ix], this.spm[1][ix], cl];
    }
  }
  *colMajorA() {
    let cl, el, cels, v, rw;
    cl = -1;  // current column
    cels = 1;
    for (el = 0; el < this.spm[0].length; ++el)
    {
      cels -= 1;  // reduce the number of column elements
      while (0 === cels)  // if 0, no more column elements in this column
      {
        cl += 1;  // move to next column
        cels = this.spm[2][cl + 1] - this.spm[2][cl];  // number of elements in the next column
      }
      v = this.spm[0][el];
      rw = this.spm[1][el];
      yield [v, rw, cl];
    }
  }
  *rowMajor1(rw) {
    let cl, ct, ix;
    ct = [];
    for (ix = 0; ix < this.spm[1].length; ++ix)
    {
      if (rw === this.spm[1][ix])
        ct.push(ix);
    }
    cl = 0;
    for (ix = 0; ix < ct.length; ++ix)
    {
      while (ct[ix] >= this.spm[2][cl + 1])
        cl += 1;
      yield [this.spm[0][ct[ix]], rw, cl];
    }
  }
  *rowMajorA() {
    let cl, el, rw, cls;
    cls = new Array(this.spm[0].length);  // number of values
    cl = 1;
    el = 0;
    while (el < this.spm[0].length)  // identifies the column of each value element
    {
      if (el < this.spm[2][cl])
      {
        cls[el] = cl - 1;
        el += 1;
      }
      else
        cl += 1;
    }
    for (rw = 0; rw < this._rows; ++rw)
    {
      for (el = 0; el < this.spm[1].length; ++el)
      {
        if (rw === this.spm[1][el])  // found an element in row rw, column is in cls
        {
          yield [this.spm[0][el], rw, cls[el]];
        }
      }
    }
  }
  rowMajor(arg) {
    if (arg === undefined)
      return this.rowMajorA();
    return this.rowMajor1(arg);
  }
  colMajor(arg) {
    if (arg === undefined)
      return this.colMajorA();
    return this.colMajor1(arg);
  }
  minor(i, j) {
    const VL = 0, RW = 1, CL = 2;
    let mn, jx, mi, mj, d1, ci, cel;
    d1 = this._rows - 1;
    mn = new SpMatrix(d1, d1, true);
    mj = 0;
    for (jx = 0; jx < this._cols; ++jx)
    {
      if (jx === j)
      {
        mj = 1;
        continue;
      }
      ci = this.colMajor(jx);
      cel = ci.next();
      mi = 0;
      while (!cel.done)
      {
        if (cel.value[RW] === i)
        {
          mi = 1;
        }
        else
        {
          mn.addccf(cel.value[VL].clone(), cel.value[RW] - mi, cel.value[CL] - mj);
        }
        cel = ci.next();
      }
    }
    mn.addccf(null);
    // console.log('minor(%d,%d)=\n%s', i, j, mn.toString());
    return mn.det();
  }
  det() {
    let ix, jx, dot, sgn, s, v, m;
    if (1 === this._rows)
      return this.spm[0][0].clone();
    if (2 === this._rows)
    {
      dot = this.sub(0, 0).prod(this.sub(1, 1));
      v = this.sub(0, 1).prod(this.sub(1, 0));
      dot.diffeq(v);
      return dot;
    }
    sgn = new Complex(-1, 0);
    s = sgn.clone();
    dot = new Complex(0, 0);
    for (ix = 0; ix < 1; ++ix)
    {
      for (jx = 0; jx < this._cols; ++jx)
      {
        s.prodeq(sgn);
        v = this.sub(ix, jx).clone();
        m = this.minor(ix, jx);
        //console.log(m.disp());
        v.prodeq(m);
        v.prodeq(s);
        dot.sumeq(v);
      }
    }
    return dot;
  }
  mag() {
    /* row magnitudes, row and column vector exceptions */
    let ix, jx, acc, r, mg, ri, rel;
    r = [];
    for (ix = 0; ix < this._rows; ++ix)
    {
      ri = this.rowMajor(ix);
      rel = ri.next();
      acc = 0;
      while (!rel.done)
      {
        mg = rel.value[0].mag();
        acc += mg * mg;
      }
      r.push(acc);
    }
    if (1 < this._rows && 1 === this._cols)
    {
      acc = r[0];
      for (jx = 1; jx < r.length; ++jx)
      {
        acc += r[jx];
      }
      return acc;
    }
    if (1 === r.length)
      return r[0];
    return r;
  }
  dim() {
    return [this._rows, this._cols];
  }
  rows() {
    return this._rows;
  }
  columns() {
    return this._cols;
  }
  prod(c) {
    // sparse complex matrix multiplication
    const VL = 0, RW = 1, CL = 2;
    let p, rw, cl, rel, ri, sm, pr, clst, clen, vla, rwa, cla;
    if (this._cols !== c._rows)
      throw new Error('not conformable: ' + c._rows + ' columns must equal ' + this._cols + ' rows');
    vla = c.spm[VL];
    rwa = c.spm[RW];
    cla = c.spm[CL];
    p = new SpMatrix(this._rows, c._cols, true);
    for (cl = 0; cl < c._cols; ++cl)
    {
      for (rw = 0; rw < this._rows; ++rw)
      {
        clst = cla[cl];
        clen = cla[cl + 1]
        ri = this.rowMajor(rw);
        rel = ri.next();
        sm = new Complex(0, 0);
        while (!rel.done && clst < clen)
        {
          if (rel.value[CL] === rwa[clst])
          {
            pr = rel.value[VL].prod(vla[clst]);
            sm.sumeq(pr);
            rel = ri.next();
            clst += 1;
          }
          else if (rel.value[CL] < rwa[clst])
          {
            rel = ri.next();
          }
          else
          {
            clst += 1;
          }
        }
        if (!sm.isZero())
          p.addccf(sm, rw, cl);
      }
    }
    p.addccf(null);
    return p;
  }
  scprod(sc) {
    let cln, ix;
    cln = this.clone();
    for (ix = 0; ix < cln.spm[0].length; ++ix)
    {
      cln.spm[0][ix].scprodeq(sc);
    }
    return cln;
  }
  static scprod(sc, m) {
    return m.scprod(sc);
  }
  scprodeq(sc) {
    let ix;
    for (ix = 0; ix < this.spm[0].length; ++ix)
    {
      this.spm[0][ix].scprodeq(sc);
    }
    return this;
  }
  iexp(theta) {
    // multiply each element by the scalar exp(i theta)
    let cln, ix;
    cln = this.clonenv();
    for (ix = 0; ix < cln.spm[0].length; ++ix)
    {
      cln.spm[0][ix] = this.spm[0][ix].iexp(theta);
    }
    return cln;
  }
  sum(s) {
    // complex matrix sum
    const VL = 0, RW = 1, CL = 2;
    let tci, sci, tel, sel, p;
    if (this._rows !== s._rows || this._cols !== s._cols)
      throw new Error('not conformable: ' + (this._rows + 'x' + this._cols) + ' must equal ' + (s._rows + 'x' + s._cols));
    p = new SpMatrix(this._rows, this._cols, true);
    tci = this.colMajor();
    tel = tci.next();
    sci = s.colMajor();
    sel = sci.next();
    while (!(tel.done || sel.done))
    {
      if (tel.value[CL] > sel.value[CL])
      {
        p.addccf(sel.value[VL], sel.value[RW], sel.value[CL]);
        sel = sci.next();
      }
      else  if (tel.value[CL] < sel.value[CL])
      {
        p.addccf(tel.value[VL], tel.value[RW], tel.value[CL]);
        tel = tci.next();
      }
      else
      {
        if (tel.value[RW] > sel.value[RW])
        {
          p.addccf(sel.value[VL], sel.value[RW], sel.value[CL]);
          sel = sci.next();
        }
        else if (tel.value[RW] < sel.value[RW])
        {
          p.addccf(tel.value[VL], tel.value[RW], tel.value[CL]);
          tel = tci.next();
        }
        else
        {
          p.addccf(tel.value[VL].sum(sel.value[VL]), tel.value[RW], tel.value[CL]);
          tel = tci.next();
          sel = sci.next();
        }
      }
    }
    while (!tel.done)
    {
      p.addccf(tel.value[VL], tel.value[RW], tel.value[CL]);
      tel = tci.next();
    }
    while (!sel.done)
    {
      p.addccf(sel.value[VL], sel.value[RW], sel.value[CL]);
      sel = sci.next();
    }
    p.addccf(null);
    return p;
  }
  sumeq(s) {
    let p = this.sum(s);
    this.spm[0] = p.spm[0];
    this.spm[1] = p.spm[1];
    this.spm[2] = p.spm[2];
    return this;
  }
  conjugate(sc) {
    let cln, ix;
    cln = this.clonenv();
    for (ix = 0; ix < cln.spm[0].length; ++ix)
    {
      cln.spm[0][ix] = this.spm[0][ix].conjugate(sc);
    }
    return cln;
  }
  transpose() {
    // complex sparse matrix transpose
    let ix, cln, ri, rel;
    cln = new SpMatrix(this._cols, this._rows, true);
    for (ix = 0; ix < this._rows; ++ix)
    {
      ri = this.rowMajor(ix);
      rel = ri.next();
      while (!rel.done)
      {
        cln.addccf(rel.value[0], rel.value[2], rel.value[1]);
        rel = ri.next();
      }
    }
    cln.addccf(null);
    return cln;
  };
  adjoint() {
    // complex sparse matrix adjoint (conjugate transpose)
    let ix, cln, ri, rel;
    cln = new SpMatrix(this._cols, this._rows, true);
    for (ix = 0; ix < this._rows; ++ix)
    {
      ri = this.rowMajor(ix);
      rel = ri.next();
      while (!rel.done)
      {
        cln.addccf(rel.value[0].conjugate(), rel.value[2], rel.value[1]);
        rel = ri.next();
      }
    }
    cln.addccf(null);
    return cln;
  }
  tensorprod(rm) {
    // tensor product done in column major order to directly use ccf format data
    const VL = 0, RW = 1, CL = 2;
    let b1 = this._rows, b2 = this._cols, c1 = rm._rows, c2 = rm._cols,
        tp, tpr, tpc,
        rcx, rrw, rst, ren, rv,
        lcx, lrw, lst, len, lv;
    tp = new SpMatrix(b1 * c1, b2 * c2, true);
    rv = rm.spm[VL];
    for (lcx = 0; lcx < b2; ++lcx)  // iterate across left op columns
    {
      for (rcx = 0; rcx < c2; ++rcx)  // iterate across right op columns
      {
        lst = this.spm[CL][lcx];
        len = this.spm[CL][lcx + 1];
        tpc = lcx * c2;
        while (lst < len)  // iterate down left op rows
        {
          lv = this.spm[VL][lst];
          lrw = this.spm[RW][lst];
          tpr = lrw * c1;
          rst = rm.spm[CL][rcx];
          ren = rm.spm[CL][rcx + 1];
          while (rst < ren)  // iterate down right op rows
          {
            rrw = rm.spm[RW][rst];
            // left op row * right op rows + right op row,
            //console.log('add %s at [%d,%d]', lv.prod(rv[rst]).disp(), tpr + rrw, tpc + rcx);
            tp.addccf(lv.prod(rv[rst]), tpr + rrw, tpc + rcx);  // product of the two values
            rst += 1;
          }
          lst += 1;
        }
      }
    }
    tp.addccf(null);
    return tp;
  }
  equal(eq) {
    let d1 = this._rows, d2 = this._cols, ix;
    if (d1 !== eq._rows || d2 !== eq._cols)
      throw new Error('matrix operand sizes must be the same for equal comparison');
    if (this.spm[0].length !== eq.spm[0].length)
      return false;
    for (ix = 0; ix < this.spm[2].length; ++ix)
    {
      if (this.spm[2][ix] !== eq.spm[2][ix])
        return false;
    }
    for (ix = 0; ix < this.spm[1].length; ++ix)
    {
      if (this.spm[1][ix] !== eq.spm[1][ix])
        return false;
    }
    for (ix = 0; ix < this.spm[0].length; ++ix)
    {
      if (!this.spm[0][ix].equal(eq.spm[0][ix]))
        return false;
    }
    return true;
  }
  clone() {
    let cln, ix;
    cln = new SpMatrix(this._rows, this._cols);
    for (ix = 0; ix < this.spm[0].length; ++ix)
    {
      cln.spm[0][ix] = this.spm[0][ix].clone();
      cln.spm[1][ix] = this.spm[1][ix];
    }
    for (ix = 0; ix < this.spm[2].length; ++ix)
    {
      cln.spm[2][ix] = this.spm[2][ix];
    }
    cln.complete = this.complete;
    return cln;
  }
  clonenv() {
    let cln, ix;
    cln = new SpMatrix(this._rows, this._cols);
    cln.spm[0] = [];
    for (ix = 0; ix < this.spm[1].length; ++ix)
    {
      cln.spm[1][ix] = this.spm[1][ix];
    }
    for (ix = 0; ix < this.spm[2].length; ++ix)
    {
      cln.spm[2][ix] = this.spm[2][ix];
    }
    cln.complete = this.complete;
    return cln;
  }
  factorOut(f) {
    let ix, cln;
    if (!(f instanceof Complex))
      throw new Error('factor must be a complex number');
    cln = this.clonenv();
    for (ix = 0; ix < this.spm[0].length; ++ix)
    {
      cln.spm[0][ix] = this.spm[0][ix].quo(f);
    }
    return cln;
  }
  /**
   * Get or set the value at row ix, column jx.  If the third argument, val, is present, set the value, otherwise get.
   * @param ix the row coordinate
   * @param jx the column coordinate
   * @param val the optional value
   * @returns the current value on get, or the previous value on set
   */
  sub(ix, jx, val) {
    let st, en, prv, vla, rwa, cla;
    if (0 > ix || ix >= this._rows || 0 > jx || jx >= this._cols)
      throw new Error('subscript range');
    vla = this.spm[0];
    rwa = this.spm[1];
    cla = this.spm[2];
    st = cla[jx];
    en = cla[jx + 1];
    prv = null;
    while (st < en && ix > rwa[st])
    {
      ++st;
    }
    if (st < en && ix === rwa[st])
    {
      prv = vla[st];
      if (arguments.length < 3)
        return prv;
    }  // otherwise st is the index at which a new value can be inserted
    if (prv != null)  // a value was found and should be replaced
    {
      if (val.isZero())  // value to be deleted is at st
      {
        // delete a value
        en = vla.length - 1;
        while (en > st)
        {
          vla[st] = vla[st + 1];
          rwa[st] = rwa[st + 1];
          ++st;
        }
        vla.pop();
        rwa.pop();
        for (en = jx + 1; en < cla.length; ++en)
          --cla[en];
      }
      else
        vla[st] = val;
      return prv;
    }
    // no value at the coordinates was found and so should be zero; if not being replaced, it can be returned
    prv = new Complex(0);
    if (arguments.length < 3 || val.isZero())
      return prv;
    // need to insert a new value
    en = vla.length;
    while (en > st)
    {
      vla[en] = vla[en - 1];
      rwa[en] = rwa[en - 1];
      --en;
    }
    vla[st] = val;
    rwa[st] = ix;
    for (en = jx + 1; en < cla.length; ++en)
      ++cla[en];
    return prv;
  }
  disp() {
    let ix, jx, str, dsp, cln, d1 = this._rows, d2 = this._cols;
    // cln = this.rebuild();
    dsp = new Array(d1);
    for (ix = 0; ix < d1; ++ix)
    {
      str = new Array(d2);
      for (jx = 0; jx < d2; ++jx)
      {
        str[jx] = this.sub(ix, jx).disp();
      }
      dsp[ix] = str.join(' ');
    }
    return dsp.join('\n');
  }
  qdisp() {
    let rows, one, basis, coef, qbs, ix, vl,
        qout = [],
        cols = this._cols;
    if (1 !== cols)
      throw new Error('qdisp() input must be a quantum state (column vector');
    one = new Complex(1, 0);
    rows = this._rows;
    ix = rows;
    qbs = 0;
    while (ix > 1)
    {
      qbs += 1;
      ix /= 2;
    }
    for (ix = 0; ix < rows; ++ix)
    {
      vl = this.sub(ix, 0);
      if (!vl.isZero())
      {
        basis = Number(ix).toString(2);
        // while (basis.length < qbs)
        //   basis = '0' + basis;
        basis = '|' + '0'.repeat(qbs - basis.length) + basis + '>';
        if (!one.equal(vl))
        {
          coef = vl.disp(Complex.precision);
          if (0 !== qout.length)
          {
            if (coef.charAt(0) !== '-')
              coef = '+' + coef;
          }
        }
        else
        {
          coef = (0 === qout.length) ? '' : '+';
          //coef = '';
        }
        qout.push(coef + basis)
      }
    }
    return qout.join('');
  }
  edisp() {
    function ljustify(str, wid, sgn) {
      let ln = str.length;
      if (0 === ln)
        return ' '.repeat(wid - ln);
      if (sgn && '-' !== str.charAt(0))
      {
        str = ' ' + str;
        ln += 1;
      }
      if (ln < wid)
        str += ' '.repeat(wid - ln);
      return str;
    }
    let ix, jx, str, dsp, sgn, lnc, ln, cln, d1 = this._rows, d2 = this._cols;
    let singleElement;
    //cln = this.rebuild();
    dsp = new Array(d1);
    for (jx = 0; jx < d2; ++jx)
    {
      lnc = 0;
      sgn = false;
      str = new Array(d1);
      for (ix = 0; ix < d1; ++ix)
      {
        singleElement = this.sub(ix, jx);
        str[ix] = (SpMatrix.configReplaceZeroes && singleElement.isZero()) ? '.' : singleElement.disp();
        ln = str[ix].length;
        if (lnc < ln)
          lnc = ln;
        if ('-' === str[ix].charAt(0))
          sgn = true;
      }
      if (sgn)
      {
        for (ix = 0; ix < d1; ++ix)
        {
          if (lnc === str[ix].length && '-' !== str[ix].charAt(0))
          {
            lnc += 1;
            break;
          }
        }
      }
      if (jx > 0)
      {
        for (ix = 0; ix < d1; ++ix)
        {
          dsp[ix] += ' ' + ljustify(str[ix], lnc, sgn);
        }
      }
      else
      {
        for (ix = 0; ix < d1; ++ix)
        {
          dsp[ix] = ljustify(str[ix], lnc, sgn);
        }
      }
    }
    return dsp.join('\n');
  }
  toString() {
    let c, v = [], w = [], cl, cls = this.spm[0].length, str;
    for (cl = 0; cl < cls; ++cl)
    {
      c = this.spm[0][cl];
      v.push(c.disp());
      w.push(c.length);
    }
    str = [];
    str.push(v.join(' '));
    v = [];
    for (cl = 0; cl < cls; ++cl)
    {
      c = String(this.spm[1][cl]);
      v.push(' '.repeat(w[cl] - c.length) + c);
    }
    str.push(v.join(' '));
    cls = this.spm[2].length;
    v = [];
    for (cl = 0; cl < cls; ++cl)
    {
      c = String(this.spm[2][cl]);
      v.push(' '.repeat(w[cl] - c.length) + c);
    }
    str.push(v.join(' '));
    return str.join('\n');
  }
  iterate() {

  }
}
SpMatrix.configReplaceZeroes = false;
SpMatrix.setReplaceZeroes = function (flg) {
  if (typeof flg === 'boolean')
    SpMatrix.configReplaceZeroes = flg;
};
/*(function() {
  let m1, m2, ms, v, rmj, ix, jx;
  // m1 = qq.Quantum.buildCNOT(3, 0, 2);
  // console.log("CNOT 302\n%s", m1.disp());
  // ms = new SpMatrix(m1);
  // console.log(ms.toString());
  // console.log('rebuild=\n%s', ms.rebuild().disp());
  // // colMajorList(ms);
  // // rowMajorList(ms);
  // m1 = qq.Quantum.buildBasis(4, 7);
  // console.log("4Q Basis value 7=%s", m1.transpose().disp());
  // ms = new SpMatrix(m1);
  // console.log(ms.toString());
  // console.log('rebuild=%s', ms.rebuild().transpose().disp());
  // // colMajorList(ms);
  // // rowMajorList(ms);
  // m1 = qq.Quantum.buildHn(2);
  // console.log("Hadamard\n%s", m1.disp());
  // ms = new SpMatrix(m1);
  // console.log(ms.toString());
  // console.log('rebuild=\n%s', ms.rebuild().disp());
  // // colMajorList(ms);
  // // rowMajorList(ms);
  // // gens();
  // m2 = ms.prod(ms);
  // console.log("4x4 Hadamard^2\n%s", m2.toString());
  // console.log('rebuild=\n%s', m2.rebuild().disp());
  function gens() {
    function* logGenerator() {
      console.log(0);
      console.log(1, yield);
      console.log(2, yield);
      console.log(3, yield);
      return 4;
    }

    var gen = logGenerator();

// the first call of next executes from the start of the function
// until the first yield statement
    gen.next();             // 0
    gen.next('pretzel');    // 1 pretzel
    gen.next('california'); // 2 california
    gen.next('mayonnaise'); // 3 mayonnaise
    console.log(gen.next());
  }
  function colMajorList(ms) {
    let cmj = ms.colMajor(),
        m2 = cmj.next();
    console.log('column major');
    while (!m2.done)
    {
      // console.log('[%d,%d]', m2.value[1], m2.value[2]);
      console.log(m2);
      m2 = cmj.next();
    }
    console.log(m2);
  }
  function rowMajorList(ms) {
    let rmj = ms.rowMajor(),
        m2 = rmj.next();
    console.log('row major');
    while (!m2.done)
    {
      // console.log('[%d,%d]', m2.value[1], m2.value[2]);
      console.log(m2);
      m2 = rmj.next();
    }
    console.log(m2);
  }
  function testMatrix() {
    let rmj, ix, jx, v;
    rmj = [];
    for (ix = 0; ix < 4; ++ix)
    {
      rmj[ix] = [];
      for (jx = 0; jx < 4; ++jx)
      {
        rmj[ix][jx] = new Complex(ix * 4 + jx);
      }
    }
    v = new CMatrix(rmj[0], rmj[1], rmj[2], rmj[3]);
    console.log("test\n%s", v.disp());
    return [new SpMatrix(v), v];
  }
  // console.log(ms.toString());
  // console.log('rebuild=\n%s', ms.rebuild().disp());
  // console.log('row major');
  // for (ix = 0; ix < 4; ++ix)
  // {
  //   m1 = ms.rowMajor(ix);
  //   m2 = m1.next();
  //   while (!m2.done)
  //   {
  //     console.log('[%d,%d]=%s', m2.value[1], m2.value[2], m2.value[0].disp());
  //     m2 = m1.next();
  //   }
  // }
  // console.log('column major');
  // for (ix = 0; ix < 4; ++ix)
  // {
  //   m1 = ms.colMajor(ix);
  //   m2 = m1.next();
  //   while (!m2.done)
  //   {
  //     console.log('[%d,%d]=%s', m2.value[1], m2.value[2], m2.value[0].disp());
  //     m2 = m1.next();
  //   }
  // }
  function testTranspose()
  {
    ms = testMatrix();
    console.log(ms[0].toString());
    // console.log('rebuild=\n%s', ms.rebuild().disp());
    m1 = ms[0].transpose();
    console.log(m1.toString());
    console.log('rebuild=\n%s', m1.rebuild().disp());
  }
  function testDeterminant() {
    let tm, cm;
    ms = testMatrix();
    cm = qq.Quantum.buildHn(2);
    console.log('determinant:', cm.det());
    tm = new SpMatrix(cm);
    console.log(tm.toString());
    console.log('sparse determinant:', tm.det());
    // console.log(ms.toString());
  }
  function testSum() {
    let ms, sm, cm, cln;
    ms = testMatrix();
    cln = ms[0].clone();
    cln.sub(0, 1, new Complex(0));
    cln.sub(0, 2, new Complex(0));
    cln.sub(0, 3, new Complex(0));
    cln.sub(1, 0, new Complex(0));
    cln.sub(2, 0, new Complex(0));
    cln.sub(3, 0, new Complex(0));
    console.log('plus:\n%s', cln.disp());
    sm = ms[0].sum(cln);
    console.log('A+B sum toString:\n%s', sm.toString());
    console.log('A+B sum:\n%s', sm.disp());
    sm = cln.sum(ms[0]);
    console.log('B+A sum toString:\n%s', sm.toString());
    console.log('B+A sum:\n%s', sm.disp());
    sm = ms[0].clone();
    sm.sumeq(cln);
    console.log('sumeq toString:\n%s', sm.toString());
    console.log('sumeq:\n%s', sm.disp());
    // console.log(ms.toString());
  }
  function testTensorProd() {
    let ms, im, tm, cm;
    ms = testMatrix();
    im = new SpMatrix(qq.Quantum.iGate);
    tm = ms[0].tensorprod(im);
    console.log(tm.toString());
    console.log('rebuild tensorprod TestxI:\n%s', tm.rebuild().disp());
    tm = im.tensorprod(ms[0]);
    console.log(tm.toString());
    console.log('rebuild tensorprod IxTest:\n%s', tm.rebuild().disp());
    // console.log(ms.toString());
  }
  function testBuildCNOT (qbits, ctl, tgt)
  {
    let sz, ix, jx, gat, bas;
    if (qbits < 2 || ctl < 0 || ctl >= qbits || tgt < 0 || tgt >= qbits)
      throw new Error('buildCNOT argument range error qubits:' + qbits + ', ctl:' + ctl + ', tgt:' + tgt);
    sz = Math.pow(2, qbits);
    gat = new SpMatrix(sz, sz);
    for (ix = 0; ix < sz; ++ix)
    {
      for (jx = 0; jx < sz; ++jx)
      {
        gat.sub(ix, jx, new Complex(0));
      }
    }
    for (ix = 0; ix < sz; ++ix)
    {
      bas = (+ix).toString(2);
      bas = '0'.repeat(qbits - bas.length) + bas;
      bas = bas.split('');
      if (bas[ctl] === '1')
      {
        bas[tgt] = (bas[tgt] === '0') ? '1' : '0';
        jx = parseInt(bas.join(''), 2);
      }
      else
      {
        jx = ix;
      }
      if (jx === undefined)
        console.log('jx is undefined');
      gat.sub(ix, jx, new Complex(1));
      console.log(gat.toString());
    }
    console.log(gat.toString());
    console.log('rebuild CNOT(2,0,1):\n%s', gat.rebuild().disp());
    return gat;
  }
  // testBuildCNOT(2, 0, 1);
  testSum();
})();*/

exports.SpMatrix = SpMatrix;
exports.Complex = Complex;
exports.CMatrix = CMatrix;

