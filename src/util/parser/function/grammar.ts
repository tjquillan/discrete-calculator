// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
  return d[0]
}
// eslint-disable-next-line import/first
import { DiscreteFunction } from "./ast"
const func = new DiscreteFunction()
interface NearleyToken {
  value: any
  [key: string]: any
}

interface NearleyLexer {
  reset: (chunk: string, info: any) => void
  next: () => NearleyToken | undefined
  save: () => any
  formatError: (token: never) => string
  has: (tokenType: string) => boolean
}

interface NearleyRule {
  name: string
  symbols: NearleySymbol[]
  postprocess?: (d: any[], loc?: number, reject?: {}) => any
}

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean }

interface Grammar {
  Lexer: NearleyLexer | undefined
  ParserRules: NearleyRule[]
  ParserStart: string
}

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    { name: "_$ebnf$1", symbols: [] },
    { name: "_$ebnf$1", symbols: ["_$ebnf$1", "wschar"], postprocess: (d) => d[0].concat([d[1]]) },
    {
      name: "_",
      symbols: ["_$ebnf$1"],
      postprocess: function (d) {
        return null
      }
    },
    { name: "__$ebnf$1", symbols: ["wschar"] },
    { name: "__$ebnf$1", symbols: ["__$ebnf$1", "wschar"], postprocess: (d) => d[0].concat([d[1]]) },
    {
      name: "__",
      symbols: ["__$ebnf$1"],
      postprocess: function (d) {
        return null
      }
    },
    { name: "wschar", symbols: [/[ \t\n\v\f]/], postprocess: id },
    { name: "function", symbols: [{ literal: "{" }, "_", "comma", "_", { literal: "}" }], postprocess: () => func },
    { name: "comma$ebnf$1", symbols: [] },
    { name: "comma$ebnf$1$subexpression$1$ebnf$1", symbols: [{ literal: "," }], postprocess: id },
    { name: "comma$ebnf$1$subexpression$1$ebnf$1", symbols: [], postprocess: () => null },
    { name: "comma$ebnf$1$subexpression$1", symbols: ["comma$ebnf$1$subexpression$1$ebnf$1", "tuple"] },
    {
      name: "comma$ebnf$1",
      symbols: ["comma$ebnf$1", "comma$ebnf$1$subexpression$1"],
      postprocess: (d) => d[0].concat([d[1]])
    },
    {
      name: "comma",
      symbols: ["comma$ebnf$1"],
      postprocess: (d) =>
        d[0].map((e: Array<string>) => {
          const tuple = e[1][0]
          func.addTuple(tuple[0], tuple[1])
        })
    },
    {
      name: "tuple",
      symbols: [{ literal: "(" }, "_", "var", "_", { literal: "," }, "_", "var", "_", { literal: ")" }],
      postprocess: (d) => [[d[2], d[6]]]
    },
    { name: "var", symbols: [/[a-zA-Z0-9]/], postprocess: id }
  ],
  ParserStart: "function"
}

export default grammar
