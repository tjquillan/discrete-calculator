// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
  return d[0]
}
declare var assignment: any
declare var lBracket: any
declare var rBracket: any
declare var emptyset: any
declare var comma: any
declare var symbol: any
declare var lParen: any
declare var rParen: any

// eslint-disable-next-line import/first
import { getNamedSet } from "./ast"
// eslint-disable-next-line import/first
import { List, Set } from "immutable"

// eslint-disable-next-line import/first
import moo from "moo"

const lexer = moo.compile({
  lBracket: /\\lbrace\s?/,
  rBracket: /\\rbrace/,
  lParen: "(",
  rParen: ")",
  comma: ",",
  emptyset: /\\emptyset/,
  assignment: { match: /[a-zA-Z]=/, value: (x) => x.slice(0, 1) },
  symbol: /[a-zA-Z0-9]+/
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
    {
      name: "assignment",
      symbols: [lexer.has("assignment") ? { type: "assignment" } : assignment, "set"],
      postprocess: (d) => getNamedSet(d[0], d[1])
    },
    {
      name: "set",
      symbols: [
        lexer.has("lBracket") ? { type: "lBracket" } : lBracket,
        "items",
        lexer.has("rBracket") ? { type: "rBracket" } : rBracket
      ],
      postprocess: (d) => Set(d[1])
    },
    { name: "set", symbols: [lexer.has("emptyset") ? { type: "emptyset" } : emptyset], postprocess: () => Set() },
    { name: "items$ebnf$1", symbols: [] },
    {
      name: "items$ebnf$1$subexpression$1$ebnf$1",
      symbols: [lexer.has("comma") ? { type: "comma" } : comma],
      postprocess: id
    },
    { name: "items$ebnf$1$subexpression$1$ebnf$1", symbols: [], postprocess: () => null },
    { name: "items$ebnf$1$subexpression$1", symbols: ["items$ebnf$1$subexpression$1$ebnf$1", "item"] },
    {
      name: "items$ebnf$1",
      symbols: ["items$ebnf$1", "items$ebnf$1$subexpression$1"],
      postprocess: (d) => d[0].concat([d[1]])
    },
    { name: "items", symbols: ["items$ebnf$1"], postprocess: (d) => d[0].map((i: Array<string>) => i[1]) },
    { name: "item", symbols: [lexer.has("symbol") ? { type: "symbol" } : symbol], postprocess: (d) => d[0].value },
    { name: "item", symbols: ["set"], postprocess: id },
    { name: "item", symbols: ["tuple"], postprocess: id },
    {
      name: "tuple",
      symbols: [
        lexer.has("lParen") ? { type: "lParen" } : lParen,
        lexer.has("symbol") ? { type: "symbol" } : symbol,
        lexer.has("comma") ? { type: "comma" } : comma,
        lexer.has("symbol") ? { type: "symbol" } : symbol,
        lexer.has("rParen") ? { type: "rParen" } : rParen
      ],
      postprocess: (d) => List([d[1].value, d[3].value])
    }
  ],
  ParserStart: "assignment"
}

export default grammar
