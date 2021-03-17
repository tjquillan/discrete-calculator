@preprocessor typescript
@{%
// eslint-disable-next-line import/first
import {getNamedSet} from './ast'
// eslint-disable-next-line import/first
import {List, Set} from 'immutable'
%}

@{%
// eslint-disable-next-line import/first
import moo from 'moo'

const lexer = moo.compile({
  lBracket:   /\\lbrace\s?/,
  rBracket:   /\\rbrace/,
  lParen:     '(',
  rParen:     ')',
  comma:      ',',
  emptyset:   /\\emptyset/,
  assignment: {match: /[a-zA-Z]=/, value: (x) => x.slice(0,1)},
  symbol:     /[a-zA-Z0-9]+/
})
%}

@lexer lexer

assignment  ->  %assignment set                         {% (d) => getNamedSet(d[0], d[1]) %}
set         ->  %lBracket items %rBracket               {% (d) => Set(d[1]) %}
             |  %emptyset                               {% () => Set() %}
items       ->  (%comma:? item):*                       {% (d) => d[0].map((i: Array<string>) => i[1]) %}
item        ->  %symbol                                 {% (d) => d[0].value %}
             |  set                                     {% id %}
             |  tuple                                   {% id %}
tuple       ->  %lParen %symbol %comma %symbol %rParen  {% (d) => List([d[1].value, d[3].value]) %}

