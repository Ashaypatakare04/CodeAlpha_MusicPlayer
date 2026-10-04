# Between the Frames — Digital Listening Archive
### CodeAlpha Frontend Development Internship · Task 4: Music Player

![Between the Frames Preview](assets/images/afterglow.jpg)

> **"Music for the moments between everything else."**  
> An original editorial listening experience and digital album archive crafted for the CodeAlpha Frontend Development Internship.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Audio](https://img.shields.io/badge/HTML5_Audio_API-333333?logo=soundcharts&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)

---

## 1. Project Overview

**Between the Frames** is an original digital listening archive and editorial music player web application designed and built for **CodeAlpha Frontend Development Internship (Task 4 — Music Player)**.

Departing from conventional commercial music player interfaces characterized by excessive gradients, neon colors, glassmorphism, and cluttered dashboard widgets, this application presents an original editorial visual identity rooted in independent print publications, architectural photography, and fine art catalogues.

### Brand / UI Concept
* **Identity:** *Editorial Music Player × Digital Album Archive × Modern Portfolio*
* **Aesthetic:** Minimalist, calm, photographic, typography-driven, warm editorial palette.
* **Architecture:** Zero framework dependencies — pure HTML5, modular CSS3 custom properties, and Vanilla JavaScript leveraging the native HTML5 Audio API.

---

## 2. Features & Functional Specifications

### Core CodeAlpha Requirements Implemented
1. **Play Functionality:** Immediate audio playback using native HTML5 Audio API.
2. **Pause Functionality:** Clean pause state with visual button toggle and visualizer freeze.
3. **Next Track:** Advances smoothly to the next track in the catalogue.
4. **Previous Track:** Returns to the previous track, or rewinds to 00:00 if track has played for more than 3 seconds.
5. **Song Title Display:** Dynamic title rendering in both the editorial showcase deck and the persistent bottom control bar.
6. **Artist Name Display:** Editorial artist typography across showcase, catalogue, and control bar.
7. **Track Duration:** Dynamic duration formatting (`mm:ss`) derived from audio file metadata.
8. **Real-Time Progress Bar & Scrubbing:** Fluid progress bar displaying current time, remaining time, and interactive drag/click seeking.
9. **Volume Control & Memory Mute:** Precise volume slider with interactive speaker icon to toggle mute while preserving previous volume levels.

### Bonus & Portfolio Enhancements
* **Curated Archival Playlist:** Interactive track list displaying track indices, titles, artists, albums, and runtimes.
* **Active Track Highlight & Soundwave Bars:** Dynamic active state highlighting with subtle borders and animated micro equalizers for the active track.
* **Instant Track Selection:** Click or press enter on any playlist row to immediately switch and play that track.
* **Autoplay Mode:** Configurable toggle allowing tracks to automatically advance when finished.
* **Intelligent Shuffle:** Plays unrepeated randomized tracks across the catalogue.
* **3-Mode Repeat Cycle:** Seamless toggle between `Repeat All`, `Repeat One` (with badge indicator), and `Repeat Off`.
* **Complete Keyboard Hotkeys:** Instant controls for play/pause, track skipping, volume graduation, mute, repeat, and shuffle.
* **Light / Dark Mode Editorial Theme Toggle:** Bespoke warm editorial palettes (`#F5F1E8` light mode / `#151513` dark mode) with automatic system preference detection and `localStorage` persistence.
* **Live Audio Visualizer Bars:** Animated visual frequency bar overlay on album artwork indicating playback status.
* **Local Audio Drag & Drop / Ingestion:** Ingest personal MP3, WAV, or OGG audio files directly into the active catalogue.
* **Catalogue Search & Filter Chips:** Real-time search filtering by song title, artist, or album, alongside genre tag filters (All, Ambient, Acoustic, Cinematic).
* **Media Session API Integration:** Native operating system media notifications and hardware key integration.
* **Responsive Mobile Recomposition:** Mobile layout reorders elements logically (Artwork → Metadata → Controls → Progress → Volume → Catalogue) with comfortable touch targets.
* **Graceful Error Handling:** Non-intrusive editorial notifications when an audio file fails to load without crashing the player state.

---

## 3. Technologies Used

* **HTML5:** Semantic architecture (`<header>`, `<main>`, `<section>`, `<article>`, `<audio>`, `<dialog>`), ARIA accessibility roles and landmark navigation.
* **CSS3:** Native CSS Custom Properties (Design Tokens), CSS Grid, Flexbox, Fluid Typography (`clamp()`), subtle hardware-accelerated transitions, and `@media (prefers-reduced-motion: reduce)` compliance.
* **Vanilla JavaScript (ES6+):** Pure object-oriented state management, Event Listeners, HTML5 Audio API (`Audio.play()`, `Audio.pause()`, `currentTime`, `duration`, `volume`), Drag and Drop API, and File API.
* **Typography:** Google Fonts (*Cormorant Garamond* for editorial serif headings; *Plus Jakarta Sans* for modern clean controls and metadata).

---

## 4. Project Structure

```text
CodeAlpha_MusicPlayer/
│
├── index.html          # Semantic HTML5 markup and structure
├── style.css           # Modular CSS3 styling, design tokens, responsive breakpoints
├── script.js           # Vanilla JavaScript state manager, HTML5 Audio controller
├── README.md           # Professional project documentation
└── assets/
    ├── images/         # High-resolution editorial photography covers
    │   ├── afterglow.jpg
    │   ├── quiet-hours.jpg
    │   ├── after-rain.jpg
    │   ├── subtle-drift.jpg
    │   ├── memory-grain.jpg
    │   └── golden-hour.jpg
    │
    └── audio/          # Studio audio files (MP3 format)
        ├── afterglow.mp3
        ├── quiet-hours.mp3
        ├── after-rain.mp3
        ├── subtle-drift.mp3
        ├── memory-grain.mp3
        └── golden-hour.mp3
```

---

## 5. Keyboard Shortcuts

Press <kbd>?</kbd> at any time in the app to view the keyboard helper dialog:

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Play / Pause playback |
| <kbd>→</kbd> (Arrow Right) | Next track |
| <kbd>←</kbd> (Arrow Left) | Previous track (or rewind to 00:00) |
| <kbd>↑</kbd> (Arrow Up) | Increase volume by +5% |
| <kbd>↓</kbd> (Arrow Down) | Decrease volume by -5% |
| <kbd>M</kbd> | Mute / Restore volume |
| <kbd>R</kbd> | Cycle Repeat mode (*Repeat All* → *Repeat One* → *Off*) |
| <kbd>S</kbd> | Toggle Shuffle mode |
| <kbd>?</kbd> | Open Keyboard Shortcuts modal |
| <kbd>Esc</kbd> | Close open modals or banners |

*Note: Keyboard shortcuts are automatically disabled while focused in text inputs to prevent interference.*

---

## 6. How to Run Locally

### Option 1: Direct Browser Launch
1. Clone or download the repository to your local computer:
   ```bash
   git clone https://github.com/Ashaypatakare04/CodeAlpha_MusicPlayer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd CodeAlpha_MusicPlayer
   ```
3. Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Brave).

### Option 2: Local HTTP Server (Recommended)
Running through a local web server ensures optimal audio streaming:

* **Using Python:**
  ```bash
  python -m http.server 8000
  ```
  Open `http://localhost:8000` in your browser.

* **Using VS Code Live Server:**
  Right-click `index.html` in VS Code and select **"Open with Live Server"**.

* **Using Node.js (`npx serve`):**
  ```bash
  npx serve .
  ```

---

## 7. How to Add Custom Audio Files

You can add audio files in two ways:

### Method A: In-Browser Drag & Drop (Instant)
1. Simply drag any audio file (`.mp3`, `.wav`, `.ogg`, `.m4a`) from your desktop directly into the **"Add your personal audio files to the archive"** dropzone box at the bottom of the catalogue.
2. Alternatively, click the **"＋ Add Local Audio"** button in the Now Playing deck.
3. The track will immediately be added to the catalogue and ready to play!

### Method B: Adding Permanent Files to the Codebase
1. Copy your audio file into `assets/audio/` (e.g. `assets/audio/my-song.mp3`).
2. Add a cover image into `assets/images/` (e.g. `assets/images/my-cover.jpg`).
3. Open `script.js` and add a new entry to the `defaultTracks` array:
   ```javascript
   {
     id: 7,
     title: "Your Song Title",
     artist: "Artist Name",
     album: "Album Title",
     year: "2026",
     duration: "03:45",
     category: "ambient", // "ambient" | "acoustic" | "cinematic"
     audio: "assets/audio/my-song.mp3",
     cover: "assets/images/my-cover.jpg",
     description: "Archival notes regarding this selection."
   }
   ```
4. Save and refresh the browser.

---

## 8. Color Palette & Typography Tokens

| Token | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `#F5F1E8` | `#151513` | Document canvas |
| **Surface** | `#E8E2D7` | `#1E1E1B` | Frames, cards, dropzones |
| **Primary Text** | `#171714` | `#F1EEE7` | Major titles, headings |
| **Secondary Text** | `#68655D` | `#A8A49A` | Metadata, subtitles, runtimes |
| **Borders** | `#D8D2C5` | `#36342F` | Editorial hairline dividers |
| **Accent** | `#8A6A45` | `#C7A77A` | Buttons, progress bar, badges |

---

## 9. CodeAlpha Internship Details

* **Internship Program:** CodeAlpha Frontend Development Internship
* **Task Assigned:** Task 4 — Music Player
* **Candidate Name:** Ashay Patakare
* **GitHub Repository:** [https://github.com/Ashaypatakare04/CodeAlpha_MusicPlayer](https://github.com/Ashaypatakare04/CodeAlpha_MusicPlayer)
* **Live Demo:** [https://ashaypatakare04.github.io/CodeAlpha_MusicPlayer](https://ashaypatakare04.github.io/CodeAlpha_MusicPlayer) *(GitHub Pages)*

---

## 10. License

This project is open-source under the [MIT License](LICENSE). Audio tracks and photographic assets used for the demo archive are open-source and royalty-free under Creative Commons licensing.
