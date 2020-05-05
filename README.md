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
 0            0            0.5+0.5i -0.5-0.5i]
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
<tr><td>Z </td><td> Pauli Z gate (π phase gate)</td><td>M</td><td>measurement</td></tr>
</table>
   
Gate Positioning and Replication
===

"i" prefixes and suffixes have already been mentioned.  They may be replicated as many times as needed (subject to maximum qubit restriction) to position a gate on the correct line.  For example, :iiXii designates an X-gate on line 2 in a 5-qubit circuit

Gates may be replicated across adjacent lines by using 1-digit suffix replicator.  For example, :iiX3 designates a gate starting on line 2 create from the tensor product of 3 X-gates on lines 2, 3, 4 of a 5-qubit circuit.  The replication is only applicable to single-qubit gates.  As an alternative, the gate name can be repeated. :HHHH is the same as :H4

Non-adjacent gates are handled by dividing the name into comma-separated pieces. :iX,I,X puts two X gates on lines 1 and 3 of a 4-qubit circuit.  In names like this, interior identity gates are designated with the upper case I.  Lower case i’s are only used for overall prefixes and suffixes.

Controlled Gate Names
===

<img src="img/Screen Shot 2020-05-03 at 3.41.56 PM.png" />


Qubit line numbers on a controlled gate are relative to the span of the gate

The span of a gate is the difference between the minimum and maximum control/target lines plus one
Reading left to right, controls first, then target

Prefixes and suffixes are used, as in all other gates, to position the gate vertically in the circuit
Any single qubit gate can be followed by a control suffix to make it a controlled gate
