import { Book, Library, Serie } from "../models/Book.js";

export class LibrariesGenerator {
  constructor(
    private readonly books: Book[],
    private readonly libraries: Library[],
    private readonly series: Serie[],
  ) {}

  generate(library: Library): Book[] {
    // Au moins un des tags fait partie de la liste des tags de la bibliothèque
    const disponibles = this.books.filter((oeuvre) =>
      oeuvre.genres.some((genre) => library.genres.includes(genre)),
    );

    return this.tirerPondere(disponibles, library.genres, library.size);
  }

  /**
   * Dernier tome d'une série
   * @param oeuvre
   * @param resultat
   * @returns
   */
  private premierTome(oeuvre: Book, resultat: Book[]): number {

    // L'oeuvre ne fait pas partie d'une série où l'ordre est important.
    if (!oeuvre.serie || !oeuvre.serie.isOrdered || typeof oeuvre.order !== "number") {
      return -1;
    }

    const nbTomesPrecedents = resultat.filter(
      (book) => book.serie?.id === oeuvre.serie!.id,
    ).length;

    return nbTomesPrecedents + 1;
  }

  private score(oeuvre: Book, genres: string[]): number {
    return oeuvre.genres.filter((genre) => genres.includes(genre)).length;
  }

  private tirerPondere(
    oeuvres: Book[],
    tags: string[],
    nombre: number,
  ): Book[] {
    const disponibles = [...oeuvres];
    const resultat: Book[] = [];

    // Tant qu'il y a des livres disponibles et que la biblioyhèque n'est pas remplie
    while (disponibles.length > 0 && resultat.length < nombre) {
      const poids = disponibles.map((oeuvre) => this.score(oeuvre, tags));

      const total = poids.reduce((somme, poids) => somme + poids, 0);

      let tirage = Math.random() * total;
      let index = 0;

      for (; index < disponibles.length; index++) {
        tirage -= poids[index];

        if (tirage <= 0) {
          break;
        }
      }

      let choix = disponibles[index];
      const premierTome = this.premierTome(choix, resultat);

      if (premierTome > 0 && choix.order != premierTome) {
        // Le livre fait partie d'une série, il faut les ajouter dans l'ordre
        // Il ne faut pas le retirer pour autant des livres disponibles
        // Mais prendre le premier tome disponible de la série
        index = disponibles.findIndex(b => b.serie?.id == choix.serie!.id && b.order == premierTome)!
        choix = disponibles[index];
      }

      resultat.push(choix);
      disponibles.splice(index, 1);
    }

    return resultat;
  }

  generateAll() {
    for (const library of this.libraries) {
      library.books = this.generate(library);
    }

    for (const serie of this.series) {
      const suites = this.books.filter(b => b.serie == serie)
        .sort((a, b) => b.order! - a.order!)

      if (suites.length == 0) continue;

      serie.volumes = serie.volumesAvailable = suites[0].order || 0;
      while (serie.volumesAvailable > 0
        && !this.libraries.some(l => l.books.some(b => b.serie == serie && b.order == serie.volumesAvailable))) {
        serie.volumesAvailable--;
      }
    }
  }
}
