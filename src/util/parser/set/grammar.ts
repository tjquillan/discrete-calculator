// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
  return d[0]
}
declare var setidentifier: any
declare var equals: any
declare var elementof: any
declare var supset: any
declare var supseteq: any
declare var not: any
declare var nsupseteq: any
declare var subset: any
declare var subseteq: any
declare var nsubseteq: any
declare var union: any
declare var intersect: any
declare var difference: any
declare var lParen: any
declare var rParen: any
declare var lBracket: any
declare var rBracket: any
declare var emptyset: any
declare var comma: any
declare var symbol: any

// eslint-disable-next-line import/first
import moo from "moo"
// eslint-disable-next-line import/first
import { List, Set } from "immutable"
// eslint-disable-next-line import/first
import { createNode } from "./ast"

const lexer = moo.compile({
  union: /\\cup\b\s?/,
  intersect: /\\cap\b\s?/,
  not: /\\not\b\s?/,
  elementof: /\\in\b\s?/,
  supset: /\\supset\b\s?/,
  supseteq: /\\supseteq\b\s?/,
  nsupseteq: /\\nsupseteq\b\s?/,
  subset: /\\subset\b\s?/,
  subseteq: /\\subseteq\b\s?/,
  nsubseteq: /\\nsubseteq\b\s?/,
  emptyset: /\\emptyset\b/,
  difference: /-\s?/,
  lParen: /\(/,
  rParen: /\)/,
  lBracket: /\\left\\lbrace\s?/,
  rBracket: /\\right\\rbrace/,
  comma: /,/,
  equals: /=/,
  setidentifier: /[A-Z]\b/,
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
    { name: "input", symbols: ["assignment"], postprocess: id },
    { name: "input", symbols: ["setexpression"], postprocess: id },
    {
      name: "assignment",
      symbols: [
        lexer.has("setidentifier") ? { type: "setidentifier" } : setidentifier,
        lexer.has("equals") ? { type: "equals" } : equals,
        "set"
      ],
      postprocess: (d) => [d[0].value, d[2]]
    },
    { name: "setexpression", symbols: ["exclusiveoperand"], postprocess: id },
    {
      name: "exclusiveoperand",
      symbols: ["element", lexer.has("elementof") ? { type: "elementof" } : elementof, "operand"],
      postprocess: (d) => createNode("elementof", d[0], d[2])
    },
    {
      name: "exclusiveoperand",
      symbols: ["operand", lexer.has("supset") ? { type: "supset" } : supset, "operand"],
      postprocess: (d) => createNode("psupset", d[0], d[2])
    },
    {
      name: "exclusiveoperand",
      symbols: ["operand", lexer.has("supseteq") ? { type: "supseteq" } : supseteq, "operand"],
      postprocess: (d) => createNode("supset", d[0], d[2])
    },
    {
      name: "exclusiveoperand",
      symbols: [
        "operand",
        lexer.has("not") ? { type: "not" } : not,
        lexer.has("supset") ? { type: "supset" } : supset,
        "operand"
      ],
      postprocess: (d) => createNode("npsupset", d[0], d[2])
    },
    {
      name: "exclusiveoperand",
      symbols: ["operand", lexer.has("nsupseteq") ? { type: "nsupseteq" } : nsupseteq, "operand"],
      postprocess: (d) => createNode("nsupset", d[0], d[2])
    },
    {
      name: "exclusiveoperand",
      symbols: ["operand", lexer.has("subset") ? { type: "subset" } : subset, "operand"],
      postprocess: (d) => createNode("psubset", d[0], d[2])
    },
    {
      name: "exclusiveoperand",
      symbols: ["operand", lexer.has("subseteq") ? { type: "subseteq" } : subseteq, "operand"],
      postprocess: (d) => createNode("subset", d[0], d[2])
    },
    {
      name: "exclusiveoperand",
      symbols: [
        "operand",
        lexer.has("not") ? { type: "not" } : not,
        lexer.has("subset") ? { type: "subset" } : subset,
        "operand"
      ],
      postprocess: (d) => createNode("npsubset", d[0], d[2])
    },
    {
      name: "exclusiveoperand",
      symbols: ["operand", lexer.has("nsubseteq") ? { type: "nsubseteq" } : nsubseteq, "operand"],
      postprocess: (d) => createNode("nsubset", d[0], d[2])
    },
    { name: "exclusiveoperand", symbols: ["operand"], postprocess: id },
    {
      name: "operand",
      symbols: ["operand", lexer.has("union") ? { type: "union" } : union, "operand"],
      postprocess: (d) => createNode("union", d[0], d[2])
    },
    {
      name: "operand",
      symbols: ["operand", lexer.has("intersect") ? { type: "intersect" } : intersect, "operand"],
      postprocess: (d) => createNode("intersect", d[0], d[2])
    },
    {
      name: "operand",
      symbols: ["operand", lexer.has("difference") ? { type: "difference" } : difference, "operand"],
      postprocess: (d) => createNode("difference", d[0], d[2])
    },
    { name: "operand", symbols: ["paren"], postprocess: id },
    {
      name: "operand",
      symbols: [lexer.has("setidentifier") ? { type: "setidentifier" } : setidentifier],
      postprocess: (d) => d[0].value
    },
    { name: "operand", symbols: ["set"], postprocess: id },
    {
      name: "paren",
      symbols: [
        lexer.has("lParen") ? { type: "lParen" } : lParen,
        "operand",
        lexer.has("rParen") ? { type: "rParen" } : rParen
      ],
      postprocess: (d) => d[1]
    },
    {
      name: "set",
      symbols: [
        lexer.has("lBracket") ? { type: "lBracket" } : lBracket,
        "elements",
        lexer.has("rBracket") ? { type: "rBracket" } : rBracket
      ],
      postprocess: (d) => Set(d[1])
    },
    { name: "set", symbols: [lexer.has("emptyset") ? { type: "emptyset" } : emptyset], postprocess: () => Set() },
    { name: "elements$ebnf$1", symbols: [] },
    {
      name: "elements$ebnf$1$subexpression$1$ebnf$1",
      symbols: [lexer.has("comma") ? { type: "comma" } : comma],
      postprocess: id
    },
    { name: "elements$ebnf$1$subexpression$1$ebnf$1", symbols: [], postprocess: () => null },
    { name: "elements$ebnf$1$subexpression$1", symbols: ["elements$ebnf$1$subexpression$1$ebnf$1", "element"] },
    {
      name: "elements$ebnf$1",
      symbols: ["elements$ebnf$1", "elements$ebnf$1$subexpression$1"],
      postprocess: (d) => d[0].concat([d[1]])
    },
    { name: "elements", symbols: ["elements$ebnf$1"], postprocess: (d) => d[0].map((i: Array<string>) => i[1]) },
    { name: "element", symbols: ["symbol"], postprocess: id },
    { name: "element", symbols: ["tuple"], postprocess: id },
    { name: "element", symbols: ["set"], postprocess: id },
    {
      name: "tuple",
      symbols: [
        lexer.has("lParen") ? { type: "lParen" } : lParen,
        "element",
        lexer.has("comma") ? { type: "comma" } : comma,
        "element",
        lexer.has("rParen") ? { type: "rParen" } : rParen
      ],
      postprocess: (d) => List([d[1], d[3]])
    },
    { name: "symbol", symbols: [lexer.has("symbol") ? { type: "symbol" } : symbol], postprocess: (d) => d[0].value },
    {
      name: "symbol",
      symbols: [lexer.has("setidentifier") ? { type: "setidentifier" } : setidentifier],
      postprocess: (d) => d[0].value
    }
  ],
  ParserStart: "input"
}

export default grammar
