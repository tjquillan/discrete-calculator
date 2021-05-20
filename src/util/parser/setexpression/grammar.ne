@preprocessor typescript


# @{%
# const moo = require('moo')

# function createNode(id, left, right) {
#   return {
#     id: id,
#     left: left,
#     right: right
#   }
# }
# %}

@{%
// eslint-disable-next-line import/first
import { createNode } from './ast'
// eslint-disable-next-line import/first
import moo from 'moo'
%}

@{%
const lexer = moo.compile({
  union:      /\\cup\s?/,
  intersect:  /\\cap\s?/,
  not:        /\\not\s?/,
  supset:     /\\supset\s?/,
  supseteq:   /\\supseteq\s?/,
  nsupseteq:  /\\nsupseteq\s?/,
  subset:     /\\supset\s?/,
  subseteq:   /\\subseteq\s?/,
  nsubseteq:  /\\nsubseteq\s?/,
  emptyset:   /\\emptyset/,
  difference: /-\s?/,
  lparen:     /\(/,
  rparen:     /\)/,
  symbol:     /[A-Z]/
})

%}

@lexer lexer

# TODO: Resolve parser ambiguity
setoperation      ->  exclusiveoperand              {% id %}
exclusiveoperand  ->  operand %supset operand       {% (d) => createNode("psupset", d[0], d[2]) %}      # Perfect Superset
                   |  operand %supseteq operand     {% (d) => createNode("supset", d[0], d[2]) %}       # Superset
                   |  operand %not %supset operand  {% (d) => createNode("npsupset", d[0], d[2]) %}     # Not Perfect Superset
                   |  operand %nsupseteq operand    {% (d) => createNode("nsupset", d[0], d[2]) %}      # Not Superset
                   |  operand %subset operand       {% (d) => createNode("psubset", d[0], d[2]) %}      # Perfect Subset
                   |  operand %subseteq operand     {% (d) => createNode("subset", d[0], d[2]) %}       # Subset
                   |  operand %not %subset operand  {% (d) => createNode("npsubset", d[0], d[2]) %}     # Not Perfect Subset
                   |  operand %nsubseteq operand    {% (d) => createNode("nsubset", d[0], d[2]) %}      # Not Subset
                   |  operand                       {% id %}
operand           ->  operand %union operand        {% (d) => createNode("union", d[0], d[2]) %}        # Union
                   |  operand %intersect operand    {% (d) => createNode("intersect", d[0], d[2]) %}    # Intersection
                   |  operand %difference operand   {% (d) => createNode("difference", d[0], d[2]) %}   # Difference
                   |  paren                         {% id %}
                   |  set                           {% id %}
paren             ->  %lparen operand %rparen       {% (d) => d[1] %}
set               ->  %symbol                       {% (d) => d[0].value %}
                   |  %emptyset                     {% (d) => d[0].value %}

