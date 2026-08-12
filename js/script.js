
// Change this date to your wedding date.
// Format: YYYY-MM-DDTHH:MM:SS+09:00
const weddingDate = "2026-11-08T10:00:00+09:00";

function updateCountdown() {
  const target = new Date(weddingDate).getTime();
  const now = Date.now();
  const distance = target - now;

  const ids = ["days", "hours", "minutes", "seconds"];
  if (distance <= 0) {
    ids.forEach(id => document.getElementById(id).textContent = "0");
    return;
  }

  document.getElementById("days").textContent = Math.floor(distance / 86400000);
  document.getElementById("hours").textContent = Math.floor((distance / 3600000) % 24);
  document.getElementById("minutes").textContent = Math.floor((distance / 60000) % 60);
  document.getElementById("seconds").textContent = Math.floor((distance / 1000) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);
