# Sets
set I;  # Children
set J;  # Assistants

# Parameters
param Nutzen {I, J};               # Utility of assigning j to i
param Zeitbedarf {I};             # Time demand of child i
param Zeitkapazitaet {J};         # Time capacity of assistant j
param MaxBetreuer {I};            # Max number of assistants per child (1 or 2)

param wTU >= 0;                   # Penalty weight for overtime
param wTS >= 0;                   # Penalty weight for underutilization
param aOT >= 0;                   # allowed overtime

# Decision Variables
var x {I, J} binary;              # 1 if assistant j assigned to child i
var Ueberzeit {J} >= 0;           # Overtime for assistant j
var Unterzeit {J} >= 0;           # Underused time for assistant j

# Objective: Maximize total utility minus penalties
maximize GesamtScore:
    sum {i in I, j in J} Nutzen[i, j] * x[i, j]
    - sum {j in J} (wTU * Ueberzeit[j] + wTS * Unterzeit[j]);

# Constraints

# Maximal Ueberzeit is 4 Hours
subject to MaxUeberzeit {j in J}:
    Ueberzeit[j] <= aOT;

# Each child gets at least one assistant
subject to Versorgungspflicht {i in I}:
    sum {j in J} x[i, j] >= 1;

# Each child gets at most MaxBetreuer[i] assistants
subject to MaxBetreuerConstraint {i in I}:
    sum {j in J} x[i, j] <= MaxBetreuer[i];

# Time balance for assistants
subject to ZeitBilanz {j in J}:
    sum {i in I} (Zeitbedarf[i] * x[i, j]) + Unterzeit[j] - Ueberzeit[j] = Zeitkapazitaet[j];
