// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
  return d[0]
}
// eslint-disable-next-line import/first
import { Atom, Paren, Not, And, Or, Xor, Implies, Iff } from "./ast"
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
    { name: "proposition", symbols: ["iff"], postprocess: id },
    { name: "iff", symbols: ["iff", { literal: "↔" }, "implies"], postprocess: (d) => new Iff(d[1], d[0], d[2]) },
    { name: "iff", symbols: ["implies"], postprocess: id },
    {
      name: "implies",
      symbols: ["implies", { literal: "→" }, "xor"],
      postprocess: (d) => new Implies(d[1], d[0], d[2])
    },
    { name: "implies", symbols: ["xor"], postprocess: id },
    { name: "xor", symbols: ["xor", { literal: "⊕" }, "or"], postprocess: (d) => new Xor(d[1], d[0], d[2]) },
    { name: "xor", symbols: ["or"], postprocess: id },
    { name: "or", symbols: ["or", { literal: "∨" }, "and"], postprocess: (d) => new Or(d[1], d[0], d[2]) },
    { name: "or", symbols: ["and"], postprocess: id },
    { name: "and", symbols: ["and", { literal: "∧" }, "not"], postprocess: (d) => new And(d[1], d[0], d[2]) },
    { name: "and", symbols: ["not"], postprocess: id },
    { name: "not", symbols: [{ literal: "¬" }, "not"], postprocess: (d) => new Not(d[0], d[1], null) },
    { name: "not", symbols: ["paren"], postprocess: id },
    {
      name: "paren",
      symbols: [{ literal: "(" }, "proposition", { literal: ")" }],
      postprocess: (d) => new Paren(null, d[1], null)
    },
    { name: "paren", symbols: ["var"], postprocess: id },
    { name: "var", symbols: [/[a-zA-Z]/], postprocess: (d) => new Atom(null, d[0], null) }
  ],
  ParserStart: "proposition"
}

export default grammar
