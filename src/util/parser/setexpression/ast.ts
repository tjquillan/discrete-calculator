export type Node =
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
