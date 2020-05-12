/**
 * Created by danevans on 1/14/20.
 */
let cc = require('./complex.js');
let Complex = cc.Complex,
    CMatrix = cc.CMatrix;
function Quantum() {

}
Quantum.qubits = 10;
Quantum.iGate = new CMatrix([new Complex(1), new Complex(0)], [new Complex(0), new Complex(1)]);
Quantum.xGate = new CMatrix([new Complex(0), new Complex(1)], [new Complex(1), new Complex(0)]);
Quantum.yGate = new CMatrix([new Complex(0), new Complex(0, -1)], [new Complex(0, 1), new Complex(0)]);
Quantum.zGate = new CMatrix([new Complex(1, 0), new Complex(0, 0)], [new Complex(0, 0), new Complex(-1, 0)]);
Quantum.dGate = new CMatrix([new Complex(-1, 0), new Complex(0, 0)], [new Complex(0, 0), new Complex(1, 0)]);
Quantum.hGate = new CMatrix([new Complex(1, 0), new Complex(1, 0)], [new Complex(1, 0), new Complex(-1, 0)]).scprod(1 / Math.sqrt(2));
Quantum.hlGate = new CMatrix([new Complex(1, 0), new Complex(1, 0)], [new Complex(1, 0), new Complex(-1, 0)]);
Quantum.controlledNotGate = new CMatrix(
    [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)],
);
Quantum.reverseCNotGate = new CMatrix(
    [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
);
Quantum.controlledZGate = new CMatrix(
    [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(-1, 0)],
);
Quantum.controlledYGate = new CMatrix(
    [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, -1)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(0, 1), new Complex(0, 0)],
);
Quantum.swapGate = new CMatrix(
    [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0)],
);
Quantum.notGate = new CMatrix([new Complex(0, 0), new Complex(1, 0)], [new Complex(1, 0), new Complex(0, 0)]);
Quantum.sGate = new CMatrix([new Complex(1, 0), new Complex(0, 0)], [new Complex(0, 0), new Complex(0, 1)]);
Quantum.tGate = new CMatrix([new Complex(1, 0), new Complex(0, 0)], [new Complex(0, 0), new Complex(1).iexp(Math.PI / 4)]);


Quantum.toffoli = new CMatrix(
    [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)]
);

Quantum.q0 = new CMatrix([new Complex(1, 0)], [new Complex(0, 0)]);
Quantum.q1 = new CMatrix([new Complex(0, 0)], [new Complex(1, 0)]);
Quantum.q00 = Quantum.q0.tensorprod(Quantum.q0);
Quantum.q01 = Quantum.q0.tensorprod(Quantum.q1);
Quantum.q10 = Quantum.q1.tensorprod(Quantum.q0);
Quantum.q11 = Quantum.q1.tensorprod(Quantum.q1);

Quantum.bellPhiPos = new CMatrix([new Complex(1 / Math.SQRT2, 0)], [new Complex(0, 0)], [new Complex(0, 0)], [new Complex(1 / Math.SQRT2, 0)]);
Quantum.bellPhiNeg = new CMatrix([new Complex(1 / Math.SQRT2, 0)], [new Complex(0, 0)], [new Complex(0, 0)], [new Complex(-1 / Math.SQRT2, 0)]);
Quantum.bellPsiPos = new CMatrix( [new Complex(0, 0)], [new Complex(1 / Math.SQRT2, 0)], [new Complex(1 / Math.SQRT2, 0)], [new Complex(0, 0)]);
Quantum.bellPsiNeg = new CMatrix( [new Complex(0, 0)], [new Complex(1 / Math.SQRT2, 0)], [new Complex(-1 / Math.SQRT2, 0)], [new Complex(0, 0)]);

/**
 * Build a CNOT matrix for use in an n-qubit curcuit with arbitrary control and target lines
 * @param qbits number of qubits in the circuit - matrix will be 2^q x 2^q
 * @param ctl control qubit line 0 <= c < qubits
 * @param tgt target qubit line 0 <= t < qubits and t != c
 */
Quantum.buildCNOT = function (qbits, ctl, tgt)
{
  let sz, ix, jx, gat, bas;
  if (qbits < 2 || qbits > Quantum.qubits || ctl < 0 || ctl >= qbits || tgt < 0 || tgt >= qbits)
    throw new Error('buildCNOT argument range error qubits:' + qbits + ', ctl:' + ctl + ', tgt:' + tgt);
  sz = Math.pow(2, qbits);
  gat = new CMatrix(sz, sz);
  for (ix = 0; ix < sz; ++ix)
  {
    for (jx = 0; jx < sz; ++jx)
    {
      gat.mat[ix][jx] = new Complex(0, 0);
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
    gat.mat[ix][jx] = new Complex(1, 0);
  }
  return gat;
};
Quantum.buildToffoli = function (qbits, ctl1, ctl2, tgt) {
  let sz, ix, jx, gat, bas;
  if (qbits < 3 || qbits > Quantum.qubits || ctl1 < 0 || ctl1 >= qbits || ctl2 < 0 || ctl2 >= qbits || tgt < 0 || tgt >= qbits)
    throw new Error('argument range error - 3 <= qubits <= 8, 0 <= lines < qubits');
  sz = Math.pow(2, qbits);
  gat = new CMatrix(sz, sz);
  for (ix = 0; ix < sz; ++ix)
  {
    for (jx = 0; jx < sz; ++jx)
    {
      gat.mat[ix][jx] = new Complex(0, 0);
    }
  }
  for (ix = 0; ix < sz; ++ix)
  {
    bas = (+ix).toString(2);
    while (bas.length < qbits)
      bas = '0' + bas;
    bas = bas.split('');
    if (bas[ctl1] === '1' && bas[ctl2] === '1')
    {
      bas[tgt] = (bas[tgt] === '0') ? '1' : '0';
      jx = parseInt(bas.join(''), 2);
    }
    else
    {
      jx = ix;
    }
    gat.mat[ix][jx] = new Complex(1, 0);
  }
  return gat;
};
/**
 * Build a Hadamard matrix to the tensor power n
 * @param n the tensor power of the returned matrix
 * @return the requested matrix
 */
Quantum.buildHn = function (n) {
  let hn, ix;
  if (n < 1 || n > Quantum.qubits)
    throw new Error('argument range error - tensor power valid range: 1 <= n <= 8');
  hn = Quantum.hGate;
  for (ix = 2; ix <= n; ++ix)
  {
    hn = Quantum.hGate.tensorprod(hn);
  }
  return hn;
};
/**
 * Build an Identity matrix to the tensor power n
 * @param n the tensor power of the returned matrix
 * @return the requested matrix
 */
Quantum.buildIn = function (n) {
  let nI, ix;
  if (n < 1 || n > Quantum.qubits)
    throw new Error('argument range error - tensor power valid range: 1 <= n <= 8');
  nI = Quantum.iGate;
  for (ix = 2; ix <= n; ++ix)
  {
    nI = Quantum.iGate.tensorprod(nI);
  }
  return nI;
};
/**
 * Build a gate matrix to the tensor power n from 2x2 gate matrix
 * @param g the 2 x 2 CMatrix gate to be tensor exponentiated
 * @param n the tensor power of the returned matrix
 * @return the requested matrix
 */
Quantum.buildTensoredGate = function (g, n) {
  let nI, ix;
  if (2 !== g.rows() || 2 !== g.columns())
    throw new Error('argument error - gate to be tensored must be 2 x 2');
  if (n < 1 || n > Quantum.qubits)
    throw new Error('argument range error - tensor power valid range: 1 <= n <=' + Quantum.qubits);
  nI = g.clone();
  for (ix = 2; ix <= n; ++ix)
  {
    nI = g.tensorprod(nI);
  }
  return nI;
};
/**
 * Build a inversion about the mean gate for the number of qubits requested.
 * @param qbits
 * @returns cc.CMatrix|CMatrix requested matrix
 */
Quantum.buildMeanInversion = function (qbits) {
  let nn, ix, jx, mat, cc, m1;
  if (qbits < 1 || qbits > Quantum.qubits)
    throw new Error('argument range error 1 <= qubits <= 8');
  nn = Math.pow(2, qbits);
  cc = new Complex(2 / nn);
  m1 = cc.sum(new Complex(-1));
  mat = new CMatrix(nn, nn);
  for (ix = 0; ix < nn; ++ix)
  {
    for (jx = 0; jx < nn; ++jx)
    {
      if (jx !== ix)
        mat.mat[ix][jx] = cc;
      else
        mat.mat[ix][jx] = m1;
    }
  }
  return mat;
};
/**
 * Build an n qubit basis vector
 * @param qbits - the number of qubits represented by the basis vector
 * @param qv - the basis vector value, from 0 <= qv < 2^qubits
 */
Quantum.buildBasis = function(qbits, qv) {
  let qb, ix, b;
  if (qbits < 1 || qbits > Quantum.qubits)
    throw new Error('argument range error 1 <= qubits <=' + Quantum.qubits);
  b = (qv).toString(2);
  while (b.length < qbits)
  {
    b = '0' + b;
  }
  ix = b.length - 1;
  if ('1' === b[ix])
    qb = Quantum.q1;
  else
    qb = Quantum.q0;
  ix -= 1;
  while (ix >= 0)
  {
    if ('1' === b[ix])
      qb = Quantum.q1.tensorprod(qb);
    else
      qb = Quantum.q0.tensorprod(qb);
    ix -= 1;
  }
  return qb;
};
/**
 * Build a 2x2 global phase shift matrix from Rieffel and Polak
 * @param ph the requested phase
 * @return CMatrix the requested matrix
 */
Quantum.buildGlobalPhase = function (ph) {
  let one = new Complex(1, 0), zero = new Complex(0, 0);
  return new CMatrix([one.iexp(ph), zero], [zero, one.iexp(ph)]);
};
/**
 * Build a 2x2 rotation matrix from Rieffel and Polak
 * @param ph the requested angle
 * @return CMatrix the requested matrix
 */
Quantum.buildRotation = function (ph) {
  return new CMatrix(
      [new Complex(Math.cos(ph), 0), new Complex(Math.sin(ph), 0)],
      [new Complex(-Math.sin(ph), 0), new Complex(Math.cos(ph), 0)]);
};
/**
 * Build a 2x2 phase rotation matrix from Rieffel and Polak
 * @param ph the requested phase
 * @return CMatrix the requested matrix
 */
Quantum.buildPhaseRotation = function (ph) {
  let one = new Complex(1, 0), zero = new Complex(0, 0);
  return new CMatrix([one.iexp(ph), zero], [zero, one.iexp(-ph)]);
};
/**
 * Build a three parameter universal gate from QASM
 * @param theta angle parameter 1
 * @param phi angle parameter 2
 * @param lambda angle p
 * @returns {CMatrix}
 */
Quantum.buildU = function (theta, phi, lambda) {
  let plsum = (phi + lambda) / 2,
      pldif = (phi - lambda) / 2,
      cost2 = Math.cos(theta / 2),
      sint2 = Math.sin(theta / 2);
  return new CMatrix([Complex.iexp(-plsum).scprodeq(cost2), Complex.iexp(-pldif).scprodeq(-sint2)],
      [Complex.iexp(pldif).scprodeq(sint2), Complex.iexp(plsum).scprodeq(cost2)]);
};
/**
 * Build a 2x2 z-axis rotation matrix from QASM - Rz is U(0,0,ph)
 * @param ph the requested phase
 * @return CMatrix the requested matrix
 */
Quantum.buildRz = function (ph) {
  // let one = new Complex(1, 0), zero = new Complex(0, 0);
  // return new CMatrix([one, zero], [zero, one.iexp(ph)]);
  return Quantum.buildU(0, 0, ph);
};
/**
 * Build a 2x2 y-axis rotation matrix from QASM - Ry is U(ph, 0, 0)
 * @param ph the requested phase
 * @return CMatrix the requested matrix
 */
Quantum.buildRy = function (ph) {
  // let one = new Complex(1, 0), zero = new Complex(0, 0);
  // return new CMatrix([one, zero], [zero, one.iexp(ph)]);
  return Quantum.buildU(ph, 0, 0);
};
/**
 * Build a 2x2 x-axis rotation matrix from QASM - Rx is U(ph,-pi/2,pi/2)
 * @param ph the requested phase
 * @return CMatrix the requested matrix
 */
Quantum.buildRx = function (ph) {
  // let zero = new Complex(0, 0),
  //     ph2 = ph / 2;
  // return new CMatrix([Complex.iexp(-ph2), zero], [zero, Complex.iexp(ph2)]);
  let p2 = Math.PI / 2;
  return Quantum.buildU(ph, -p2, p2);
};
/**
 * Build a general controlled gate from a single-qubit gate, one control qubit, and one target qubit
 * @param qbits the span of the controlled gate
 * @param ctl the control line
 * @param tgt the target line
 * @param gat the one qubit gate to be controlled (a CMatrix)
 */
Quantum.buildControlled = function (qbits, ctl, tgt, gat) {
  let ix, jx, spn, rws, cls, q0, q1, n, ket, cg, ll, qs;
  if (!(gat instanceof CMatrix))
    throw new Error('gate to be controlled must be 2x2 CMatrix');
  if (2 != gat.rows() || 2 != gat.columns())
    throw new Error('gate to be controlled must be 2x2 CMatrix');
  spn = Math.abs(ctl - tgt) + 1;
  q0 = gat.prod(this.buildBasis(1, 0));
  q1 = gat.prod(this.buildBasis(1, 1));
  n = Math.pow(2, spn);
  cg = new CMatrix(n, n);
  for (ix = 0; ix < n; ++ix)
  {
    ket = Number(ix).toString(2);
    while (ket.length < spn)
    {
      ket = '0' + ket;
    }
    for (jx = 0; jx < spn; ++jx)
    {
      if (jx === tgt && '1' === ket[ctl])
      {
        ll = ('1' === ket[jx]) ? q1 : q0;
      }
      else
      {
        ll = ('1' === ket[jx]) ? Quantum.q1 : Quantum.q0;
      }
      if (0 === jx)
      {
        qs = ll.clone();
      }
      else
      {
        qs = qs.tensorprod(ll);
      }
    }
    for (jx = 0; jx < n; ++jx)
    {
      cg.mat[jx][ix] = qs.mat[jx][0];
    }
  }
  return cg;
};
Quantum.buildSwap = function (qbits, sw1, sw2) {
  let ix, jx, spn, rws, cls, q0, q1, n, ket, cg, ll, qs;
  if (qbits < 1 || qbits > Quantum.qubits)
    throw new Error('argument range error 1 <= qubits <=' + Quantum.qubits);
  if (sw1 < 0 || sw1 >= qbits || sw2 < 0 || sw2 >= qbits || sw1 === sw2)
    new Error('swap lines must be unique and within qubits range');
  if (sw2 < sw1)
  {
    ix = sw1;
    sw1 = sw2;
    sw2 = ix;
  }
  n = Math.pow(2, qbits);
  cg = new CMatrix(n, n);
  for (ix = 0; ix < n; ++ix)
  {
    q0 = Number(ix).toString(2);
    q0 = '0'.repeat(qbits - q0.length) + q0;
    q1 = q0.substring(0, sw1) + q0[sw2] + q0.substring(sw1 + 1, sw2) + q0[sw1] + q0.substring(sw2 + 1);
    qs = this.buildBasis(qbits, parseInt(q1, 2));
    for (jx = 0; jx < n; ++jx)
    {
      cg.mat[jx][ix] = qs.mat[jx][0];
    }
  }
  return cg;
};
/**
 * Convert from degrees to radians.
 * @param theta the angle in degrees to be converted
 * @returns {number} the angle converted to radians
 */
Quantum.radians = function (theta) {
  return theta * (Math.PI / 180);
};
/**
 * Convert from radians to degrees.
 * @param theta the angle in radians to be converted
 * @returns number angle converted to degrees
 */
Quantum.degrees = function (theta) {
  return theta * (180 / Math.PI);
};
Quantum.probabilities = function (q) {
  let sz, qb, ix, m, probs, rv;
  let rws = q.rows(), cols = q.columns();
  if (1 === rws)
  {
    rv = true;
    sz = cols;
  }
  else if (1 === cols)
  {
    rv = false;
    sz = rws;
  }
  else
    throw new Error('argument q must be a row or column vector');
  ix = 2;
  qb = 1;
  while (ix < sz)
  {
    qb += 1;
    ix = 2 * ix;
  }
  if (ix !== sz)
    throw new Error('argument q length must be a power of 2');
  if (qb > Quantum.qubits)
    throw new Error('argument range error 1 <= qubits <= ' + Quantum.qubits);
  probs = [];
  for (ix = 0; ix < sz; ++ix)
  {
    if (rv)
      m = q.mat[0][ix].mag();
    else
      m = q.mat[ix][0].mag();
    probs.push(Complex.format(m * m, 3));
  }
  return probs;
};
/**
 * Measure one or more qubits using the passed mask
 * @param mask a binary string, the length of the number of qubits q, indicating which qubits should be measured; the
 *             bits should be ordered from left to right in circuit order top to bottom
 * @param q the quantum state to be measured
 */
Quantum.measure = function (mask, q) {
  function binString(qbs) {
    let bin, sz, ix, str;
    sz = Math.pow(2, qbs);
    bin = [];
    for (ix = 0; ix < sz; ++ix)
    {
      str = (ix).toString(2);
      while (str.length < qbs)
      {
        str = '0' + str;
      }
      bin.push(str);
    }
    return bin;
  }
  let sz, qb, ix, jx, m, rv, bin, str, zro, one, prob, prob0, prob1, rtn;
  let rws = q.rows(), cols = q.columns();
  if (1 === rws)
  {
    rv = true;
    sz = cols;
  }
  else if (1 === cols)
  {
    rv = false;
    sz = rws;
  }
  else
    throw new Error('argument q must be a row or column vector');
  ix = 2;
  qb = 1;
  while (ix < sz)
  {
    qb += 1;
    ix = 2 * ix;
  }
  if (ix !== sz)
    throw new Error('argument q length must be a power of 2');
  if (qb > Quantum.qubits)
    throw new Error('argument range error 1 <= qubits <= ' + Quantum.qubits);
  bin = binString(qb);
  prob0 = [];
  prob1 = [];
  for (jx = 0; jx < qb; ++jx)
  {
    if ('1' === mask.charAt(jx))
      prob = prob1;
    else
      prob = prob0;
    zro = one = 0;
    for (ix = 0; ix < sz; ++ix)
    {
      if (rv)
        m = q.mat[0][ix].mag();
      else
        m = q.mat[ix][0].mag();
      if ('0' === bin[ix].charAt(jx))
      {
        zro += m * m;
      }
      else
      {
        one += m * m;
      }
    }
    prob.push([jx, zro, one]);
  }
  rtn = [[], []];
  if (0 < prob1.length)
  {
    qb = [];
    bin = binString(prob1.length);
    for (ix = 0; ix < bin.length; ++ix)
    {
      m = 1.0;
      for (jx = 0; jx < bin[ix].length; ++jx)
      {
        if ('0' === bin[ix].charAt(jx))
        {
          m *= prob1[jx][1];
        }
        else
        {
          m *= prob1[jx][2];
        }
      }
      qb.push(bin[ix] + ':' + Complex.format(m, 3));
    }
    rtn[0] = qb;
  }
  if (0 < prob0.length)
  {
    qb = new CMatrix(Math.pow(2, prob0.length), 1);
    bin = binString(prob0.length);
    for (ix = 0; ix < bin.length; ++ix)
    {
      m = 1.0;
      for (jx = 0; jx < bin[ix].length; ++jx)
      {
        if ('0' === bin[ix].charAt(jx))
        {
          m *= Math.sqrt(prob0[jx][1]);
        }
        else
        {
          m *= Math.sqrt(prob0[jx][2]);
        }
      }
      qb.mat[ix][0] = new Complex(m, 0);
    }
    rtn[1] = qb;
  }
  return rtn;
};
module.exports.Quantum = Quantum;