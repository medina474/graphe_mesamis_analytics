export class Point {
  constructor(
    public readonly id: string,
    public readonly nom: string,
    public readonly altitude: number,
    public readonly longitude: number,
    public readonly latitude: number,
  ) {
  }
}

export class Route {
  constructor(
    public readonly id: string,
    public readonly source: string,
    public readonly target: string,
    public readonly tag: string,
    public readonly directCost: number,
    public readonly inverseCost: number,
  ) {
  }
}
