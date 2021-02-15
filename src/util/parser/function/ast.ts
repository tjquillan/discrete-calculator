type FuntionData = { [id: string]: Set<string> }

export class DiscreteFunction {
  private functionData: FuntionData = {}

  public addTuple(a: string, b: string) {
    if (!this.functionData[a]) {
      this.functionData[a] = new Set()
    }
    this.functionData[a].add(b)
  }
}
