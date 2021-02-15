@preprocessor typescript
@{%// eslint-disable-next-line import/first
import { DiscreteFunction } from './ast'
const func = new DiscreteFunction()%}

@builtin "whitespace.ne"

function  ->  "{" _ comma _ "}"             {% () => func %}
comma     ->  (",":? tuple):*               {% (d) => d[0].map((e: Array<string>) => {
                                              const tuple = e[1][0]
                                              func.addTuple(tuple[0], tuple[1])
                                            }) %}
tuple     ->  "(" _ var _ "," _ var _ ")"   {% (d) => [[d[2], d[6]]] %}
var       ->  [a-zA-Z0-9]                   {% id %}
