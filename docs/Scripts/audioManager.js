class AudioManager {
    constructor() {
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
            new AudioClip("001", "Assets/Audio/Spark/001.mp3"),
            new AudioClip("002", "Assets/Audio/Spark/002.mp3"),
            new AudioClip("003", "Assets/Audio/Spark/003.mp3"),
            new AudioClip("004", "Assets/Audio/Spark/004.mp3"),
            new AudioClip("005", "Assets/Audio/Spark/005.mp3"),
            new AudioClip("006", "Assets/Audio/Spark/006.mp3"),
            new AudioClip("007", "Assets/Audio/Spark/007.mp3"),
            new AudioClip("008", "Assets/Audio/Spark/008.mp3"),
            new AudioClip("009", "Assets/Audio/Spark/009.mp3"),
            new AudioClip("010", "Assets/Audio/Spark/010.mp3"),
            new AudioClip("011", "Assets/Audio/Spark/011.mp3"),
            new AudioClip("012", "Assets/Audio/Spark/012.mp3"),
            new AudioClip("013", "Assets/Audio/Spark/013.mp3"),
            new AudioClip("014", "Assets/Audio/Spark/014.mp3"),
            new AudioClip("015", "Assets/Audio/Spark/015.mp3"),
            new AudioClip("016", "Assets/Audio/Spark/016.mp3"),
            new AudioClip("017", "Assets/Audio/Spark/017.mp3"),
            new AudioClip("018", "Assets/Audio/Spark/018.mp3"),
            new AudioClip("019", "Assets/Audio/Spark/019.mp3"),
            new AudioClip("020", "Assets/Audio/Spark/020.mp3"),
            new AudioClip("021", "Assets/Audio/Spark/021.mp3"),
            new AudioClip("022", "Assets/Audio/Spark/022.mp3"),
            new AudioClip("023", "Assets/Audio/Spark/023.mp3"),
            new AudioClip("024", "Assets/Audio/Spark/024.mp3"),
            new AudioClip("025", "Assets/Audio/Spark/025.mp3"),
            new AudioClip("026", "Assets/Audio/Spark/026.mp3"),
            new AudioClip("027", "Assets/Audio/Spark/027.mp3"),
            new AudioClip("028", "Assets/Audio/Spark/028.mp3"),
            new AudioClip("029", "Assets/Audio/Spark/029.mp3"),
            new AudioClip("030", "Assets/Audio/Spark/030.mp3"),
            new AudioClip("031", "Assets/Audio/Spark/031.mp3"),
            new AudioClip("032", "Assets/Audio/Spark/032.mp3"),
            new AudioClip("033", "Assets/Audio/Spark/033.mp3"),
            new AudioClip("034", "Assets/Audio/Spark/034.mp3"),
            new AudioClip("035", "Assets/Audio/Spark/035.mp3"),
            new AudioClip("036", "Assets/Audio/Spark/036.mp3"),
            new AudioClip("037", "Assets/Audio/Spark/037.mp3"),
            new AudioClip("038", "Assets/Audio/Spark/038.mp3"),
            new AudioClip("039", "Assets/Audio/Spark/039.mp3"),
            new AudioClip("040", "Assets/Audio/Spark/040.mp3"),
            new AudioClip("041", "Assets/Audio/Spark/041.mp3"),
            new AudioClip("042", "Assets/Audio/Spark/042.mp3"),
            new AudioClip("043", "Assets/Audio/Spark/043.mp3"),
            new AudioClip("044", "Assets/Audio/Spark/044.mp3"),
            new AudioClip("045", "Assets/Audio/Spark/045.mp3"),
            new AudioClip("046", "Assets/Audio/Spark/046.mp3"),
            new AudioClip("047", "Assets/Audio/Spark/047.mp3"),
            new AudioClip("048", "Assets/Audio/Spark/048.mp3"),
            new AudioClip("049", "Assets/Audio/Spark/049.mp3"),
            new AudioClip("050", "Assets/Audio/Spark/050.mp3"),
            new AudioClip("051", "Assets/Audio/Spark/051.mp3"),
            new AudioClip("052", "Assets/Audio/Spark/052.mp3"),
        ]
        this.audioGroups.push(new AudioGroup("Spark", this.audioClips))
        this.mute = false;
    }

    StopAllAudio() {
        for (let i = 0; i < this.audioGroups.length; i++) {
            for (let j = 0; j < this.audioGroups[i].audioClips.length; j++) {
                this.audioGroups[i].audioClips[j].Stop()
            }
        }
    }

    Mute(b) {
        this.mute = b;
        this.StopAllAudio()
    }

    Play(group, track) {
        this.StopAllAudio()
        if (!this.mute) {
            for (let i = 0; i < this.audioGroups.length; i++) {
                if (this.audioGroups[i].groupName == group) {
                    for (let j = 0; j < this.audioGroups[i].audioClips.length; j++) {
                        if (this.audioGroups[i].audioClips[j].name == track) {
                            this.audioGroups[i].audioClips[j].Play()
                        }
                    }
                }
            }
        }
    }

}

class AudioClip {
    constructor(name, file) {
        this.name = name
        this.fileName = file
        this.audio = new Audio(this.fileName)
        this.audio.volume = 0.3
    }

    Play() {
        this.audio.play()
    }

    Stop() {
        this.audio.pause()
        this.audio.currentTime = 0
    }
}

class AudioGroup {

    constructor(name, audioClips) {
        this.groupName = name
        this.audioClips = audioClips
    }

}