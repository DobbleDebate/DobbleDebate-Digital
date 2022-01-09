class Player{
    constructor(n){
        this.name = n
        //this.avatar = FILE BASED ON NAME
        this.role = 0
        this.dobbles = 0
        this.filepath = "Assets/Characters/"+ n + ".svg"
        this.proFilepath = "Assets/Characters/"+ n + ".svg"
        this.conFilepath = "Assets/Characters/"+ n + ".svg"
        this.refFilepath = "Assets/Characters/"+ n + ".svg"
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