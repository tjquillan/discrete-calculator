// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
  return d[0]
}
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
declare var lparen: any
declare var rparen: any
declare var symbol: any
declare var emptyset: any

// eslint-disable-next-line import/first
import { createNode } from "./ast"
// eslint-disable-next-line import/first
import moo from "moo"

const lexer = moo.compile({
  union: /\\cup\s?/,
  intersect: /\\cap\s?/,
  not: /\\not\s?/,
  supset: /\\supset\s?/,
  supseteq: /\\supseteq\s?/,
  nsupseteq: /\\nsupseteq\s?/,
  subset: /\\supset\s?/,
  subseteq: /\\subseteq\s?/,
  nsubseteq: /\\nsubseteq\s?/,
  emptyset: /\\emptyset/,
  difference: /-\s?/,
  lparen: /\(/,
  rparen: /\)/,
  symbol: /[A-Z]/
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
    { name: "setoperation", symbols: ["exclusiveoperand"], postprocess: id },
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
    { name: "operand", symbols: ["set"], postprocess: id },
    {
      name: "paren",
      symbols: [
        lexer.has("lparen") ? { type: "lparen" } : lparen,
        "operand",
        lexer.has("rparen") ? { type: "rparen" } : rparen
      ],
      postprocess: (d) => d[1]
    },
    { name: "set", symbols: [lexer.has("symbol") ? { type: "symbol" } : symbol], postprocess: (d) => d[0].value },
    { name: "set", symbols: [lexer.has("emptyset") ? { type: "emptyset" } : emptyset], postprocess: (d) => d[0].value }
  ],
  ParserStart: "setoperation"
}

export default grammar
