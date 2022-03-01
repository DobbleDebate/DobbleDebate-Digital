class Deck {

    constructor(c, n) {
        this.cards = c
        this.name = n
        this.AssignElements()
    }

    get CardsInDeck() {
        return this.cards.length
    }

    AssignElements() {
        this.AssignQueryPrefix()
        this.AssignCardName()

        if (this.name != "Spark") {
            this.AssignCardDescription()
            this.AssignCardImage();
        } else {
            this.AssignSparkText()
        }
        if(this.name == 'Situation'){ 
            this.AssignCardQuotation()
        }
    }

    AssignQueryPrefix() {
        if (this.name == 'Ability') {
            this.queryPrefix = "#abil-"
        } else if (this.name == 'Situation') {
            this.queryPrefix = "#sit-"
        } else if (this.name == "Spark") {
            this.queryPrefix = "#spark-"
        }
    }

    AssignCardDescription() {
        this.cardDescriptionElements = [document.querySelector(this.queryPrefix + "desc-1"),
        document.querySelector(this.queryPrefix + "desc-2"),
        document.querySelector(this.queryPrefix + "desc-3")
        ]
    }

    AssignSparkText() {
        this.cardText = document.querySelector(this.queryPrefix + "textcontent")
    }


    AssignCardName() {
        this.cardNameElement = document.querySelector(this.queryPrefix + "name")
    }

    AssignCardQuotation() {
        this.cardQuotationElement = document.querySelector(this.queryPrefix + "quotation")
        this.cardQuotationAuthorElement = document.querySelector(this.queryPrefix + "author")
    }

    AssignCardImage(){
        this.cardImageElement = document.querySelector(this.queryPrefix + "image")
    }

    RenderCard() {
        this.cardNameElement.textContent = this.cards[0].name
        this.cardNameElement.ariaLabel = this.cards[0].name + "."

        if (this.name != "Spark") {

            this.cardDescriptionElements[0].textContent = this.cards[0].description1;
            this.cardDescriptionElements[1].textContent = this.cards[0].description2;
            this.cardDescriptionElements[2].textContent = this.cards[0].description3;
            this.cardImageElement.setAttribute("href", this.cards[0].img)

            if(this.name == 'Situation'){
                this.cardQuotationElement.textContent = "\"" + this.cards[0].description1 + "\""
                this.cardQuotationAuthorElement.textContent = "~" + this.cards[0].name
            }else{
                console.log(this.cards[0].link)
                let link = this.cards[0].link
                this.cardImageElement.onclick = function(){
                    window.open(link, '_blank').focus();
                }
            }
        }else{
            this.cardText.textContent = this.cards[0].text
        }
    }

    Discard() {
        this.cards.shift()
    }

    PlaceAtBottomOfDeck(){
        let card = this.cards[0]
        this.cards.shift()
        this.cards.push(card)
    }

    Shuffle() {
        for (let i = this.CardsInDeck - 1; i > 0; i--) {

            //Find Indexes
            let newIndex = Math.floor(Math.random() * (i + 1))
            let oldCard = this.cards[newIndex]

            //Swap Cards
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldCard
        }
    }
}