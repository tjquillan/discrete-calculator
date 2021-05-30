@preprocessor typescript

@{%
// eslint-disable-next-line import/first
import moo from 'moo'
// eslint-disable-next-line import/first
import {Atom, Paren, Not, And, Or, Xor, Implies, Iff} from './ast'
%}

@{%
const lexer = moo.compile({
  iff:      /\\leftrightarrow\b\s?/,
  implies:  /\\to\b\s?/,
  xor:      /\\oplus\b\s?/,
  or:       /\\vee\b\s?/,
  and:      /\\wedge\b\s?/,
  not:      /\\neg\b\s?/,
  lParen:   /\(\s?/,
  rParen:   /\)\s?/,
  symbol:   /[a-zA-Z]/
})
%}

@lexer lexer

proposition -> iff                          {% id %}
iff         -> iff %iff implies             {% (d) => new Iff(d[1], d[0], d[2]) %}        # IFF
             | implies                      {% id %}
implies     -> implies %implies xor         {% (d) => new Implies(d[1], d[0], d[2]) %}    # Implies (if)
             | xor                          {% id %}
xor         -> xor %xor or                  {% (d) => new Xor(d[1], d[0], d[2]) %}        # Exclusive Or
             | or                           {% id %}
or          -> or %or and                   {% (d) => new Or(d[1], d[0], d[2]) %}         # Inclusive Or
             | and                          {% id %}
and         -> and %and not                 {% (d) => new And(d[1], d[0], d[2]) %}        # And
             | not                          {% id %}
not         -> %not not                     {% (d) => new Not(d[0], d[1], null) %}        # Negation
             | paren                        {% id %}
paren       -> %lParen proposition %rParen  {% (d) => new Paren(null, d[1], null) %}      # Handle parentheses
             | atom                         {% id %}
atom        -> %symbol                      {% (d) => new Atom(null, d[0].value, null) %} # Var
