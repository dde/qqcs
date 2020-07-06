# QQCS - Quick Quantum Circuit Simulation

Overview
===

The student new to Quantum Computing immediately confronts the steep hurdle of the mathematics of complex vector spaces needed to understand the basic concepts

There are elaborate systems available to aid quantum computations, but they are embedded in other languages, which is just one more thing to learn

When working with quantum algorithms expressed as circuits or gate sequences, one wants to know several things that are not immediately available in quantum programming systems.

    * A trace of the quantum state after each circuit gate
    * A display of the gate equivalent at any point in the circuit
    * Simple displays of quantum probabilities
    * Output using the notation of quantum computing

QQCS contains all these features.  It is an educational tool for first and second courses in Quantum Computing.

Quantum Circuit Simulation
===

A circuit simulation is not a quantum computer simulation.  It is a mathematical rendering of each step of a quantum algorithm that is described by a sequence of gate operations on an initial quantum state.

The simulation is rendered by the underlying software system, Quick Quantum Circuit Simulation (QQCS).
The system allows a student to quickly construct a circuit using a linear notation motivated by the circuits themselves, and to acquire the information to analyze an algorithm quickly without the need for tedious calculations.

Introduction
===
The following gate sequence \[6\] may or may not implement a controlled Hadamard gate.  How is one to tell?

<img src="img/Screen Shot 2020-05-03 at 3.41.56 PM.png" />

Writing a program in QASM \[6\] will give you counts at the end, but it will be difficult to say for sure that those counts represent controlled-H gate

You can write a QuTIP \[9\] program in Python, or use Python interactively to invoke QuTIP functions after studying QuTIP and the Num.py library

Or you can interactively enter a single QQCS statement

A QCCS Statement
===

Here is the interactive QQCS statement and its output to definitively answer the question (the \[ 1\] is the line number prompt):

```
[ 1]:iH:is:Cx:iH:iT:Cx:iT:iH:iS:iX:Si
[0.7+0.7i 0            0              0
 0            0.7+0.7i 0              0
 0            0            0.5+0.5i   0.5+0.5i
 0            0            0.5+0.5i  -0.5-0.5i]
```

Although first two diagonal elements should be 1, it looks like a factor of cos pi/4 + i sin pi/4￼ would make that so, meaning that the circuit could very well be equivalent to a global phase with a controlled Hadamard gate

QQCS Statement Detail
===

Gates syntactically begin with a colon (:) and are given their standard names

Gates have prefixes and suffixes ("i") for each ungated qubit line above or below the gate.  The first gate, :iH, is a Hadamard gate with an undated line above it

Gates with common adjoint gates use the upper case letter name for the gate and the lower case letter name for the adjoint

A controlled gate, such as the CNOT, has a two- or three-digit suffix following the gate name identifying the control line (or lines) followed by the target line, so :C01 is a CNOT with control line 0 and target line 1. :Cx is a common abbreviation for :C01, and :C10 is a reverse CNOT, and is also abbreviated Cr

Control and target lines are relative to the span of the controlled gate, so ‘i’ prefixes and suffixes do not change the numbering of the controls and target

Basic Available Gates
===

<table>
<tr><th colspan=2">1-Qubit</th><th colspan="2">2-Qubit</th></tr>
<tr><td>H </td><td> Hadamard gate </td><td>C </td><td> general CNOT (used with a 2-digit control suffix) </td></tr>
<tr><td>I </td><td> Identity gate, infixes</td><td>Cx </td><td>CNOT with control qubit q and target qubit q+1</td></tr>
<tr><td>i </td><td> implied Identity prefixes and suffixes</td><td>Cr </td><td>reverse CNOT with control qubit q+1 and target qubit q</td></tr>
<tr><td>S </td><td>S gate (π/2 phase gate)</td><td>Sw</td><td>general Swap (used with a 2-digit control suffix) </td></tr>
<tr><td>s </td><td>  (S adjoint) </td><td></td><td>general control gate for any 1-qubit gate with control suffix</td></tr>
<tr><td>T </td><td> π/8 gate (π/4 phase gate)</td><th colspan="2">3-Qubit</th></tr>
<tr><td>t </td><td>  (T adjoint) </td><td>Tf </td><td> general Toffoli gate (used with a 3-digit control suffix) </td></tr>
<tr><td>X </td><td> Pauli X gate </td><td>Fr </td><td> general Fredkin gate (used with a 3-digit control suffix) </td></tr>
<tr><td>Y </td><td> Pauli Y gate </td><td></td><td>named, reusable, custom gate sequences</td></tr>
<tr><td>Z </td><td> Pauli Z gate (π phase gate)</td><td>Imn</td><td>n-qubit Mean Inversion</td></tr>
<tr><td></td><td></td><td>Mn</td><td>n-qubit measurement</td></tr>
</table>
   
Gate Positioning and Replication
===

"i" prefixes and suffixes have already been mentioned.  They may be replicated as many times as needed (subject to maximum qubit restriction) to position a gate on the correct line.  For example, :iiXii designates an X-gate on line 2 in a 5-qubit circuit

Gates may be replicated across adjacent lines by using 1-digit suffix replicator.  For example, :iiX3 designates a gate starting on line 2 create from the tensor product of 3 X-gates on lines 2, 3, 4 of a 5-qubit circuit.  The replication is only applicable to single-qubit gates.  As an alternative, the gate name can be repeated. :HHHH is the same as :H4

Non-adjacent gates are handled by dividing the name into comma-separated pieces. :iX,I,X puts two X gates on lines 1 and 3 of a 4-qubit circuit.  In names like this, interior identity gates are designated with the upper case I.  Lower case i’s are only used for overall prefixes and suffixes.

Controlled Gate Names
===

<img src="img/Screen Shot 2020-05-03 at 8.30.54 PM.png" />

Qubit line numbers on a controlled gate are relative to the span of the gate

The span of a gate is the difference between the minimum and maximum control/target lines plus one
Reading left to right, controls first, then target

Prefixes and suffixes are used, as in all other gates, to position the gate vertically in the circuit

Any single qubit gate can be followed by a control suffix to make it a controlled gate

Display
===

The default display is the resulting gate matrix or quantum state transposed column vector

If the gate sequence was supplied with an initial value (see below), that value is displayed before the gate sequence is executed

The ket (-k) flag causes the quantum state display to be in basis vector form

The trace (-t) flag causes a display of output at each step in the gate sequence

    * If there was an initial value, the trace is of each quantum state
    * If no initial value, the trace is the equivalent gate matrix to that point in the circuit

Measurement
===

The :M pseudo-gate signifies measurement

It is placed and replicated as many times as needed in a circuit.  To measure all 5 qubits at the end of a 5-qubit gate sequence, use :M5

The measurement display is a probability associated with each of the basis vectors at the point in the circuit where the :M pseudo-gate appears. Measurement output is sequentially numbered to track the different M-pseudo-gates that may be in a gate sequence

Measurement is purely a mathematical display and does not cause state collapse

Any subset of the qubit lines can be measured.  Use the comma gate name delimiters if needed.

Initial Values
===

A gate sequence execution does not automatically start with a ￼ value. This allows the computation and display of an equivalent gate matrix, a sequence of gate matrix products

To specify an initial value for a gate sequence, including ￼, use a linear combination of basis vectors in standard quantum computing ket notation

    * |0> - single qubit zero ket
    * 0.707|0>+0.707|1> - balanced superposition qubit
    * Decimal values should begin with a zero, not a decimal point
    * An i is the imaginary value suffix, and must be preceded by a number, even if the number is 1.  Only + and - operators are used.  Multiplication is implicit when a complex number is adjacent to a basis ket. There is no division, but see factoring below.
    * The initial value is ended by the first colon of the gate sequence
    
Initial Value Tensor Products
===

Larger initial values can be composed by surrounding a ket expression with parentheses

    * (|0>)(|0>) is the same as |00>
    * (0.707|0>+0.707|1> )(0.707|0>-0.707|1>) is the tensor product of |+> and |->￼, symbols which are currently not recognized by QQCS
    
If the tensor product is all that is needed, terminate the statement with a return. No gate sequence is necessary.

Factoring
===

A Quantum Fourier Transform circuit \[5\] can be difficult to recognize without factoring.

The / operator followed by a (possibly complex) number at the end of a gate sequence, will factor out the number before the final display

### Quantum Fourier Transform - No Factor
```
:Hii:S10i:T20:iHi:iS10:iiH:Sw02
0.354  0.354       0.354   0.354      ...
0.354  0.25+0.25i  0.354i -0.25+0.25i ...
0.354  0.354i     -0.354  -0.354i     ...
0.354 -0.25+0.25i -0.354i  0.25+0.25i ...
0.354 -0.354       0.354  -0.354      ...
0.354 -0.25-0.25i  0.354i  0.25-0.25i ...
0.354 -0.354i     -0.354   0.354i     ...
0.354  0.25-0.25i -0.354i -0.25-0.25i ...
```

### Quantum Fourier Transform - Factoring Sqrt(8)
```
:Hii:S10i:T20:iHi:iS10:iiH:Sw02/0.35355
1  1             1   1            ...
1  0.707+0.707i  1i -0.707+0.707i ...
1  1i           -1  -1i           ...
1 -0.707+0.707i -1i  0.707+0.707i ...
1 -1             1  -1            ...
1 -0.707-0.707i  1i  0.707-0.707i ...
1 -1i           -1   1i           ...
1  0.707-0.707i -1i -0.707-0.707i ...
```

Custom Gates
===

A gate sequence can be named and saved for future use.  Simply precede the gate sequence with a name

A name should start with a letter, comprise letters and digits, BUT should not end with a digit.  Do not start or end the name with anything that might be mistaken for a gate sequence prefix or suffix, such as "i".

Once defined, a custom gate is used just like a normal gate.  It can be positioned in a circuit with i prefixes and suffixes, but control and replicator suffixes cannot be applied to it.

For example, ss:Sw03:Sw01ii:iSw01i assigns the 4-qubit custom swap circuit \[1\] to the name ss.  It can then be used in another circuit as :ss, or all 16 4-qubit basis kets can be used as initial values to determine the effect of the circuit on each.

Conclusion
===

QQCS is a simple linear notation for the simulation of quantum circuits

It is an educational tool that can be easily used by students new to Quantum Computing

It provides automatic mathematical analysis of circuits by incorporating the matrix mathematics necessary to provide insight to circuit operation, and by displaying the details at each execution step, something not available from quantum computer execution

It can be executed in interactive or batch mode

QQCS is available through the NodeJS Package Manager, npm, and is executed using NodeJS

QQCS Linear Notation Syntax
===

### Meta-symbols
    - ::=   is defined as
    - |   alternative
    - [ ... ]   zero or more
    - e   empty
    - 'x'   identifies x as a grammar symbol
```
pgm ::=  stmt stmt-list eof
stmt ::= e | circuit | ident gate-sequence
stmt-list ::= e | eol stmt [ stmt-list ]
circuit ::= e | initial-value gate-sequence
gate-sequence ::= e | g-seq-tail g-factor
initial-value ::= e | q-state | q-state-list
q-state ::=  unop v-comp p-state-tail
q-state-list ::= e | ( q-state ) [ q-state-list ]
g-seq-tail ::= e | : gate [ g-seq-tail ]
g-factor ::= e | / unop complex
gate ::=  sub-gate gates
unop ::= e | -
v-comp ::=  coeff ket
p-state-tail ::= e | addop v-comp [ p-state-tail ]
addop ::=  + | -
sub-gate ::=  ident
gates ::= e | , sub-gate [ gates ]
coeff ::= e | complex | integer
ket ::=  '|' integer >
```

References
===
```
[1] C. C. Moran (2019) Mastering Quantum Computing with IBM QX,  Birmingham, UK, Packt Publishing.
[2] G. Nannicini (2018). An Introduction to Quantum Computing, Without the Physics. IBM T.J. Watson, Yorktown Heights, NY. retrieve https://arxiv.org/pdf/1708.03684v3.pdf.
[3] M. A. Nielsen and I. L. Chuang (2010) Quantum Computation and Quantum Information. 10th Anniversary Ed, New York, Cambridge University Press.
[4] E. Rieffel and W. Polak (2011) Quantum Computing, A Gentle Introduction. MIT Press, Cambridge, Massachusetts; London, England.
[5] R. S. Sutor (2019) Dancing With Qubits. Birmingham, UK, Packt Publishing.
[6] A. Cross, L. Bishop, J. Smolin, J. Gambetta (2017). Open Quantum Assembly Language. retrieve https://arxiv.org/pdf/1707.03429.pdf.
[7] IBM, Quantum Experience web site (2019) retrieve http://quantumexperience.ng.bluemix.net/.
[8] The QISKit SDK for Quantum Software Development (2019). retrieve https://github.com/QISKit.
[9]QuTIP (2019) - Quantum Toolbox In Python, a set of software tools for quantum math, visualization, and simulation, retrieve http://qutip.org/.
[10] QPIC (2018) Creating quantum circuit diagrams in TikZ. retrieve https://github.com/qpic/qpic.
```
