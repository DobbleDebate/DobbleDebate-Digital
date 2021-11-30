class Player{
    constructor(n){
        this.name = n
        //this.avatar = FILE BASED ON NAME
        this.dobbles = 0
    }

    GiveDobbles(val){
        this.dobbles += val
    }

    SetRole(r){
        this.role = r
    }

    Animate(){

        this.PlaySound()
    }

    PlaySound(){

    }
}