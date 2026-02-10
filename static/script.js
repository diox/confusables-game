const h2 = document.querySelector("h2");
const alphabet = document.getElementById("alphabet");
const controls = document.getElementById("controls");
const main = document.querySelector("main");
var availableCharacters;
var currrentCharacter;

async function fetchData() {
  const response = await fetch("/static/characters.json?2026-02-07");
  return response.json();
}

async function init() {
  availableCharacters = await fetchData();
  alphabet.addEventListener("click", function (e) {
    if (e.target.nodeName == "BUTTON") {
      recordConfusable(currrentCharacter, e.target.textContent[0]);
    }
  });

  controls.addEventListener("click", function (e) {
    if (e.target.nodeName == "BUTTON") {
      if (e.target.id == "nothing") {
        recordConfusable(currrentCharacter, null);
      } else if (e.target.id == "skip") {
        skipConfusable(currrentCharacter);
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) {
      return;
    }
    if (e.key == "Backspace") {
      recordConfusable(currrentCharacter, null);
    } else if (e.key == " ") {
      skipConfusable();
    } else if (/^[a-z]$/.test(e.key)) {
      recordConfusable(currrentCharacter, e.key);
    }
  });

  main.style.visibility = "visible";
  newGame();
}

function newGame() {
  currrentCharacter =
    availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
  h2.textContent = currrentCharacter;
}

function recordConfusable(confusableCharacter, alphabetCharacter) {
  fetch("/record", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      confusable: confusableCharacter,
      alphabet: alphabetCharacter,
    }),
  });

  skipConfusable(confusableCharacter);
}

function skipConfusable(confusableCharacter) {
  let idx = availableCharacters.indexOf(confusableCharacter);
  if (idx >= 0) {
    availableCharacters.splice(idx, 1);
  }
  newGame();
}

init();
