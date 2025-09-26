export class TerminalCommands {
  constructor(terminalAudio, radioSystem) {
    this.terminalAudio = terminalAudio;
    this.radioSystem = radioSystem;
    this.currentSection = "boot";
    this.bootIndex = 0;
  }

  handleCommand(event) {
    this.terminalAudio.playKeyPress();

    // Auto-scroll to command section when typing
    if (event.key !== "Enter") {
      setTimeout(() => {
        const commandSection = document.getElementById("command-section");
        commandSection.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 50);
    }

    if (event.key === "Enter") {
      const input = document.getElementById("command-input");
      const output = document.getElementById("command-output");
      const command = input.value.toLowerCase().trim();

      let response = "";

      switch (command) {
        case "help":
          response = `
► Available commands:
  • help - Show this help menu
  • about - Show profile information
  • skills - Display technical skills
  • experience - Show work history
  • projects - List projects
  • contact - Show contact information
  • download - Download resume
  • clear - Clear terminal
  • matrix - Enter the matrix
  • whoami - Current user info
  
► Audio Stream commands:
  • radio play - Start audio stream
  • radio pause - Pause audio stream
  • radio next - Next track
  • radio prev - Previous track
  • radio shuffle - Randomize playlist
  • radio volume [0-100] - Set volume level`;
          break;
        case "about":
          this.showSectionWithScroll("profile");
          response = "► Loading personnel file...";
          break;
        case "skills":
          this.showSectionWithScroll("skills");
          response = "► Accessing technical specifications...";
          break;
        case "experience":
          this.showSectionWithScroll("experience");
          response = "► Retrieving mission history...";
          break;
        case "projects":
          this.showSectionWithScroll("projects");
          response = "► Opening project database...";
          break;
        case "contact":
          this.showSectionWithScroll("contact");
          response = "► Establishing communication protocols...";
          break;
        case "download":
          this.downloadResume();
          response = "► Generating personnel dossier...";
          break;
        case "clear":
          output.innerHTML = "";
          input.value = "";
          document.getElementById("typed-text").textContent = "";
          return;
        case "matrix":
          this.showSection("matrix");
          response = "► Entering the matrix...";
          break;
        case "whoami":
          response =
            "► Current user: VISITOR\n► Access level: PUBLIC\n► Location: WEB_INTERFACE";
          break;

        // Radio commands
        case "radio":
        case "radio play":
          this.radioSystem.play();
          response = "► Radio playback started";
          break;
        case "radio pause":
          this.radioSystem.pause();
          response = "► Radio playback paused";
          break;
        case "radio next":
          this.radioSystem.nextTrack();
          response = "► Switched to next track";
          break;
        case "radio prev":
          this.radioSystem.prevTrack();
          response = "► Switched to previous track";
          break;
        case "radio shuffle":
          this.radioSystem.shufflePlaylist();
          response = "► Playlist shuffled";
          break;
        default:
          // Check for radio volume command
          if (command.startsWith("radio volume ")) {
            const volumeValue = command.split(" ")[2];
            const volume = parseInt(volumeValue);
            if (volume >= 0 && volume <= 100) {
              this.radioSystem.setVolume(volume);
              document.getElementById("volume-slider").value = volume;
              response = `► Radio volume set to ${volume}%`;
            } else {
              response = "► Invalid volume. Use: radio volume [0-100]";
            }
          } else {
            response = `► Command '${command}' not recognized. Type 'help' for available commands.`;
          }
      }

      const commandLine = document.createElement("div");
      commandLine.innerHTML = `<span class="prompt">marcus@portfolio:~$</span> ${input.value}`;
      output.appendChild(commandLine);

      const responseLine = document.createElement("div");
      responseLine.innerHTML = response;
      responseLine.style.whiteSpace = "pre-line";
      output.appendChild(responseLine);

      input.value = "";

      // Auto-scroll to show new content in command output
      setTimeout(() => {
        output.scrollTop = output.scrollHeight;

        // Ensure the command section is visible after command execution
        const commandSection = document.getElementById("command-section");
        commandSection.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }

  showSection(section) {
    // Hide all sections
    const sections = [
      "main-menu",
      "profile-section",
      "skills-section",
      "experience-section",
      "projects-section",
      "contact-section",
      "matrix-section",
    ];
    sections.forEach((s) => {
      document.getElementById(s).style.display = "none";
    });

    // Show selected section
    document.getElementById(section + "-section").style.display = "block";
    this.currentSection = section;

    this.terminalAudio.playMenuSelect();
    if (section === "matrix") {
      this.startMatrix();
    }
  }

  showSectionWithScroll(sectionName) {
    this.showSection(sectionName);
    setTimeout(() => {
      const commandSection = document.getElementById(`section-${sectionName}`);
      commandSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  }

  async downloadResume() {
    try {
      // Fetch the professional resume version from index_backup.html
      const response = await fetch("./index_backup.html");

      if (!response.ok) {
        throw new Error(`Failed to fetch resume: ${response.status}`);
      }

      let resumeContent = await response.text();

      // Add print-specific styles to optimize for PDF generation
      const printStyles = `
        <style>
          @media print {
            body { font-size: 12px; line-height: 1.4; color: #000 !important; }
            .no-print, [aria-labelledby="cta-heading"] { display: none !important; }
            .break-inside-avoid { break-inside: avoid; }
            h1 { font-size: 24px; margin-bottom: 8px; page-break-after: avoid; }
            h2 { font-size: 18px; margin-top: 16px; margin-bottom: 8px; page-break-after: avoid; }
            h3 { font-size: 16px; margin-bottom: 4px; page-break-after: avoid; }
            .container { max-width: none; margin: 0; padding: 15px; }
            a { color: #000 !important; text-decoration: none !important; }
            .bg-gradient-to-r, .bg-gradient-to-br { background: #f8f9fa !important; color: #000 !important; }
            .shadow-md, .rounded-lg { box-shadow: none !important; border-radius: 0 !important; }
            .text-blue-600, .text-green-600, .text-purple-600, .text-orange-600 { color: #000 !important; }
            .fade-in, .slide-in, .bounce { animation: none !important; }
            footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc; }
          }
        </style>
      `;

      // Insert print styles before closing head tag
      resumeContent = resumeContent.replace("</head>", printStyles + "</head>");

      // Create a new window with the professional resume version
      const printWindow = window.open("", "_blank");
      printWindow.document.write(resumeContent);
      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();

          // Close window after printing (optional)
          setTimeout(() => {
            printWindow.close();
          }, 1000);
        }, 500);
      };

      // Play audio feedback
      this.terminalAudio.playMenuSelect();
    } catch (error) {
      console.error("Error generating resume:", error);

      // Fallback: try to open index_backup.html directly in new tab
      try {
        const fallbackWindow = window.open("./index_backup.html", "_blank");
        if (fallbackWindow) {
          setTimeout(() => {
            fallbackWindow.print();
          }, 1000);
        }
      } catch (fallbackError) {
        alert(
          "Resume download initiated! Please check your browser's print dialog."
        );
      }

      this.terminalAudio.playError();
    }
  }

  startMatrix() {
    const matrixElement = document.getElementById("matrix-rain");
    let matrix = "";
    const characters =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

    for (let i = 0; i < 20; i++) {
      let line = "";
      for (let j = 0; j < 50; j++) {
        line += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      matrix += line + "\n";
    }

    matrixElement.textContent = matrix;

    // Animate the matrix
    setInterval(() => {
      if (this.currentSection === "matrix") {
        matrix = "";
        for (let i = 0; i < 20; i++) {
          let line = "";
          for (let j = 0; j < 50; j++) {
            line += characters.charAt(
              Math.floor(Math.random() * characters.length)
            );
          }
          matrix += line + "\n";
        }
        matrixElement.textContent = matrix;
      }
    }, 100);
  }
}
