export type Results = { [expr: string]: boolean }

export abstract class TruthTableNode {
  constructor(
    public readonly symbol: string | null,
    public readonly left: TruthTableNode | string,
    public readonly right: TruthTableNode | null = null
  ) {}

  protected abstract operator(left: boolean, right: boolean | undefined): boolean

  /**
   *
   * @param values  Object containing the base values of each atom
   * @param storeResults If true the result of each evaluation will be stored in `values`
   */
  public evaluate(values: { [id: string]: boolean }, storeResults?: boolean): boolean {
    let value: boolean
    if (this instanceof Atom) {
      value = values[this.left as string]
    } else {
      value = this.operator(
        (this.left as TruthTableNode).evaluate(values, storeResults),
        this.right?.evaluate(values, storeResults)
      )
    }
    if (storeResults && !(this instanceof Paren)) {
      values[this.toString()] = value
    }
    return value
  }

  public toString(): string {
    return `${this.left}${this.symbol}${this.right}`
  }
}

export class Atom extends TruthTableNode {
  constructor(symbol: string | null, left: TruthTableNode | string, right: TruthTableNode | null = null) {
    super(symbol, left, right)
  }

  protected operator(): boolean {
    throw new Error("This should not get called!")
  }

  public toString() {
    return `${this.left}`
  }
}

export class Paren extends TruthTableNode {
  protected operator(left: boolean): boolean {
    return left
  }

  public toString() {
    return `(${this.left})`
  }
}

export class Not extends TruthTableNode {
  protected operator(left: boolean): boolean {
    return !left
  }

  public toString() {
    return `${this.symbol}${this.left}`
  }
}

export class And extends TruthTableNode {
  protected operator(left: boolean, right: boolean): boolean {
    return left && right
  }
}

export class Or extends TruthTableNode {
  protected operator(left: boolean, right: boolean): boolean {
    return left || right
  }
}

export class Xor extends TruthTableNode {
  protected operator(left: boolean, right: boolean): boolean {
    return left !== right
  }
}

export class Implies extends TruthTableNode {
  protected operator(left: boolean, right: boolean): boolean {
    return !left || right
  }
}

export class Iff extends TruthTableNode {
  protected operator(left: boolean, right: boolean): boolean {
    return left === right
  }
}
