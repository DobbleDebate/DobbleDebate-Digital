var decks = []
var animCard = null
var players = []
var storage = window.sessionStorage
var isFirstCard = true
var phase = 0
var isFirstJudge = true
var tmpPoints = -2
var firstPlayerTurnDone = false
var audioManager = new AudioManager();

const pro = 0
const con = 1
const ref = 2


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
    fetch('/Cards/Spark Cards/JSON/Spark.json')
        .then(response => response.json())
        .then(data => AddCards(data, 'Spark'))
    PositionScreen()
    audioManager.Play("SFX", "start")
}


//Dobbles Control
function AssignDobbles(){
    let pointDisplay = document.getElementById("dobble-results")
    let val = parseInt(pointDisplay.textContent)
    let nextPlayer
    let roleId = pro

    PlayDobblesAudio(val)
    
    if(!isFirstJudge)
        roleId = con
    
    for(let i = 0; i < players.length; i++){
        if(players[i].role == roleId){
            players[i].GiveDobbles(val)
            if(tmpPoints < val){
                tmpPoints = val
                leadingPlayer = players[i]
            }
        }else if(players[i].role == roleId + 1){
            nextPlayer = players[i]
        }
    }
    let imageDisplay = document.getElementById("judged-player")
    if(roleId == pro){
        imageDisplay.src = nextPlayer.conFilepath
        imageDisplay.alt = "arguing con - " + nextPlayer.altText
        isFirstJudge = false
    }else{
        ShowDobbleContainer(false)
        imageDisplay.tabIndex = -1
        AssignWinner()
        ShowWinnerContainer(true)
        isFirstJudge = true
    }

    pointDisplay.innerHTML = "0"
}

function ChangeDobbles(v){
    let pointDisplay = document.getElementById("dobble-results")
    let currentVal = parseInt(pointDisplay.textContent)
    let newVal = currentVal + v
    
    if(newVal <= 3 && newVal >= -1){
        pointDisplay.textContent = newVal
    }
}

function FindProPlayer(){
    for(let i = 0; i < players.length; i++){
        if (players[i].role == pro){
            return players[i]
        }
    }
}

function SetNewPoistions(){
    for(let i = 0; i < players.length; i++){
        players[i].role++
        if(players[i].role == players.length){
            players[i].role = 0;
        }
   }
   console.log(players)
   PreparePositions()
}

function PreparePositions(){
    let proImage = document.getElementById("pro-player")
    let conImage = document.getElementById("con-player")
    let refImage = document.getElementById("ref-player")
    for(let i = 0; i < players.length; i++){
        if(players[i].role == pro){
            proImage.src = players[i].proFilepath
            proImage.alt = "arguing pro - " + players[i].altText
        }else if(players[i].role == con){
            conImage.src = players[i].conFilepath
            conImage.alt = "arguing con - " + players[i].altText
        }else if(players[i].role == ref){
            refImage.src = players[i].refFilepath
            refImage.alt = "referee - " + players[i].altText
        }
    }
}

function PlayDobblesAudio(val){
    switch (val){
        case -1:
            audioManager.Play("SFX", "points-1")
            break;
        case 0:
            audioManager.Play("SFX", "points0")
            break;
        case 1:
            audioManager.Play("SFX", "points1")
            break;
        case 2:
            audioManager.Play("SFX", "points2")
            break;
        case 3:
            audioManager.Play("SFX", "points1")
            break;
        default:
            break;
    }
}

//Winners
function AssignWinner(){
    let winnerDisplay = document.getElementById("winner")
    winnerDisplay.src = leadingPlayer.filepath
    winnerDisplay.alt = leadingPlayer.altText
    winnerDisplay.tabIndex = 0
    tmpPoints = -2
}

function GameWinner(){
    let winnerDisplay = document.getElementById("winner")
    let currentLeader
    let currentLeaderPoints = -5

    for(let i = 0; i < players.length; i++){
        if(players[i].dobbles > currentLeaderPoints){
            currentLeader = players[i]
        }
    }
    winnerDisplay.src = currentLeader.filepath
    audioManager.Play("SFX", "win")
    ShowWinnerContainer(true)
}

//Containers and container control
function BlurContainer(b){
    let container = document.getElementById("game-container")
    if(b)
        container.classList.add("blur")
    else
        container.classList.remove("blur")
}

function AssignDobblesScreen(){
    EnableButton()
    let proPlayer = FindProPlayer()
    let imageDisplay = document.getElementById("judged-player")
    imageDisplay.src = proPlayer.proFilepath
    imageDisplay.tabIndex = 0;
    imageDisplay.alt = "arguing pro - " + proPlayer.altText
    BlurContainer(true)
    ShowDobbleContainer(true)
    MainTabIndexesEnabled(false)
    IsSecondCardTabIndexed(false)
}

function ShowDobbleContainer(b){
    let container = document.getElementById("dobble-container")
    container.hidden = !b
}

function ShowPositionsContainer(b){
    let container = document.getElementById("positions-container")
    container.hidden = !b
}

function ShowWinnerContainer(b){
    let container = document.getElementById("winner-container")
    container.hidden = !b
}

function ShowSparkContainer(b){
    let container = document.getElementById("spark-container")
    container.hidden = !b
}

function AfterWinnerContainer(){
    BlurContainer(false)
    ShowWinnerContainer(false)
    MainTabIndexesEnabled(true)
    let winnerDisplay = document.getElementById("winner")
    winnerDisplay.tabIndex = -1
}

function PositionScreen(){
    BlurContainer(true)
    MainTabIndexesEnabled(false)
    ShowPositionsContainer(true)
}

function AfterPositionScreen(){
    BlurContainer(false)
    ShowPositionsContainer(false)
    MainTabIndexesEnabled(true)
}

function Leaderboard(){
    for(let i = 0; i < players.length; i++){
        console.log(players[i].name + ":" + players[i].dobbles + " Dobbles")
    }
}

//Tab Indexing
function MainTabIndexesEnabled(b){
    let tabItems = document.getElementsByClassName("disable-tab-on-blur")
    for (let i = 0; i < tabItems.length; i++){
        if(b){
            tabItems[i].tabIndex = 0
            tabItems[i].hidden = false;
        }else{
            tabItems[i].tabIndex = -1
            tabItems[i].hidden = true;
        }
    }
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
        audioManager.Play("Situations", decks[1].cards[0].id)
    }
    EnableButton()
}

function AnimateDiscard(){
    for(let i = 0; i < animCard.length; i++){
        animCard[i].classList.add('discard')
        animCard[i].classList.remove('first-flip')
    }
    EnableButton()
    IsSecondCardTabIndexed(false)
    SetNewPoistions()
    setTimeout(function(){
        DrawCards(false)
        if(firstPlayerTurnDone && players[0].role == pro){
            GameWinner()
        }else{
            PositionScreen()
        }
        }, 1500)

    if(players[0].role == pro){
        firstPlayerTurnDone = true;
    }
}

//Card Population and deck control
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
    } else if (str == 'Spark'){
        index = 2
    }
    decks[index] = new Deck(d, str)
    decks[index].Shuffle()
    DrawCards(true)
}

function DrawCards(isFirstCard) {
    for (let i = 0; i < decks.length - 1; i++) {
        if (!isFirstCard) {
            if (decks[i].CardsInDeck > 1) {
                decks[i].Discard()
            } else {
                LastCard()
            }
        }
        console.log(decks[i])
        decks[i].RenderCard()
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

        if (i == 55) {
            breakSpace = lastKnownSpace
            endStrings[0] = str.substring(0, breakSpace + 1)

            if (characterArray.length <= 80) {
                endStrings[1] = str.substring(breakSpace + 1)
                return endStrings
            }

        }else if (i == 110) {
            endStrings[1] = str.substring(breakSpace, lastKnownSpace + 1)
            endStrings[2] = str.substring(lastKnownSpace + 1)
            return endStrings
        }
    }

    return endStrings
}

function EnableButton(){
    let phaseButtons = [document.getElementById("drawFirstCard"),
    document.getElementById("drawFirstCard-hover"), 
    document.getElementById("drawSecondCard"), 
    document.getElementById("drawSecondCard-hover"), 
    document.getElementById("debateBegins"),
    document.getElementById("debateBegins-hover"),
    document.getElementById("assignDobbles"),
    document.getElementById("assignDobbles-hover"), 
    document.getElementById("newRound"),
    document.getElementById("newRound-hover")]

    phase++
    if(phase == 5){
        phase = 0;
    }

    for(i = 0; i < phaseButtons.length; i+=2){
        if(i/2 == phase){
            phaseButtons[i].classList.add("is-in-phase")
            phaseButtons[i+1].classList.add("is-in-phase")
            phaseButtons[i].classList.remove("not-in-phase")
            phaseButtons[i+1].classList.remove("not-in-phase")
            phaseButtons[i].tabIndex = 0
            phaseButtons[i+1].tabIndex = 0
        }
        else{
            console.log("i:"+ i + "\nPhase Button:" + phaseButtons[i].id + "\nNext Button:" + phaseButtons[i+1].id)
            phaseButtons[i].classList.remove("is-in-phase")
            phaseButtons[i+1].classList.remove("is-in-phase")
            phaseButtons[i].classList.add("not-in-phase")
            phaseButtons[i+1].classList.add("not-in-phase")
            phaseButtons[i].onclick = function () {return false}
            phaseButtons[i+1].onclick = function () {return false}
            phaseButtons[i].tabIndex = -1
            phaseButtons[i+1].tabIndex = -1
        }
    }
    switch(phase){
        case 0:

            phaseButtons[0].onclick = function () {AnimateFlip(0)}
            phaseButtons[1].onclick = function () {AnimateFlip(0)}
            break;
        case 1:
            phaseButtons[2].onclick = function () {AnimateFlip(1)}
            phaseButtons[3].onclick = function () {AnimateFlip(1)}
            break;
        case 2:
            phaseButtons[4].onclick = function () {EnableButton()}
            phaseButtons[5].onclick = function () {EnableButton()}
            break;
        case 3:
            phaseButtons[6].onclick = function () {AssignDobblesScreen()}
            phaseButtons[7].onclick = function () {AssignDobblesScreen()}
            break;
        case 4:
            phaseButtons[8].onclick = function () {AnimateDiscard()}
            phaseButtons[9].onclick = function () {AnimateDiscard()}
            break;
    }
}

function LastCard(){
    EnableButton()
    for(let j = 0; j < bottomCard.length; j++){
        bottomCard[j].style.visibility = "hidden"
    }
}

//Spark Card
function SparkCard(){
    DrawSparkCard()
    BlurContainer(true)
    ShowSparkContainer(true)
    audioManager.Play("Spark", decks[2].cards[0].id)
}

function DrawSparkCard(){
    decks[2].RenderCard()
}

function CloseSparkContainer(){
    BlurContainer(false)
    ShowSparkContainer(false)
    audioManager.StopAllAudio()
}

//Save data management
function Load(){
    let tmpPlayers = JSON.parse(storage.getItem("players"))
    if(tmpPlayers == null){
        return;
    }else{
        for(i = 0; i < tmpPlayers.length; i++){
            tmpPlayers[i] = Object.assign(new Player(), tmpPlayers[i])
        }
    }
    players = tmpPlayers
}

function Save(){
    storage.setItem("players", players)
    storage.setItem("decks", decks)
}

function VerifyPlayers(){
    if(players == null || players.length < 3){
        window.location.href = "pre_03.html"
    }
}