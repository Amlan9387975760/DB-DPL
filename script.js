const API_URL = "https://script.google.com/macros/s/AKfycbxVlXl7nU9FNZiNoTGoyekK3X5llZ_Og794rsMBx-Y37Lxkd1dAAH0GJQgcJJ1ubTg/exec";

// ADD TEAM
function addTeam() {
  const team = document.getElementById("teamName").value;
  const players = document.getElementById("players").value;

  const url = `${API_URL}?action=addTeam&teamName=${team}&players=${players}`;

  fetch(url)
    .then(() => alert("Team Added"));
}

// GENERATE FIXTURES
function generateFixtures() {
  fetch(`${API_URL}?action=generateFixtures`)
    .then(() => {
      alert("Fixtures Generated");
      loadFixtures();
    });
}

// LOAD FIXTURES
function loadFixtures() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const table = document.querySelector("#fixtures tbody");
      table.innerHTML = "";

      data.forEach(row => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${row[0]}</td>
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td><input id="score-${row[0]}"></td>
          <td>
            <select id="winner-${row[0]}">
              <option value="${row[1]}">${row[1]}</option>
              <option value="${row[2]}">${row[2]}</option>
            </select>
          </td>
          <td><button onclick="saveResult(${row[0]})">Save</button></td>
        `;

        table.appendChild(tr);
      });
    });
}

// SAVE RESULT
function saveResult(id) {
  const score = document.getElementById(`score-${id}`).value;
  const winner = document.getElementById(`winner-${id}`).value;

  const url = `${API_URL}?action=saveResult&id=${id}&score=${score}&winner=${winner}`;

  fetch(url)
    .then(() => alert("Saved"));
}

// INIT
window.onload = loadFixtures;

// ADD TEAM
async function addTeam() {
  const teamName = document.getElementById("teamName").value;
  const players = document.getElementById("players").value;

  if (!teamName) {
    alert("Enter team name");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "addTeam",
      teamName: teamName,
      players: players ? players.split(",") : []
    })
  });

  alert("Team Added");
}

// GENERATE FIXTURES
async function generateFixtures() {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "generateFixtures"
    })
  });

  alert("Fixtures Generated");
  loadFixtures();
}

// LOAD FIXTURES
async function loadFixtures() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const table = document.querySelector("#fixtures tbody");
    table.innerHTML = "";

    data.forEach(row => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td><input id="score-${row[0]}" placeholder="Score"></td>
        <td>
          <select id="winner-${row[0]}">
            <option value="">Select</option>
            <option value="${row[1]}">${row[1]}</option>
            <option value="${row[2]}">${row[2]}</option>
          </select>
        </td>
        <td><button onclick="saveResult(${row[0]})">Save</button></td>
      `;

      table.appendChild(tr);
    });

  } catch (err) {
    console.error("Error loading fixtures:", err);
  }
}

// SAVE RESULT
async function saveResult(matchId) {
  const score = document.getElementById(`score-${matchId}`).value;
  const winner = document.getElementById(`winner-${matchId}`).value;

  if (!winner) {
    alert("Select winner");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "saveResult",
      matchId: matchId,
      score: score,
      winner: winner
    })
  });

  alert("Result Saved");
}

// INIT LOAD
window.onload = function () {
  loadFixtures();
};