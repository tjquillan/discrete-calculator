@preprocessor typescript

@{%
// eslint-disable-next-line import/first
import moo from 'moo'
// eslint-disable-next-line import/first
import {List, Set} from 'immutable'
// eslint-disable-next-line import/first
import { createNode } from './ast'
%}

# @{%
# const moo = require('moo')
# const { Set, List } = require('immutable')

# function createNode(id, left, right) {
#   return {
#     id: id,
#     left: left,
#     right: right
#   }
# }
# %}

@{%
const lexer = moo.compile({
  union:          /\\cup\b\s?/,
  intersect:      /\\cap\b\s?/,
  not:            /\\not\b\s?/,
  elementof:      /\\in\b\s?/,
  supset:         /\\supset\b\s?/,
  supseteq:       /\\supseteq\b\s?/,
  nsupseteq:      /\\nsupseteq\b\s?/,
  subset:         /\\subset\b\s?/,
  subseteq:       /\\subseteq\b\s?/,
  nsubseteq:      /\\nsubseteq\b\s?/,
  emptyset:       /\\emptyset\b/,
  pset:           /P\b/,
  cprod:          /\\times\b\s?/,
  difference:     /-\s?/,
  lParen:         /\(/,
  rParen:         /\)/,
  lBracket:       /\\left\\lbrace\s?/,
  rBracket:       /\\right\\rbrace/,
  comma:          /,/,
  equals:         /=/,
  setidentifier:  /[A-Z]\b/,
  symbol:         /[a-zA-Z0-9]+/
})
%}

@lexer lexer

# Master Rule
input             ->  assignment                              {% id %}
                   |  setexpression                           {% id %}

# Set Assignment Parser
assignment        ->  %setidentifier %equals set              {% (d) => [d[0].value, d[2]] %}

# Set Expression Parser
# TODO: Resolve parser ambiguity
setexpression     ->  exclusiveoperand                        {% id %}
exclusiveoperand  ->  element %elementof operand              {% (d) => createNode("elementof", d[0], d[2]) %}    # Element of
                   |  operand %supset operand                 {% (d) => createNode("psupset", d[0], d[2]) %}      # Perfect Superset
                   |  operand %supseteq operand               {% (d) => createNode("supset", d[0], d[2]) %}       # Superset
                   |  operand %not %supset operand            {% (d) => createNode("npsupset", d[0], d[2]) %}     # Not Perfect Superset
                   |  operand %nsupseteq operand              {% (d) => createNode("nsupset", d[0], d[2]) %}      # Not Superset
                   |  operand %subset operand                 {% (d) => createNode("psubset", d[0], d[2]) %}      # Perfect Subset
                   |  operand %subseteq operand               {% (d) => createNode("subset", d[0], d[2]) %}       # Subset
                   |  operand %not %subset operand            {% (d) => createNode("npsubset", d[0], d[2]) %}     # Not Perfect Subset
                   |  operand %nsubseteq operand              {% (d) => createNode("nsubset", d[0], d[2]) %}      # Not Subset
                   |  operand                                 {% id %}
operand           ->  %pset paren                             {% (d) => createNode("pset", d[1], d[1]) %}         # Power Set
                   |  operand %cprod operand                  {% (d) => createNode("cprod", d[0], d[2]) %}        # Cartesian Product
                   |  operand %union operand                  {% (d) => createNode("union", d[0], d[2]) %}        # Union
                   |  operand %intersect operand              {% (d) => createNode("intersect", d[0], d[2]) %}    # Intersection
                   |  operand %difference operand             {% (d) => createNode("difference", d[0], d[2]) %}   # Difference
                   |  paren                                   {% id %}
                   |  %setidentifier                          {% (d) => d[0].value %}
                   |  set                                     {% id %}
paren             ->  %lParen operand %rParen                 {% (d) => d[1] %}

# Set Parser
set               ->  %lBracket elements %rBracket            {% (d) => Set(d[1]) %}
                   |  %emptyset                               {% () => Set() %}
elements          ->  (%comma:? element):*                    {% (d) => d[0].map((i: Array<string>) => i[1]) %}
element           ->  symbol                                  {% id %}
                   |  tuple                                   {% id %}
                   |  set                                     {% id %}
tuple             ->  %lParen element %comma element %rParen    {% (d) => List([d[1], d[3]]) %}
symbol            ->  %symbol                                 {% (d) => d[0].value %}
                   |  %setidentifier                          {% (d) => d[0].value %}
