var players = []
var avatars = []
var storage = window.sessionStorage

function AddCharacter(name){
    let btn = document.getElementById(name + "-btn")
    avatars.push(name)
    btn.classList.add("btn-success")
    btn.classList.remove("btn-danger")
    btn.onclick = function() {RemoveCharacter(name)}
}

function RemoveCharacter(name){
    let btn = document.getElementById(name + "-btn")
    let index = avatars.indexOf(name)
    avatars.splice(index,1)
    btn.classList.add("btn-danger")
    btn.classList.remove("btn-success")
    btn.onclick = function() {AddCharacter(name)}
}

function AssignCharacters(){
    for(let i=0; i < avatars.length; i++){
        players.push(new Player(avatars[i]))
        players[i].SetRole(i)
    }
    Save()
}

function Save(){
    let strPlayers = JSON.stringify(players)
    sessionStorage.setItem("players", strPlayers)
    console.log(storage.getItem("players"))
}