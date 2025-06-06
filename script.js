// Vide le localStorage à chaque arrivée sur une page
localStorage.clear();

// script.js

window.addEventListener("DOMContentLoaded", () => {
  // === Dark Mode Toggle ===
  const toggleButton = document.createElement("button");
  toggleButton.id = "darkModeToggle";
  toggleButton.className = "theme-toggle";
  toggleButton.setAttribute("aria-label", "Changer le thème");

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("id", "themeIcon");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("viewBox", "0 0 24 24");

  toggleButton.appendChild(svg);

  // On insère le bouton dans le header
  const header = document.querySelector("header .header-container");
  if(header) header.appendChild(toggleButton);

  // Icônes SVG pour les thèmes
  const icons = {
    light: '<path d="M21 12.79A9 9 0 1111.21 3a7 7 0 0010.59 9.79z" />', // lune
    dark:
      '<circle cx="12" cy="12" r="5" />' +
      '<line x1="12" y1="1" x2="12" y2="3" />' +
      '<line x1="12" y1="21" x2="12" y2="23" />' +
      '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />' +
      '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />' +
      '<line x1="1" y1="12" x2="3" y2="12" />' +
      '<line x1="21" y1="12" x2="23" y2="12" />' +
      '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />' +
      '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />' // soleil
  };

  function setIcon(theme) {
    svg.innerHTML = theme === "dark" ? icons.dark : icons.light;
  }

  // Chargement thème depuis localStorage ou par défaut light
  let theme = localStorage.getItem("theme") || "light";

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    setIcon(theme);
    localStorage.setItem("theme", theme);
  }

  applyTheme(theme);

  toggleButton.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme(theme);
  });

  // === Chargement des scores (uniquement sur scores.html) ===
  if (document.getElementById("scoreTable")) {
    fetch("scores.json")
      .then((response) => response.json())
      .then((data) => {
        displayScores(data.scores);
        displayPodium(data.scores);
      })
      .catch((error) => console.error("Erreur chargement scores :", error));
  }

  /**
   * Affiche le tableau des scores
   * @param {Array} scores
   */
  function displayScores(scores) {
    const tbody = document.querySelector("#scoreTable tbody");
    if (!tbody) return;

    tbody.innerHTML = ""; // Reset

    scores.forEach(({ jeu, joueur, points }) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${jeu}</td>
        <td>${joueur}</td>
        <td>${points}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  /**
   * Affiche les podiums sous forme de cards dans la div #podium-cards
   * @param {Array} scores
   */
  function displayPodium(scores) {
    const podiumContainer = document.getElementById("podium-cards");
    if (!podiumContainer) return;

    // Trie décroissant des scores
    const sorted = [...scores].sort((a, b) => b.points - a.points);
    const top3 = sorted.slice(0, 3);

    // Classes couleurs cards (respecte ton CSS)
    const classes = ["gold", "silver", "bronze"];
    const ranks = ["1ère place", "2ème place", "3ème place"];

    podiumContainer.innerHTML = ""; // Reset

    top3.forEach((player, i) => {
      const card = document.createElement("div");
      card.className = `podium-item ${classes[i]}`;
      card.innerHTML = `
        <h3>${ranks[i]}</h3>
        <p><strong>Joueur :</strong> ${player.joueur}</p>
        <p><strong>Jeu :</strong> ${player.jeu}</p>
        <p><strong>Points :</strong> ${player.points}</p>
      `;
      podiumContainer.appendChild(card);
    });
  }
});

function getFormattedCountdown(targetDate, now) {
  const diff = targetDate - now;
  if (diff <= 0) return "Épreuve en cours !";

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  return `${days}j ${hours}h ${minutes}m ${seconds}s`;
}

function updateCountdowns() {
  const dataElem = document.getElementById("countdown-data");
  const utcTargetDate = new Date(dataElem.dataset.target);

  const now = new Date();

  // Format local FR
  const targetFR = new Date(utcTargetDate.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  const nowFR = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));

  // Format local CA
  const targetCA = new Date(utcTargetDate.toLocaleString('en-US', { timeZone: 'America/Toronto' }));
  const nowCA = new Date(now.toLocaleString('en-US', { timeZone: 'America/Toronto' }));

  // Afficher heure de début locale
  document.getElementById('fr-start-time').textContent = `Heure locale : ${targetFR.toLocaleString('fr-FR')}`;
  document.getElementById('ca-start-time').textContent = `Heure locale : ${targetCA.toLocaleString('fr-FR')}`;

  // Afficher les countdowns
  document.getElementById("countdown-fr").textContent = getFormattedCountdown(targetFR, nowFR);
  document.getElementById("countdown-ca").textContent = getFormattedCountdown(targetCA, nowCA);
}

setInterval(updateCountdowns, 1000);
updateCountdowns();







