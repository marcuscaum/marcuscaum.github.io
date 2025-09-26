export class CRTEffects {
  constructor() {
    this.isEnabled = true;
    this.initCRTEffects();
  }

  initCRTEffects() {
    // Create the CRT overlay elements
    this.createScanlines();
    this.createFlicker();
    this.applyStyles();
  }

  createScanlines() {
    // Scanlines are already applied via CSS in the main styles
    // This could be extended for dynamic scanline effects
  }

  createFlicker() {
    // The flickering effect is handled via CSS animations
    // This method can be extended for programmatic flicker control
  }

  applyStyles() {
    // Apply any dynamic CRT styling
    document.documentElement.style.setProperty(
      "--crt-flicker",
      this.isEnabled ? "1" : "0"
    );
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    this.applyStyles();

    // Update any CRT effect classes
    const body = document.body;
    if (this.isEnabled) {
      body.classList.add("crt-enabled");
    } else {
      body.classList.remove("crt-enabled");
    }
  }

  adjustIntensity(level) {
    // Adjust CRT effect intensity (0-100)
    const opacity = level / 100;
    document.documentElement.style.setProperty(
      "--crt-opacity",
      opacity.toString()
    );
  }
}
