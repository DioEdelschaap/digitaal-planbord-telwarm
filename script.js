// ----- Basisdata -----
const maandNamen = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
let huidigeMaand = new Date().getMonth(); // 0 - 11
let huidigJaar = new Date().getFullYear();

// Knoppen vorige/volgende maand
document.getElementById('prevMonth').addEventListener('click', () => {
    huidigeMaand--;
    if (huidigeMaand < 0) {
        huidigeMaand = 11;
        huidigJaar--;
    }
    updateMaand();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    huidigeMaand++;
    if (huidigeMaand > 11) {
        huidigeMaand = 0;
        huidigJaar++;
    }
    updateMaand();
});

// ----- Maand en jaar tonen -----
function updateMaand() {
    document.getElementById('monthYear').innerText = `${maandNamen[huidigeMaand]} ${huidigJaar}`;
    maakDagHeaders();
}

updateMaand(); // Eerste keer laden

// ----- Dagkoppen en datumnummers automatisch maken -----
function maakDagHeaders() {
    const dagenRij = document.querySelectorAll('thead tr')[0];
    const nummersRij = document.querySelectorAll('thead tr')[1];

    // Leegmaken behalve eerste cel
    dagenRij.innerHTML = '<th>Ploeg / Werknemers</th>';
    nummersRij.innerHTML = '<th></th>';

    const dagen = ["ZO", "MA", "DI", "WO", "DO", "VR", "ZA"]; // Zondag = 0
    const aantalDagen = new Date(huidigJaar, huidigeMaand + 1, 0).getDate();

    for (let dag = 1; dag <= 31; dag++) {
        if (dag <= aantalDagen) {
            const datum = new Date(huidigJaar, huidigeMaand, dag);
            const weekDag = dagen[datum.getDay()];
            dagenRij.innerHTML += `<th>${weekDag}</th>`;
            nummersRij.innerHTML += `<th>${dag}</th>`;
        } else {
            dagenRij.innerHTML += `<th></th>`;
            nummersRij.innerHTML += `<th></th>`;
        }
    }
}

// ----- Ploegen en werknemers laden -----
fetch('data/ploegen.json')
    .then(response => response.json())
    .then(data => {
        laadRooster(data);
    })
    .catch(error => {
        console.error("Fout bij laden JSON:", error);
    });

function laadRooster(ploegenData) {
    const tbody = document.getElementById('roosterBody');
    tbody.innerHTML = '';

    ploegenData.forEach(ploeg => {
        // Rij voor de ploegnaam
        const ploegRow = document.createElement('tr');
        ploegRow.innerHTML = `<td><strong>${ploeg.ploeg}</strong></td>`;
        for (let dag = 1; dag <= 31; dag++) {
            ploegRow.innerHTML += `<td><input type="text" maxlength="3" class="form-control form-control-sm rooster-invoer"></td>`;
        }
        tbody.appendChild(ploegRow);

        // Rijen voor de werknemers
        ploeg.werknemers.forEach(naam => {
            const werknemerRow = document.createElement('tr');
            werknemerRow.innerHTML = `<td>${naam}</td>`;
            for (let dag = 1; dag <= 31; dag++) {
                werknemerRow.innerHTML += `<td><input type="text" maxlength="3" class="form-control form-control-sm rooster-invoer"></td>`;
            }
            tbody.appendChild(werknemerRow);
        });
    });
}
