set CHILDREN;
set CARETAKERS;

param D {CHILDREN};            # Child demand
param minH {CARETAKERS};       # Caretaker min hours
param maxH {CARETAKERS};       # Caretaker max hours
param Q {CARETAKERS};          # Caretaker qualification
param R {CHILDREN};            # Child requirement
param T {CHILDREN, CARETAKERS}; # Travel time
param S {CHILDREN, CARETAKERS}; # Matching score
param valid {CHILDREN, CARETAKERS}; # 1 if Q_j >= R_i and T_ij <= τ
param lambda1;
param lambda2;

var x {CHILDREN, CARETAKERS} binary;
var h {CHILDREN, CARETAKERS} >= 0;
var z {CHILDREN} binary;
var y {CARETAKERS} binary;
var s {CARETAKERS} >= 0;

maximize TotalScore:
    sum{i in CHILDREN} z[i]
    + lambda1 * sum{i in CHILDREN, j in CARETAKERS} S[i,j] * x[i,j]
    - lambda2 * sum{i in CHILDREN, j in CARETAKERS} T[i,j] * x[i,j]
    - sum{j in CARETAKERS} s[j];

subject to DemandSatisfaction {i in CHILDREN}:
    sum{j in CARETAKERS} h[i,j] >= D[i] * z[i];

subject to CaretakerMax {j in CARETAKERS}:
    sum{i in CHILDREN} h[i,j] <= maxH[j] * y[j];

subject to CaretakerMin {j in CARETAKERS}:
    sum{i in CHILDREN} h[i,j] + s[j] >= minH[j] * y[j];

subject to HoursLink {i in CHILDREN, j in CARETAKERS}:
    h[i,j] <= D[i] * x[i,j];

subject to ValidAssignments {i in CHILDREN, j in CARETAKERS}:
    x[i,j] <= valid[i,j];

subject to MaxTwoCaretakers {i in CHILDREN}:
    sum{j in CARETAKERS} x[i,j] <= 2;
