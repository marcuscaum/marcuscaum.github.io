export class TerminalAudio {
  constructor() {
    this.isEnabled = true;
    this.sounds = {};
    this.backgroundLoop = null;
    this.initAudio();
  }

  async initAudio() {
    try {
      // Preload all audio files
      const soundFiles = {
        // Boot sounds
        powerOn: "sounds/poweron.mp3",
        powerOff: "sounds/poweroff.mp3",

        // Typing sounds - single characters
        type1: "sounds/ui_hacking_charsingle_01.wav",
        type2: "sounds/ui_hacking_charsingle_02.wav",
        type3: "sounds/ui_hacking_charsingle_03.wav",
        type4: "sounds/ui_hacking_charsingle_04.wav",
        type5: "sounds/ui_hacking_charsingle_05.wav",
        type6: "sounds/ui_hacking_charsingle_06.wav",

        // Menu navigation
        enter1: "sounds/ui_hacking_charenter_01.wav",
        enter2: "sounds/ui_hacking_charenter_02.wav",
        enter3: "sounds/ui_hacking_charenter_03.wav",

        // Background/scrolling
        scroll: "sounds/ui_hacking_charscroll.wav",
        scrollLoop: "sounds/ui_hacking_charscroll_lp.wav",

        // Piano easter egg
        piano1: "sounds/piano/1.wav",
        piano2: "sounds/piano/2.wav",
        piano3: "sounds/piano/3.wav",
        piano4: "sounds/piano/4.wav",
        piano5: "sounds/piano/5.wav",
      };

      // Load all sounds
      for (const [key, path] of Object.entries(soundFiles)) {
        this.sounds[key] = new Audio(path);
        this.sounds[key].preload = "auto";
        this.sounds[key].volume = 0.3; // Default volume
      }

      // Set specific volumes
      this.sounds.powerOn.volume = 0.4;
      this.sounds.powerOff.volume = 0.4;
      this.sounds.scrollLoop.volume = 0.1;
      this.sounds.scroll.volume = 0.2;
    } catch (error) {
      console.log("Audio loading failed:", error);
    }
  }

  // Background ambience
  startBackgroundAmbience() {}

  // Generic sound player with random variation
  playSound(soundKey, volume = null) {
    if (!this.isEnabled || !this.sounds[soundKey]) return;

    try {
      const sound = this.sounds[soundKey].cloneNode();
      if (volume) sound.volume = volume;

      // Add slight pitch variation for realism
      if (sound.mozPreservesPitch !== undefined) {
        sound.mozPreservesPitch = false;
      } else if (sound.webkitPreservesPitch !== undefined) {
        sound.webkitPreservesPitch = false;
      }

      sound.playbackRate = 0.9 + Math.random() * 0.2; // Vary pitch slightly
      sound.play().catch((e) => console.log("Audio play failed:", e));
    } catch (error) {
      console.log("Sound playback error:", error);
    }
  }

  // Typing sound with variation
  playKeyPress() {
    if (!this.isEnabled) return;

    // Randomly select from typing sounds
    const typeSounds = ["type1", "type2", "type3", "type4", "type5", "type6"];
    const randomSound =
      typeSounds[Math.floor(Math.random() * typeSounds.length)];
    this.playSound(randomSound, 0.2 + Math.random() * 0.2);
  }

  // Menu selection sound
  playMenuSelect() {
    if (!this.isEnabled) return;

    // Randomly select from enter sounds
    const enterSounds = ["enter1", "enter2", "enter3"];
    const randomSound =
      enterSounds[Math.floor(Math.random() * enterSounds.length)];
    this.playSound(randomSound, 0.3);
  }

  // Boot sound
  playBootSound() {
    if (!this.isEnabled) return;
    this.playSound("powerOn", 0.4);
  }

  // Error sound - play power off sound
  playError() {
    if (!this.isEnabled) return;

    // Use power off sound for errors, play 3 times quickly
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playSound("powerOff", 0.3);
      }, i * 200);
    }
  }

  // Power off sound (for shutdown/exit)
  playPowerOff() {
    if (!this.isEnabled) return;
    this.playSound("powerOff", 0.4);
  }

  // Matrix sound effect
  playMatrixSound() {
    if (!this.isEnabled) return;
    this.playSound("scrollLoop", 0.15);
  }

  // Easter egg: piano melody
  playPianoMelody() {
    if (!this.isEnabled) return;

    const melody = ["piano1", "piano2", "piano3", "piano2", "piano4", "piano5"];
    melody.forEach((note, index) => {
      setTimeout(() => {
        this.playSound(note, 0.4);
      }, index * 400);
    });
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled && this.backgroundLoop) {
      clearInterval(this.backgroundLoop);
      this.backgroundLoop = null;
    } else if (this.isEnabled) {
      this.startBackgroundAmbience();
    }

    // Update status bar
    const audioStatus = document.getElementById("audio-status");
    if (audioStatus) {
      audioStatus.textContent = `AUDIO: ${this.isEnabled ? "ON" : "OFF"}`;
      audioStatus.style.color = this.isEnabled ? "#00ff41" : "#ff4444";
    }
  }
}
