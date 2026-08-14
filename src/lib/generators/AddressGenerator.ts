import { DirectedGraph } from "graphology";
import { Person, Gender } from "../models/Person.js";
import { Address } from "../models/Address.js";
import { Random } from "../stats/Random.js";

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
        // Gérer les pensions de famille
        const candidates = persons.filter(person =>
            person.gender === Gender.Female &&
            person.age > 64 &&
            !person.spouse &&
            !person.address
        );
        const capacity = Random.int(2, 7);
        
        // Gérer les jeunes filles au pair
        const families = persons.filter(person =>
            person.spouse &&
            person.children?.some(child => child.age < 10)
        );

        const candidates = persons.filter(person =>
            !person.address &&
            !person.spouse &&
            person.age >= 18 &&
            person.age <= 30
        );
        
        // Gérer les cohabitations
        const jeunes = persons.filter(person =>
            !person.spouse &&
            person.age < 30  &&
            !person.address
        );

        console.log(`Nombre de célibataires de moins de 30 ans : ${jeunes.length}`)
        Random.shuffle(eligibles);
        
        for (const person of persons.sort((a, b) => b.age - a.age)) {
            if (!person.address) {
                this.generate(person)
            }
        }
    }
}
