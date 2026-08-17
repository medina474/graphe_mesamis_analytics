import { Person } from "../models/Person.js";
import { Copy, Loan } from "../models/Book.js";
import type { GenreInfo } from "../models/Book.js"
import { Random } from "../utilities/Random.js";
import { exportObjectsToCsv } from "../utilities/CSVExporter.js";

export class LoanGenerator {
  private copiesAvalaiblesCurrentDay: Copy[] = [];

  constructor(
    private readonly personnes: Person[],
    private readonly copies: Copy[],
    private readonly genres: Record<string, GenreInfo>,
  ) {
    const genresNames = Object.keys(genres);
    this.personnes
      .filter((p) => Object.keys(p.interestTags).length === 0)
      .forEach((p) => {
        const genre =
          genresNames[Math.floor(Math.random() * genresNames.length)];
        p.interestTags[genre] = 1;
      });
  }

  generate(nombrePrets: number, dateDebut: Date = new Date()): Loan[] {
    console.log(`Prêts`);
    console.log(`----------------------------------------`);
    const prets: Loan[] = [];

    /* Au départ toutes les personnes sont disponibles
     */
    for (const personne of this.personnes) {
      personne.availableAt = dateDebut;
    }

    /* Au départ le détenteur est le propriétaire du livre
     * Le livre est immédiatement disponible
     * Les propriétaires ont déja lus leurs livres
     */
    for (const copy of this.copies) {
      copy.availableAt = dateDebut;
      copy.owner.oeuvresLues.add(copy.book);
    }

    const maintenant = new Date(dateDebut);
    let currentDay = this.startOfDay(maintenant);
    let backupDayTime = currentDay.getTime() - 1;
    let pretsToday = 0;
    let dailyQuota = this.dailyPrets();
    let index = 1;

    while (prets.length < nombrePrets) {
      /*
       * Nouveau jour ?
       * Recalcul d'un quota pour la journée.
       *  Retour éventuels des prêts
       */
      if (currentDay.getTime() !== backupDayTime) {
        pretsToday = 0;
        /*
         * Combien de prêts sont prévus ce jour  ?
         */
        dailyQuota = this.dailyPrets();
        backupDayTime = currentDay.getTime(); // Copie la valeur pas la référence

        /*
         * Quels sont les copies disponible aujourd'hui ?
         */
        this.copiesAvalaiblesCurrentDay = this.copies.filter((c) => {
          return c.availableAt <= currentDay;
        });

        /*
        console.log(
          `${currentDay.toLocaleDateString("fr-FR")} : ${dailyQuota} copies prévues | ${this.copiesAvalaiblesCurrentDay.length} copies disponibles.`,
        );
        */
      }

      /*
       * Quota journalier de prêts atteint ?
       * On incrémente d'un jour
       * Retour des exemplaires à leur propriétaire
       */
      if (pretsToday >= dailyQuota) {
        currentDay = this.startOfNextDay(currentDay);

        this.copies
          .filter((c) => c.availableAt < currentDay && c.holder != c.owner)
          .forEach((c) => {
            if (Math.random() < 0.005) {
              c.holder = c.owner;
              let pret_precedent = this.dernierPret(prets, c);
              if (pret_precedent) {
                pret_precedent.returnedDate = currentDay;
              } else {
                console.warn(`Retour sans prêt`);
              }
            }
          });

        continue;
      }

      /*
       * On cherche les personnes qui peuvent
       * emprunter à cet instant.
       */
      const candidats = this.getCandidats(currentDay);

      if (candidats.length === 0) {
        console.info("Aucun candidat disponible");

        // Aucun candidat pour l'instant : avancer d'un jour.
        currentDay = this.startOfNextDay(currentDay);
        continue;
      }

      /*
       * Le score de lecture utilisé ici est
       * celui du début de la simulation.
       */
      const emprunteur = this.tirerPersonne(candidats);

      const copy = this.choisirExemplaire(emprunteur);

      if (!copy) {
        /*
         * Cette personne ne dispose finalement d'aucun livre compatible.
         * Elle doit attendre 7 jours pour être de nouveau disponible et laisser la chance à d'autres
         */

        /*
        console.log(
          `Pas de copie compatible pour ${emprunteur.firstname} ${Object.keys(emprunteur.interestTags).join(", ")}`,
        );
        */

        emprunteur.availableAt = new Date(
          currentDay.getTime() + Random.int(3, 8),
        );
        continue;
      }

      const preteur = copy.holder;

      const duree = this.dureePret();

      const fin = new Date(currentDay.getTime() + duree);

      let pret_precedent;
      if (preteur != copy.owner) {
        pret_precedent = this.dernierPret(prets, copy);
      }

      const pret: Loan = {
        id: `loan_${index++}`,
        copy: copy,
        preteur,
        emprunteur,
        start: new Date(currentDay),
        end: fin,
        previous: pret_precedent,
      };

      /*
      console.log(
        `${pret.copy.id} | ${pret.copy.book.title} | ${pret.preteur.firstname} -> ${pret.emprunteur.firstname} ${pret.emprunteur.reading}`,
      );
      */

      prets.push(pret);
      pretsToday++;

      /*
       * Le livre change de détenteur.
       */
      copy.holder = emprunteur;

      /*
       * Le livre ne pourra pas être repris
       * avant la fin du prêt.
       */
      copy.availableAt = fin;

      /*
       * L'emprunteur ne pourra pas emprunter
       * un autre livre avant la fin de celui-ci.
       */
      emprunteur.availableAt = fin;

      /*
       * L'œuvre est maintenant considérée comme lue.
       *
       * Important : on utilise oeuvre.id et non
       * copy.id.
       */
      emprunteur.oeuvresLues.add(copy.book);

      for (const tag of copy.book.genres) {
        emprunteur.interestTags[tag] = (emprunteur.interestTags[tag] ?? 0) + 1;
      }

      // Stocker les séries en cours de lecture
      if (copy.book.serie) {
        emprunteur.series[copy.book.serie.id] = copy.book.order!;
      }
    }

    return prets;
  }

  private getCandidats(currentDay: Date): Person[] {
    return this.personnes.filter((personne) => {
      /*
       * La personne doit avoir terminé son prêt précédent.
       */
      if (personne.availableAt > currentDay) {
        return false;
      }

      /*
       * Une personne qui ne lit pas n'est pas candidate.
       * N'arrive jamais reading est compris entre 0 et 1
       */
      if (personne.reading <= 0) {
        return false;
      }

      /*
       * Existe-t-il au moins une copie disponible (some)
       * d'une œuvre jamais lue par la personne
       */
      return this.copiesAvalaiblesCurrentDay.some(
        (copy) => !personne.oeuvresLues.has(copy.book),
      );
    });
  }

  private choisirExemplaire(emprunteur: Person): Copy | null {
    // Les oeuvres sont celles qui sont disponibles ce jour
    // et qui n'ont pas été lues par l'emprunteur
    // qui ont comme genre le ou les genres préférés de l'emprunteur
    const selection = this.copiesAvalaiblesCurrentDay.filter((copy) => {
      return (
        !emprunteur.oeuvresLues.has(copy.book) &&
        Object.keys(emprunteur.interestTags).some((t) =>
          copy.book.genres.includes(t),
        )
      );
    });

    if (selection.length === 0) {
      return null;
    }

    const poids = selection.map((c) =>
      this.scoreExemplaire(emprunteur, c),
    );

    const total = poids.reduce((somme, p) => somme + p, 0);

    const drawIndex = (): number => {
      let tirage = Math.random() * total;
      let i = 0;
      for (; i < selection.length; i++) {
        tirage -= poids[i];
        if (tirage < 0) break;
      }
      if (i >= selection.length) i = selection.length - 1;
      return i;
    };

    let attempts = 0;
    let index = 0;

    while (attempts < 3) {
      index = drawIndex();

      // Si la sélection fait partie d'une série,
      // préférer le tome suivant si la série est en cours (ou le tome 1)
      if (selection[index].book.serie && selection[index].book.serie!.isOrdered) {
        const book = selection[index].book;
        const serieId = book.serie!.id;
        //console.log(`${book.serie!.label} ${book.order}`);

        const preferredOrder = emprunteur.series[serieId]
          ? emprunteur.series[serieId] + 1
          : 1;

        if (book.order === preferredOrder) {
          break;
        }

        // Chercher le tome préféré dans la sélection (copies disponibles aujourd'hui)
        const preferredIndex = selection.findIndex(
          (c) =>
            c.book.serie?.id === serieId && c.book.order === preferredOrder,
        );

        if (preferredIndex >= 0) {
          index = preferredIndex;
          console.log(`prends le tome ${preferredOrder} d'abord`);
          break;
        } else {
          console.log(`le tome ${preferredOrder} n'est pas disponible.`);
          // Faire jusqu'à 3 ré-essais d'un nouveau tirage pour choisir un autre exemplaire
          attempts++;

          if (attempts >= 3) {
            // Après 3 essais, abandonner
            console.log(
              `Abandon après ${attempts} essais, aucun autre exemplaire trouvé.`,
            );
            return null;
          }
        }
      }
      else {
        break;
      }
    }

    return selection[index];
  }

  /**
   * Le score est calculé à partir du nombre de genres en commun entre
   * la personne et le livre
   * @param emprunteur
   * @param copy
   * @returns
   */
  private scoreExemplaire(emprunteur: Person, copy: Copy): number {
    return (
      1 +
      copy.book.genres.reduce(
        (somme, genre) => somme + (emprunteur.interestTags[genre] ?? 0),
        0,
      )
    );
  }

  private tirerPersonne(personnes: Person[]): Person {
    const total = personnes.reduce(
      (somme, personne) => somme + personne.reading,
      0,
    );

    let tirage = Math.random() * total;

    for (const personne of personnes) {
      tirage -= personne.reading;

      if (tirage <= 0) {
        return personne;
      }
    }

    return personnes[personnes.length - 1];
  }

  private dureePret(): number {
    /*
     * Entre 7 et 21 jours inclus.
     */
    const jours = Random.normalRange(7, 21);

    return jours * 24 * 60 * 60 * 1000;
  }

  private dernierPret(prets: Loan[], copy: Copy): Loan | undefined {
    const finds = prets
      .filter((p) => p.copy == copy)
      .sort((a, b) => b.end.getTime() - a.end.getTime());
    return finds.length > 0 ? finds[0] : undefined;
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private startOfNextDay(date: Date): Date {
    const start = this.startOfDay(date);
    return new Date(start.getTime() + 24 * 60 * 60 * 1000);
  }

  private dailyPrets(): number {
    return 2 + Math.floor(Math.random() * 4);
  }
}
