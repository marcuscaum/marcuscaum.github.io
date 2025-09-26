// Main entry point for Marcus Caum's Cyberpunk Terminal Portfolio
import "./styles/main.css";
import { TerminalAudio } from "./js/audio-system.js";
import { RadioSystem } from "./js/radio-system.js";
import { CRTEffects } from "./js/crt-effects.js";
import { TerminalCommands } from "./js/terminal-commands.js";
import { PortfolioCore } from "./js/portfolio-core.js";

// Global variables for systems
let terminalAudio, radioSystem, crtEffects, terminalCommands, portfolioCore;

// Initialize basic systems when DOM is loaded (but not portfolio core)
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Loading Marcus Caum Cyberpunk Terminal...");

  // Initialize basic systems only
  terminalAudio = new TerminalAudio();
  radioSystem = new RadioSystem(terminalAudio);
  crtEffects = new CRTEffects();
  terminalCommands = new TerminalCommands(terminalAudio, radioSystem);
  portfolioCore = new PortfolioCore(terminalAudio, radioSystem);

  // Make systems globally available for onclick handlers in HTML
  window.terminalAudio = terminalAudio;
  window.radioSystem = radioSystem;
  window.terminalCommands = terminalCommands;
  window.portfolioCore = portfolioCore;

  console.log("⏳ Systems loaded, waiting for robot verification...");
});

// Function to initialize portfolio core after robot verification
window.initializePortfolio = function() {
  console.log("🤖 Robot verified! Initializing portfolio core...");
  
  // Initialize the portfolio core system
  portfolioCore.initialize();

  // Export functions for HTML onclick handlers
  window.showSection = portfolioCore.showSection.bind(portfolioCore);
  window.showMainMenu = portfolioCore.showMainMenu.bind(portfolioCore);
  window.downloadResume = portfolioCore.downloadResume.bind(portfolioCore);
  window.startMatrix = portfolioCore.startMatrix.bind(portfolioCore);
  window.togglePlayPause = radioSystem.togglePlayPause.bind(radioSystem);
  window.nextTrack = radioSystem.nextTrack.bind(radioSystem);
  window.prevTrack = radioSystem.prevTrack.bind(radioSystem);
  window.shufflePlaylist = radioSystem.shufflePlaylist.bind(radioSystem);
  window.setVolume = radioSystem.setVolume.bind(radioSystem);
  window.handleCommand = terminalCommands.handleCommand.bind(terminalCommands);

  console.log("✅ Terminal initialized successfully!");
};
