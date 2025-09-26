// Main entry point for Marcus Caum's Cyberpunk Terminal Portfolio
import "./styles/main.css";
import { TerminalAudio } from "./js/audio-system.js";
import { RadioSystem } from "./js/radio-system.js";
import { CRTEffects } from "./js/crt-effects.js";
import { TerminalCommands } from "./js/terminal-commands.js";
import { PortfolioCore } from "./js/portfolio-core.js";

// Initialize all systems when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Initializing Marcus Caum Cyberpunk Terminal...");

  // Initialize core systems
  const terminalAudio = new TerminalAudio();
  const radioSystem = new RadioSystem(terminalAudio);
  const crtEffects = new CRTEffects();
  const terminalCommands = new TerminalCommands(terminalAudio, radioSystem);
  const portfolioCore = new PortfolioCore(terminalAudio);

  // Make systems globally available for onclick handlers in HTML
  window.terminalAudio = terminalAudio;
  window.radioSystem = radioSystem;
  window.terminalCommands = terminalCommands;
  window.portfolioCore = portfolioCore;

  // Export functions for HTML onclick handlers
  window.showSection = portfolioCore.showSection.bind(portfolioCore);
  window.showMainMenu = portfolioCore.showMainMenu.bind(portfolioCore);
  window.downloadResume = portfolioCore.downloadResume.bind(portfolioCore);
  window.togglePlayPause = radioSystem.togglePlayPause.bind(radioSystem);
  window.nextTrack = radioSystem.nextTrack.bind(radioSystem);
  window.prevTrack = radioSystem.prevTrack.bind(radioSystem);
  window.shufflePlaylist = radioSystem.shufflePlaylist.bind(radioSystem);
  window.setVolume = radioSystem.setVolume.bind(radioSystem);
  window.handleCommand = terminalCommands.handleCommand.bind(terminalCommands);

  console.log("✅ Terminal initialized successfully!");
});
