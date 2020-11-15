/**
 * Created by danevans on 1/20/18.
 */
function Complex(re, im) {
  if (typeof arguments[0] === 'string')
  {
    this.magn = re.match(/(([+-]?)([0-9.]+))?(([+-])([0-9.]+)i)?/); // both real and imag must be present with i suffix
    if (this.magn != null)
    {
      if (this.magn[1] !== undefined)
        this.real = parseFloat(this.magn[1]);
      else
        this.real = 0.0;
      if (this.magn[4] !== undefined)
        this.imag = parseFloat(this.magn[4]);
      else
        this.imag = 0.0;
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
  this.magn = -1.0;
}
Complex.prototype.clone = function()
{
  return new Complex(this);
};
Complex.tolerance = 0.000001;
Complex.precision = 3;
Complex.prototype.arg = function () {
  if (this.magn < 0.0)
    this.polar();
  return this.argu;
};
Complex.prototype.argdeg = function () {
  if (this.magn < 0.0)
    this.polar();
  return 180.0 * this.argu / Math.PI;
};
Complex.prototype.mag = function () {
  if (this.magn < 0.0)
    this.polar();
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
  if (c.magn < 0.0)
    c.polar();
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
  this.magn = -1;
  return this;
};
Complex.prototype.diff = function(c) {
  return new Complex(this.real - c.real, this.imag - c.imag);
};
Complex.prototype.diffeq = function(c) {
  this.real -= c.real;
  this.imag -= c.imag;
  this.magn = -1;
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
  this.magn = -1.0
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
  this.magn= -1.0
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
  this.magn = -1.0;
  return this;
};
Complex.prototype.conjugate = function() {
  return new Complex(this.real, -this.imag);
};
Complex.prototype.negate = function() {
  return new Complex(-this.real, -this.imag);
};
Complex.prototype.conjugateq = function() {
  if (0.0 !== this.imag)
    this.imag = -this.imag;
  this.magn = -1.0;
  return this;
};
Complex.prototype.negateq = function() {
  if (0.0 !== this.real)
    this.real = -this.real;
  if (0.0 !== this.imag)
    this.imag = -this.imag;
  this.magn = -1.0
  return this;
};
Complex.prototype.isOne = function() {
  return 1.0 === this.real && 0.0 === this.imag;
};
Complex.prototype.pow = function(rt) {
  let arg, c, d, pi2;
  if (0 === rt)
    return new Complex(1, 0);
  if (this.magn < 0.0)
    this.polar();
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
  if (Math.abs(this.real) >= Complex.tolerance)
  {
    str += Complex.format(this.real);
  }
  if (Math.abs(this.imag) >= Complex.tolerance)
  {
    if (1.0 === this.imag)
      str += 'i';
    else if (-1.0 === this.imag)
      str += '-i';
    else
    {
      if (this.imag > 0 && 0 !== str.length)
        str += '+';
      // else if (this.imag < 0)
      //   str += '-';
      str += Complex.format(this.imag) + 'i';
    }
  }
  else if (0.0 === this.real)
    str = '0';
  return str;
};
Complex.prototype.dispPolar = function() {
  let str = '';
  if (this.magn < 0.0)
    this.polar();
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
  this.magn = -1.0;
};
Complex.prototype.equal = function (eq)
{
  return this.real === eq.real && this.imag === eq.imag;
};
Complex.exponents = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
Complex.format = function (d, p)
{
  let f, exp, str;
  if (Math.floor(d) === d)
    return String(d);
  if (undefined === p || p < 1)
    p = Complex.precision;
  else if (p >= Complex.exponents.length)
    p = Complex.exponents.length - 1;
  exp = Complex.exponents[p];
  f = Math.floor(d  * exp + 0.5);
  str = String(f / exp);
  if (f === 0 && d < 0)  // don't lose negative when loss of precision yields 0
    str = '-' + str;
  return str;
};

exports.Complex = Complex;
