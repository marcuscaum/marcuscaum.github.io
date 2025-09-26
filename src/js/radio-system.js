export class RadioSystem {
  constructor(terminalAudio) {
    this.terminalAudio = terminalAudio;
    this.playlist = [
      "sounds/radio/Allan Gray - Swing Doors.mp3",
      "sounds/radio/Billie Holiday - Crazy He Calls Me.mp3",
      "sounds/radio/Billie Holiday- Easy Living.mp3",
      "sounds/radio/Billy Munn - Jazzy Interlude.mp3",
      "sounds/radio/Bob Crosby and The Bobcats - Happy Times.mp3",
      "sounds/radio/Bob Crosby and The Bobcats - Way Back Home.mp3",
      "sounds/radio/Cole Porter - Anything Goes.mp3",
      "sounds/radio/Danny Kaye and The Andrews Sisters - Civilization.mp3",
      "sounds/radio/Eddy Christiani and Frans Poptie - Rythm For You.mp3",
      "sounds/radio/Gerhard Trede - Fox Boogie.mp3",
      "sounds/radio/Gerhard Trede - Jolly Days.mp3",
      "sounds/radio/Jack Shaindlin - I'm Tickled Pink.mp3",
      "sounds/radio/Jack Shaindlin - Let's Go Sunning.mp3",
    ];

    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.isShuffled = false;
    this.audio = new Audio();
    this.volume = 0.5;

    this.setupAudioEvents();
    this.loadCurrentTrack();
  }

  setupAudioEvents() {
    this.audio.addEventListener("ended", () => {
      this.nextTrack();
    });

    this.audio.addEventListener("loadstart", () => {
      this.updateTrackInfo("Loading...");
    });

    this.audio.addEventListener("canplay", () => {
      this.updateTrackInfo();
    });

    this.audio.addEventListener("error", (e) => {
      console.log("Radio audio error:", e);
      this.updateTrackInfo("Error loading track");
      setTimeout(() => this.nextTrack(), 2000);
    });
  }

  loadCurrentTrack() {
    const track = this.playlist[this.currentTrackIndex];
    this.audio.src = track;
    this.audio.volume = this.volume;
    this.updateTrackInfo();
  }

  updateTrackInfo(customText = null) {
    const trackElement = document.getElementById("current-track");
    if (customText) {
      trackElement.textContent = customText;
      return;
    }

    const track = this.playlist[this.currentTrackIndex];
    const filename = track.split("/").pop().replace(".mp3", "");

    if (this.isPlaying) {
      trackElement.textContent = `► NOW STREAMING: ${filename}`;
    } else {
      trackElement.textContent = `► LOADED: ${filename}`;
    }
  }

  play() {
    if (this.audio.src) {
      this.audio
        .play()
        .then(() => {
          this.isPlaying = true;
          this.updatePlayButton();
          this.updateTrackInfo();
          this.terminalAudio.playSound("menuSelect");
        })
        .catch((e) => {
          console.log("Radio play error:", e);
          this.updateTrackInfo("Playback error");
        });
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayButton();
    this.updateTrackInfo();
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  nextTrack() {
    this.currentTrackIndex =
      (this.currentTrackIndex + 1) % this.playlist.length;
    this.loadCurrentTrack();
    if (this.isPlaying) {
      this.play();
    }
  }

  prevTrack() {
    this.currentTrackIndex =
      this.currentTrackIndex === 0
        ? this.playlist.length - 1
        : this.currentTrackIndex - 1;
    this.loadCurrentTrack();
    if (this.isPlaying) {
      this.play();
    }
  }

  shufflePlaylist() {
    // Fisher-Yates shuffle algorithm
    const shuffled = [...this.playlist];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    this.playlist = shuffled;
    this.currentTrackIndex = 0;
    this.loadCurrentTrack();
    this.isShuffled = !this.isShuffled;

    this.terminalAudio.playSound("menuSelect");
    this.updateTrackInfo("► Playlist randomized!");
    setTimeout(() => this.updateTrackInfo(), 2000);
  }

  setVolume(volume) {
    this.volume = volume / 100;
    this.audio.volume = this.volume;
    document.getElementById("volume-display").textContent = `${volume}%`;
  }

  updatePlayButton() {
    const btn = document.getElementById("play-pause-btn");
    btn.textContent = this.isPlaying ? "||" : "|>";
    btn.className = this.isPlaying ? "radio-btn active" : "radio-btn";
  }
}
