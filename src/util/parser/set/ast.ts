import type { List, Set } from "immutable"

export type SetElement = string | Set<SetElement> | List<SetElement>

export type Node = SetElement | SetExprNode

export type SetExprNode =
  | {
      id: string
      left: Node
      right: Node
    }
  | string

export function createNode(id: string, left: Node, right: Node): Node {
  return {
    id: id,
    left: left,
    right: right
  }
}
