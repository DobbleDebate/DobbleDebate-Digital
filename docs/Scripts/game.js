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
var hints;

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
    hints = document.getElementById("hints")
    PositionScreen()
    AddEnterListener()
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
        hints.innerHTML = "Referee, assign dobbles for the player arguing <b>con</b> (Range: -1 to +3)"
    }else{
        ShowDobbleContainer(false)
        imageDisplay.tabIndex = -1
        AssignWinner()
        ShowWinnerContainer(true)
        isFirstJudge = true
        hints.innerHTML = "Here's this round's winner! Continue when ready."
        document.getElementById("increment-dobbles").tabIndex = -1
        document.getElementById("decrease-dobbles").tabIndex = -1
        document.getElementById("submit-dobbles").tabIndex = -1
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
    document.getElementById("submit-winner").tabIndex = -1
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

    document.getElementById("increment-dobbles").tabIndex = 0
    document.getElementById("decrease-dobbles").tabIndex = 0
    document.getElementById("submit-dobbles").tabIndex = 0

    BlurContainer(true)
    ShowDobbleContainer(true)
    MainTabIndexesEnabled(false)
    IsSecondCardTabIndexed(false)
    hints.innerHTML = "Referee, assign dobbles for the player arguing <b>pro</b> (Range: -1 to +3)"
}

function ShowDobbleContainer(b){
    let container = document.getElementById("dobble-container")
    container.hidden = !b
}

function ShowPositionsContainer(b){
    let container = document.getElementById("positions-container")
    container.hidden = !b
}

function ShowScoreContainer(b){
    BlurContainer(b)
    MainTabIndexesEnabled(!b)
    let container = document.getElementById("scoreboard-container")
    container.hidden = !b
}

function ShowWinnerContainer(b){
    BlurContainer(b)
    let container = document.getElementById("winner-container")
    container.hidden = !b
}

function ShowSparkContainer(b){
    let container = document.getElementById("spark-container")
    container.hidden = !b
}

function AfterWinnerContainer(){
    ShowWinnerContainer(false)
    MainTabIndexesEnabled(true)
    let winnerDisplay = document.getElementById("winner")
    winnerDisplay.tabIndex = -1
    hints.innerHTML = "Click next round when ready for a new set of cards. Remember, if you need inspiration pick a spark!"
}

function PositionScreen(){
    BlurContainer(true)
    MainTabIndexesEnabled(false)
    ShowPositionsContainer(true)
    document.getElementById("pro-player").tabIndex = 0
    document.getElementById("con-player").tabIndex = 0
    document.getElementById("ref-player").tabIndex = 0
    document.getElementById("positions-button").tabIndex = 0
    hints.innerHTML = "Remember your new position!"
}

function AfterPositionScreen(){
    BlurContainer(false)
    ShowPositionsContainer(false)
    MainTabIndexesEnabled(true)
    document.getElementById("pro-player").tabIndex = -1
    document.getElementById("con-player").tabIndex = -1
    document.getElementById("ref-player").tabIndex = -1
    document.getElementById("positions-button").tabIndex = -1
    hints.innerHTML = "Click to show <b>ability</b>, then read out loud or sign the card for the group"
}

function Scoreboard(){

    let scoreboardRowElements = [document.getElementById("1st"),
        document.getElementById("2nd"),
        document.getElementById("3rd"),
        document.getElementById("4th"),
        document.getElementById("5th"),
        document.getElementById("6th"),
        document.getElementById("7th"),
        document.getElementById("8th"),
        document.getElementById("9th"),
        document.getElementById("10th")
    ]

    let scoreboardNameElements = [document.getElementById("1st-name"),
    document.getElementById("2nd-name"),
    document.getElementById("3rd-name"),
    document.getElementById("4th-name"),
    document.getElementById("5th-name"),
    document.getElementById("6th-name"),
    document.getElementById("7th-name"),
    document.getElementById("8th-name"),
    document.getElementById("9th-name"),
    document.getElementById("10th-name")
    ]

    let scoreboardScoreElements =[document.getElementById("1st-score"),
    document.getElementById("2nd-score"),
    document.getElementById("3rd-score"),
    document.getElementById("4th-score"),
    document.getElementById("5th-score"),
    document.getElementById("6th-score"),
    document.getElementById("7th-score"),
    document.getElementById("8th-score"),
    document.getElementById("9th-score"),
    document.getElementById("10th-score")
    ]

    let sortedPlayers = SortPlayersByDobbles()

    for (let i = sortedPlayers.length-1; i >= 0; i--){
        if(i == sortedPlayers.length - 1){
            for(let j = 0; j <= i; j++){
                scoreboardRowElements[j].hidden = false;
            }
        }

        let currentPlayer = sortedPlayers[i]

        console.log(currentPlayer)

        scoreboardNameElements[i].textContent = currentPlayer.name
        scoreboardScoreElements[i].textContent = currentPlayer.dobbles
    }

    ShowScoreContainer(true)
}

function SortPlayersByDobbles(){
    let n = players.length
    let sortedArray = players
    for (let i = 1; i < n; i++){
        let current = sortedArray[i]
        let j = i-1
        while((j > -1) && (current.dobbles > sortedArray[j].dobbles)){
            sortedArray[j+1] = sortedArray[j]
            j--
        }
        sortedArray[j+1] = current;
    }
    return sortedArray
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
        hints.innerHTML = "Start the debate, audience don't hesitate to chime in"
    }else{
        hints.innerHTML = "Click to show <b>situation</b>, then read out loud or sign the card for the group"
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
            hints.innerHTML = "Time for the referee to assign dobbles based on each debater's creativity, persuasivness, and/or logical arguments"
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
    decks[2].Discard()
    audioManager.StopAllAudio()
}

function AddEnterListener(){
    let buttons = [document.getElementById("drawFirstCard"),
    document.getElementById("drawFirstCard-hover"), 
    document.getElementById("drawSecondCard"), 
    document.getElementById("drawSecondCard-hover"), 
    document.getElementById("debateBegins"),
    document.getElementById("debateBegins-hover"),
    document.getElementById("assignDobbles"),
    document.getElementById("assignDobbles-hover"), 
    document.getElementById("newRound"),
    document.getElementById("newRound-hover"),
    document.getElementById("positions-button"),
    document.getElementById("positions-button-hover"),
    document.getElementById("increment-dobbles"),
    document.getElementById("increment-dobbles-hover"),
    document.getElementById("decrease-dobbles"),
    document.getElementById("decrease-dobbles-hover"),
    document.getElementById("submit-dobbles"),
    document.getElementById("submit-dobbles-hover")]

    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener("keyup", function(event){
            if(event.keyCode === 13){
                event.preventDefault()
                buttons[i].click()
            }
        })
    }
}

//Mute and animation
function MuteAudio(){
    audioManager.Mute(true);
    let soundImage = document.getElementById("sound-icon")
    let soundImageHover = document.getElementById("sound-icon-hover")

    soundImage.src = "images/basics/sound_on.svg"
    soundImageHover.src = "images/basics/sound_on_hover.svg"

    soundImage.onclick = function () {UnmuteAudio()}
    soundImageHover.onclick = function () {UnmuteAudio()}
}

function UnmuteAudio(){
    audioManager.Mute(false);
    let soundImage = document.getElementById("sound-icon")
    let soundImageHover = document.getElementById("sound-icon-hover")

    soundImage.src = "images/basics/sound.svg"
    soundImageHover.src = "images/basics/sound_hover.svg"

    soundImage.onclick = function () {MuteAudio()}
    soundImageHover.onclick = function () {MuteAudio()}
}

function StopAnimation(){
    let cards = Array.from(document.getElementsByClassName("card__inner"))
    for(let i = 0; i < cards.length; i++){
        cards[i].classList.add("notransition");
    }

    let animImage = document.getElementById("anim-icon")
    let animHoverImage = document.getElementById("anim-icon-hover")

    animImage.src = "images/basics/animation_on.svg"
    animHoverImage.src = "images/basics/animation_on_hover.svg"
    
    animImage.onclick = function () {StartAnimation()}
    animHoverImage.onclick = function () {StartAnimation()}

}

function StartAnimation(){
    let cards = Array.from(document.getElementsByClassName("card__inner"))
    for(let i = 0; i < cards.length; i++){
        cards[i].classList.remove("notransition");
    }

    let animImage = document.getElementById("anim-icon")
    let animHoverImage = document.getElementById("anim-icon-hover")

    animImage.src = "images/basics/animation.svg"
    animHoverImage.src = "images/basics/animation_hover.svg"
    
    animImage.onclick = function () {StopAnimation()}
    animHoverImage.onclick = function () {StopAnimation()}
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