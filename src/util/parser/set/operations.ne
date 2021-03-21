# @preprocessor typescript

@{%
// eslint-disable-next-line import/first
//import moo from 'moo'
const moo = require('moo')

const lexer = moo.compile({
  union:      /\\cup /,
  intersect:  /\\cap /,
  not:        /\\not /,
  supset:     /\\supset /,
  supseteq:   /\\supseteq /,
  nsupseteq:  /\\nsupseteq /,
  subset:     /\\supset /,
  subseteq:   /\\subseteq /,
  nsubseteq:  /\\nsubseteq /,
  difference: /- /,
  lparen:     /\(/,
  rparen:     /\)/,
  symbol:     /[A-Z]/
})
%}

setoperation  ->  operand
operand       ->  operand %union operand        # Union
               |  operand %intersect operand    # Intersection
               |  operand %difference operand   # Difference
               |  operand %supset operand       # Perfect Superset
               |  operand %supseteq operand     # Superset
               |  operand %not %supset operand  # Not Perfect Superset
               |  operand %nsupseteq operand    # Not Superset
               |  operand %subset operand       # Perfect Subset
               |  operand %subseteq operand     # Subset
               |  operand %not %subset operand  # Not Perfect Subset
               |  operand %nsubseteq operand    # Not Subset
paren         ->  %lparen setoperation %rparen

