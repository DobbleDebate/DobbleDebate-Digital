var decks = []
var animCard = null;
function StartGame() {
    document.querySelector("#drawCard").disabled = false
    animCardNL = document.querySelectorAll('.card__inner')
    bottomCardNL = document.querySelectorAll('.card__below')
    animCard = Array.prototype.slice.call(animCardNL)
    bottomCard = Array.prototype.slice.call(bottomCardNL)
    fetch('/Cards/Ability Cards/JSON/Abilities.json')
        .then(response => response.json())
        .then(data => AddCards(data, 'Ability'))
    fetch('/Cards/Situation Cards/JSON/Situations.json')
        .then(response => response.json())
        .then(data => AddCards(data, 'Situation'))
}

function AddCards(data, str) {
    let cards = []
    for (let i = 0; i < data['Base'].length; i++) {
        cards[i] = data['Base'][i]
    }
    BuildDeck(cards, str)
}

function BuildDeck(d, str) {
    let index
    if (str == 'Ability') {
        index = 0
    } else if (str == 'Situation') {
        index = 1
    }
    decks[index] = new Deck(d, str)
    decks[index].Shuffle()
    console.log(decks[index].cards)
    if(str == 'Situation'){
        Animate(true)
    }
}

function DrawCards(isFirstCard) {
    ToggleButtonDisable(true)
    for (let i = 0; i < decks.length; i++) {
        if (!isFirstCard) {
            if (decks[i].CardsInDeck > 1) {
                decks[i].Discard()
            } else {
                LastCard()
            }
        }
        decks[i].RenderCard()
    }
}

function AssignDobblesScreen(){
    ToggleButtonDisable(false)
    BlurContainer(true)
    ShowDobbleContainer(true)
}

function BlurContainer(b){
    let container = document.getElementById("game-container")
    if(b)
        container.classList.add("blur")
    else
        container.classList.remove("blur")
}

function ShowDobbleContainer(b){
    let container = document.getElementById("dobble-container")
    container.hidden = !b
}

function AssignDobbles(){
    BlurContainer(false)
    ShowDobbleContainer(false)
}

function LastCard(){
    ToggleButtonDisable(true)
    for(let j = 0; j < bottomCard.length; j++){
        bottomCard[j].style.visibility = "hidden"
    }
}

function Animate(isFirstCard){
    for(let i = 0; i < animCard.length; i++){
        if(!isFirstCard){
            animCard[i].classList.add('discard')
            animCard[i].classList.remove('first-flip')
            setTimeout(function(){
                animCard[i].classList.add('first-flip')
                animCard[i].classList.remove('discard')
            }, 1500)
        }else{ 
            animCard[i].classList.add('first-flip')
            DrawCards(isFirstCard)
        }
    }
    setTimeout(function(){DrawCards(isFirstCard)},1000)
}

function BreakString(str) {
    let characterArray = Array.from(str)
    let lastKnownSpace = 0
    let breakSpace = 0
    let endStrings = [str, "", ""]
    for (let i = 0; i < characterArray.length; i++) {
        if (characterArray[i] == " ") {
            lastKnownSpace = i
        }

        if (i == 40) {
            breakSpace = lastKnownSpace
            endStrings[0] = str.substring(0, breakSpace + 1)

            if (characterArray.length <= 80) {
                endStrings[1] = str.substring(breakSpace + 1)
                return endStrings
            }

        }else if (i == 80) {
            endStrings[1] = str.substring(breakSpace, lastKnownSpace + 1)
            endStrings[2] = str.substring(lastKnownSpace + 1)
            return endStrings
        }
    }

    return endStrings
}

function ToggleButtonDisable(b){
    document.getElementById("drawCard").disabled = b
    document.getElementById("assignDobbles").disabled = !b
}

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
        this.AssignCardDescription()
        this.AssignCardBullets()
        //if(this.name == 'Situation') this.AssignCardQuotation()
    }

    AssignQueryPrefix() {
        if (this.name == 'Ability') {
            this.queryPrefix = "#abil-"
        } else if (this.name == 'Situation') {
            this.queryPrefix = "#sit-"
        }
    }

    AssignCardDescription() {
        this.cardDescriptionElements = [document.querySelector(this.queryPrefix + "desc-1a"),
        document.querySelector(this.queryPrefix + "desc-1b"),
        document.querySelector(this.queryPrefix + "desc-1c"),
        document.querySelector(this.queryPrefix + "desc-2a"),
        document.querySelector(this.queryPrefix + "desc-2b"),
        document.querySelector(this.queryPrefix + "desc-2c"),
        document.querySelector(this.queryPrefix + "desc-3a"),
        document.querySelector(this.queryPrefix + "desc-3b"),
        document.querySelector(this.queryPrefix + "desc-3c")
        ]
    }

    AssignCardBullets() {
        this.cardBulletElements = [document.querySelector(this.queryPrefix + "bullet-1"),
        document.querySelector(this.queryPrefix + "bullet-2"),
        document.querySelector(this.queryPrefix + "bullet-3")
        ]
    }

    AssignCardName() {
        this.cardNameElement = document.querySelector(this.queryPrefix + "name")
    }

    AssignCardQuotation() {
        this.cardQuotationElement = document.querySelector(this.queryPrefix + "quotation")
        this.cardQuotationAuthorElement = document.querySelector(this.queryPrefix + "author")
    }

    RenderCard() {
        this.cardNameElement.textContent = this.cards[0].name

        let brokenString = BreakString(this.cards[0].description1)
        for (let i = 0; i < this.cardDescriptionElements.length; i++) {
            if (i >= 6) {
                brokenString = BreakString(this.cards[0].description3)
            } else if (i >= 3) {
                brokenString = BreakString(this.cards[0].description2)
            }
            this.cardDescriptionElements[i].textContent = brokenString[i % 3]
        }

        /*if(this.name == 'Situation'){
            this.cardQuotationElement.textContent = this.cards[0].quotation
            this.cardQuotationAuthorElement.textContent = this.cards[0].author
        }*/

        for (let i = 0; i < this.cardBulletElements.length; i++) {
            this.cardBulletElements[i].style.visibility = 'visible'
        }
    }

    Discard() {
        this.cards.shift()
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

class Player{
    constructor(n, a){
        this.name = n
        this.avatar = a
        this.dobbles = 0
    }

    GiveDobbles(val){
        this.dobbles += val
    }

    SetRole(){
    }
}