/**
 * ==============================================================================
 * BETWEEN THE FRAMES — Editorial Music Player & Digital Album Archive
 * CodeAlpha Frontend Development Internship — Task 4
 * ==============================================================================
 * Architecture:
 * - HTML5 Audio Engine & Reactive State Controller
 * - Multi-Deck Synchronization (Deck Showcase + Persistent Bottom Dock)
 * - Intelligent Unrepeated Shuffle & 3-Mode Repeat Cycle
 * - Search & Genre Filter Engine with Cohesive Track Navigation
 * - Local Audio File Ingestion with Asynchronous Metadata Duration Preload
 * - Complete Keyboard Hotkeys, ARIA Accessibility & Native Audio Event Sync
 * ==============================================================================
 */

'use strict';

// ------------------------------------------------------------------------------
// 1. Initial Archival Track Data
// ------------------------------------------------------------------------------
const defaultTracks = [
  {
    id: 1,
    title: "Afterglow",
    artist: "Aria Vale",
    album: "Between Light & Shadow",
    year: "2026",
    duration: "06:12",
    category: "ambient",
    audio: "assets/audio/afterglow.mp3",
    cover: "assets/images/afterglow.jpg",
    description: "Warm golden sunset harmonics drifting through open concrete corridors. Soft analog tape resonance meeting gentle melodic architecture."
  },
  {
    id: 2,
    title: "Quiet Hours",
    artist: "Aria Vale",
    album: "Between Light & Shadow",
    year: "2026",
    duration: "07:05",
    category: "acoustic",
    audio: "assets/audio/quiet-hours.mp3",
    cover: "assets/images/quiet-hours.jpg",
    description: "Misty nocturnal stillness and contemplative piano tones. Recorded at 3 AM with antique room microphones and delicate felt dampening."
  },
  {
    id: 3,
    title: "After Rain",
    artist: "Nova",
    album: "Places We Remember",
    year: "2025",
    duration: "05:44",
    category: "ambient",
    audio: "assets/audio/after-rain.mp3",
    cover: "assets/images/after-rain.jpg",
    description: "Reflections on rain-slicked pavement. Subtle hydrophone field recordings layered beneath lush ambient synthesizers."
  },
  {
    id: 4,
    title: "Subtle Drift",
    artist: "Kaelen",
    album: "Cinema of the Mind",
    year: "2025",
    duration: "05:02",
    category: "cinematic",
    audio: "assets/audio/subtle-drift.mp3",
    cover: "assets/images/subtle-drift.jpg",
    description: "Expansive oceanic horizons captured through slow modular panning. Evoking coastal fog, quiet lighthouses, and solitary passage."
  },
  {
    id: 5,
    title: "Memory Grain",
    artist: "Sören Lund",
    album: "Monochrome Studies",
    year: "2024",
    duration: "05:53",
    category: "acoustic",
    audio: "assets/audio/memory-grain.mp3",
    cover: "assets/images/memory-grain.jpg",
    description: "Monochrome brutalist acoustic reflections. Analog vinyl crackle intertwining with warm acoustic cello and upright bass."
  },
  {
    id: 6,
    title: "Golden Hour Architecture",
    artist: "Elena Rostova",
    album: "Between the Frames",
    year: "2026",
    duration: "04:39",
    category: "cinematic",
    audio: "assets/audio/golden-hour.mp3",
    cover: "assets/images/golden-hour.jpg",
    description: "Amber sunlight casting long geometric shadows across contemporary gallery halls. Grand chord progressions with neoclassical weight."
  }
];

// ------------------------------------------------------------------------------
// 2. Application State
// ------------------------------------------------------------------------------
const state = {
  playlist: [...defaultTracks],
  currentTrackIndex: 0,
  isPlaying: false,
  isMuted: false,
  volume: 0.8,
  previousVolume: 0.8,
  isShuffle: false,
  shuffleHistory: [], // Stack of played track indices in shuffle mode
  repeatMode: 'all',  // 'off' | 'all' | 'one'
  autoplay: true,
  currentFilter: 'all',
  searchQuery: '',
  isDraggingSeek: false
};

// ------------------------------------------------------------------------------
// 3. DOM Element References
// ------------------------------------------------------------------------------
const DOM = {
  audio: document.getElementById('audio-player'),

  // Editorial Hero & Metadata
  archiveCount: document.getElementById('archive-count'),
  statusIndicator: document.getElementById('status-indicator'),
  notificationBanner: document.getElementById('notification-banner'),
  notificationText: document.getElementById('notification-text'),
  notificationClose: document.getElementById('notification-close'),

  // Deck (Left Showcase)
  trackIndexBadge: document.getElementById('display-track-index'),
  albumCover: document.getElementById('album-cover'),
  trackYear: document.getElementById('display-track-year'),
  trackTitle: document.getElementById('display-track-title'),
  trackArtist: document.getElementById('display-track-artist'),
  trackAlbum: document.getElementById('display-track-album'),
  trackDesc: document.getElementById('display-track-desc'),

  deckCurrentTime: document.getElementById('deck-current-time'),
  deckTotalDuration: document.getElementById('deck-total-duration'),
  deckProgressBar: document.getElementById('deck-progress-bar'),
  deckProgressFill: document.getElementById('deck-progress-fill'),

  deckPlayBtn: document.getElementById('deck-play-btn'),
  deckPrevBtn: document.getElementById('deck-prev-btn'),
  deckNextBtn: document.getElementById('deck-next-btn'),
  deckShuffleBtn: document.getElementById('deck-shuffle-btn'),
  deckRepeatBtn: document.getElementById('deck-repeat-btn'),
  deckRepeatBadge: document.getElementById('deck-repeat-badge'),

  // Deck Volume Controls (Accessible Desktop & Mobile)
  deckMuteBtn: document.getElementById('deck-mute-btn'),
  deckVolumeSlider: document.getElementById('deck-volume-slider'),
  deckVolumeFill: document.getElementById('deck-volume-fill'),
  deckVolumeValueText: document.getElementById('deck-volume-value-text'),

  addTrackTrigger: document.getElementById('add-track-trigger'),
  copyTrackLinkBtn: document.getElementById('copy-track-link-btn'),

  // Catalogue & Playlist (Right Column)
  playlistCountBadge: document.getElementById('playlist-count-badge'),
  playlistSearch: document.getElementById('playlist-search'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  filterChips: document.querySelectorAll('.chip-btn'),
  playlistItemsList: document.getElementById('playlist-items-list'),
  localDropzone: document.getElementById('local-dropzone'),
  localFileInput: document.getElementById('local-file-input'),

  // Persistent Bottom Control Bar
  barThumbnail: document.getElementById('bar-thumbnail'),
  barTitle: document.getElementById('bar-title'),
  barArtist: document.getElementById('bar-artist'),

  barPlayBtn: document.getElementById('bar-play-btn'),
  barPrevBtn: document.getElementById('bar-prev-btn'),
  barNextBtn: document.getElementById('bar-next-btn'),
  barShuffleBtn: document.getElementById('bar-shuffle-btn'),
  barRepeatBtn: document.getElementById('bar-repeat-btn'),
  barRepeatBadge: document.getElementById('bar-repeat-badge'),

  barCurrentTime: document.getElementById('bar-current-time'),
  barTotalDuration: document.getElementById('bar-total-duration'),
  barProgressSlider: document.getElementById('bar-progress-slider'),
  barProgressFill: document.getElementById('bar-progress-fill'),

  // Bar Volume & Extras
  muteBtn: document.getElementById('mute-btn'),
  volumeSlider: document.getElementById('volume-slider'),
  volumeFill: document.getElementById('volume-fill'),
  volumeValueText: document.getElementById('volume-value-text'),
  autoplayToggleBtn: document.getElementById('autoplay-toggle-btn'),

  // Modals & Navigation
  shortcutsBtn: document.getElementById('shortcuts-btn'),
  shortcutsModal: document.getElementById('shortcuts-modal'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  navLinks: document.querySelectorAll('.nav-link')
};

// ------------------------------------------------------------------------------
// 4. Utility Functions
// ------------------------------------------------------------------------------

/**
 * Formats time in seconds to mm:ss format.
 */
function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Escapes HTML characters for safe template rendering.
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Updates the hero status indicator.
 */
function updateStatus(label, type = 'ready') {
  if (!DOM.statusIndicator) return;
  let dotClass = 'pulse-dot';
  if (type === 'active') dotClass = 'pulse-dot active';
  if (type === 'waiting') dotClass = 'pulse-dot waiting';
  if (type === 'notice') dotClass = 'pulse-dot notice';

  DOM.statusIndicator.innerHTML = `<span class="${dotClass}" aria-hidden="true"></span> ${escapeHTML(label)}`;
}

/**
 * Updates total archive selections counter in hero.
 */
function updateArchiveCount() {
  if (!DOM.archiveCount) return;
  const count = state.playlist.length;
  DOM.archiveCount.textContent = `${count < 10 ? '0' : ''}${count} Selection${count === 1 ? '' : 's'}`;
}

// ------------------------------------------------------------------------------
// 5. Track Management & Playback Core
// ------------------------------------------------------------------------------

/**
 * Loads a track by index from the active playlist.
 */
function loadTrack(index, autoPlayAfterLoad = false) {
  if (!state.playlist || state.playlist.length === 0) return;

  // Clamp index safely
  if (index < 0) index = state.playlist.length - 1;
  if (index >= state.playlist.length) index = 0;

  state.currentTrackIndex = index;
  const track = state.playlist[index];

  // Set audio source
  DOM.audio.src = track.audio;
  DOM.audio.load();

  // Update Left Showcase Editorial View
  const indexFormatted = (index + 1 < 10 ? '0' : '') + (index + 1);
  const totalFormatted = (state.playlist.length < 10 ? '0' : '') + state.playlist.length;
  DOM.trackIndexBadge.textContent = `${indexFormatted} / ${totalFormatted}`;

  DOM.albumCover.src = track.cover;
  DOM.albumCover.alt = `Album cover for ${track.title} by ${track.artist}`;
  DOM.trackTitle.textContent = track.title;
  DOM.trackArtist.textContent = track.artist;
  DOM.trackAlbum.textContent = track.album;
  DOM.trackYear.textContent = track.year || '2026';
  DOM.trackDesc.textContent = `"${track.description || 'Preserved listening selection from the archive.'}"`;

  DOM.deckCurrentTime.textContent = '00:00';
  DOM.deckTotalDuration.textContent = track.duration || '00:00';
  DOM.deckProgressBar.value = 0;
  DOM.deckProgressBar.setAttribute('aria-valuenow', '0');
  DOM.deckProgressFill.style.width = '0%';

  // Update Persistent Bar View
  DOM.barThumbnail.src = track.cover;
  DOM.barThumbnail.alt = `Current track: ${track.title}`;
  DOM.barTitle.textContent = track.title;
  DOM.barArtist.textContent = track.artist;
  DOM.barCurrentTime.textContent = '00:00';
  DOM.barTotalDuration.textContent = track.duration || '00:00';
  DOM.barProgressSlider.value = 0;
  DOM.barProgressSlider.setAttribute('aria-valuenow', '0');
  DOM.barProgressFill.style.width = '0%';

  // Update Playlist active highlight
  renderPlaylist();

  // Update document title & OS media session
  updateMediaSession(track);

  if (autoPlayAfterLoad) {
    playTrack();
  } else {
    syncPlayPauseUI(false);
  }
}

/**
 * Starts audio playback.
 */
function playTrack() {
  const playPromise = DOM.audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        state.isPlaying = true;
        syncPlayPauseUI(true);
        updateStatus('Active Playback', 'active');
        hideNotification();
      })
      .catch((error) => {
        console.warn('Playback initiation error:', error);
        state.isPlaying = false;
        syncPlayPauseUI(false);
        updateStatus('System Ready', 'ready');

        if (error.name !== 'AbortError') {
          showNotification(
            `Playback notice: Tap play or check that "${state.playlist[state.currentTrackIndex]?.title}" audio is accessible in assets/audio/.`
          );
        }
      });
  }
}

/**
 * Pauses audio playback.
 */
function pauseTrack() {
  DOM.audio.pause();
  state.isPlaying = false;
  syncPlayPauseUI(false);
  updateStatus('Playback Paused', 'ready');
}

/**
 * Toggles between play and pause.
 */
function togglePlayPause() {
  if (DOM.audio.paused) {
    playTrack();
  } else {
    pauseTrack();
  }
}

/**
 * Advances to the next track.
 * Respects active filters, search criteria, shuffle history, and repeat modes.
 */
function nextTrack() {
  if (state.playlist.length === 0) return;

  const filtered = getFilteredTracks();
  const targetPool = filtered.length > 0 ? filtered : state.playlist.map((track, originalIndex) => ({ track, originalIndex }));

  if (targetPool.length === 0) return;

  // Single track case
  if (targetPool.length === 1) {
    if (state.repeatMode === 'off') {
      pauseTrack();
      DOM.audio.currentTime = 0;
      updateProgressUI(0, DOM.audio.duration);
      return;
    }
    loadTrack(targetPool[0].originalIndex, true);
    return;
  }

  let nextOriginalIndex;

  if (state.isShuffle) {
    // Record current track in shuffle history before advancing
    if (!state.shuffleHistory.includes(state.currentTrackIndex)) {
      state.shuffleHistory.push(state.currentTrackIndex);
    }

    // Unplayed tracks within active target pool
    const unplayed = targetPool.filter(item => !state.shuffleHistory.includes(item.originalIndex) && item.originalIndex !== state.currentTrackIndex);

    if (unplayed.length > 0) {
      const pick = unplayed[Math.floor(Math.random() * unplayed.length)];
      nextOriginalIndex = pick.originalIndex;
    } else {
      // All tracks have been played: reset history and pick any other track
      state.shuffleHistory = [state.currentTrackIndex];
      const others = targetPool.filter(item => item.originalIndex !== state.currentTrackIndex);
      const pick = others[Math.floor(Math.random() * others.length)];
      nextOriginalIndex = pick.originalIndex;
    }
  } else {
    // Sequential navigation within target pool
    const currentPoolIndex = targetPool.findIndex(item => item.originalIndex === state.currentTrackIndex);

    if (currentPoolIndex === -1) {
      // Current track is not in filtered pool; start at beginning of pool
      nextOriginalIndex = targetPool[0].originalIndex;
    } else {
      const nextPoolIndex = currentPoolIndex + 1;
      if (nextPoolIndex >= targetPool.length) {
        if (state.repeatMode === 'off') {
          pauseTrack();
          DOM.audio.currentTime = 0;
          updateProgressUI(0, DOM.audio.duration);
          return;
        }
        nextOriginalIndex = targetPool[0].originalIndex;
      } else {
        nextOriginalIndex = targetPool[nextPoolIndex].originalIndex;
      }
    }
  }

  loadTrack(nextOriginalIndex, true);
}

/**
 * Returns to the previous track (or restarts track if past 3 seconds).
 */
function previousTrack() {
  if (state.playlist.length === 0) return;

  // If track has been playing for more than 3 seconds, rewind current track
  if (DOM.audio.currentTime > 3) {
    DOM.audio.currentTime = 0;
    if (state.isPlaying) {
      playTrack();
    } else {
      updateProgressUI(0, DOM.audio.duration);
    }
    return;
  }

  const filtered = getFilteredTracks();
  const targetPool = filtered.length > 0 ? filtered : state.playlist.map((track, originalIndex) => ({ track, originalIndex }));

  if (targetPool.length === 0) return;

  let prevOriginalIndex;

  if (state.isShuffle && state.shuffleHistory.length > 0) {
    // Step back in shuffle history
    prevOriginalIndex = state.shuffleHistory.pop();
    if (prevOriginalIndex === state.currentTrackIndex && state.shuffleHistory.length > 0) {
      prevOriginalIndex = state.shuffleHistory.pop();
    }
  } else {
    const currentPoolIndex = targetPool.findIndex(item => item.originalIndex === state.currentTrackIndex);

    if (currentPoolIndex === -1) {
      prevOriginalIndex = targetPool[targetPool.length - 1].originalIndex;
    } else {
      const prevPoolIndex = currentPoolIndex - 1;
      if (prevPoolIndex < 0) {
        prevOriginalIndex = targetPool[targetPool.length - 1].originalIndex;
      } else {
        prevOriginalIndex = targetPool[prevPoolIndex].originalIndex;
      }
    }
  }

  loadTrack(prevOriginalIndex, true);
}

/**
 * Selects and plays a specific track by its original playlist index.
 */
function selectTrack(index) {
  if (index === state.currentTrackIndex) {
    togglePlayPause();
  } else {
    loadTrack(index, true);
  }
}

/**
 * Seeks to a proportional percentage in the active audio track.
 */
function seekTrack(percentage) {
  if (!DOM.audio.duration || isNaN(DOM.audio.duration) || !isFinite(DOM.audio.duration)) return;
  const clamped = Math.max(0, Math.min(100, percentage));
  const targetTime = (clamped / 100) * DOM.audio.duration;
  DOM.audio.currentTime = targetTime;
  updateProgressUI(targetTime, DOM.audio.duration);
}

// ------------------------------------------------------------------------------
// 6. UI Synchronization & Progress Updates
// ------------------------------------------------------------------------------

/**
 * Synchronizes play/pause button states across all components.
 */
function syncPlayPauseUI(isPlaying) {
  document.body.classList.toggle('is-playing', isPlaying);

  // Deck Button
  const deckPlayIcon = DOM.deckPlayBtn.querySelector('.icon-play');
  const deckPauseIcon = DOM.deckPlayBtn.querySelector('.icon-pause');
  if (deckPlayIcon && deckPauseIcon) {
    deckPlayIcon.style.display = isPlaying ? 'none' : 'block';
    deckPauseIcon.style.display = isPlaying ? 'block' : 'none';
  }
  DOM.deckPlayBtn.setAttribute('aria-label', isPlaying ? 'Pause track' : 'Play track');

  // Bar Button
  const barPlayIcon = DOM.barPlayBtn.querySelector('.icon-play');
  const barPauseIcon = DOM.barPlayBtn.querySelector('.icon-pause');
  if (barPlayIcon && barPauseIcon) {
    barPlayIcon.style.display = isPlaying ? 'none' : 'block';
    barPauseIcon.style.display = isPlaying ? 'block' : 'none';
  }
  DOM.barPlayBtn.setAttribute('aria-label', isPlaying ? 'Pause track' : 'Play track');

  // Update document title
  const current = state.playlist[state.currentTrackIndex];
  if (current) {
    document.title = isPlaying 
      ? `▶ ${current.title} — Between the Frames`
      : `${current.title} — Between the Frames | CodeAlpha`;
  }

  // Update playing indicator in playlist rows
  renderPlaylist();
}

/**
 * Updates progress sliders, fills, and timestamps.
 */
function updateProgressUI(currentTime, duration) {
  if (isNaN(duration) || !isFinite(duration) || duration <= 0) return;

  const percentage = Math.max(0, Math.min(100, (currentTime / duration) * 100));
  const timeFormatted = formatTime(currentTime);
  const durationFormatted = formatTime(duration);

  // Deck Progress
  if (!state.isDraggingSeek) {
    DOM.deckProgressBar.value = percentage;
    DOM.deckProgressBar.setAttribute('aria-valuenow', percentage.toFixed(1));
    DOM.deckProgressFill.style.width = `${percentage}%`;
  }
  DOM.deckCurrentTime.textContent = timeFormatted;
  DOM.deckTotalDuration.textContent = durationFormatted;

  // Bar Progress
  if (!state.isDraggingSeek) {
    DOM.barProgressSlider.value = percentage;
    DOM.barProgressSlider.setAttribute('aria-valuenow', percentage.toFixed(1));
    DOM.barProgressFill.style.width = `${percentage}%`;
  }
  DOM.barCurrentTime.textContent = timeFormatted;
  DOM.barTotalDuration.textContent = durationFormatted;

  // OS Media Session Position State
  if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
    try {
      navigator.mediaSession.setPositionState({
        duration: duration,
        playbackRate: DOM.audio.playbackRate || 1,
        position: Math.min(currentTime, duration)
      });
    } catch (e) {
      // Ignored for environments where mediaSession position state is restricted
    }
  }
}

// ------------------------------------------------------------------------------
// 7. Volume & Mute Controls
// ------------------------------------------------------------------------------

/**
 * Sets playback volume (0.0 to 1.0).
 */
function setVolume(value) {
  const vol = Math.max(0, Math.min(1, Math.round(value * 100) / 100));
  state.volume = vol;
  DOM.audio.volume = vol;

  if (vol > 0) {
    state.isMuted = false;
  }

  syncVolumeUI();
}

/**
 * Toggles mute with volume memory.
 */
function toggleMute() {
  if (state.isMuted || DOM.audio.volume === 0) {
    // Unmute
    state.isMuted = false;
    const restore = state.previousVolume > 0 ? state.previousVolume : 0.8;
    setVolume(restore);
  } else {
    // Mute
    state.previousVolume = state.volume > 0 ? state.volume : 0.8;
    state.isMuted = true;
    DOM.audio.volume = 0;
    syncVolumeUI();
  }
}

/**
 * Synchronizes volume sliders, fill bars, and icons across Deck & Persistent Bar.
 */
function syncVolumeUI() {
  const percent = Math.round((state.isMuted ? 0 : DOM.audio.volume) * 100);

  // Persistent Bar Volume
  DOM.volumeSlider.value = percent;
  DOM.volumeSlider.setAttribute('aria-valuenow', percent);
  DOM.volumeFill.style.width = `${percent}%`;
  DOM.volumeValueText.textContent = `${percent}%`;

  // Deck Volume (if available)
  if (DOM.deckVolumeSlider) {
    DOM.deckVolumeSlider.value = percent;
    DOM.deckVolumeSlider.setAttribute('aria-valuenow', percent);
    DOM.deckVolumeFill.style.width = `${percent}%`;
    DOM.deckVolumeValueText.textContent = `${percent}%`;
  }

  // Update Mute Icons (Bar)
  const barHighIcon = DOM.muteBtn.querySelector('.icon-volume-high');
  const barMuteIcon = DOM.muteBtn.querySelector('.icon-volume-muted');
  if (state.isMuted || percent === 0) {
    if (barHighIcon) barHighIcon.style.display = 'none';
    if (barMuteIcon) barMuteIcon.style.display = 'block';
    DOM.muteBtn.setAttribute('aria-label', 'Unmute audio');
  } else {
    if (barHighIcon) barHighIcon.style.display = 'block';
    if (barMuteIcon) barMuteIcon.style.display = 'none';
    DOM.muteBtn.setAttribute('aria-label', 'Mute audio');
  }

  // Update Mute Icons (Deck)
  if (DOM.deckMuteBtn) {
    const deckHighIcon = DOM.deckMuteBtn.querySelector('.icon-volume-high');
    const deckMuteIcon = DOM.deckMuteBtn.querySelector('.icon-volume-muted');
    if (state.isMuted || percent === 0) {
      if (deckHighIcon) deckHighIcon.style.display = 'none';
      if (deckMuteIcon) deckMuteIcon.style.display = 'block';
      DOM.deckMuteBtn.setAttribute('aria-label', 'Unmute audio');
    } else {
      if (deckHighIcon) deckHighIcon.style.display = 'block';
      if (deckMuteIcon) deckMuteIcon.style.display = 'none';
      DOM.deckMuteBtn.setAttribute('aria-label', 'Mute audio');
    }
  }
}

// ------------------------------------------------------------------------------
// 8. Shuffle & Repeat Modes
// ------------------------------------------------------------------------------

/**
 * Toggles shuffle mode.
 */
function toggleShuffle() {
  state.isShuffle = !state.isShuffle;
  state.shuffleHistory = [];

  DOM.deckShuffleBtn.classList.toggle('active', state.isShuffle);
  DOM.barShuffleBtn.classList.toggle('active', state.isShuffle);

  DOM.deckShuffleBtn.setAttribute('aria-pressed', state.isShuffle ? 'true' : 'false');
  DOM.barShuffleBtn.setAttribute('aria-pressed', state.isShuffle ? 'true' : 'false');

  showNotification(`Shuffle mode ${state.isShuffle ? 'enabled' : 'disabled'}`);
}

/**
 * Cycles through Repeat modes: 'all' -> 'one' -> 'off' -> 'all'.
 */
function toggleRepeat() {
  if (state.repeatMode === 'all') {
    state.repeatMode = 'one';
  } else if (state.repeatMode === 'one') {
    state.repeatMode = 'off';
  } else {
    state.repeatMode = 'all';
  }

  syncRepeatUI();
}

/**
 * Updates repeat buttons visual states, tooltips, and badges.
 */
function syncRepeatUI() {
  const isOne = state.repeatMode === 'one';
  const isOff = state.repeatMode === 'off';

  DOM.deckRepeatBtn.classList.toggle('active', !isOff);
  DOM.barRepeatBtn.classList.toggle('active', !isOff);

  const badgeText = isOne ? '1' : '';
  DOM.deckRepeatBadge.textContent = badgeText;
  DOM.barRepeatBadge.textContent = badgeText;

  let modeLabel = 'Repeat All';
  if (isOne) modeLabel = 'Repeat One';
  if (isOff) modeLabel = 'Repeat Off';

  DOM.deckRepeatBtn.setAttribute('title', `Repeat Mode: ${modeLabel} (R)`);
  DOM.barRepeatBtn.setAttribute('title', `Repeat Mode: ${modeLabel} (R)`);
  DOM.deckRepeatBtn.setAttribute('aria-label', `Repeat mode: ${modeLabel}`);
  DOM.barRepeatBtn.setAttribute('aria-label', `Repeat mode: ${modeLabel}`);

  showNotification(`Repeat mode set to: ${modeLabel}`);
}

/**
 * Toggles autoplay behaviour.
 */
function toggleAutoplay() {
  state.autoplay = !state.autoplay;
  DOM.autoplayToggleBtn.setAttribute('aria-pressed', state.autoplay ? 'true' : 'false');
  DOM.autoplayToggleBtn.setAttribute('title', `Autoplay: ${state.autoplay ? 'Enabled' : 'Disabled'}`);
  showNotification(`Autoplay ${state.autoplay ? 'enabled' : 'disabled'}`);
}

// ------------------------------------------------------------------------------
// 9. Playlist Rendering & Filtering
// ------------------------------------------------------------------------------

/**
 * Returns filtered tracks based on search query and category chip.
 */
function getFilteredTracks() {
  const query = state.searchQuery.trim().toLowerCase();
  const filter = state.currentFilter.toLowerCase();

  return state.playlist.map((track, originalIndex) => ({ track, originalIndex }))
    .filter(({ track }) => {
      // Category filter
      const trackCategory = (track.category || '').toLowerCase();
      const matchesCategory = (filter === 'all') || (trackCategory === filter);

      // Search filter
      const matchesSearch = query === '' ||
        (track.title && track.title.toLowerCase().includes(query)) ||
        (track.artist && track.artist.toLowerCase().includes(query)) ||
        (track.album && track.album.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
}

/**
 * Renders playlist items to the DOM.
 */
function renderPlaylist() {
  const filtered = getFilteredTracks();
  DOM.playlistItemsList.innerHTML = '';

  DOM.playlistCountBadge.textContent = `${filtered.length} Work${filtered.length === 1 ? '' : 's'}`;

  if (filtered.length === 0) {
    const emptyRow = document.createElement('li');
    emptyRow.className = 'playlist-empty-state';
    emptyRow.style.padding = 'var(--space-xl) var(--space-md)';
    emptyRow.style.textAlign = 'center';
    emptyRow.style.color = 'var(--secondary-text)';
    emptyRow.style.fontSize = '0.9rem';
    emptyRow.textContent = 'No archive selections match your search criteria.';
    DOM.playlistItemsList.appendChild(emptyRow);
    return;
  }

  filtered.forEach(({ track, originalIndex }) => {
    const isActive = originalIndex === state.currentTrackIndex;
    const isPlaying = isActive && state.isPlaying;

    const li = document.createElement('li');
    li.className = `playlist-item${isActive ? ' active' : ''}${isPlaying ? ' is-playing' : ''}`;
    li.setAttribute('role', 'listitem');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `Track ${originalIndex + 1}: ${track.title} by ${track.artist}`);

    const indexNumberFormatted = (originalIndex + 1 < 10 ? '0' : '') + (originalIndex + 1);

    li.innerHTML = `
      <div class="track-row-index">
        <span class="index-number">${indexNumberFormatted}</span>
        <div class="playing-bars" aria-hidden="true">
          <span class="bar-pip"></span>
          <span class="bar-pip"></span>
          <span class="bar-pip"></span>
        </div>
      </div>
      <div class="track-row-main">
        <span class="track-row-title">${escapeHTML(track.title)}</span>
        <span class="track-row-artist">${escapeHTML(track.artist)}</span>
      </div>
      <div class="track-row-album">${escapeHTML(track.album || 'Archive Edition')}</div>
      <div class="track-row-duration">${escapeHTML(track.duration || '--:--')}</div>
    `;

    // Click to select
    li.addEventListener('click', () => {
      selectTrack(originalIndex);
    });

    // Enter/Space keyboard selection
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        selectTrack(originalIndex);
      }
    });

    DOM.playlistItemsList.appendChild(li);
  });
}

// ------------------------------------------------------------------------------
// 10. Local File Ingestion & Drag-and-Drop
// ------------------------------------------------------------------------------

/**
 * Ingests audio files selected via file input or drag-and-drop.
 * Asynchronously preloads duration metadata for instant catalogue integration.
 */
function ingestLocalFiles(files) {
  if (!files || files.length === 0) return;

  let addedCount = 0;
  const firstNewIndex = state.playlist.length;

  Array.from(files).forEach((file) => {
    if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)) {
      const audioUrl = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      const newIndex = state.playlist.length + 1;

      // Extract title and artist guess from filename
      let title = cleanName;
      let artist = 'Local Audio';
      if (cleanName.includes(' - ')) {
        const parts = cleanName.split(' - ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      }

      // Rotate through archival cover images for visual variety
      const coverOptions = [
        'assets/images/afterglow.jpg',
        'assets/images/quiet-hours.jpg',
        'assets/images/after-rain.jpg',
        'assets/images/subtle-drift.jpg',
        'assets/images/memory-grain.jpg',
        'assets/images/golden-hour.jpg'
      ];
      const selectedCover = coverOptions[(newIndex - 1) % coverOptions.length];

      const newTrack = {
        id: newIndex,
        title: title,
        artist: artist,
        album: 'Personal Archive',
        year: new Date().getFullYear().toString(),
        duration: '--:--',
        category: 'ambient',
        audio: audioUrl,
        cover: selectedCover,
        description: `Imported audio selection: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`
      };

      // Preload duration asynchronously with temporary audio element
      const tempAudio = new Audio();
      tempAudio.src = audioUrl;
      tempAudio.addEventListener('loadedmetadata', () => {
        if (!isNaN(tempAudio.duration) && tempAudio.duration > 0) {
          newTrack.duration = formatTime(tempAudio.duration);
          renderPlaylist();
        }
      });

      state.playlist.push(newTrack);
      addedCount++;
    }
  });

  if (addedCount > 0) {
    // Reset filters and search so new tracks appear immediately
    state.currentFilter = 'all';
    state.searchQuery = '';
    DOM.playlistSearch.value = '';
    DOM.searchClearBtn.hidden = true;
    DOM.filterChips.forEach((chip) => {
      const isAll = chip.getAttribute('data-filter') === 'all';
      chip.classList.toggle('active', isAll);
      chip.setAttribute('aria-checked', isAll ? 'true' : 'false');
    });

    updateArchiveCount();
    renderPlaylist();
    showNotification(`Successfully added ${addedCount} local audio selection${addedCount > 1 ? 's' : ''} to catalogue.`);
    
    // Auto-select and play the first newly added track
    selectTrack(firstNewIndex);
  } else {
    showNotification('Please select valid audio files (.mp3, .wav, .ogg, .m4a).');
  }
}

// ------------------------------------------------------------------------------
// 11. Theme Management (Light / Dark)
// ------------------------------------------------------------------------------

/**
 * Reads saved theme safely with fallback.
 */
function getStoredTheme() {
  try {
    return localStorage.getItem('btf_theme');
  } catch (e) {
    return null;
  }
}

/**
 * Saves theme preference safely.
 */
function setStoredTheme(theme) {
  try {
    localStorage.setItem('btf_theme', theme);
  } catch (e) {
    // Storage quota or private browsing restriction
  }
}

/**
 * Initializes theme based on preference or system settings.
 */
function initTheme() {
  const savedTheme = getStoredTheme();
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  setTheme(initialTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  setStoredTheme(theme);
  if (DOM.themeToggleBtn) {
    const isDark = theme === 'dark';
    DOM.themeToggleBtn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
    DOM.themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const target = current === 'dark' ? 'light' : 'dark';
  setTheme(target);
}

// ------------------------------------------------------------------------------
// 12. Notification Banner / Toast
// ------------------------------------------------------------------------------
let notificationTimer = null;

function showNotification(message, durationMs = 4500) {
  if (!DOM.notificationBanner) return;

  DOM.notificationText.textContent = message;
  DOM.notificationBanner.removeAttribute('hidden');

  if (notificationTimer) clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => {
    hideNotification();
  }, durationMs);
}

function hideNotification() {
  if (!DOM.notificationBanner) return;
  DOM.notificationBanner.setAttribute('hidden', '');
  if (notificationTimer) clearTimeout(notificationTimer);
}

// ------------------------------------------------------------------------------
// 13. Media Session API (OS Media Notifications)
// ------------------------------------------------------------------------------
function updateMediaSession(track) {
  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album || 'Between the Frames',
        artwork: [
          { src: track.cover, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => playTrack());
      navigator.mediaSession.setActionHandler('pause', () => pauseTrack());
      navigator.mediaSession.setActionHandler('previoustrack', () => previousTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && DOM.audio.duration) {
          DOM.audio.currentTime = details.seekTime;
          updateProgressUI(details.seekTime, DOM.audio.duration);
        }
      });
    } catch (e) {
      console.warn('MediaSession initialization notice:', e);
    }
  }
}

// ------------------------------------------------------------------------------
// 14. Event Listeners & Binding
// ------------------------------------------------------------------------------
function bindEventListeners() {

  // --- HTML5 Audio Element Core Events ---

  // Metadata loaded
  DOM.audio.addEventListener('loadedmetadata', () => {
    const duration = DOM.audio.duration;
    if (!isNaN(duration) && duration > 0) {
      const formatted = formatTime(duration);
      DOM.deckTotalDuration.textContent = formatted;
      DOM.barTotalDuration.textContent = formatted;
      
      // Update state playlist item duration if uncalculated
      if (state.playlist[state.currentTrackIndex]) {
        state.playlist[state.currentTrackIndex].duration = formatted;
        renderPlaylist();
      }
    }
  });

  // Time update during playback
  DOM.audio.addEventListener('timeupdate', () => {
    if (!state.isDraggingSeek && DOM.audio.duration) {
      updateProgressUI(DOM.audio.currentTime, DOM.audio.duration);
    }
  });

  // Track finished playing (ended event)
  DOM.audio.addEventListener('ended', () => {
    if (state.repeatMode === 'one') {
      DOM.audio.currentTime = 0;
      playTrack();
    } else if (state.autoplay) {
      nextTrack();
    } else {
      pauseTrack();
      DOM.audio.currentTime = 0;
      updateProgressUI(0, DOM.audio.duration);
    }
  });

  // Audio play event (syncs external/OS play events)
  DOM.audio.addEventListener('play', () => {
    state.isPlaying = true;
    syncPlayPauseUI(true);
    updateStatus('Active Playback', 'active');
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'playing';
    }
  });

  // Audio pause event (syncs external/OS pause events)
  DOM.audio.addEventListener('pause', () => {
    state.isPlaying = false;
    syncPlayPauseUI(false);
    updateStatus('Playback Paused', 'ready');
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused';
    }
  });

  // Audio waiting / buffering
  DOM.audio.addEventListener('waiting', () => {
    updateStatus('Buffering...', 'waiting');
  });

  // Audio playing resumed
  DOM.audio.addEventListener('playing', () => {
    updateStatus('Active Playback', 'active');
  });

  // Audio error handling
  DOM.audio.addEventListener('error', (e) => {
    console.error('Audio playback error:', e);
    const track = state.playlist[state.currentTrackIndex];
    showNotification(
      `Audio playback notice: Unable to decode "${track?.title}". Please verify audio file in assets/audio/ or load a local track.`
    );
    updateStatus('Audio Notice', 'notice');
    syncPlayPauseUI(false);
  });

  // --- Deck Controls ---
  DOM.deckPlayBtn.addEventListener('click', togglePlayPause);
  DOM.deckPrevBtn.addEventListener('click', previousTrack);
  DOM.deckNextBtn.addEventListener('click', nextTrack);
  DOM.deckShuffleBtn.addEventListener('click', toggleShuffle);
  DOM.deckRepeatBtn.addEventListener('click', toggleRepeat);

  // Deck Progress Slider
  DOM.deckProgressBar.addEventListener('input', (e) => {
    state.isDraggingSeek = true;
    const val = parseFloat(e.target.value);
    DOM.deckProgressFill.style.width = `${val}%`;
    DOM.barProgressSlider.value = val;
    DOM.barProgressFill.style.width = `${val}%`;
    if (DOM.audio.duration) {
      const seekTime = (val / 100) * DOM.audio.duration;
      DOM.deckCurrentTime.textContent = formatTime(seekTime);
      DOM.barCurrentTime.textContent = formatTime(seekTime);
    }
  });

  DOM.deckProgressBar.addEventListener('change', (e) => {
    state.isDraggingSeek = false;
    seekTrack(parseFloat(e.target.value));
  });

  // Wrapper click fallback for Deck progress
  if (DOM.deckProgressBar.parentElement) {
    DOM.deckProgressBar.parentElement.addEventListener('click', (e) => {
      if (e.target !== DOM.deckProgressBar) {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        seekTrack(percent);
      }
    });
  }

  // Deck Volume Controls (if available)
  if (DOM.deckVolumeSlider) {
    DOM.deckVolumeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      setVolume(val / 100);
    });

    if (DOM.deckVolumeSlider.parentElement) {
      DOM.deckVolumeSlider.parentElement.addEventListener('click', (e) => {
        if (e.target !== DOM.deckVolumeSlider) {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
          setVolume(percent / 100);
        }
      });
    }
  }

  if (DOM.deckMuteBtn) {
    DOM.deckMuteBtn.addEventListener('click', toggleMute);
  }

  // --- Persistent Bar Controls ---
  DOM.barPlayBtn.addEventListener('click', togglePlayPause);
  DOM.barPrevBtn.addEventListener('click', previousTrack);
  DOM.barNextBtn.addEventListener('click', nextTrack);
  DOM.barShuffleBtn.addEventListener('click', toggleShuffle);
  DOM.barRepeatBtn.addEventListener('click', toggleRepeat);

  // Bar Progress Slider
  DOM.barProgressSlider.addEventListener('input', (e) => {
    state.isDraggingSeek = true;
    const val = parseFloat(e.target.value);
    DOM.barProgressFill.style.width = `${val}%`;
    DOM.deckProgressBar.value = val;
    DOM.deckProgressFill.style.width = `${val}%`;
    if (DOM.audio.duration) {
      const seekTime = (val / 100) * DOM.audio.duration;
      DOM.barCurrentTime.textContent = formatTime(seekTime);
      DOM.deckCurrentTime.textContent = formatTime(seekTime);
    }
  });

  DOM.barProgressSlider.addEventListener('change', (e) => {
    state.isDraggingSeek = false;
    seekTrack(parseFloat(e.target.value));
  });

  // Wrapper click fallback for Bar progress
  if (DOM.barProgressSlider.parentElement) {
    DOM.barProgressSlider.parentElement.addEventListener('click', (e) => {
      if (e.target !== DOM.barProgressSlider) {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        seekTrack(percent);
      }
    });
  }

  // Global window release ensures seek drag never locks up
  window.addEventListener('pointerup', () => {
    if (state.isDraggingSeek) {
      state.isDraggingSeek = false;
    }
  });
  window.addEventListener('touchend', () => {
    if (state.isDraggingSeek) {
      state.isDraggingSeek = false;
    }
  });

  // --- Volume Slider & Mute ---
  DOM.volumeSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val / 100);
  });

  if (DOM.volumeSlider.parentElement) {
    DOM.volumeSlider.parentElement.addEventListener('click', (e) => {
      if (e.target !== DOM.volumeSlider) {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        setVolume(percent / 100);
      }
    });
  }

  DOM.muteBtn.addEventListener('click', toggleMute);

  // Autoplay button
  DOM.autoplayToggleBtn.addEventListener('click', toggleAutoplay);

  // --- Catalogue Search & Filters ---
  DOM.playlistSearch.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    DOM.searchClearBtn.hidden = state.searchQuery.length === 0;
    renderPlaylist();
  });

  DOM.searchClearBtn.addEventListener('click', () => {
    DOM.playlistSearch.value = '';
    state.searchQuery = '';
    DOM.searchClearBtn.hidden = true;
    renderPlaylist();
    DOM.playlistSearch.focus();
  });

  DOM.filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      DOM.filterChips.forEach((c) => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-checked', 'true');
      state.currentFilter = chip.getAttribute('data-filter') || 'all';
      renderPlaylist();
    });
  });

  // --- Drag & Drop / File Input ---
  DOM.addTrackTrigger.addEventListener('click', () => {
    DOM.localFileInput.click();
  });

  DOM.localDropzone.addEventListener('click', () => {
    DOM.localFileInput.click();
  });

  // Keyboard accessibility for dropzone
  DOM.localDropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      DOM.localFileInput.click();
    }
  });

  DOM.localFileInput.addEventListener('change', (e) => {
    ingestLocalFiles(e.target.files);
    e.target.value = ''; // Reset input
  });

  // Dropzone drag over feedback
  DOM.localDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    DOM.localDropzone.classList.add('drag-over');
  });

  DOM.localDropzone.addEventListener('dragleave', () => {
    DOM.localDropzone.classList.remove('drag-over');
  });

  DOM.localDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    DOM.localDropzone.classList.remove('drag-over');
    if (e.dataTransfer && e.dataTransfer.files) {
      ingestLocalFiles(e.dataTransfer.files);
    }
  });

  // Window-level drag/drop safety to prevent browser navigating away on accidental drops
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  window.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      ingestLocalFiles(e.dataTransfer.files);
    }
  });

  // --- Share / Copy Track Link ---
  DOM.copyTrackLinkBtn.addEventListener('click', () => {
    const current = state.playlist[state.currentTrackIndex];
    if (!current) return;
    const text = `Listening to "${current.title}" by ${current.artist} on Between the Frames (CodeAlpha Music Player)`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showNotification('Track reference copied to clipboard.');
      }).catch(() => {
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  });

  // --- Theme Toggle ---
  DOM.themeToggleBtn.addEventListener('click', toggleTheme);

  // --- Notification Banner Close ---
  DOM.notificationClose.addEventListener('click', hideNotification);

  // --- Keyboard Shortcuts Modal ---
  DOM.shortcutsBtn.addEventListener('click', () => {
    DOM.shortcutsModal.removeAttribute('hidden');
    DOM.modalCloseBtn.focus();
  });

  DOM.modalCloseBtn.addEventListener('click', () => {
    DOM.shortcutsModal.setAttribute('hidden', '');
    DOM.shortcutsBtn.focus();
  });

  DOM.shortcutsModal.addEventListener('click', (e) => {
    if (e.target === DOM.shortcutsModal) {
      DOM.shortcutsModal.setAttribute('hidden', '');
      DOM.shortcutsBtn.focus();
    }
  });

  // Navigation Links smooth active highlight
  DOM.navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      DOM.navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // --- Global Keyboard Controls ---
  window.addEventListener('keydown', handleGlobalKeydown);
}

/**
 * Fallback clipboard copy using textarea element.
 */
function fallbackCopyText(text) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showNotification('Track reference copied to clipboard.');
  } catch (e) {
    const current = state.playlist[state.currentTrackIndex];
    showNotification(`Selected: "${current.title}" by ${current.artist}`);
  }
}

/**
 * Handles keyboard hotkeys when not inside text inputs.
 */
function handleGlobalKeydown(e) {
  if (e.defaultPrevented) return;

  const activeElement = document.activeElement;
  const isInput = activeElement && (
    activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.isContentEditable
  );

  // When focused in search input, Escape clears the search
  if (isInput) {
    if (e.key === 'Escape' && activeElement === DOM.playlistSearch) {
      DOM.playlistSearch.value = '';
      state.searchQuery = '';
      DOM.searchClearBtn.hidden = true;
      renderPlaylist();
      DOM.playlistSearch.blur();
    }
    return;
  }

  // Prevent double-activation if button is already focused and Space/Enter is pressed
  if (activeElement && activeElement.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) {
    return;
  }

  switch (e.key) {
    case ' ': // Space: Play / Pause
      e.preventDefault();
      togglePlayPause();
      break;

    case 'ArrowRight': // Arrow Right: Next Track
      e.preventDefault();
      nextTrack();
      break;

    case 'ArrowLeft': // Arrow Left: Previous Track
      e.preventDefault();
      previousTrack();
      break;

    case 'ArrowUp': // Arrow Up: Volume Up (+5%)
      e.preventDefault();
      setVolume((state.isMuted ? state.previousVolume : DOM.audio.volume) + 0.05);
      break;

    case 'ArrowDown': // Arrow Down: Volume Down (-5%)
      e.preventDefault();
      setVolume((state.isMuted ? state.previousVolume : DOM.audio.volume) - 0.05);
      break;

    case 'm':
    case 'M': // M: Mute / Unmute
      e.preventDefault();
      toggleMute();
      break;

    case 's':
    case 'S': // S: Shuffle Toggle
      e.preventDefault();
      toggleShuffle();
      break;

    case 'r':
    case 'R': // R: Repeat Mode Cycle
      e.preventDefault();
      toggleRepeat();
      break;

    case '?': // ?: Open Shortcuts Dialog
      e.preventDefault();
      DOM.shortcutsModal.removeAttribute('hidden');
      DOM.modalCloseBtn.focus();
      break;

    case 'Escape': // Escape: Close modal or notification
      DOM.shortcutsModal.setAttribute('hidden', '');
      hideNotification();
      if (DOM.shortcutsBtn) DOM.shortcutsBtn.focus();
      break;

    default:
      break;
  }
}

// ------------------------------------------------------------------------------
// 15. Application Bootstrap
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  bindEventListeners();

  // Set initial volume & repeat UI
  setVolume(state.volume);
  syncRepeatUI();

  // Update initial hero counts
  updateArchiveCount();

  // Load first track without autoplay
  loadTrack(0, false);

  // Render initial catalogue
  renderPlaylist();

  console.info('Between the Frames — Digital Listening Archive initialized successfully.');
});
