export class PortfolioCore {
  constructor(terminalAudio) {
    this.terminalAudio = terminalAudio;
    this.currentSection = "boot";
    this.bootIndex = 0;
    this.bootMessages = [
      "LOADING PERSONAL DATABASE AND SKILL MODULES...",
      "CONNECTING TO GITHUB REPOSITORY...",
      "SYSTEM READY - WELCOME TO THE MARCUS CAUM INTERFACE",
    ];
    this.scrollTimeout = null;
    this.isScrolling = false;
    this.initializeEventListeners();
    this.initializeScrollObserver();
  }

  initializeEventListeners() {
    // Keep focus on command input at all times
    this.maintainFocus = () => {
      const commandInput = document.getElementById("command-input");
      if (commandInput && document.activeElement !== commandInput) {
        commandInput.focus();
      }
    };

    // Ensure command section is always visible when user types
    this.ensureCommandVisible = () => {
      const commandSection = document.getElementById("command-section");
      if (commandSection) {
        commandSection.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    };

    // Multiple event listeners to ensure input stays focused
    document.addEventListener("click", (e) => {
      // Don't focus if clicking on interactive elements
      const isInteractive =
        e.target.tagName === "A" ||
        e.target.onclick ||
        e.target.href ||
        e.target.classList.contains("menu-option") ||
        e.target.classList.contains("radio-btn") ||
        e.target.closest("[onclick]") ||
        e.target.closest(".menu-option");

      if (!isInteractive) {
        this.terminalAudio.playMenuSelect();
        setTimeout(this.maintainFocus, 10);
      }
    });

    document.addEventListener("keydown", (e) => {
      // Redirect all keyboard input to command input except for special keys
      const commandInput = document.getElementById("command-input");
      if (
        document.activeElement !== commandInput &&
        e.key !== "Tab" &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        e.key.length === 1 // Only for actual typing characters
      ) {
        commandInput.focus();
        // Ensure command section is visible when user starts typing
        setTimeout(this.ensureCommandVisible, 100);
      }
    });

    // Focus when window regains focus
    window.addEventListener("focus", this.maintainFocus);

    // Prevent input from losing focus on blur (unless specifically needed)
    document.addEventListener("DOMContentLoaded", () => {
      const commandInput = document.getElementById("command-input");
      if (commandInput) {
        commandInput.addEventListener("blur", () => {
          setTimeout(this.maintainFocus, 10);
        });

        // Add input event listener to ensure scroll follows typing
        commandInput.addEventListener("input", () => {
          setTimeout(this.ensureCommandVisible, 50);
        });

        // Also ensure command section is visible when input gains focus
        commandInput.addEventListener("focus", () => {
          setTimeout(this.ensureCommandVisible, 100);
        });
      }
    });

    // Add scroll event listener with audio feedback
    document.addEventListener("DOMContentLoaded", () => {
      const terminal = document.querySelector(".terminal");
      if (terminal) {
        terminal.addEventListener("scroll", () => {
          if (!this.isScrolling) {
            this.terminalAudio.playSound("scroll");
            this.isScrolling = true;
          }

          clearTimeout(this.scrollTimeout);
          this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
          }, 150);
        });
      }
    });
  }

  initializeScrollObserver() {
    // Smart scroll observer for content changes
    const scrollObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          // New content was added, scroll if near bottom
          const terminal = document.querySelector(".terminal");
          const isNearBottom =
            terminal.scrollTop >=
            terminal.scrollHeight - terminal.clientHeight - 100;

          if (isNearBottom) {
            setTimeout(() => {
              terminal.scrollTo({
                top: terminal.scrollHeight,
                behavior: "smooth",
              });
            }, 50);
          }
        }
      });
    });

    // Observe the terminal for content changes
    document.addEventListener("DOMContentLoaded", () => {
      const terminalContent = document.querySelector(".terminal");
      if (terminalContent) {
        scrollObserver.observe(terminalContent, {
          childList: true,
          subtree: true,
        });
      }
    });
  }

  typeWriter(element, text, speed = 50, callback) {
    let i = 0;
    element.innerHTML = "";
    const type = () => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        this.terminalAudio.playKeyPress();
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    };
    type();
  }

  bootSequence() {
    const bootElement = document.getElementById("boot-sequence");

    if (this.bootIndex < this.bootMessages.length) {
      const line = document.createElement("div");
      line.className = "info-line";
      bootElement.appendChild(line);

      this.typeWriter(
        line,
        "► " + this.bootMessages[this.bootIndex],
        30,
        () => {
          this.bootIndex++;

          // Auto-scroll during boot sequence
          setTimeout(() => {
            const terminal = document.querySelector(".terminal");
            terminal.scrollTop = terminal.scrollHeight;
          }, 100);

          setTimeout(() => this.bootSequence(), 500);
        }
      );
    } else {
      setTimeout(() => {
        document.querySelector(".section").style.display = "none";
        document.getElementById("boot-sequence-container").style.display =
          "none";
        document.getElementById("main-menu").style.display = "block";
        document.getElementById("command-section").style.display = "block";
        document.getElementById("main-container").style.display = "flex";
        this.currentSection = "main";

        // Scroll to show main menu
        this.terminalAudio.playBootSound();
        setTimeout(this.smoothScrollToBottom, 300);
      }, 1000);
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
  }

  showMainMenu() {
    const sections = [
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
    document.getElementById("main-menu").style.display = "block";
    this.currentSection = "main";
  }

  smoothScrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }

  smoothScrollToBottom() {
    const terminal = document.querySelector(".terminal");
    terminal.scrollTo({
      top: terminal.scrollHeight,
      behavior: "smooth",
    });
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

  updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const timeElement = document.getElementById("current-time");
    if (timeElement) {
      timeElement.textContent = timeString;
    }
  }

  initialize() {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => this.bootSequence(), 1000);
      this.updateTime();
      setInterval(() => this.updateTime(), 1000);

      // Focus on command input
      const commandInput = document.getElementById("command-input");
      if (commandInput) {
        commandInput.focus();
      }
    });
  }
}
