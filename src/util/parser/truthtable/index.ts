import * as nearley from "nearley"
import grammar from "./grammar"
import { Atom, Results, TruthTableNode } from "./ast"

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
const BASE_STATE = parser.save()

export function parse(string: string): TruthTableNode {
  parser.restore(BASE_STATE)
  parser.feed(string)
  return parser.results[0]
}

export function evaluate(ast: TruthTableNode, presets: Results): Results {
  const results: Results = { ...presets }
  ast.evaluate(results, true)
  return results
}

export function getVars(ast: TruthTableNode, vars?: Set<string>): Array<string> {
  if (!vars) {
    vars = new Set()
  }

  if (ast instanceof Atom) {
    vars.add(ast.left as string)
  }
  if (ast.left && typeof ast.left !== "string") {
    getVars(ast.left, vars)
  }
  if (ast.right) {
    getVars(ast.right, vars)
  }
  return Array.from(vars).sort()
}
