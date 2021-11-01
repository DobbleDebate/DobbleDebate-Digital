export default class Deck{
    constructor(c){
        this.cards = c
    }

    get CardsInDeck(){
        return this.cards.length
    }

    Shuffle(){
        for(let i = this.CardsInDeck - 1; i > 0; i--){
            
            //Find Indexes
            let newIndex = Math.floor(Math.random() * (i + 1));
            let oldCard = this.cards[newIndex]
            
            //Swap Cards
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldCard
        }
    }
}

export class AbilityCard{
    constructor(col = "Undefined Collection", id = "Unidentified ID", n = "Undefined Name", d = "Undefined Description"){
        this.collection = col
        this.id = id
        this.name = n
        this.description = d
    }
}

class SituationCard{
    constructor(id = "Undefined Collection", n = "Undefined Name", q, d = "Undefined Description", i){
        this.collection = id
        this.name = n
        this.quotation = q
        this.description = d
        this.cardArt = i
    }
}

class DobbleCard{
    constructor(v, i){
        this.value = v
        this.cardArt = i
    }
}