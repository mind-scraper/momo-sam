// Change this date to your wedding date.
// Format: YYYY-MM-DDTHH:MM:SS+09:00
const weddingDate = "2027-04-24T11:00:00+09:00";

function updateCountdown() {
  const target = new Date(weddingDate).getTime();
  const now = Date.now();
  const distance = target - now;

  const ids = ["days", "hours", "minutes", "seconds"];
  if (distance <= 0) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = "0";
    });
    return;
  }

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (daysEl) daysEl.textContent = Math.floor(distance / 86400000);
  if (hoursEl) hoursEl.textContent = Math.floor((distance / 3600000) % 24);
  if (minutesEl) minutesEl.textContent = Math.floor((distance / 60000) % 60);
  if (secondsEl) secondsEl.textContent = Math.floor((distance / 1000) % 60);
}

// Only run countdown if the elements exist (i.e. on invitation pages)
if (document.getElementById("days")) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ---------- Background Music ----------
(function initMusic() {
  const audio = document.getElementById("bg-music");
  const toggleBtn = document.getElementById("music-toggle");

  if (!audio) return;

  // Helper to update button appearance
  function updateToggleUI(isPlaying) {
    if (!toggleBtn) return;
    toggleBtn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    toggleBtn.innerHTML = isPlaying
      ? '<span class="music-icon">♪</span><span class="music-label">Music On</span>'
      : '<span class="music-icon">♪</span><span class="music-label">Music Off</span>';
    toggleBtn.classList.toggle("is-playing", isPlaying);
  }

  // Try to resume if the user previously chose to play music
  const shouldPlay = sessionStorage.getItem("playMusic") === "true";

  if (shouldPlay) {
    // Attempt autoplay. This often succeeds because the user already
    // interacted on the opening page (same origin + recent gesture).
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => updateToggleUI(true))
        .catch(() => {
          // Autoplay blocked – wait for the user to tap the music button
          updateToggleUI(false);
        });
    }
  } else {
    updateToggleUI(false);
  }

  // Toggle button handler
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play()
          .then(() => {
            sessionStorage.setItem("playMusic", "true");
            updateToggleUI(true);
          })
          .catch(err => {
            console.warn("Could not play audio:", err);
          });
      } else {
        audio.pause();
        sessionStorage.setItem("playMusic", "false");
        updateToggleUI(false);
      }
    });
  }

  // Keep UI in sync if the audio ends or is paused externally
  audio.addEventListener("play", () => updateToggleUI(true));
  audio.addEventListener("pause", () => updateToggleUI(false));
})();
