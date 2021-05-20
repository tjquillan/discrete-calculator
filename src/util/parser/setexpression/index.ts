import type { Node } from "./ast"
import type { SetElement } from "../set/ast"
import * as nearley from "nearley"
import grammar from "./grammar"
import { Set } from "immutable"
import { setToString } from "../set"

type Sets = Map<string, Set<SetElement>>

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
const BASE_STATE = parser.save()

export function parseSetExpression(string: string): Node {
  parser.restore(BASE_STATE)
  parser.feed(string)
  return parser.results[0]
}

function boolToStr(bool: boolean): string {
  return bool ? "True" : "False"
}

function evalNode(node: Node, sets: Sets): Set<SetElement> {
  if (typeof node !== "string") {
    const leftNode = evalNode(node.left, sets)
    const rightNode = evalNode(node.right, sets)
    switch (node.id) {
      case "union":
        return leftNode.union(rightNode)
      case "intersect":
        return leftNode.intersect(rightNode)
      case "difference":
        return leftNode.filter((value) => !rightNode.contains(value))
      default:
        throw new Error(`Invalid ID: ${node.id}`)
    }
  } else if (node === "\\emptyset") {
    return Set()
  } else {
    const set = sets.get(node)
    if (set) {
      return set
    } else {
      throw new Error(`Invalid set: ${node}`)
    }
  }
}

export function evalSetExpression(exprAST: Node, sets: Sets): string {
  if (typeof exprAST !== "string") {
    let leftNode: Set<SetElement>, rightNode: Set<SetElement>
    switch (exprAST.id) {
      case "psupset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToStr(leftNode.isSuperset(rightNode) && leftNode.size > rightNode.size)
      case "supset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToStr(leftNode.isSuperset(rightNode))
      case "npsupset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToStr(!(leftNode.isSuperset(rightNode) && leftNode.size > rightNode.size))
      case "nsupset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToStr(!leftNode.isSuperset(rightNode))
      case "psubset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToStr(leftNode.isSubset(rightNode) && leftNode.size < rightNode.size)
      case "subset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToStr(leftNode.isSubset(rightNode))
      case "npsubset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToStr(!(leftNode.isSubset(rightNode) && leftNode.size < rightNode.size))
      case "nsubset":
        leftNode = evalNode(exprAST.left, sets)
        rightNode = evalNode(exprAST.right, sets)
        return boolToStr(!leftNode.isSubset(rightNode))
      default:
        return setToString(evalNode(exprAST, sets))
    }
  }
  return exprAST
}
