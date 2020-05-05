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
The following gate sequence cite6 may or may not implement a controlled Hadamard gate.  How is one to tell?

![Image of Controlled Hadamard Sequence]
(img/Screen%20Shot%202020-05-03%20at%203.41.56%20PM.png)

Writing a program in QASM [6] will give you counts at the end, but it will be difficult to say for sure that those counts represent controlled-H gate

You can write a QuTIP [9] program in Python, or use Python interactively to invoke QuTIP functions after studying QuTIP and the Num.py library

Or you can interactively enter a single QQCS statement
