
// Change this date to your wedding date.
// Format: YYYY-MM-DDTHH:MM:SS+09:00
const weddingDate = "2027-04-24T11:00:00+09:00";

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
setInterval(updateCountdown, 1000)


const openingScreen = document.getElementById("opening-screen");
const openingButtons = document.querySelectorAll(".opening-language-button");
const languageButtons = document.querySelectorAll(".language-button");
const weddingMusic = document.getElementById("wedding-music");

function setLanguage(language) {
  document.querySelectorAll("[data-en][data-id][data-ja]").forEach(element => {
    const text = element.dataset[language];

    if (text !== undefined) {
      element.innerHTML = text;
    }
  });

  languageButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.lang === language);
  });

  document.documentElement.lang =
    language === "id" ? "id" :
    language === "ja" ? "ja" : "en";

  localStorage.setItem("weddingLanguage", language);
}

openingButtons.forEach(button => {
  button.addEventListener("click", async () => {
    const language = button.dataset.openingLang;

    setLanguage(language);
    openingScreen.classList.add("hidden");

    try {
      await weddingMusic.play();
    } catch (error) {
      // Browser may block autoplay. The invitation still opens normally.
    }
  });
});

languageButtons.forEach(button => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

// Start with English until the visitor selects a language.
setLanguage("en");

const attendanceInputs = document.querySelectorAll(
  'input[name="attendance"]'
);
const extraFields = document.getElementById("rsvp-extra");

attendanceInputs.forEach(input => {
  input.addEventListener("change", () => {
    const attending = input.value === "Yes" && input.checked;
    extraFields.hidden = !attending;
  });
});


const scriptURL = "https://script.google.com/macros/s/AKfycbxitGk6uvvRrwzVagMdduqOXY0lfdf415JhFnRNIdcc2pt9jFWm0AWJeIAjcVJDhZd5/exec";

const rsvpForm = document.getElementById("rsvp-form");

rsvpForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const submitButton = rsvpForm.querySelector(
    'button[type="submit"]'
  );

  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  const formData = {
    name: rsvpForm.querySelector('[name="name"]').value,
    attendance: rsvpForm.querySelector(
      '[name="attendance"]:checked'
    ).value,
    guest_count: rsvpForm.querySelector(
      '[name="guest_count"]'
    ).value,
    guest_names: rsvpForm.querySelector(
      '[name="guest_names"]'
    ).value,
    allergies: rsvpForm.querySelector(
      '[name="allergies"]'
    ).value
  };

  try {
    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(formData)
    });

    // The no-cors request cannot confirm that
    // Google Sheets actually saved the response.
    // Verify the result in your spreadsheet.
    rsvpForm.innerHTML = `
      <p class="rsvp-success">
        Thank you for your response.
        Please contact us if you need to make a correction.
      </p>
    `;

  } catch (error) {
    console.error("RSVP submission error:", error);

    submitButton.disabled = false;
    submitButton.textContent = originalText;

    alert(
      "We could not send your response. Please try again."
    );
  }
});
