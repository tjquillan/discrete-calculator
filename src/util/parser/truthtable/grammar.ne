@preprocessor typescript
@{%// eslint-disable-next-line import/first
import {Atom, Paren, Not, And, Or, Xor, Implies, Iff} from './ast' %}

proposition -> iff                  {% id %}
iff         -> iff "↔" implies      {% (d) => new Iff(d[1], d[0], d[2]) %}      # IFF
                | implies           {% id %}
implies     -> implies "→" xor      {% (d) => new Implies(d[1], d[0], d[2]) %}  # Implies (if)
                | xor               {% id %}
xor         -> xor "⊕" or           {% (d) => new Xor(d[1], d[0], d[2]) %}      # Exclusive Or
                | or                {% id %}
or          -> or "∨" and           {% (d) => new Or(d[1], d[0], d[2]) %}       # Inclusive Or
                | and               {% id %}
and         -> and "∧" not          {% (d) => new And(d[1], d[0], d[2]) %}      # And
                | not               {% id %}
not         -> "¬" not              {% (d) => new Not(d[0], d[1], null) %}      # Negation
                | paren             {% id %}
paren       -> "(" proposition ")"  {% (d) => new Paren(null, d[1], null) %}    # Handle parentheses
                | var               {% id %}
var         -> [a-zA-Z]             {% (d) => new Atom(null, d[0], null) %}     # Var
