import { DirectedGraph } from "graphology";
import { Person, Gender } from "../models/Person.js";
import { Address } from "../models/Address.js";
import { Random } from "../utilities/Random.js";

export class AddressGenerator {

    private addressesDisponibles: Address[]

    constructor(
        private graph: DirectedGraph,
        private addresses: Address[],
        private divorceRate: number = 0.05,
    ) {
        this.addressesDisponibles = [...this.addresses];
    }

    public generate(person: Person) {
        // Si marié faire habiter aussi le conjoint et les enfants de -21ans
        // Dans x% des cas les personnes sont séparées
        // Si c'est le cas traiter le cas des enfants

        if (this.addressesDisponibles.length == 0) {
            console.warn('Aucune adresse disponible pour cette personne')
            return;
        }

        const index = Random.int(0, this.addressesDisponibles.length)

        // Permettre la cohabitation entre personnes "amies"
        const address = this.addressesDisponibles.splice(index, 1)[0];

        person.address = address;

        if (person.spouse) {
            let withChildren: boolean = true;
            if (Math.random() <= (1 - this.divorceRate)) {
                person.spouse.address = address
            } else {
                if (person.gender == Gender.Female) {
                    withChildren = (Math.random() <= 0.90)
                }
            }

            if (withChildren && person.children) {
                for (const child of person.children.filter(c => c.age < Random.int(18, 22))) {
                    child.address = address
                }
            }
        }
    }

    public generateAll(persons: Person[]) {
            console.log(`----------------------------------------
Logement
----------------------------------------`);

        // Pensions de famille
        let boarders = persons.filter(person =>
            !person.address &&
            person.gender === Gender.Female &&
            person.age >= 64 &&
            !person.spouse &&
            !person.address
        );

        console.log(`Pensions de famille potentielles : ${boarders.length}`)

        for (const person of boarders.slice(0, Math.min(boarders.length, Random.int(5, 10)))) {
            console.log(`Pension de famille : ${person.firstname} (${person.age})`);

            if (person.address) continue;
            this.generate(person)

            // Trouver les pensionnaires
            const residents = persons.filter(person =>
                !person.address &&
                !person.spouse &&
                person.father == null && person.mother == null &&
                person.age >= 18 && person.age < 55 &&
                person.children.length == 0
            );

            if (residents.length == 0) {
                console.log("Pas de résidents disponibles");
                break;
            }

            Random.shuffle(residents)

            for (const resident of residents.slice(0, Random.int(2, 7))) {
                resident.address = person.address
                console.log(`Résident : ${resident.firstname} (${resident.age})`);
            }
        }


        // Gérer les jeunes filles au pair
        const families = persons.filter(person =>
            !person.address &&
            person.spouse &&
            person.children?.some(child => child.age < 12)
        );

        console.log(`Familles d'accueil potentielles : ${families.length}`)

        for (const family of families.slice(0, Math.min(boarders.length, Random.int(7, 15)))) {
            if (!family.address) {
                this.generate(family)
            }

            // Trouver les jeunes filles au pair

            const girls = persons.filter(person =>
                !person.address &&
                !person.spouse &&
                person.age >= 18 && person.age < 27 &&
                person.gender == Gender.Female &&
                person.father == null && person.mother == null &&
                person.children.length == 0 &&
                person.work == null
            );

            //console.log(`Jeunes filles : ${girls.length}`)

            Random.shuffle(girls)

            if (girls.length > 0) {
                girls[0].address = family.address
                console.log(`Jeune fille au pair : ${girls[0].firstname} ( ${girls[0].age})`)
            }
        }

        // Colocataires
        const jeunes = [...persons.filter(person =>
            !person.address &&
            !person.spouse &&
            person.age >= 18 && person.age < 28 &&
            person.children.length == 0
        )];

        console.log(`Célibataires de moins de 28 ans : ${jeunes.length}`)
        Random.shuffle(jeunes)

        let colocation = Random.int(7, 15);

        while (colocation > 0 && jeunes.length > 0) {
            const jeune = jeunes.splice(0, 1)[0];
            this.generate(jeune)
            console.log(`* ${jeune.firstname} (${jeune.age})`)
            for (const j of jeunes.splice(0, Random.int(0, 3) + 1)) {
                j.address = jeune.address
                console.log(`- ${j.firstname} (${j.age})`)
            }

            colocation--;
        }

        // En triant du plusâgé au plus jeune , on s'assure que les enfants sont logés auprès de leurs parents.
        for (const person of persons.filter(p => p.age > 18)
          .sort((a, b) => b.age - a.age)) {
            if (!person.address) {
                this.generate(person)
            }
        }
    }
}
