// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
  return d[0]
}
declare var iff: any
declare var implies: any
declare var xor: any
declare var or: any
declare var and: any
declare var not: any
declare var lParen: any
declare var rParen: any
declare var symbol: any

// eslint-disable-next-line import/first
import moo from "moo"
// eslint-disable-next-line import/first
import { Atom, Paren, Not, And, Or, Xor, Implies, Iff } from "./ast"

const lexer = moo.compile({
  iff: /\\leftrightarrow\b\s?/,
  implies: /\\to\b\s?/,
  xor: /\\oplus\b\s?/,
  or: /\\vee\b\s?/,
  and: /\\wedge\b\s?/,
  not: /\\neg\b\s?/,
  lParen: /\(\s?/,
  rParen: /\)\s?/,
  symbol: /[a-zA-Z]/
})

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
  Lexer: lexer,
  ParserRules: [
    { name: "proposition", symbols: ["iff"], postprocess: id },
    {
      name: "iff",
      symbols: ["iff", lexer.has("iff") ? { type: "iff" } : iff, "implies"],
      postprocess: (d) => new Iff(d[1], d[0], d[2])
    },
    { name: "iff", symbols: ["implies"], postprocess: id },
    {
      name: "implies",
      symbols: ["implies", lexer.has("implies") ? { type: "implies" } : implies, "xor"],
      postprocess: (d) => new Implies(d[1], d[0], d[2])
    },
    { name: "implies", symbols: ["xor"], postprocess: id },
    {
      name: "xor",
      symbols: ["xor", lexer.has("xor") ? { type: "xor" } : xor, "or"],
      postprocess: (d) => new Xor(d[1], d[0], d[2])
    },
    { name: "xor", symbols: ["or"], postprocess: id },
    {
      name: "or",
      symbols: ["or", lexer.has("or") ? { type: "or" } : or, "and"],
      postprocess: (d) => new Or(d[1], d[0], d[2])
    },
    { name: "or", symbols: ["and"], postprocess: id },
    {
      name: "and",
      symbols: ["and", lexer.has("and") ? { type: "and" } : and, "not"],
      postprocess: (d) => new And(d[1], d[0], d[2])
    },
    { name: "and", symbols: ["not"], postprocess: id },
    {
      name: "not",
      symbols: [lexer.has("not") ? { type: "not" } : not, "not"],
      postprocess: (d) => new Not(d[0], d[1], null)
    },
    { name: "not", symbols: ["paren"], postprocess: id },
    {
      name: "paren",
      symbols: [
        lexer.has("lParen") ? { type: "lParen" } : lParen,
        "proposition",
        lexer.has("rParen") ? { type: "rParen" } : rParen
      ],
      postprocess: (d) => new Paren(null, d[1], null)
    },
    { name: "paren", symbols: ["atom"], postprocess: id },
    {
      name: "atom",
      symbols: [lexer.has("symbol") ? { type: "symbol" } : symbol],
      postprocess: (d) => new Atom(null, d[0].value, null)
    }
  ],
  ParserStart: "proposition"
}

export default grammar
