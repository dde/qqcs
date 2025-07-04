# QQCS - Quick Quantum Circuit Simulation

Table of Contents
=================

* [Installation](#installation)
* [Overview](#overview)
* [Introduction](#introduction)
* [QQCS Statement Detail](#qqcs-statement-detail)
* [Available Gates](#available-gates)
* [Rotational Gates](#rotational-gates)
* [Permutation Gates](#permutation-gates)
* [Oracles](#oracles)
* [Gate Positioning and Replication](#gate-positioning-and-replication)
* [Controlled Gate Names](#controlled-gate-names)
* [Display](#display)
* [Measurement](#measurement)
* [Initial Values](#initial-values)
* [Initial Value Tensor Products](#initial-value-tensor-products)
* [Factoring](#factoring)
* [Custom Gates](#custom-gates)
* [Most Recent Computation Result](#most-recent-computation-result)
* [Circuits With More Than 10 Lines](#circuits-with-more-than-10-lines)
* [Generic Gates](#generic-gates)
* [Big-endian Qubit Line References](#big-endian-qubit-line-references)
* [Comments](#comments)
* [Interactive help](#interactive-help)
* [Conclusion](#conclusion)
* [Version Notes](#version-notes)
* [QQCS Linear Notation Syntax](#qqcs-linear-notation-syntax)
  * [Meta-symbols](#meta-symbols)
  * [Grammar](#grammar)
* [References](#references)

## Installation

QQCS is installed with the Node Package Manager.  First, install NodeJS.  Then, at the command line, enter:

```npm install qqcs```

To run, go to the ```node_modules``` directory, and enter:

```node qqcs``` -or- ```node qqcs/qdesk.js```

Use the command line switch -h to get help.

## Overview

The student new to Quantum Computing immediately confronts the steep hurdle of the mathematics of complex vector
 spaces needed to understand the basic concepts.

When working with quantum algorithms expressed as circuits or gate sequences, one wants to know several things
that are not immediately available in quantum programming systems.

    * A trace of the quantum state after each circuit gate
    * A display of the gate equivalent at any point in the circuit
    * Simple displays of quantum probabilities
    * Output using the notation of quantum computing

QQCS contains all these features.  It is an educational tool for first and second courses in Quantum Computing.

QQCS can also be used by the quantum experimentalist.  It can test the operation of a quantum circuit step by step,
displaying the output of each step as a quantum state, an equivalent gate, or a measure of one or more qubits,
and it can quickly run through alternatives.

Although QQCS is "one more thing to learn", it is designed to be an intuitive character representation of a
quantum circuit, using familiar gate names and quantum notation, drawing on existing concepts so that the
learning effort is minimal.

## Introduction

A quantum circuit simulation is not a quantum computer simulation.  It is a mathematical rendering of each step
of a quantum algorithm that is described by a sequence of gate operations on an initial quantum state.

The QQCS software renders the simulation. The system allows a student to quickly construct a circuit using a linear
notation motivated by the circuits
themselves, and to acquire the information to analyze an algorithm quickly without the need for tedious calculations.

The following gate sequence \[6\] may or may not implement a controlled Hadamard gate.  How is one to tell?

<img src="img/Screen Shot 2020-05-03 at 3.41.56 PM.png" alt="equivalent gate sequence for a controlled Hadamard gate"/>

QQCS answers the question with a single interactive statement. 

Statement entry (\[ 1\] is the statement number prompt):
```
[ 1] :_H:_Sa:Cx:_H:_T:Cx:_T:_H:_S:_X:S_
```
QQCS circuit execution output:
```
[] _H _Sa Cx _H _T Cx _T _H _S _X S_ [
0.707+0.707i 0            0         0       
0            0.707+0.707i 0         0       
0            0            0.5+0.5i  0.5+0.5i
0            0            0.5+0.5i -0.5-0.5i]
```

Although first two diagonal elements would be 1 in a controlled Hadamard gate, it looks like a factor of
```cos π/4 + isin π/4``` would make that so,
 meaning the circuit could very well be equivalent to a global phase with a controlled Hadamard gate

## QQCS Statement Detail

A QQCS statement has the general syntactic form ```[identifier|register][initial-value][gate-sequence[factor]]```.  The
above example is just a gate sequence.

Circuit steps syntactically begin with a colon (```:```) and combine gates, given their standard names, with ungated
qubit lines, indicated by underscores (```_```), in sequence from the top to the bottom of the lines in the circuit.
The first step in the example, ```:_H```, is a Hadamard gate with an ungated line above it, in a two-line circuit.

The second step, ```:_Sa```, is an S-adjoint gate, the common name for the adjoint of a π/2 phase gate, again with an
ungated line above it.

A controlled gate, such as the controlled not (CNOT) gate, has a two- or more-digit suffix following the gate name
identifying the control line (or lines) followed by the target line, so ```:C01``` is a CNOT with control line 0 and 
target line 1. ```:Cx``` is a common abbreviation for ```:C01```.  ```:C10``` is a reverse CNOT,
and can be abbreviated ```:Cr```.

Control and target lines are relative to the span of the controlled gate, so "_" prefixes and suffixes do not
change the numbering of the controls and target.

## Available Gates
(suffix sizes are with respect to 1-digit qubit line references)

<table>
<tr><th colspan="2">1-Qubit</th><th colspan="2">2-Qubit</th></tr>
<tr><td>H </td><td> Hadamard gate </td><td>C </td><td> general CNOT (used with a 2-digit control suffix) </td></tr>
<tr><td>I </td><td> Identity gate</td><td>Cx </td><td>CNOT with control qubit q and target qubit q+1</td></tr>
<tr><td>_ </td><td> ungated lines (implied Identity)</td><td>Cr </td><td>reverse CNOT with control qubit q+1 and target qubit q</td></tr>
<tr><td>Kp(𝜃)</td><td>Phase gate (universal set) [4] </td><td>Sw</td><td>general Swap (used with a 2-digit control suffix)</td></tr>
<tr><td>Rp(𝜃)</td><td>Rotation gate (universal set) [4]</td><th colspan="2">3-Qubit</th></tr>
<tr><td>Rx(𝜃)</td><td>Pauli X rotation gate</td><td>Fr</td><td>general Fredkin gate (used with a 3-digit control suffix)</td></tr>
<tr><td>Ry(𝜃)</td><td>Pauli Y rotation gate</td><td>Tf</td><td>general Toffoli gate (used with a 3 (or more) digit control suffix)</td></tr>
<tr><td>Rz(𝜃)</td><td>Pauli Z rotation gate</td><th colspan="2">n-Qubit</th></tr>
<tr><td>S </td><td>S gate (π/2 phase gate)</td><td>Imn</td><td>Mean Inversion (with n-qubit size suffix)</td></tr>
<tr><td>Sa </td><td>S adjoint</td><td>Qan</td><td>Inverse Quantum Fourier Transform (with n-qubit size suffix)</td></tr>
<tr><td>T </td><td> π/8 gate (π/4 phase gate)</td><td>Qfn</td><td>Quantum Fourier Transform (with n-qubit size suffix)</td></tr>
<tr><td>Ta </td><td>T adjoint</td><td>P(s,...,s)n</td><td>Permutation gate with permutation specifications (with n-qubit size suffix)</td></tr>
<tr><td>Tp(𝜃)</td><td>Phase Rotation gate (universal set) [4]</td><td>G(v,...,v)n </td><td>Generic gate with a sequence of values (with n-qubit size suffix)</td></tr>
<tr><td>U(𝜃,𝜙,λ)</td><td>General one-, two-, or three-parameter rotation gate</td><th colspan="2">Other</th></tr>
<tr><td>X </td><td> Pauli X gate </td><td>a...</td><td>named, reusable, custom gate sequences</td></tr>
<tr><td>Y </td><td> Pauli Y gate </td><td>ct</td><td>control(c)-target(t) digit control suffix for any 1-qubit gate</td></tr>
<tr><td>Z </td><td> Pauli Z gate (π phase gate)</td><td>M</td><td>Qubit measurement pseudo-gate</td></tr>
</table>

## Rotational Gates

All the rotational gates specify the angle parameters as factors of π radians, with π implicit.
Thus, Rx(.5) is an X-axis rotation of π/2 radians, or 90 degrees.  The parameter range for all angles is ```[0,4)```.

The U gate may have 1, 2, or 3 parameters.  ```U(λ) = U(0,0,λ) = Rz(λ)```, ```U(𝜙,λ) = U(π/2,𝜙,λ)```, and ```U(𝜃,𝜙,λ)```.
The U gate implements the general unitary matrix
```
exp(-i(𝜙+λ)/2)cos(𝜃/2)  -exp(-i(𝜙-λ)/2)sin(𝜃/2)
exp( i(𝜙-λ)/2)sin(𝜃/2)   exp( i(𝜙+λ)/2)cos(𝜃/2)
```

The Rx(𝜃) gate is equivalent to U(𝜃,-π/2,π/2).

The Ry(𝜃) gate is equivalent to U(𝜃,0,0).

The Rz(λ) gate is equivalent to U(0,0,λ).

An alternate general unitary definition is available, invoked by the -u command line flag, or the ualt comment
flag.  The alternate definition differs only by a global phase factor from the default definition above, but it can
simplify the elements of some rotational gates.  The definition is:
```
cos(𝜃/2)        -exp(iλ)sin(𝜃/2)
exp(i𝜙)sin(𝜃/2)  exp(i(𝜙+λ))cos(𝜃/2)
```

Depending upon the unitary definition in effect, some gates will show different values.  For example, by default,
```Rz(1)``` is:
```
-i  0
 0  i
```
With #$ualt set to true, the same gate will display as
```
 1  0
 0 -1
```
differing only by a factor of ```-1i```.
## Permutation Gates

Permutation gates are matrices with a single 1 in each row and column and 0's in all other elements.  The CNOT gate is
a typical permutation gate. When applied to a quantum state, permutation gates shift the amplitudes from one basis
vector to another

A permutation gate is specified with the syntax
```:P(pair, ...)n```.  Each pair is a real number, but it is interpreted as a pair of integers separated by a period.
Thus, 2.6 is the pair 2 -> 6, specifying that the amplitude for basis vector ```|010>``` becomes the amplitude for basis vector
```|110>```.  The gate ```:P(2.6,6.2)3``` will exchange the amplitudes of those two basis vectors. The CNOT gate specified
as a permutation is ```:P(2.3,3.2)2```.  The n suffix is the qubit size of the permutation gate.

A permutation gate starts as an identity gate.  The permutation ```a.b``` is applied by setting the element ```(a,a)``` to 0, then
setting the element ```(a,b)``` to 1. After the permutations are applied, QQCS will verify that the result is valid.  A
permutation gate is a unitary matrix.  If the gate is symmetric, it is Hermitian and therefore its own adjoint.  Otherwise,
its adjoint is the reverse permutation.

The specification of a permutation gate is tedious. The simplest way to use one is to specify it once and assign it
to a custom gate, then reuse the custom gate as needed.

## Oracles

Oracles are available for the well-known algorithms of Deutsch, Deutsch and Jozsa, Bernstein and Vazirani, Simon,
and Grover.

The oracles are specified with the syntax ```:Ox(p)n```.  The ```x``` is ```d``` for Deutsch and Deutsch-Jozsa which are,
distinguished by their qubit size, ```b``` for Bernstein-Vazirani, ```s``` for Simon, and ```g``` for Grover.
The optional parameter ```p```
is specific to the oracle and determines whether the oracle will implement a random function or a function determined by
the parameter. The ```n``` suffix is the qubit size and must be specified.  The qubit size includes any ancilla qubits.

```:Od2``` is considered the Deutsch oracle, and any larger qubit size is the Deutsch-Jozsa oracle.  Both algorithms use
a single ancilla qubit, and the random function is either a constant or balanced binary function of domain size ```n-1```.
If the optional parameter is specified, a value of 0 generates a constant function whose values are all 0.  A value of 1
generates a constant function whose values are all 1.  Any other value generates a balanced function.

```:Obn``` is the Bernstein-Vazirani oracle.  The algorithm uses a single ancilla qubit, and the function implements 
a hidden binary string of size ```n-1```. If the optional parameter is specified, it determines the hidden string and
should be a value between ```0``` and ```n-1```.

```:Osn``` is the Simon oracle.  The algorithm uses ```n/2``` ancilla qubits, and the function implements a binary string
of size ```n/2``` representing the "period" \[5\] of the function, which is discovered by the Simon algorithm. If the optional
parameter is specified, it determines the "period" and should be a value between ```0``` and ```(n/2)-1```.

```:Ogn``` is the Grover oracle.  The oracle negates the phase of one basis vector of the n-qubit input quantum state.
If the optional parameter is specified, it determines which basis vector is
negated and should be a value between ```0``` and ```n-1```.

## Gate Positioning and Replication

Ungated lines (```_```) have already been mentioned.  They may be repeated as many times as needed (subject to maximum
qubit restriction) to position a gate on the correct line.  For example, :\_\_X\_\_ designates an X-gate on line
2 in a 5-qubit circuit.  The gate is a 32x32 matrix.

Gates may be repeated across adjacent lines by using a 1-digit suffix replicator.  For example, ```:__X3``` designates
a circuit step created from the tensor product of 2 Identity gates on lines 0 and 1, and 3 X-gates on lines 2, 3, 4
of a 5-qubit circuit.  The replication is only applicable to single-qubit gates, and uses only a single digit.
As an alternative, the gate name can be repeated. ```:HHHH``` is the same as ```:H4```.

Non-adjacent gates are handled by infixed underscores (```_```), such as ```:_X_X```, which puts two X gates on lines 1 and 3
of a 4-qubit circuit.

## Controlled Gate Names

<img src="img/Screen Shot 2021-02-14 at 11.02.03 AM.png" width="615" height="301" alt="suffix notation corresponding to CNOT gates in a circuit"/>

Qubit line numbers on a controlled gate can be relative to the span of the gate, or absolute.

The span of a gate is the difference between the minimum and maximum control/target lines plus one.
Reading left to right, controls occur first, then target, each as a single digit (see v1.5.0).  As an example, the
control suffix 02 has a span of 3 (2-0+1=3) lines,
and indicates a control on relative line 0 and a target on relative line 2.

Ungated prefixes and suffixes are used, as in all other gates, to position the gate vertically in the circuit.
Lines within the span that are not control or target lines are ungated by implication.

With an absolute suffix, the control and target digits indicate the actual lines of the circuit.  No leading
```_```'s are needed for positioning.  Trailing ```_```'s may still be needed.

Either absolute or relative notation may be used.

Any single qubit gate can be followed by a control suffix to make it a controlled gate.

A Toffoli gate may have more than two control qubits.

## Display

The default display is the resulting gate matrix, or a quantum state transposed column vector.

If the gate sequence was supplied with an initial value (see below), that value is displayed before the gate sequence is executed.

The ket display (-k) flag causes the quantum state display to be in computational basis vector form.

The trace (-t) flag causes a display of output at each step in the gate sequence.

    * If there was an initial value, the trace is of each quantum state
    * If no initial value, the trace is the equivalent gate matrix to that point in the circuit

## Measurement

The M pseudo-gate signifies measurement.

It is placed and repeated as many times as needed in a circuit.  To measure all 5 qubits at the end of a 5-qubit
gate sequence, use :MMMMM, or :M5.  Use the underscore for any unmeasured lines.

The measurement display is a probability associated with the selected qubit lines, at the point in the circuit
where the M pseudo-gate appears. Measurement output is sequentially numbered to track the different M-pseudo-gates
that may be specified in circuit steps.

Measurement is purely a mathematical display and does not cause state collapse.

Any subset of the qubit lines can be measured.  Use the ungated notation to position M pseudo-gates as needed.

## Initial Values

A gate sequence execution does not automatically start with a default qubit value. This allows the computation and
display of an equivalent gate matrix, a sequence of gate matrix products.

To specify an initial value for a gate sequence, use a linear combination of basis vectors in standard quantum
computing ket notation.

    * |0> - single qubit zero ket
    * 0.707|0>+0.707|1> - balanced superposition qubit
    * An i is the imaginary value suffix, and must be preceded by a number, even if the number is 1.  Only + and
      - operators are used. Multiplication is implicit when a complex number is adjacent to a basis ket. There is
      no division, but see factoring below.
    * The initial value is ended by the first colon of the gate sequence
    
## Initial Value Tensor Products

Larger initial values can be composed using the tensor product by surrounding a ket expression with parentheses.

    * (|0>)(|0>) is the same as |00>
    * (0.707|0>+0.707|1>)(0.707|0>-0.707|1>) is the tensor product of quantum states also known in the literature
      as |+> and |->.
    
If the tensor product is all that is needed, terminate the statement with a return. No gate sequence is necessary.

(v1.5.0) Each tensor product operand may be the result of a gate sequence applied to an initial quantum state.  Follow
the initial quantum state with a gate sequence of one or more compatible gates.  The gates sequences will be applied
to each operand, followed by the tensor products.

    * (|0>:H)(|00>:H2):H3 is [1 0 0 0 0 0 0 0]

Explanation:
```|0>:H``` is ```[0.707 0.707]```.  ```|00>:H2``` is ```[0.5 0.5 0.5 0.5]```.  The tensor product of the two quantum
states is ```[0.354 0.354 0.354 0.354 0.354 0.354 0.354 0.354]```.  Applying ```:H3``` to the result yields
```[1 0 0 0 0 0 0 0]```.  ```:H3``` is a 3-qubit Hadamard gate, the tensor product of three one-qubit Hadamard gates.
Alternately, it can be written as ```:HHH```

## Factoring

A Quantum Fourier Transform circuit \[5\] can be difficult to recognize without factoring.

At the end of a gate sequence, the / operator followed by a (possibly complex) number at the end of a
gate sequence, will factor out the number before the final display.  This is in effect the removal of a global phase
from the resulting gate sequence.

### 3-qubit Quantum Fourier Transform - No Factor
```
:H__:S10_:T20:_H_:_S10:__H:Sw02
0.354  0.354       0.354   0.354       0.354  0.354       0.354   0.354     
0.354  0.25+0.25i  0.354i -0.25+0.25i -0.354 -0.25-0.25i -0.354i  0.25-0.25i
0.354  0.354i     -0.354  -0.354i      0.354  0.354i     -0.354  -0.354i    
0.354 -0.25+0.25i -0.354i  0.25+0.25i -0.354  0.25-0.25i  0.354i -0.25-0.25i
0.354 -0.354       0.354  -0.354       0.354 -0.354       0.354  -0.354     
0.354 -0.25-0.25i  0.354i  0.25-0.25i -0.354  0.25+0.25i -0.354i -0.25+0.25i
0.354 -0.354i     -0.354   0.354i      0.354 -0.354i     -0.354   0.354i    
0.354  0.25-0.25i -0.354i -0.25-0.25i -0.354 -0.25+0.25i  0.354i  0.25+0.25i
```

### 3-qubit Quantum Fourier Transform, Factoring Sqrt(8)
```
:H__:S10_:T20:_H_:_S10:__H:Sw02/0.35355
1  1             1   1             1  1             1   1           
1  0.707+0.707i  1i -0.707+0.707i -1 -0.707-0.707i -1i  0.707-0.707i
1  1i           -1  -1i            1  1i           -1  -1i          
1 -0.707+0.707i -1i  0.707+0.707i -1  0.707-0.707i  1i -0.707-0.707i
1 -1             1  -1             1 -1             1  -1           
1 -0.707-0.707i  1i  0.707-0.707i -1  0.707+0.707i -1i -0.707+0.707i
1 -1i           -1   1i            1 -1i           -1   1i          
1  0.707-0.707i -1i -0.707-0.707i -1 -0.707+0.707i  1i  0.707+0.707i
``` 
Factoring is equivalent to multiplying a gate by the inverse of the factor.  In order to multiply a gate or
gate sequence by -1, factor the -1.  In order to multiply by 2, factor a .5.
## Custom Gates

A gate sequence can be named and saved for future use.  Simply precede the gate sequence with a custom name.
The name saves the matrix value of the resulting gate sequence.

A custom name should start with a lower case letter (v1.5.0), followed by lower and upper case letters only.
Initial capital letter names are reserved by QQCS.

Once defined, a custom gate is used just like a normal gate.  It can be positioned in a circuit with "_" prefixes
and suffixes, and replicated (v1.5.0). A one-qubit custom gate can have control suffixes applied to it (v1.5.0).

For example, ```ss:Sw03:Sw01__:_Sw01_``` assigns the 4-qubit custom swap circuit \[1\] to the name "ss".  It can then
be used in another circuit as :ss.  For example, ```|0001>:ss``` determines the
effect of the ```:ss``` equivalent circuit on the 4-qubit basis |0001>.

Custom gates allow new gates to be defined.  The square root of X (square root NOT \[5\]) gate can be defined by
```sn:Rx(.5)/.707-.707i```.  This statement assigns the custom gate ```sn``` a π/2 Rx rotation, after factoring out
the global phase ```exp(-iπ/4)```.

```
0.5+0.5i 0.5-0.5i
0.5-0.5i 0.5+0.5i
```

To verify, look at the result ```:sn:sn```.  Square root NOT squared is X.  Another
example, ```y:Y/1i``` creates an alternate
version of the Y-gate without imaginary values by factoring.
```
0 -1
1  0
```
```:y01``` is then the controlled version of the new y-gate.
```
1  0  0  0
0  1  0  0
0  0  0 -1
0  0  1  0
```
Use custom gates and factoring to get constant multiples of gate.  ```nZ:Z/-1``` creates the custom gate ```nZ``` as the
gate ```-Z```.
```
-1 0
 0 1
```
```iTwo:I/.5``` creates the custom gate ```iTwo``` as  ```2I```.
```
2 0
0 2
```

## Most Recent Computation Result

(v1.5.0) When the most recent computation result is a quantum state, it is implicitly available to the next computation as its
initial value.  This allows a long, multi-gate computation to be divided into shorter computations across
several statements.  The most recent result is always available except in the following situations:

    1. The next computation begins with an initial value
    2. The most recent result is incompatible with the first gate in the next computation
    3. The first operation in the next computation is not a gate
    4. The most recent result is not a quantum state

The most recent result can be displayed by entering an empty line.  If it is defined, it will be displayed in the
current display format.

The most recent result can always be cleared by entering a single gate that is incompatible with the result.
For example, if the most recent result is a two-qubit quantum state, entering a one-qubit Identity gate ```:I```
discards the most recent result.

The operation of the most recent result can be supressed with the ```-m``` command line
option or the ```$nomrr``` comment flag.

## Circuits With More Than 10 Lines

(v1.5.0) Qubit line references in the foregoing text have always been single digits referencing lines 0 through 9.  If a circuit has
more than 10 lines, use a comma-delimited syntax.  The syntax for a CNOT gate in an 11-qubit circuit whose control is
line 10 and target is line 5 is ```:C10,5```.  Although there is no need to use commas for single digit references, they
are syntactically valid: ```:Tf0,1,2```.  In order to handle multi-digit replication suffixes and to avoid ambiguity, use
the trailing comma convention.  The reference ```:Z10,``` is a replication suffix of 10, where the reference ```:Z10``` 
is a control-Z gate with line 1 as the control and line 0 as the target.

## Generic Gates

(v1.5.0) A generic gate is simply a matrix.  It is not necessarily a unitary matrix.  Syntactically, a generic gate is 
```:G(v,v,v...)n``` where ```v's``` are comma-delimited values in row-major order, and ```n``` is a qubit size specification. If ```n``` is greater
than 9 it must be followed by a trailing comma (see [Circuits With More Than 10 Lines](#circuits-with-more-than-10-lines)).
As an example, if a gate needs to be multiplied by a constant factor, use a generic gate with the factor as the
diagonal elements. ```:G(2,0,0,2)1``` is a 2x2 matrix with 2's on the diagonal.  The 1 suffix specifies a 1-qubit matrix, implying
that there should be four values.  Easily expand the matrix to any size by using identity gates: ```:G(2,0,0,2)1__```
is an 8x8 matrix with 2's on the diagonal.

## Big-endian Qubit Line References

(v1.5.0) QQCS by default uses little-endian qubit line references, that is, circuit lines are referenced from top to bottom starting
with line 0 and increasing from top to bottom.  This is the convention used in many texts.  However, there are also texts
that begin the numbering at the top with the highest qubit line number and decrease to zero at the bottom (last)
qubit line.  This big-ending referencing can also be used to build a QQCS circuit.  Big-endian referencing is controlled
by the ```-q``` command line switch or the ```$qrev``` interactive comment flag.  Once set, this mode remains in effect
until unset with another occurrence of the flag.

## Registers

(v1.5.0) Registers store quantum states.  They can interact with a quantum program by providing initial
quantum states, and by storing final quantum states resulting from the operation of a circuit.

Syntactically, a register is an identifier preceded by the ~ (tilde or not) character.  A register can be assigned a
quantum state by placing it to the left of any statement that produces a quantum state.  For example,

    ~ra|0>:H

~ra receives the result of the H gate operation on the ```|0>``` state.

## Comments

Comments are introduced by the hash character (#) and continue until the end of the line.

In interactive mode, it is possible to set switch controls by preceding the switch keyword with a $ in a comment.

    kdisp - display quantum states in ket notation (default is transposed column vector)
    trace - display the resulting quantum state (or equivalent matrix) at each step of the quantum circuit
    ualt - use the alternate definition of a general 1-qubit unitary matrix
    rzeroes - replace zero values with periods in matrix displays for readability
    ocache - cache oracles once they are generated
    qrev - set qubit line references to big-endian order
    none - reset all switches, and clear the instruction cache

When the ```$name``` appears in a comment, the switch is toggled.

### Interactive Help

    The keyword $gate[s] immediately following the hash character in an interactive comment will display a short
    help regarding the available gates.  The keyword $help will display a list of comment switches.

## Conclusion

QQCS is a simple linear notation for the simulation of quantum circuits.

It is an educational tool that can be easily used by students new to Quantum Computing.

It provides automatic mathematical analysis of circuits by incorporating the matrix mathematics necessary
to provide insight to circuit operation, and by displaying the details at each execution step.

It can be executed in interactive or batch mode.

## Version Notes
### Notes on Version 1.5.0
    * Add multi-digit qubit line references and replication suffixes
    * Provide custom gates with replication and control suffixes
    * Add generic gates
    * Add registers
    * Initial values can be computed by gate sequences 
    * Add option-controlled big-endian qubit line references (option qrev)
    * Add most recent comptation result (quantum state) available for next computation
    * Add negation to permutation gates
### Notes on Version 1.4.1
    * Add the Grover oracle
    * Add the oracle cacheing switch ocache
    * Redesign the configuration processing
### Notes on Version 1.4.0
    * Added extended controls (more than two) to the Toffoli gate 
    * Added permutation gates
    * Added oracles for the Deutsch, Deutsch-Josza, Bernstein-Vazirani, and Simon algorithms
    * Improved compiler-generator for handling tail recursion
### Notes on Version 1.3.0
    * An alternate general unitary matrix definition is available with the -u flag on start-up, or with the $ualt
      interactive comment flag
    * The Fredkin (Fr) gate, controlled swap, has been added
    * The n-qubit Quantum Fourier Transform (Qf) anf Inverse QFT (Qa) gates have been added
    * The gates Kp(𝜙), Rp(𝛽), and Tp(𝛼), which are the universal gate set from [4] have been added
    * The gate suffix notation has been simplified in an upward compatible way
        * actual circuit line numbers can now be used in multiple-qubit gates, instead of relative ones
        * this eliminates the need for leading _'s to indicate identify matrix positioning
        * as an example, the following are equivalent
            * X12 and _X01
            * X24 and __X02
            * Fr123 and _Fr012
        * the number of qubits in the circuit will be taken as the maximum size of the circuit, unless overridden by trailing _'s
    * Control suffixes are allowed on all single qubit gates
#### Fixes
    * When a non-zero element of a matrix was set to zero, the sparse matrix structure was corrupted.
### Notes on Version 1.2.0
Version 1.2.0 introduces several upward incompatibilities in order to expand the set of gates supported and to
simplify the syntax:

    * Ungated circuit lines are now represented by the underscore (_) character, not the lower case i
    * The comma syntax for ungated circuit lines between gates has been eliminated.  What used to be specified
      as :X,I,X can now be specified as :X_X
    * The S adjoint gate has been renamed from 's' to 'Sa'.  A similiar change has been made for the T adjoint gate. 
    * In prior versions, factoring at the end of a custom gate assignment was displayed but did not affect the
      assigned gate matrix.  It now does.
#### New features in version 1.2.0 include:
    * Rx(𝜃), Ry(𝜃), and Rz(𝜃) rotation gates
    * U(𝜃,𝜙,λ), general rotation gate (U1, U2, and U3) based on a three parameter general 2x2 unitary matrix
## QQCS Linear Notation Syntax

### Meta-symbols
    ::=       is defined as
    |         alternative
    e         empty
    'x'       identifies x as a grammar symbol

### Grammar (v1.5.0)
```
           pgm ::= stmt stmt-list eos
           eos ::= eol | eof
     stmt-list ::= ; stmt stmt-list | e
          stmt ::= ident gate-sequence | reg initial-value gate-sequence
 initial-value ::= q-state | q-state-list
 gate-sequence ::= g-seq-tail g-factor
    g-seq-tail ::= : gate-list g-seq-tail | e
      g-factor ::= / unop Complex | e
  q-state-list ::= ( t-val gate-sequence ) q-state-list | e
         t-val ::= q-state | reg
       q-state ::= unop v-comp p-state-tail
  p-state-tail ::= addop v-comp p-state-tail | e
     gate-list ::= full-gate gate-list | e
     full-gate ::= gate-name gate-suffix
     gate-name ::= gate | ident
   gate-suffix ::= gate-angle gate-repl
    gate-angle ::= ( unop Complex cmplxs ) | e
     gate-repl ::= line lines
         lines ::= , line lines | e
        cmplxs ::= , unop Complex cmplxs | e
          line ::= integer reg | e
           reg ::= ~ ident | e
        v-comp ::= coeff ket
         coeff ::= Complex | e
           ket ::= '|' integer >
       Complex ::= complex | real | integer
          unop ::= addop | e
         addop ::= + | -
```

## References

```
[1] C. C. Moran (2019) Mastering Quantum Computing with IBM QX,  Birmingham, UK, Packt Publishing.
[2] G. Nannicini (2018). An Introduction to Quantum Computing, Without the Physics. IBM T.J. Watson, Yorktown Heights, NY. retrieve https://arxiv.org/pdf/1708.03684v3.pdf.
[3] M. A. Nielsen and I. L. Chuang (2010) Quantum Computation and Quantum Information. 10th Anniversary Ed, New York, Cambridge University Press.
[4] E. Rieffel and W. Polak (2011) Quantum Computing, A Gentle Introduction. MIT Press, Cambridge, Massachusetts; London, England.
[5] R. S. Sutor (2019) Dancing With Qubits. Birmingham, UK, Packt Publishing.
[6] A. Cross, L. Bishop, J. Smolin, J. Gambetta (2017). Open Quantum Assembly Language. retrieve https://arxiv.org/pdf/1707.03429.pdf.
[7] IBM, the Quantum Experience web site (2019) retrieve https://quantumexperience.ng.bluemix.net/.
[8] The QISKit SDK for Quantum Software Development (2019). retrieve https://github.com/QISKit.
[9] QPIC (2018) Creating quantum circuit diagrams in TikZ. retrieve https://github.com/qpic/qpic.
```
