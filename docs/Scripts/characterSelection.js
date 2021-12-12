var players = []
var avatars = []
var storage = window.sessionStorage

function AddCharacter(name){
    let btn = document.getElementById(name + "-btn")
    avatars.push(name)
    btn.classList.add("btn-success")
    btn.classList.remove("btn-danger")
    btn.ariaPressed = "true"
    btn.onclick = function() {RemoveCharacter(name)}
}

function RemoveCharacter(name){
    let btn = document.getElementById(name + "-btn")
    let index = avatars.indexOf(name)
    avatars.splice(index,1)
    btn.classList.add("btn-danger")
    btn.classList.remove("btn-success")
    btn.ariaPressed = "false"
    btn.onclick = function() {AddCharacter(name)}
}

function AssignCharacters(){
    if(avatars.length < 3){
        alert("This game needs at least 3 teams/players")
        return
    }

    for(let i=0; i < avatars.length; i++){
        players.push(new Player(avatars[i]))
        if(i<=3){
            players[i].SetRole(i)
        }else{
            players[i].SetRole(4)
        }
    }

    SaveCharacters()
    LoadGameState()
}

function ClearSaveData(){
    sessionStorage.clear();
}

function SaveCharacters(){
    let strPlayers = JSON.stringify(players)
    sessionStorage.setItem("players", strPlayers)
    console.log(storage.getItem("players"))
}

function LoadGameState(){
    window.location.href = "game.html"
}