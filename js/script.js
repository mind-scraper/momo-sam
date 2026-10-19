
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

let currentLanguage = "en";

function setLanguage(language) {
  currentLanguage = language;

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

const rsvpMessages = {
  en: {
    submitting: "Submitting...",
    success: "Thank you for your response.",
    correction: "Please contact us if you need to make a correction.",
    error: "We could not send your response. Please try again.",
    fullName: "Full name",
    guestNames: "Please enter their names",
    allergies: "Please let us know (optional)"
  },
  id: {
    submitting: "Mengirim...",
    success: "Terima kasih atas konfirmasi Anda.",
    correction: "Silakan hubungi kami jika ingin mengubah jawaban Anda.",
    error: "Jawaban Anda gagal dikirim. Silakan coba lagi.",
    fullName: "Nama lengkap",
    guestNames: "Masukkan nama pendamping",
    allergies: "Silakan informasikan jika ada (opsional)"
  },
  ja: {
    submitting: "送信中...",
    success: "ご回答ありがとうございます。",
    correction: "回答を変更される場合は、お手数ですがご連絡ください。",
    error: "回答を送信できませんでした。もう一度お試しください。",
    fullName: "氏名",
    guestNames: "ご同伴者のお名前をご記入ください",
    allergies: "該当する場合はご記入ください（任意）"
  }
};

function updateRsvpLanguage() {
  const messages = rsvpMessages[currentLanguage] || rsvpMessages.en;

  document.getElementById("rsvp-name").placeholder = messages.fullName;
  document.getElementById("rsvp-guest-names").placeholder = messages.guestNames;
  document.getElementById("rsvp-allergies").placeholder = messages.allergies;
}

const originalSetLanguage = setLanguage;

setLanguage = function(language) {
  originalSetLanguage(language);
  updateRsvpLanguage();
};

updateRsvpLanguage();

rsvpForm.addEventListener("submit", async function(event) {
  event.preventDefault();

  const messages = rsvpMessages[currentLanguage] || rsvpMessages.en;
  const submitButton = rsvpForm.querySelector('button[type="submit"]');

  const attendance = rsvpForm.querySelector('[name="attendance"]:checked');

  if (!attendance) {
    alert(messages.error);
    return;
  }

  const formData = {
    name: rsvpForm.querySelector('[name="name"]').value,
    attendance: attendance.value,
    guest_count: rsvpForm.querySelector('[name="guest_count"]').value,
    guest_names: rsvpForm.querySelector('[name="guest_names"]').value,
    allergies: rsvpForm.querySelector('[name="allergies"]').value
  };

  submitButton.disabled = true;
  submitButton.textContent = messages.submitting;

  try {
    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(formData)
    });

    rsvpForm.innerHTML = "";

    const success = document.createElement("p");
    success.className = "rsvp-success";
    success.textContent = messages.success;

    const correction = document.createElement("p");
    correction.className = "rsvp-correction";
    correction.textContent = messages.correction;

    rsvpForm.append(success, correction);

  } catch (error) {
    console.error("RSVP submission error:", error);

    submitButton.disabled = false;
    submitButton.textContent =
      rsvpMessages[currentLanguage]?.submitting === undefined
        ? "Submit RSVP"
        : document.querySelector('#rsvp-form button[type="submit"]')
            .dataset[currentLanguage] || "Submit RSVP";

    alert(messages.error);
  }
});
