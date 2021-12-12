var decks = []
var animCard = null
var players = []
var storage = window.sessionStorage
var isFirstCard = true

const pro = 0
const con = 1
const ref = 2
const aud = 3


//Game Progression

//1: Show Positions
//2: Reveal First card
//3: Let players reveal second card
//4: Pro starts debate
//5: Con starts debate
//6: Rebuttal time
//7: Assigning Points
//8: Next turn

function StartGame() {
    Load()
    VerifyPlayers()
    PreparePositions()
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
    PositionScreen()
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
    MainTabIndexesEnabled(false)
    IsSecondCardTabIndexed(false)
}

function AssignDobbles(playerId, points){
    BlurContainer(false)
    ShowDobbleContainer(false)
    MainTabIndexesEnabled(true)
    IsSecondCardTabIndexed(true)
}

function PreparePositions(){
    let proImage = document.getElementById("pro-player")
    let conImage = document.getElementById("con-player")
    let refImage = document.getElementById("ref-player")
    for(let i = 0; i < players.length; i++){
        if(players[i].role == pro){
            proImage.src = players[i].proFilepath
        }else if(players[i].role == con){
            conImage.src = players[i].conFilepath
        }else if(players[i].role == ref){
            refImage.src = players[i].refFilepath
        }
    }
}

function PositionScreen(){
    BlurContainer(true)
    MainTabIndexesEnabled(false)
    ShowPositionsContainer(true)
}

function MainTabIndexesEnabled(b){
    let tabItems = document.getElementsByClassName("disable-tab-on-blur")
    for (let i = 0; i < tabItems.length; i++){
        if(b){
            tabItems[i].tabIndex = 0
        }else{
            tabItems[i].tabIndex = -1
        }
    }
}

function AfterPositionScreen(){
    BlurContainer(false)
    ShowPositionsContainer(false)
    MainTabIndexesEnabled(true)
    Animate()
    if(isFirstCard){
        isFirstCard = false
    }
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

function ShowPositionsContainer(b){
    let container = document.getElementById("positions-container")
    container.hidden = !b
}


function LastCard(){
    ToggleButtonDisable(true)
    for(let j = 0; j < bottomCard.length; j++){
        bottomCard[j].style.visibility = "hidden"
    }
}

function Animate(){
    if(!isFirstCard){
        AnimateDiscard()
    }else{ 
        DrawCards(isFirstCard)
        AnimateFlip(0)
    }
}

function AnimateDiscard(){
    for(let i = 0; i < animCard.length; i++){
        animCard[i].classList.add('discard')
        animCard[i].classList.remove('first-flip')
    }
    IsSecondCardTabIndexed(false)
    setTimeout(function(){
        DrawCards(false)
        AnimateFlip(0)
        }, 1500)
}

function IsSecondCardTabIndexed(b){
    let card = document.getElementById("situation-card")
    if(b){
        card.tabIndex = 0
    }else{
        card.tabIndex = -1
    }
}

function AnimateFlip(card){
    animCard[card].classList.add('first-flip')
    animCard[card].classList.remove('discard')
    if(card == 1){
        IsSecondCardTabIndexed(true)
    }
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

function Load(){
    players = JSON.parse(storage.getItem("players"))
}

function Save(){
    storage.setItem("players", players)
    storage.setItem("decks", decks)
}

function VerifyPlayers(){
    console.log(players)
    if(players == null || players.length < 3){
        window.location.href = "character-creation.html"
    }
}