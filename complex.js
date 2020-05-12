/**
 * Created by danevans on 1/20/18.
 */
function Complex(re, im) {
  if (typeof arguments[0] === 'string')
  {
    this.magn = re.match(/([+-]?)([0-9.]+)([+-])([0-9.]+)i/); // both real and imag must be present with i suffix
    if (this.magn != null)
    {
      this.real = parseFloat(this.magn[1] + this.magn[2]);
      this.imag = parseFloat(this.magn[3] + this.magn[4]);
    }
    else
    {
      this.real = 0.0;
      this.imag = 0.0;
    }
  }
  else if (arguments[0] instanceof Complex)
  {
    this.real = re.real;
    this.imag = re.imag;
  }
  else if (arguments[0] instanceof Array)
  {
    if (arguments[0].length >= 1)
    {
      this.real = Number(re[0]);
      if (arguments.length >= 2)
        this.imag = Number(re[1]);
      else
        this.imag = 0.0;
    }
    else
    {
      this.real = 0.0;
      this.imag = 0.0;
    }
  }
  else
  {
    this.real = Number(re);
    if (arguments.length > 1)
      this.imag = Number(im);
    else
      this.imag = 0.0;
  }
  this.polar();
}
Complex.prototype.clone = function()
{
  return new Complex(this);
};
Complex.tolerance = 0.000001;
Complex.precision = 3;
Complex.prototype.arg = function () {
  return this.argu;
};
Complex.prototype.argdeg = function () {
  return 180.0 * this.argu / Math.PI;
};
Complex.prototype.mag = function () {
  return this.magn;
};
Complex.prototype.polar = function () {
  let neg;
  if (Math.abs(this.real) < Complex.tolerance)
    this.real = 0.0;
  if (Math.abs(this.imag) < Complex.tolerance)
    this.imag = 0.0;
  this.magn = Math.sqrt(this.real * this.real + this.imag * this.imag);
  if (this.real === 0.0)
  {
    if (this.imag === 0.0)
    {
      this.argu = 0.0
    }
    else
    {
      neg = (this.imag > 0) ? 1 : -1;
      this.argu = (neg) * Math.PI / 2;
    }
  }
  else
  {
    this.argu = Math.atan2(this.imag, this.real);
    if (-0.0 === this.argu)
      this.argu = 0.0;
  }
};
Complex.prototype.Re = function() {
  return this.real;
};
Complex.prototype.Im = function() {
  return this.imag;
};
Complex.prototype.isZero = function() {
  return Math.abs(this.real) < Complex.tolerance && Math.abs(this.imag) < Complex.tolerance;
};
Complex.prototype.unit = function () {
  let c = this.clone();
  c.real /= c.magn;
  c.imag /= c.magn;
  c.magn = 1.0;
  return c;
};
Complex.prototype.sum = function(c) {
  return new Complex(this.real + c.real, this.imag + c.imag);
};
Complex.prototype.sumeq = function(c) {
  this.real += c.real;
  this.imag += c.imag;
  this.polar();
  return this;
};
Complex.prototype.diff = function(c) {
  return new Complex(this.real - c.real, this.imag - c.imag);
};
Complex.prototype.diffeq = function(c) {
  this.real -= c.real;
  this.imag -= c.imag;
  this.polar();
  return this;
};
Complex.prototype.prod = function(c) {
  let tr, ti;
  tr = this.real * c.real - this.imag * c.imag;
  ti = this.real * c.imag + this.imag * c.real;
  return new Complex(tr, ti);
};
Complex.prototype.prodeq = function(c) {
  let tr;
  if (!(c instanceof Complex))
    throw new Error('Complex.prodeq - multiplier is not Complex');
  tr = this.real * c.real - this.imag * c.imag;
  this.imag = this.real * c.imag + this.imag * c.real;
  this.real = tr;
  this.polar();
  return this;
};
Complex.prototype.scprod = function(sc) {
  if (sc instanceof Complex)
    return this.prod(sc);
  return new Complex(this.real * sc, this.imag * sc);
};
Complex.prototype.scprodeq = function(sc) {
  if (sc instanceof Complex)
    return this.prodeq(sc);
  this.real *= sc;
  this.imag *= sc;
  this.polar();
  return this;
};
Complex.prototype.quo = function(c) {
  let n = c.conjugate(), d;
  d = c.prod(n);
  if (0.0 === d.real)
    throw new Error('zerodivide');
  n.prodeq(this);
  n.real /= d.real;
  n.imag /= d.real;
  n.polar();
  return n;
};
Complex.prototype.quoeq = function(c) {
  let cj = c.conjugate(), n, d;
  d = c.clone();
  d.prodeq(cj);
  if (0.0 === d.real)
    throw new Error('zerodivide');
  n = this.clone();
  n.prodeq(cj);
  this.real = n.real / d.real;
  this.imag = n.imag / d.real;
  this.polar();
  return this;
};
Complex.prototype.conjugate = function() {
  return new Complex(this.real, -this.imag);
};
Complex.prototype.negate = function() {
  return new Complex(-this.real, -this.imag);
};
Complex.prototype.conjugateq = function() {
  this.imag = -this.imag;
  this.polar();
  return this;
};
Complex.prototype.negateq = function() {
  this.real = -this.real;
  this.imag = -this.imag;
  this.polar();
  return this;
};
Complex.prototype.isOne = function() {
  return 1.0 === this.real && 0.0 === this.imag;
};
Complex.prototype.pow = function(rt) {
  let arg, c, d, pi2;
  if (0 === rt)
    return new Complex(1, 0);
  pi2 = Math.PI + Math.PI;
  arg = (0.0 === this.argu) ? pi2 : this.argu;
  c = new Complex(0, 0);
  if (rt < 0)
  {
    c.magn = Math.pow(this.magn, Math.abs(rt));
    c.argu = arg * Math.abs(rt);
  }
  else
  {
    c.magn = Math.pow(this.magn, rt);
    c.argu = arg * rt;
  }
  if (c.argu >= 0)
  {
    while (c.argu > Math.PI)
      c.argu -= pi2;
  }
  else
  {
    while (c.argu <= Math.PI)
      c.argu += pi2;
  }
  c.real = c.magn * Math.cos(c.argu);
  c.imag = c.magn * Math.sin(c.argu);
  if (Math.abs(c.real) < Complex.tolerance)
    c.real = 0.0;
  if (Math.abs(c.imag) < Complex.tolerance)
    c.imag = 0.0;
  if (rt < 0)
  {
    d = c;
    c = new Complex(1, 0);
    c.quo(d);
  }
  return c;
};
Complex.iexp = function (theta) {
  // return exp(i theta)
  return new Complex(Math.cos(theta), Math.sin(theta));
};
Complex.prototype.iexp = function (theta) {
  // multiply this Complex number by exp(i angle)
  return this.prod(new Complex(Math.cos(theta), Math.sin(theta)));
};
Complex.prototype.disp = function() {
  let str = '';
  if (this.real !== 0.0)
  {
    str += Complex.format(this.real);
  }
  if (this.imag !== 0.0)
  {
    if (this.imag > 0 && 0 !== str.length)
      str += '+';
    if (1.0 === this.imag)
      str += 'i';
    else if (-1.0 === this.imag)
      str += '-i';
    else
    {
      str += Complex.format(this.imag) + 'i';
    }
  }
  else if (0.0 === this.real)
    str = '0';
  return str;
};
Complex.prototype.dispPolar = function() {
  let str = '';
  str += Complex.format(this.magn) + '@' + Complex.format((180.0 * this.argu / Math.PI));
  return str;
};
Complex.prototype.assign = function(c) {
  if (arguments.length === 1)
  {
    if (c instanceof Complex)
    {
      this.real = c.real;
      this.imag = c.imag;
    }
    else
    {
      this.real = c;
      this.imag = 0.0;
    }
  }
  else if (arguments.length === 2)
  {
    this.real = c;
    this.imag = arguments[1];
  }
  this.polar();
};
Complex.prototype.equal = function (eq)
{
  return this.real === eq.real && this.imag === eq.imag;
};
Complex.format = function (d, p)
{
  let f, exp, ix;
  if (Math.floor(d) === d)
    return String(d);
  if (undefined === p)
    p = Complex.precision;
  exp = 1;
  for (ix = 0; ix < p; ++ix)
  {
    exp *= 10;
  }
  f = Math.floor(d  * exp + 0.5);
  return String(f / exp);
};

function CMatrix() {
  let ix, jx;
  if (0 !== arguments.length)
  {
    if (arguments[0] instanceof Array)
    {
      jx = arguments[0].length;
      for (ix = 1; ix < arguments.length; ++ix)
      {
        if (jx !== arguments[ix].length)
          throw new Error('arguments must be N arrays of the same length');
      }
    }
    else if (typeof arguments[0] === 'number' && arguments.length === 2)
    {
      this.mat = new Array(arguments[0]);
      for (ix = 0; ix < this.mat.length; ++ix)
      {
        this.mat[ix] = new Array(arguments[1]);
      }
      return;
    }
    else
      throw new Error('arguments must be two numeric dimensions or conformable arrays');
  }
  this.mat = new Array(arguments.length);
  for (ix = 0; ix < arguments.length; ++ix)
  {
    this.mat[ix] = new Array(arguments[ix].length);
    for (jx = 0; jx < arguments[ix].length; ++jx)
    {
      this.mat[ix][jx] = arguments[ix][jx].clone();
    }
  }
}
CMatrix.prototype.minor = function(i, j)
{
  let mn, ix, jx, mi, mj, d1;
  d1 = this.rows() - 1;
  mn = new CMatrix(d1, d1);
  mi = -1;
  for (ix = 0; ix < this.columns(); ++ix)
  {
    if (ix === i)
      continue;
    ++mi;
    mj = -1;
    for (jx = 0; jx < this.mat[ix].length; ++jx)
    {
      if (jx === j)
        continue;
      ++mj;
      mn.mat[mi][mj] = this.mat[ix][jx].clone();
    }
  }
  return mn.det();
};
CMatrix.prototype.det = function()
{
  let ix, jx, dot, sgn, s, v, m;
  if (1 === this.mat.length)
    return this.mat[0][0].clone();
  if (2 === this.mat.length)
  {
    dot = this.mat[0][0].prod(this.mat[1][1]);
    v = this.mat[0][1].prod(this.mat[1][0]);
    dot.diffeq(v);
    return dot;
  }
  sgn = new Complex(-1, 0);
  s = sgn.clone();
  dot = new Complex(0, 0);
  for (ix = 0; ix < 1; ++ix)
  {
    for (jx = 0; jx < this.mat[ix].length; ++jx)
    {
      s.prodeq(sgn);
      v = this.mat[ix][jx].clone();
      m = this.minor(ix, jx);
      //console.log('minor (' + ix + ',' + jx + ') =');
      //console.log(m.disp());
      v.prodeq(m);
      v.prodeq(s);
      dot.sumeq(v);
    }
  }
  return dot;
};
CMatrix.prototype.mag = function() {
  /* row magnitudes, row and column vector exceptions */
  let ix, jx, acc, r, mg;
  r = [];
  for (ix = 0; ix < this.mat.length; ++ix)
  {
    mg = this.mat[ix][0].mag();
    acc = mg * mg;
    for (jx = 1; jx < this.mat[ix].length; ++jx)
    {
      mg = this.mat[ix][jx].mag();
      acc += mg * mg;
    }
    r.push(acc);
  }
  if (1 < this.mat.length && 1 === this.mat[0].length)
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
};
CMatrix.prototype.dim = function() {
  return [this.mat.length, this.mat[0].length];
};
CMatrix.prototype.rows = function() {
  return this.mat.length;
};
CMatrix.prototype.columns = function() {
  return this.mat[0].length;
};
CMatrix.prototype.prod = function(c) {
  // complex matrix multiplication
  let d1 = this.columns(), d2 = c.rows(), p, ix, jx, kx, r1, r2;
  if (d1 !== d2)
    throw new Error('not conformable: ' + d2 + ' columns must equal ' + d1 + ' rows');
  d2 = c.columns();
  p = new CMatrix(this.rows(), d2);
  for (ix = 0; ix < p.mat.length; ++ix)
  {
    for (jx = 0; jx < p.mat[ix].length; ++jx)
    {
      r2 = new Complex(0, 0);
      for (kx = 0; kx < d1; ++kx)
      {
        r1 = this.mat[ix][kx].prod(c.mat[kx][jx]);
        r2.sumeq(r1);
      }
      p.mat[ix][jx] = r2;
    }
  }
  return p;
};
CMatrix.prototype.scprod = function(sc) {
  // complex matrix multiplication by a scalar
  let p, ix, jx, d1 = this.rows(), d2 = this.columns();
  p = new CMatrix(d1, d2);
  for (ix = 0; ix < d1; ++ix)
  {
    for (jx = 0; jx < d2; ++jx)
    {
      p.mat[ix][jx] = this.mat[ix][jx].scprod(sc);
    }
  }
  return p;
};
CMatrix.scprod = function(sc, m) {
  return m.scprod(sc);
}
CMatrix.prototype.scprodeq = function(sc) {
  // complex matrix multiplication by a scalar
  let ix, jx, d1 = this.rows(), d2 = this.columns();
  for (ix = 0; ix < d1; ++ix)
  {
    for (jx = 0; jx < d2; ++jx)
    {
      this.mat[ix][jx].scprodeq(sc);
    }
  }
  return this;
};
CMatrix.prototype.iexp = function(theta) {
  // multiply each element by the scalar exp(i theta)
  let p, ix, jx, d1 = this.rows(), d2 = this.columns();
  p = new CMatrix(d1, d2);
  for (ix = 0; ix < d1; ++ix)
  {
    for (jx = 0; jx < d2; ++jx)
    {
      p.mat[ix][jx] = this.mat[ix][jx].iexp(theta);
    }
  }
  return p;
};
CMatrix.prototype.sum = function(s) {
  // complex matrix multiplication by a scalar
  let ix, jx, p = s.rows(), q = s.columns(), m = this.rows(), n = this.columns();
  if (m !== p || n !== q)
    throw new Error('not conformable: ' + (m + 'x' + n) + ' must equal ' + (p + 'x' + q));
  p = new CMatrix(m, n);
  for (ix = 0; ix < m; ++ix)
  {
    for (jx = 0; jx < n; ++jx)
    {
      p.mat[ix][jx] = this.mat[ix][jx].sum(s.mat[ix][jx]);
    }
  }
  return p;
};
CMatrix.prototype.sumeq = function(s) {
  // complex matrix summation
  let ix, jx, p = s.rows(), q = s.columns(), m = this.rows(), n = this.columns();
  if (m !== p || n !== q)
    throw new Error('not conformable: ' + (m + 'x' + n) + ' must equal ' + (p + 'x' + q));
  for (ix = 0; ix < m; ++ix)
  {
    for (jx = 0; jx < n; ++jx)
    {
      this.mat[ix][jx].sumeq(s.mat[ix][jx]);
    }
  }
  return this;
};
CMatrix.prototype.conjugate = function() {
  // complex matrix conjugate
  let ix, jx, d1 = this.rows(), d2 = this.columns(), p;
  p = new CMatrix(d1, d2);
  for (ix = 0; ix < d1; ++ix)
  {
    for (jx = 0; jx < d2; ++jx)
    {
      p.mat[ix][jx] = this.mat[ix][jx].conjugate();
    }
  }
  return p;
};
CMatrix.prototype.transpose = function() {
  // complex matrix transpose
  let ix, jx, d1 = this.rows(), d2 = this.columns(), p;
  p = new CMatrix(d2, d1);
  for (ix = 0; ix < d1; ++ix)
  {
    for (jx = 0; jx < d2; ++jx)
    {
      p.mat[jx][ix] = this.mat[ix][jx];
    }
  }
  return p;
};
CMatrix.prototype.adjoint = function() {
  // complex matrix conjugate transpose
  let ix, jx, d1 = this.rows(), d2 = this.columns(), p;
  p = new CMatrix(d2, d1);
  for (ix = 0; ix < d1; ++ix)
  {
    for (jx = 0; jx < d2; ++jx)
    {
      p.mat[jx][ix] = this.mat[ix][jx].conjugate();
    }
  }
  return p;
};
CMatrix.prototype.innerprod = function (c) {
  // complex vector inner product  two 1 x n column vectors ('this' is the left operand and will be adjointed)
  // returns Complex
  let ix, lft, d1 = this.columns(), d2 = c.columns(), p;
  if (1 !== d1 || 1 !== d2 || this.rows() !== c.rows())
      throw new Error('vector dimensions not conformable for inner product - must be n x 1');
  p = new Complex(0, 0);
  lft = this.adjoint();
  d1 = c.rows();
  for (ix = 0; ix < d1; ++ix)
  {
    p.sumeq(lft.mat[0][ix].prod(c.mat[ix][0]));
  }
  return p;
};
CMatrix.prototype.norm = function () {
  // complex vector norm, expects a column vector (1 x n matrix)
  // returns real
  let ipsq, d1 = this.columns();
  if (1 !== d1)
    throw new Error('norm requires column vector - must be n x 1');
  ipsq = this.innerprod(this);
  return Math.sqrt(ipsq.Re());
};
CMatrix.prototype.outerprod = function(c) {
  // complex vector outer product    n x 1 column vector (this) times 1 x n row vector
  // returns n x n CMatrix where r(i,j) = this(i,0) * c(0,j)
  let ix, jx, d1 = this.rows(), d2 = c.columns(), p;
  if (d1 !== d2)
    throw new Error('not conformable: left ' + d1 + ' rows must equal right ' + d2 + ' columns');
  if (1 !== this.columns() || 1 !== c.rows())
    throw new Error('not conformable: left 1 column must equal right 1 row');
  p = new CMatrix(d1, d2);
  for (ix = 0; ix < d1; ++ix)
  {
    for (jx = 0; jx < d2; ++jx)
    {
      p.mat[jx][ix] = this.mat[ix][0].prod(c.mat[0][jx]);
    }
  }
  return p;
};
CMatrix.prototype.inverse = function() {
  // complex matrix inverse
  // calculate the determinant of this matrix
  // for each element ij, calculate the minor of the ji'th element, negate it if i+j is odd, then
  // divide it by the determinant
  let d1 = this.rows(), d2 = this.columns(), p, ix, jx, m, dt;
  if (d1 !== d2)
    throw new Error('not conformable: ' + d2 + ' columns must equal ' + d1 + ' rows');
  dt = this.det();
  if (dt.isZero())
    throw new Error('singular matrix: 0 determinant');
  p = new CMatrix(d1, d2);
  for (ix = 0; ix < d1; ++ix)
  {
    for (jx = 0; jx < d2; ++jx)
    {
      m = this.minor(jx, ix);
      if (0 !== (ix + jx) % 2)
        m.scprodeq(-1);
      p.mat[ix][jx] = m.quo(dt);
    }
  }
  return p;
};
CMatrix.prototype.tensorprod = function(cm) {
  // tensor product of an m-by-n matrix with a p-by-q matrix creates a mp-by-nq matrix
  // 2-by-1 tp 2-by-1 creates 4-by-1 [[a1*b1],[a2*b2],[a2*b1],[a2*b2]]
  let b1 = this.rows(), b2 = this.columns(), c1 = cm.rows(), c2 = cm.columns(), tp, ix, jx, px, qx, t1, t2;
  tp = new CMatrix(b1 * c1, b2 * c2);
  for (t1 = ix = 0; ix < b1; ++ix)
  {
    for (px = 0; px < c1; ++px, ++t1)
    {
      for (t2 = jx = 0; jx < b2; ++jx)
      {
        for (qx = 0; qx < c2; ++qx, ++t2)
        {
          tp.mat[t1][t2] = this.mat[ix][jx].prod(cm.mat[px][qx]);
          //console.log('%d %d = %d %d %d %d', t1+1, t2+1, ix+1, jx+1, px+1, qx+1);
        }
      }
    }
  }
  return tp;
};
CMatrix.prototype.equal = function(eq) {
  let d1 = this.rows(), d2 = this.columns(), ix, jx;
  for (ix = 0; ix < d1; ++ix)
  {
    for (jx = 0; jx < d2; ++jx)
    {
      if (!this.mat[ix][jx].equal(eq.mat[ix][jx]))
        return false;
    }
  }
  return true;
};
CMatrix.prototype.clone = function() {
  let d1 = this.rows(), d2 = this.columns(), p, ix, jx;
  p = new CMatrix(d1, d2);
  for (ix = 0; ix < d1; ++ix)
  {
    for (jx = 0; jx < d2; ++jx)
    {
      p.mat[ix][jx] = this.mat[ix][jx].clone();
    }
  }
  return p;
};
CMatrix.prototype.solve = function(v) {
  let d1 = this.rows(), d2 = this.columns(), cl, ix, jx, n, d, sol;
  if (d1 !== d2)
    throw new Error('not conformable: ' + d2 + ' columns must equal ' + d1 + ' rows');
  if (v.length !== d1)
    throw new Error('not conformable: column vector length must equal ' + d1 + ' rows');
  d = this.det();
  if (d.isZero())
    throw new Error('no solution - singular matrix: 0 determinant');
  cl = this.clone();
  sol = [];
  for (jx = 0; jx < d2; ++jx)
  {
    for (ix = 0; ix < d1; ++ix)
    {
      cl.mat[ix][jx] = v[ix];
    }
    n = cl.det();
    n.quoeq(d);
    sol.push(n);
    for (ix = 0; ix < d1; ++ix)
    {
      cl.mat[ix][jx] = this.mat[ix][jx];
    }
  }
  return sol;
};
CMatrix.prototype.factorOut = function (f) {
  let ix, jx, rws, cls, rslt;
  if (!(f instanceof Complex))
    throw new Error('factor must be a complex number');
  rslt = this.clone();
  rws = rslt.rows();
  cls = rslt.columns();
  for (ix = 0; ix < rws; ++ix)
  {
    for (jx = 0; jx < cls; ++jx)
    {
      rslt.mat[ix][jx].quoeq(f);
    }
  }
  return rslt;
};
CMatrix.prototype.disp = function() {
  let ix, jx, str, dsp, d1 = this.rows(), d2 = this.columns();
  dsp = new Array(d1);
  for (ix = 0; ix < d1; ++ix)
  {
    str = new Array(d2);
    for (jx = 0; jx < d2; ++jx)
    {
      str[jx] = this.mat[ix][jx].disp();
    }
    dsp[ix] = str.join(' ');
  }
  return dsp.join('\n');
};
CMatrix.prototype.qdisp = function() {
  let rows, one, basis, coef, qbs, ix,
      qout = [],
      cols = this.columns();
  if (1 !== cols)
    throw new Error('qdisp() input must be a quantum state (column vector');
  one = new Complex(1, 0);
  rows = this.rows();
  ix = rows;
  qbs = 0;
  while (ix > 1)
  {
    qbs += 1;
    ix /= 2;
  }
  for (ix = 0; ix < rows; ++ix)
  {
    if (!this.mat[ix][0].isZero())
    {
      basis = Number(ix).toString(2);
      while (basis.length < qbs)
        basis = '0' + basis;
      basis = '|' + basis + '>';
      if (!one.equal(this.mat[ix][0]))
      {
        coef = this.mat[ix][0].disp(Complex.precision);
        if (0 !== qout.length)
        {
          if (coef.charAt(0) !== '-')
            coef = '+' + coef;
        }
      }
      else
        coef = '';
      qout.push(coef + basis)
    }
  }
  return qout.join('');
};
CMatrix.prototype.edisp = function() {
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
  let ix, jx, str, dsp, sgn, lnc, ln, d1 = this.rows(), d2 = this.columns();
  dsp = new Array(d1);
  for (jx = 0; jx < d2; ++jx)
  {
    lnc = 0;
    sgn = false;
    str = new Array(d1);
    for (ix = 0; ix < d1; ++ix)
    {
      str[ix] = this.mat[ix][jx].disp();
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
};
/**
 * Get or set the value at row ix, column jx.  If the third argument, val, is present, set the value, otherwise get.
 * @param ix the row coordinate
 * @param jx the column coordinate
 * @param val the optional value
 * @returns the current value on get, or the previous value on set
 */
CMatrix.prototype.sub = function (ix, jx, val) {
  let d1 = this.rows(), d2 = this.columns(), prv;
  if (0 > ix || ix >= d1 || 0 > jx || jx >= d2)
    throw new Error('subscript range');
  if (arguments.length < 3)
    return this.mat[ix][jx];
  prv = this.mat[ix][jx];
  this.mat[ix][jx] = val;
  return prv;
};
CMatrix.prototype.foreach = function (func) {
  let ix, jx, str, p, d1 = this.rows(), d2 = this.columns();
  p = new CMatrix(d1, d2);
  for (ix = 0; ix < d1; ++ix)
  {
    str = [];
    for (jx = 0; jx < d2; ++jx)
    {
      p.mat[ix][jx] = new Complex(func.call(this.mat[ix][jx]));
    }
  }
  return p;
};
CMatrix.prototype.dispRow = function(ix) {
  let jx, str, d1 = this.rows(), d2 = this.columns();
  if (0 > ix || ix >= d1)
    return '';
  str = [];
  for (jx = 0; jx < d2; ++jx)
  {
    str.push(this.mat[ix][jx].disp());
  }
  return str.join(' ');
};
function CVector(v)
{
  if (1 === arguments.length)
  {
    if (arguments[0] instanceof Array)
    {
      CMatrix.call(this,[v]);
      return;
    }
    else if (typeof arguments[0] === 'number' && arguments.length === 1)
    {
      CMatrix.call(this, 1, v);
      return;
    }
    else
      throw new Error('argument must be one numeric dimension or a one-dimensional array');
  }
  CMatrix.call(this);
}
CVector.prototype.__proto__ = CMatrix.prototype;
/*function solve(a, b, dd) {
  let d1, d2, ix, jx;
  try
  {
    d1 = a.solve(b);
  }
  catch (e)
  {
    console.log('error:' + e.message);
    return;
  }
  console.log('equation matrix');
//console.log(a.disp());
  for (ix = 0; ix < d1.length; ++ix)
  {
    console.log(' ' + a.dispRow(ix) + ' = ' + b[ix].disp());
  }
//console.log(' right: ' + b[0].disp() + ' ' + b[1].disp());
  console.log('solution');
  for (ix = 0; ix < d1.length; ++ix)
  {
    console.log(' ' + dd[ix] + ' ' + d1[ix].disp());
  }
  console.log('check');
  for (ix = 0; ix < d1.length; ++ix)
  {
    d2 = new Complex(0, 0);
    for (jx = 0; jx < d1.length; ++jx)
    {
      d2.sumeq(d1[jx].prod(a.mat[ix][jx]));
    }
    console.log(' ' + d2.disp());
  }
}*/
/*function test()
{
  let tp, c1 = new CMatrix([new Complex(11), new Complex(12)], [new Complex(21), new Complex(22)]),
      c2 = new CMatrix([new Complex(1), new Complex(0)], [new Complex(0), new Complex(1)]);
  tp = c1.tensorprod(c2);
  console.log('%s', tp.disp());
}
test();*/
exports.Complex = Complex;
exports.CMatrix = CMatrix;
















