# Typeclass Laws

| Typeclass              | Law                       | Predicate                                                       |
| ---------------------- | ------------------------- | --------------------------------------------------------------- |
| $\mathsf{Equivalence}$ | transitivity              | $a\!=\!b \: \land \: b\!=\!c \, \Rightarrow \, a\!=\!c$         |
|                        | symmetry                  | $a\!=\!b \, \Leftrightarrow \, b\!=\!a$                         |
|                        | reflexivity               | $a\!=\!a$                                                       |
| $\mathsf{Order}$       | transitivity              | $a \leq b \: \land \: b \leq c \, \Rightarrow \, a \leq c$      |
|                        | reflexivity               | $a \leq a$                                                      |
|                        | connectivity              | $a \leq b \: \lor \: b \leq a$                                  |
|                        | complement consistency    | $a \leq b \: \Rightarrow \: a \ngtr b$                          |
|                        | equivalence consistency   | $a \leq b \: \land \: b \leq a \, \Rightarrow \, a\! = \!b$     |
| $\mathsf{Semigroup}$   | associativity             | $(a \;\oplus\; b) \;\oplus\; c = a \;\oplus\; (b \;\oplus\; c)$ |
|                        | combineMany associativity | $a\!=\!b \, \Leftrightarrow \, b\!=\!a$                         |
