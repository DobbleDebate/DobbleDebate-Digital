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


//Comments from 10th meeting
//Try to show the Kibitzer roles
//Add rule/guidance to call on Kibitzer role
//Showcase some cards for loading screen
//Possibly type player name


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
            proImage.tabIndex = 0
        }else if(players[i].role == con){
            conImage.src = players[i].conFilepath
            conImage.alt = "arguing con - " + players[i].altText
            conImage.tabIndex = 0
        }else if(players[i].role == ref){
            refImage.src = players[i].refFilepath
            refImage.alt = "referee - " + players[i].altText
            refImage.tabIndex = 0
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
    let proImage = document.getElementById("pro-player")
    let conImage = document.getElementById("con-player")
    let refImage = document.getElementById("ref-player")
    proImage.tabIndex = 0
    conImage.tabIndex = 0
    refImage.tabIndex = 0
    if(isFirstCard){
        Animate()
        isFirstCard = false
    }
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

//Animation Control
function Animate(){
    if(!isFirstCard){
        AnimateDiscard()
    }else{ 
        DrawCards(isFirstCard)
        AnimateFlip(0)
    }
}

function AnimateFlip(card){
    animCard[card].classList.add('first-flip')
    animCard[card].classList.remove('discard')
    if(card == 1){
        IsSecondCardTabIndexed(true)
    }
    EnableButton()
}

function AnimateDiscard(){
    for(let i = 0; i < animCard.length; i++){
        animCard[i].classList.add('discard')
        animCard[i].classList.remove('first-flip')
    }
    IsSecondCardTabIndexed(false)
    SetNewPoistions()
    setTimeout(function(){
        DrawCards(false)
        AnimateFlip(0)
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
    console.log(decks[index].cards)
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

function EnableButton(){
    let sideButtons = [document.getElementById("drawSecondCard"), 
    document.getElementById("assignDobbles"),
    document.getElementById("drawCard")]
    
    for(i = 0; i < sideButtons.length; i++){
        if(i == phase)
            sideButtons[i].disabled = false
        else
            sideButtons[i].disabled = true
    }

    phase++
    if(phase == 3){
        phase = 0;
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
    for(i = 0; i < tmpPlayers.length; i++){
        tmpPlayers[i] = Object.assign(new Player(), tmpPlayers[i])
    }
    players = tmpPlayers
}

function Save(){
    storage.setItem("players", players)
    storage.setItem("decks", decks)
}

function VerifyPlayers(){
    if(players == null || players.length < 3){
        window.location.href = "character-creation.html"
    }
}