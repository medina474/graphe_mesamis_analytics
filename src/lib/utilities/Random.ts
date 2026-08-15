import { MersenneTwister19937, Random as RandomJS } from "random-js";
//import jstat from "jstat";

export class Random {
  private static engine = MersenneTwister19937.autoSeed();

  private static random = new RandomJS(Random.engine);

  /**
   * Initialise le générateur avec une graine.
   */
  static seed(seed: number): void {
    this.engine = MersenneTwister19937.seed(seed);
    this.random = new RandomJS(this.engine);
  }

  /**
   * Réel entre 0 et 1.
   */
  static next(): number {
    return this.random.real(0, 1, false);
  }

  /**
   * Entier inclusif.
   */
  static int(min: number, max: number): number {
    return this.random.integer(min, max);
  }

  /**
   * Réel.
   */
  static float(min: number, max: number): number {
    return this.random.real(min, max, false);
  }

  /**
   * Booléen.
   */
  static bool(probability = 0.5): boolean {
    return this.next() < probability;
  }

  /**
   * Choix uniforme.
   */
  static choice<T>(array: readonly T[]): T {
    if (!array || array.length === 0) throw new Error("Empty array");

    return array[this.int(0, array.length - 1)];
  }

  /**
   * Choix pondéré.
   */
  static weightedChoice<T>(
    values: readonly T[],
    weights: readonly number[],
  ): T {
    if (values.length !== weights.length)
      throw new Error("values/weights size mismatch");

    const total = weights.reduce((a, b) => a + b, 0);

    let r = this.float(0, total);

    for (let i = 0; i < values.length; i++) {
      r -= weights[i];

      if (r <= 0) return values[i];
    }

    return values[values.length - 1];
  }

  /**
   * Mélange un tableau
   */
  static shuffle<T>(array: T[]): T[] {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  /**
   * Distribution normale (gaussien) entre 0 et 1
   * @returns number
   */
  static normal(mean: number, sigma: number): number {
    let u = 0;
    let v = 0;

    while (u === 0) u = Random.next();
    while (v === 0) v = Random.next();

    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);

    return mean + sigma * z;
  }

  static normalRange(min: number, max: number): number {
    const mean = (min + max) / 2;
    const sigma = (max - min) / (2 * 2.3);

    return Random.normal(mean, sigma)
  }
  /**
   *
   * @param a Simularité cosinus entre deux vecteurs.
   * @param b
   * @returns
   */
  static cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] ** 2;
      normB += b[i] ** 2;
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Génère une valeur selon une loi Beta(alpha, beta).
   *
   * @param alpha paramètre de forme α (> 0)
   * @param beta paramètre de forme β (> 0)
   * @returns une valeur comprise entre 0 et 1
   */
  static beta(alpha: number, beta: number): number {
    if (alpha <= 0 || beta <= 0) {
      throw new Error(
        "Les paramètres alpha et beta doivent être strictement positifs",
      );
    }

    const x = this.gamma(alpha);
    const y = this.gamma(beta);

    return x / (x + y);
  }

  /**
   * Génère une variable suivant une loi Gamma(shape, 1).
   */
  static gamma(shape: number): number {
    if (shape <= 0) {
      throw new Error(
        "Le paramètre shape doit être strictement positif",
      );
    }

    // Algorithme de Marsaglia et Tsang
    if (shape < 1) {
      return (
        this.gamma(shape + 1) *
        Math.pow(Math.random(), 1 / shape)
      );
    }

    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);

    while (true) {
      let x: number;
      let v: number;

      do {
        x = this.normalN();
        v = 1 + c * x;
      } while (v <= 0);

      v = v * v * v;

      const u = Math.random();

      if (
        u < 1 - 0.0331 * x ** 4 ||
        Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))
      ) {
        return d * v;
      }
    }
  }

  /**
   * Génère une variable suivant une loi normale N(0, 1).
   */
  static normalN(): number {
    // Méthode Box-Muller
    let u = 0;
    let v = 0;

    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();

    return Math.sqrt(-2 * Math.log(u)) *
      Math.cos(2 * Math.PI * v);
  }

  static around(x: number, y: number, radius: number) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius;

    return {
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
    };
  }

  static circle(x: number, y: number, radius: number) {
    const angle = Math.random() * Math.PI * 2;

    return {
      x: x + Math.cos(angle) * radius,
      y: y + Math.sin(angle) * radius,
    };
  }
}
