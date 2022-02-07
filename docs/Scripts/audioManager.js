class AudioManager{
    constructor(){
        this.audioGroups = []
        this.audioClips = [
            new AudioClip("coffee", "/Assets/Audio/Characters/coffee.wav"),
            new AudioClip("feathers", "/Assets/Audio/Characters/feathers.wav"),
            new AudioClip("grass", "/Assets/Audio/Characters/grass.wav"),
            new AudioClip("gum", "/Assets/Audio/Characters/gum.wav"),
            new AudioClip("ice", "/Assets/Audio/Characters/ice.wav"),
            new AudioClip("jelly", "/Assets/Audio/Characters/jelly.wav"),
            new AudioClip("shag", "/Assets/Audio/Characters/shag.wav"),
            new AudioClip("sun", "/Assets/Audio/Characters/sun.wav"),
            new AudioClip("water", "/Assets/Audio/Characters/water.wav"),
            new AudioClip("wool", "/Assets/Audio/Characters/wool.wav")
        ]
        this.audioGroups.push(new AudioGroup("Characters", this.audioClips))
        
        this.audioClips = [
            new AudioClip("cardflip", "/Assets/Audio/SFX/cardflip.wav"),
            new AudioClip("error", "/Assets/Audio/SFX/error.wav"),
            new AudioClip("points-1", "/Assets/Audio/SFX/points-1.wav"),
            new AudioClip("points0", "/Assets/Audio/SFX/points0.wav"),
            new AudioClip("points1", "/Assets/Audio/SFX/points1.wav"),
            new AudioClip("points2", "/Assets/Audio/SFX/points2.wav"),
            new AudioClip("points3", "/Assets/Audio/SFX/points3.wav"),
            new AudioClip("start", "/Assets/Audio/SFX/start.wav"),
            new AudioClip("start2", "/Assets/Audio/SFX/start2.wav"),
            new AudioClip("success", "/Assets/Audio/SFX/success.wav"),
            new AudioClip("win", "/Assets/Audio/SFX/win.wav"),
            new AudioClip("submit", "/Assets/Audio/SFX/submit.wav")
        ]
        this.audioGroups.push(new AudioGroup("SFX", this.audioClips))

        this.audioClips = [
            new AudioClip("001", "/Assets/Audio/Situations/001.wav"),
            new AudioClip("002", "/Assets/Audio/Situations/002.wav"),
            new AudioClip("003", "/Assets/Audio/Situations/003.wav"),
            new AudioClip("004", "/Assets/Audio/Situations/004.wav"),
            new AudioClip("005", "/Assets/Audio/Situations/005.wav"),
            new AudioClip("006", "/Assets/Audio/Situations/006.wav"),
            new AudioClip("007", "/Assets/Audio/Situations/007.wav"),
            new AudioClip("008", "/Assets/Audio/Situations/008.wav"),
            new AudioClip("009", "/Assets/Audio/Situations/009.wav"),
            new AudioClip("010", "/Assets/Audio/Situations/010.wav"),
            new AudioClip("011", "/Assets/Audio/Situations/011.wav"),
            new AudioClip("012", "/Assets/Audio/Situations/012.wav"),
            new AudioClip("013", "/Assets/Audio/Situations/013.wav"),
            new AudioClip("014", "/Assets/Audio/Situations/014.wav"),
            new AudioClip("015", "/Assets/Audio/Situations/015.wav"),
            new AudioClip("016", "/Assets/Audio/Situations/016.wav"),
            new AudioClip("017", "/Assets/Audio/Situations/017.wav"),
            new AudioClip("018", "/Assets/Audio/Situations/018.wav"),
            new AudioClip("019", "/Assets/Audio/Situations/019.wav"),
            new AudioClip("020", "/Assets/Audio/Situations/020.wav")
        ]
        this.audioGroups.push(new AudioGroup("Situations", this.audioClips))

        this.audioClips = [
            new AudioClip("001", "Assets/Audio/Spark/drive_through.wav"),
            new AudioClip("002", "Assets/Audio/Spark/born_deaf.wav"),
            new AudioClip("003", "Assets/Audio/Spark/finding_a_positive_spi.wav"),
            new AudioClip("004", "Assets/Audio/Spark/catharsis_through_art.wav"),
            new AudioClip("005", "Assets/Audio/Spark/teaching_asl.wav"),
        ]
        this.audioGroups.push(new AudioGroup("Spark", this.audioClips))

    }

    StopAllAudio(){
        for(let i=0; i<this.audioGroups.length; i++){
            for(let j=0; j<this.audioGroups[i].audioClips.length; j++){
                this.audioGroups[i].audioClips[j].Stop()
            }
        }
    }

    Play(group, track){
        this.StopAllAudio()
        for(let i=0; i<this.audioGroups.length; i++){
            if(this.audioGroups[i].groupName == group){
                for(let j=0; j<this.audioGroups[i].audioClips.length; j++){
                    if(this.audioGroups[i].audioClips[j].name == track){
                        this.audioGroups[i].audioClips[j].Play()
                    }
                }
            }
        }
    }

}

class AudioClip{
    constructor(name, file){
        this.name = name
        this.fileName = file
        this.audio = new Audio(this.fileName)
    }

    Play(){
        this.audio.play()
    }

    Stop(){
        this.audio.pause()
        this.audio.currentTime = 0
    }
}

class AudioGroup{

    constructor(name, audioClips){
        this.groupName = name
        this.audioClips = audioClips
    }

}