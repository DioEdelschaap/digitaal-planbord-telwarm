const maandNamen = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December"
];
let huidigeMaand = new Date().getMonth();
let huidigJaar = new Date().getFullYear();

const standaardRooster = ["O", "O", "M", "M", "N", "N", "-", "-", "-", "-"];
const ploegOffsets = {
  "Ploeg 1": 8,
  "Ploeg 2": 2,
  "Ploeg 3": 4,
  "Ploeg 4": 0,
  "Ploeg 5": 6
};
const referentieDatum = new Date(2025, 0, 1); // 1 januari 2025

// Maandnavigatie

document.getElementById("prevMonth").addEventListener("click", () => {
  huidigeMaand--;
  if (huidigeMaand < 0) {
    huidigeMaand = 11;
    huidigJaar--;
  }
  updateMaand();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  huidigeMaand++;
  if (huidigeMaand > 11) {
    huidigeMaand = 0;
    huidigJaar++;
  }
  updateMaand();
});

function updateMaand() {
  document.getElementById("monthYear").innerText = `${maandNamen[huidigeMaand]} ${huidigJaar}`;
  maakHeader();
  fetch("data/ploegen.json")
    .then((res) => res.json())
    .then((data) => {
      laadRooster(data);
    });
}

updateMaand();

function maakHeader() {
  const dagen = ["ZO", "MA", "DI", "WO", "DO", "VR", "ZA"];
  const dagenRij = document.getElementById("dagenRij");
  const nummersRij = document.getElementById("nummersRij");

  dagenRij.innerHTML = "<div>Ploeg / Werknemer</div>";
  nummersRij.innerHTML = "<div></div>";

  const aantalDagen = new Date(huidigJaar, huidigeMaand + 1, 0).getDate();

  for (let i = 1; i <= 31; i++) {
    if (i <= aantalDagen) {
      const datum = new Date(huidigJaar, huidigeMaand, i);
      const weekDag = dagen[datum.getDay()];
      const isWeekend = (weekDag === "ZA" || weekDag === "ZO");

      dagenRij.innerHTML += `<div class="${isWeekend ? 'weekend' : ''}">${weekDag}</div>`;
      nummersRij.innerHTML += `<div class="${isWeekend ? 'weekend' : ''}">${i}</div>`;
    } else {
      dagenRij.innerHTML += `<div></div>`;
      nummersRij.innerHTML += `<div></div>`;
    }
  }
}

function laadRooster(ploegenData) {
  const body = document.getElementById("gridBody");
  body.innerHTML = "";

  ploegenData.forEach((ploeg) => {
    // Ploegregel met rooster
    const ploegRow = document.createElement("div");
    ploegRow.className = "row ploeg-rij";
    ploegRow.innerHTML = `<div class="cell ploeg">${ploeg.ploeg}</div>`;

    for (let i = 0; i < 31; i++) {
      const huidigeDatum = new Date(huidigJaar, huidigeMaand, i + 1);
      const dagenVerschil = Math.floor((huidigeDatum - referentieDatum) / (1000 * 60 * 60 * 24));
      const offset = ploegOffsets[ploeg.ploeg] || 0;
      const index = ((dagenVerschil + offset) % standaardRooster.length + standaardRooster.length) % standaardRooster.length;
      const symbool = standaardRooster[index];
      ploegRow.innerHTML += `<div class="cell">${symbool === '-' ? '' : symbool}</div>`;
    }
    body.appendChild(ploegRow);

    // Werknemersrijen met lege invulvelden
    ploeg.werknemers.forEach((naam) => {
      const werknemerRow = document.createElement("div");
      werknemerRow.className = "row";
      werknemerRow.innerHTML = `<div class="cell">${naam}</div>`;
      for (let i = 0; i < 31; i++) {
        werknemerRow.innerHTML += `<div class="cell"><input type="text" maxlength="3" /></div>`;
      }
      body.appendChild(werknemerRow);
    });
  });
}
