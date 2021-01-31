# QQCS - Quick Quantum Circuit Simulation



## Overview

The student new to Quantum Computing immediately confronts the steep hurdle of the mathematics of complex vector
 spaces needed to understand the basic concepts.

There are elaborate systems available to aid quantum computations, but they are embedded in other languages,
 which is just one more thing to learn.

When working with quantum algorithms expressed as circuits or gate sequences, one wants to know several things
that are not immediately available in quantum programming systems.

    * A trace of the quantum state after each circuit gate
    * A display of the gate equivalent at any point in the circuit
    * Simple displays of quantum probabilities
    * Output using the notation of quantum computing

QQCS contains all these features.  It is an educational tool for first and second courses in Quantum Computing.

QQCS can also be used by the quantum experimentalist.  It can test the operation of quantum circuits step by step,
displaying the output of each step as a quantum state, an equivalent gate, or a measure of one or more qubits,
and it can quickly run through alternatives.

Although QQCS is "one more thing to learn", it is designed to be an intuitive character reprentation of a
quantum circuit, using familiar gate names and quantum notation, drawing on existing concepts so that the
learning is minimal.

## Quantum Circuit Simulation

A quantum circuit simulation is not a quantum computer simulation.  It is a mathematical rendering of each step
of a quantum algorithm that is described by a sequence of gate operations on an initial quantum state.

The QQCS software renders the simulation. The system allows a student to quickly construct a circuit using a linear notation motivated by the circuits
themselves, and to acquire the information to analyze an algorithm quickly without the need for tedious calculations.

## Introduction

The following gate sequence \[6\] may or may not implement a controlled Hadamard gate.  How is one to tell?

<img src="img/Screen Shot 2020-05-03 at 3.41.56 PM.png" alt="equivalent gate sequence for a controlled Hadamard gate"/>

Writing a program in QASM \[6\] will give you counts at the end, but it will be difficult to say for sure those counts represent a controlled H-gate

You can write a QuTIP \[9\] program in Python, or use Python interactively to invoke QuTIP functions after studying QuTIP and the Num.py library

Or you can interactively enter a single QQCS statement

## A QQCS Statement

Here is the interactive QQCS statement and its output to answer the question (the \[ 1\] is the line number prompt):

```
[ 1] :_H:_Sa:Cx:_H:_T:Cx:_T:_H:_S:_X:S_
[] _H _Sa Cx _H _T Cx _T _H _S _X S_ [
0.707+0.707i 0            0         0       
0            0.707+0.707i 0         0       
0            0            0.5+0.5i  0.5+0.5i
0            0            0.5+0.5i -0.5-0.5i]
```

Although first two diagonal elements should be 1, it looks like a factor of ```cos π/4 + isin π/4``` would make that so,
 meaning the circuit could very well be equivalent to a global phase with a controlled Hadamard gate

## QQCS Statement Detail

Circuit steps syntactically begin with a colon (:) and combine gates, given their standard names, with ungated
qubit lines indicated by underscores (_), in sequence from the top to the bottom of the lines in the circuit.
The first step in the example, :_H, is a Hadamard gate with an ungated line above it, in a two-line circuit.

Gates with common adjoint gates use the upper case letter name for the gate, and the lower case letter "a" following
the upper case letter as the name for the adjoint gate.

A controlled gate, such as the CNOT, has a two- or three-digit suffix following the gate name identifying the
control line (or lines) followed by the target line, so :C01 is a CNOT with control line 0 and target line 1.
```:Cx``` is a common abbreviation for ```:C01```.  ```:C10``` is a reverse CNOT, and can be abbreviated Cr.

Control and target lines are relative to the span of the controlled gate, so "_" prefixes and suffixes do not
change the numbering of the controls and target.

## Basic Available Gates

<table>
<tr><th colspan="2">1-Qubit</th><th colspan="2">2-Qubit</th></tr>
<tr><td>H </td><td> Hadamard gate </td><td>C </td><td> general CNOT (used with a 2-digit control suffix) </td></tr>
<tr><td>I </td><td> Identity gate</td><td>Cx </td><td>CNOT with control qubit q and target qubit q+1</td></tr>
<tr><td>_ </td><td> ungated lines (implied Identity)</td><td>Cr </td><td>reverse CNOT with control qubit q+1 and target qubit q</td></tr>
<tr><td>Kp(𝜃)</td><td>Phase gate (universal set) [4] </td><td>Sw</td><td>general Swap (used with a 2-digit control suffix)</td></tr>
<tr><td>Rp(𝜃)</td><td>Rotation gate (universal set) [4]</td><th colspan="2">3-Qubit</th></tr>
<tr><td>Rx(𝜃)</td><td>Pauli X rotation gate</td><td>Fr</td><td>general Fredkin gate (used with a 3-digit control suffix)</td></tr>
<tr><td>Ry(𝜃)</td><td>Pauli Y rotation gate</td><td>Tf</td><td>general Toffoli gate (used with a 3-digit control suffix)</td></tr>
<tr><td>Rz(𝜃)</td><td>Pauli Z rotation gate</td><th colspan="2">n-Qubit</th></tr>
<tr><td>S </td><td>S gate (π/2 phase gate)</td><td>Im</td><td>Mean Inversion (used with 1-digit size suffix)</td></tr>
<tr><td>Sa </td><td>S adjoint</td><td>Qa</td><td>Inverse Quantum Fourier Transform (used with 1-digit size suffix)</td></tr>
<tr><td>T </td><td> π/8 gate (π/4 phase gate)</td><td>Qf</td><td>Quantum Fourier Transform (used with 1-digit size suffix)</td></tr>
<tr><td>Ta </td><td>T adjoint</td><td></td><td></td></tr>
<tr><td>Tp(𝜃)</td><td>Phase Rotation gate (universal set) [4]</td><td></td><td></td></tr>
<tr><td>U(𝜃,𝜙,λ)</td><td>General one-, two-, or three-parameter rotation gate</td><th colspan="2">Other</th></tr>
<tr><td>X </td><td> Pauli X gate </td><td>a...</td><td>named, reusable, custom gate sequences</td></tr>
<tr><td>Y </td><td> Pauli Y gate </td><td>ct</td><td>control(c)-target(t) digit control suffix for any 1-qubit gate</td></tr>
<tr><td>Z </td><td> Pauli Z gate (π phase gate)</td><td>M</td><td>Qubit measurement pseudo-gate</td></tr>
</table>

## Rotational Gates

All the rotational gates specify the angle parameters as factors of π radians, with π implicit.
Thus, Rx(.5) is an X-axis rotation of π/2 radians, or 90 degrees.  The parameter range for all angles is [0,4).

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
flag.  The alternate definition differs only by a phase factor from the default definition above, but it can
simplify the elements of some rotational gates.  The definition is:
```
cos(𝜃/2)        -exp(iλ)sin(𝜃/2)
exp(i𝜙)sin(𝜃/2)  exp(i(𝜙+λ))cos(𝜃/2)
```

## Gate Positioning and Replication

Ungated lines (\_) have already been mentioned.  They may be repeated as many times as needed (subject to maximum
qubit restriction) to position a gate on the correct line.  For example, :\_\_X\_\_ designates an X-gate on line
2 in a 5-qubit circuit.

Gates may be repeated across adjacent lines by using a 1-digit suffix replicator.  For example, :\_\_X3 designates
a circuit step created from the tensor product of 2 Identity gates on lines 0 and 1, and 3 X-gates on lines 2, 3, 4
of a 5-qubit circuit.  The replication is only applicable to single-qubit gates, and uses only a single digit.
As an alternative, the gate name can be repeated. :HHHH is the same as :H4.

Non-adjacent gates are handled by infixed underscores (\_), such as :\_X\_X, which puts two X gates on lines 1 and 3
of a 4-qubit circuit.

## Controlled Gate Names

<img src="img/Screen Shot 2020-05-03 at 8.30.54 PM.png" width="645" height="268" alt="suffix notation corresponding to CNOT gates in a circuit"/>

Qubit line numbers on a controlled gate can be relative to the span of the gate, or absolute.

The span of a gate is the difference between the minimum and maximum control/target lines plus one.
Reading left to right, controls occur first, then target, each as a single digit.  As an example, the
control suffix 02 has a span of 3 (2-0+1=3) lines,
and indicates a control on relative line 0 and a target on relative line 2.

Ungated prefixes and suffixes are used, as in all other gates, to position the gate vertically in the circuit.
Lines within the span that are not control or target lines are ungated by implication.

With a absolute suffix, the control and target digits indicate the actual lines of the circuit.  No leading
\_'s are needed for positioning.  Trailing \_'s may still be needed.

Either absolute or relative notation may be uaed.

Any single qubit gate can be followed by a control suffix to make it a controlled gate.

## Display

The default display is the resulting gate matrix, or a quantum state transposed column vector.

If the gate sequence was supplied with an initial value (see below), that value is displayed before the gate sequence is executed.

The ket (-k) flag causes the quantum state display to be in basis vector form.

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

A gate sequence execution does not automatically start with a qubit value. This allows the computation and display
of an equivalent gate matrix, a sequence of gate matrix products.

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

## Factoring

A Quantum Fourier Transform circuit \[5\] can be difficult to recognize without factoring.

At the end of a gate sequence, the / operator followed by a (possibly complex) number at the end of a
gate sequence, will factor out the number before the final display.

### 3-qubit Quantum Fourier Transform - No Factor
```
:H__:S10_:T20:_H_:_S10:__H:Sw02
0.354  0.354       0.354   0.354      ...
0.354  0.25+0.25i  0.354i -0.25+0.25i ...
0.354  0.354i     -0.354  -0.354i     ...
0.354 -0.25+0.25i -0.354i  0.25+0.25i ...
0.354 -0.354       0.354  -0.354      ...
0.354 -0.25-0.25i  0.354i  0.25-0.25i ...
0.354 -0.354i     -0.354   0.354i     ...
0.354  0.25-0.25i -0.354i -0.25-0.25i ...
```

### 3-qubit Quantum Fourier Transform, Factoring Sqrt(8)
```
:H__:S10_:T20:_H_:_S10:__H:Sw02/0.35355
1  1             1   1            ...
1  0.707+0.707i  1i -0.707+0.707i ...
1  1i           -1  -1i           ...
1 -0.707+0.707i -1i  0.707+0.707i ...
1 -1             1  -1            ...
1 -0.707-0.707i  1i  0.707-0.707i ...
1 -1i           -1   1i           ...
1  0.707-0.707i -1i -0.707-0.707i ...
```

## Custom Gates

A gate sequence can be named and saved for future use.  Simply precede the gate sequence with a name.

A name should start with a letter, comprise lower and upper case letters.  Do not start or end the name
with anything that might
be mistaken for a gate name.  Best practice is to avoid upper case characters as the first character of
a custom gate name.

Once defined, a custom gate is used just like a normal gate.  It can be positioned in a circuit with "_" prefixes
and suffixes, but control and replicator suffixes cannot be applied to it.

For example, ss:Sw03:Sw01\_\_:\_Sw01\_ assigns the 4-qubit custom swap circuit \[1\] to the name "ss".  It can then
be used in another circuit as :ss.  For example, |0001>:ss determines the
effect of the :ss equivalent circuit on the 4-qubit basis |0001>.

Custom gates allow new gates to be defined.  The square root of X (square root NOT \[5\]) gate can be defined by
```sn:Rx(.5)/.707-.707i```.  This statement assigns the custom gate ```sn``` a π/2 Rx rotation, after factoring out
the global phase ```exp(-iπ/4)```.  To verify, look at the result ```:sn:sn```.  Square root NOT squared is X.

## Comments

Comments are introduced by the hash character (#) and continue until the end of the line.

In interactive mode, it is possible to set switch controls by preceding the switch keyword with a $ in a comment.

    kdisp - display quantum states in ket notation (default is transposed column vector)
    trace - display the resulting quantum state (or equivalent matrix) at each step of the quantum circuit
    ualt - use the alternate definition of a general 1-qubit unitary matrix
    none - reset all switches

When the $name appears in a comment, the switch is toggled.

### Interactive help

    The keyword $gate[s] immediately following the hash character in an interactive comment will display a short
    help regarding the available gates.

## Conclusion

QQCS is a simple linear notation for the simulation of quantum circuits.

It is an educational tool that can be easily used by students new to Quantum Computing.

It provides automatic mathematical analysis of circuits by incorporating the matrix mathematics necessary
to provide insight to circuit operation, and by displaying the details at each execution step, something
not available from quantum computer simulated execution.

It can be executed in interactive or batch mode.

QQCS is available through the NodeJS Package Manager, npm, and is executed using NodeJS.

## Notes on Version 1.3.0

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

### Fixes

    * When a non-zero element of a matrix was set to zero, the sparse matrix structure was corrupted.

## Notes on Version 1.2.0

Version 1.2.0 introduces several upward incompatibilities in order to expand the set of gates supported and to
simplify the syntax:

    * Ungated circuit lines are now represented by the underscore (_) character, not the lower case i
    * The comma syntax for ungated circuit lines between gates has been eliminated.  What used to be specified
      as :X,I,X can now be specified as :X_X
    * The S adjoint gate has been renamed from 's' to 'Sa'.  A similiar change has been made for the T adjoint gate. 
    * In prior versions, factoring at the end of a custom gate assignment was displayed but did not affect the
      assigned gate matrix.  It now does.

New features in version 1.2.0 include:

    * Rx(𝜃), Ry(𝜃), and Rz(𝜃) rotation gates
    * U(𝜃,𝜙,λ), general rotation gate (U1, U2, and U3) based on a three parameter general 2x2 unitary matrix 

## QQCS Linear Notation Syntax

### Meta-symbols
    ::=       is defined as
    |         alternative
    [ ... ]   zero or more
    e         empty
    'x'       identifies x as a grammar symbol

### Grammar
```
              pgm ::= stmt stmt-list eof
        stmt-list ::= eol stmt stmt-list | e
             stmt ::= ident gate-sequence | initial-value gate-sequence
    initial-value ::= q-state | q-state-list | e
    gate-sequence ::= g-seq-tail g-factor
       g-seq-tail ::= : gates g-seq-tail | e
         g-factor ::= / unop Complex | e
     q-state-list ::= ( q-state ) q-state-list | e
          q-state ::= unop v-comp p-state-tail
     p-state-tail ::= addop v-comp p-state-tail | e
            gates ::= full-gate gates | e
        full-gate ::= gate gate-suffix | ident
      gate-suffix ::= gate-angle gate-repl
       gate-angle ::= ( unop Real reals ) | e
        gate-repl ::= integer | e
            reals ::= , unop Real reals | e
           v-comp ::= coeff ket
            coeff ::= Complex | e
              ket ::= '|' integer >
          Complex ::= complex | Real
             Real ::= real | integer
            addop ::= + | -
             unop ::= - | e
```

## References

```
[1] C. C. Moran (2019) Mastering Quantum Computing with IBM QX,  Birmingham, UK, Packt Publishing.
[2] G. Nannicini (2018). An Introduction to Quantum Computing, Without the Physics. IBM T.J. Watson, Yorktown Heights, NY. retrieve https://arxiv.org/pdf/1708.03684v3.pdf.
[3] M. A. Nielsen and I. L. Chuang (2010) Quantum Computation and Quantum Information. 10th Anniversary Ed, New York, Cambridge University Press.
[4] E. Rieffel and W. Polak (2011) Quantum Computing, A Gentle Introduction. MIT Press, Cambridge, Massachusetts; London, England.
[5] R. S. Sutor (2019) Dancing With Qubits. Birmingham, UK, Packt Publishing.
[6] A. Cross, L. Bishop, J. Smolin, J. Gambetta (2017). Open Quantum Assembly Language. retrieve https://arxiv.org/pdf/1707.03429.pdf.
[7] IBM, the Quantum Experience web site (2019) retrieve http://quantumexperience.ng.bluemix.net/.
[8] The QISKit SDK for Quantum Software Development (2019). retrieve https://github.com/QISKit.
[9] QuTIP (2019) - Quantum Toolbox In Python, a set of software tools for quantum math, visualization, and simulation, retrieve http://qutip.org/.
[10] QPIC (2018) Creating quantum circuit diagrams in TikZ. retrieve https://github.com/qpic/qpic.
```
