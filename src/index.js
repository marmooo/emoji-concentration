const originalLang = document.documentElement.lang;
const ttsLang = getTTSLang();
const categories = [...document.getElementById("courseOption").options].map(
  (x) => x.value.toLowerCase(),
);
const problems = {};
let englishVoices = [];
let correctAudio, correctAllAudio, incorrectAudio;
loadAudios();
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
loadConfig();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.dataset.theme = "dark";
  }
  if (originalLang == "ja") {
    if (localStorage.getItem("furigana") == 1) {
      const obj = document.getElementById("addFurigana");
      addFurigana(obj);
      obj.setAttribute("data-done", true);
    }
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.dataset.theme = "dark";
  }
}

function addFurigana() {
  if (originalLang != "ja") return;
  const obj = document.getElementById("addFurigana");
  if (obj.getAttribute("data-done")) {
    localStorage.setItem("furigana", 0);
    location.reload();
  } else {
    import("https://marmooo.github.io/yomico/yomico.min.js").then((module) => {
      module.yomico("/emoji-concentration/ja/index.yomi");
    });
    localStorage.setItem("furigana", 1);
    obj.setAttribute("data-done", true);
  }
}

function changeLang() {
  const langObj = document.getElementById("lang");
  const lang = langObj.options[langObj.selectedIndex].value;
  location.href = `/emoji-concentration/${lang}/`;
}

function getTTSLang() {
  switch (originalLang) {
    case "en":
      return "en-US";
    case "ja":
      return "ja-JP";
  }
}

function playAudio(audioBuffer, volume) {
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    audioSource.connect(gainNode);
    audioSource.start();
  } else {
    audioSource.connect(audioContext.destination);
    audioSource.start();
  }
}

function unlockAudio() {
  audioContext.resume();
}

function loadAudio(url) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer);
        }, (err) => {
          reject(err);
        });
      });
    });
}

function loadAudios() {
  promises = [
    loadAudio("/emoji-concentration/mp3/correct3.mp3"),
    loadAudio("/emoji-concentration/mp3/correct1.mp3"),
    loadAudio("/emoji-concentration/mp3/incorrect1.mp3"),
  ];
  Promise.all(promises).then((audioBuffers) => {
    correctAudio = audioBuffers[0];
    correctAllAudio = audioBuffers[1];
    incorrectAudio = audioBuffers[2];
  });
}

function loadVoices() {
  // https://stackoverflow.com/questions/21513706/
  const allVoicesObtained = new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      let supported = false;
      speechSynthesis.addEventListener("voiceschanged", () => {
        supported = true;
        voices = speechSynthesis.getVoices();
        resolve(voices);
      });
      setTimeout(() => {
        if (!supported) {
          document.getElementById("noTTS").classList.remove("d-none");
        }
      }, 500);
    }
  });
  allVoicesObtained.then((voices) => {
    englishVoices = voices.filter((voice) => voice.lang == ttsLang);
  });
}
loadVoices();

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.voice = englishVoices[Math.floor(Math.random() * englishVoices.length)];
  msg.lang = ttsLang;
  speechSynthesis.speak(msg);
  return msg;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
}

function catWalk(freq, emoji, text) {
  const area = document.getElementById("catsWalk");
  const width = area.offsetWidth;
  const height = area.offsetHeight;
  const canvas = document.createElement("span");
  canvas.className = "emoji walker";
  canvas.style.position = "absolute";
  canvas.textContent = emoji;
  const size = 128;
  canvas.style.top = getRandomInt(0, height - size) + "px";
  canvas.style.left = width - size + "px";
  canvas.addEventListener("click", () => {
    speak(text);
    canvas.remove();
  }, { once: true });
  area.appendChild(canvas);
  const timer = setInterval(() => {
    const x = parseInt(canvas.style.left) - 1;
    if (x > -size) {
      canvas.style.left = x + "px";
    } else {
      clearInterval(timer);
      canvas.remove();
    }
  }, freq);
}

function catsWalk() {
  setInterval(() => {
    if (Math.random() > 0.995) {
      const [emoji, text] = selectRandomEmoji();
      catWalk(getRandomInt(5, 20), emoji, text);
    }
  }, 10);
}

function selectRandomEmoji(category) {
  if (!category) {
    category = categories[getRandomInt(0, categories.length)];
  }
  const p = problems[category];
  const problem = p[getRandomInt(0, p.length)];
  const emojis = problem[0];
  const emoji = emojis[getRandomInt(0, emojis.length)];
  const text = problem[1];
  return [emoji, text];
}

function showAllHints() {
  const choices = document.getElementById("choices");
  [...choices.getElementsByClassName("text")].forEach((textObj) => {
    textObj.style.visibility = "initial";
  });
}

function hideAllHints() {
  const choices = document.getElementById("choices");
  [...choices.getElementsByClassName("text")].forEach((textObj) => {
    textObj.style.visibility = "hidden";
  });
}

function changeMode() {
  if (this.textContent == "EASY") {
    this.textContent = "HARD";
    hideAllHints();
  } else {
    this.textContent = "EASY";
    showAllHints();
  }
}

function filterBacked(choice, choices) {
  return choices.filter((c) => {
    const front = c.querySelector(".back");
    if (
      !c.classList.contains("cleared") &&
      front.classList.contains("d-none")
    ) {
      return true;
    } else if (c == choice) {
      return false;
    }
  });
}

function rotateCardAll(backed) {
  backed.forEach((choice) => {
    const front = choice.querySelector(".front");
    const back = choice.querySelector(".back");
    rotateCard(front, back);
  });
}

function speechOnEnd(choice, choiceText, choices, backed) {
  if (backed.length >= 2) {
    const equalAll = backed.every((c) => {
      if (c.querySelector(".text").textContent == choiceText) {
        return true;
      }
    });
    if (equalAll) {
      const cleared = choices.filter((c) => c.classList.contains("cleared"));
      if (cleared.length == choices.length - backed.length) {
        playAudio(correctAllAudio);
      } else {
        playAudio(correctAudio);
      }
      backed.forEach((c) => {
        c.querySelector(".back").onclick = () => {};
        c.classList.add("cleared");
      });
    } else {
      playAudio(incorrectAudio);
      rotateCardAll(backed);
    }
  }
  choice.parentNode.style.pointerEvents = "auto";
}

function initEvents() {
  const choices = [...document.getElementById("choices").children];
  choices.forEach((choice) => {
    const front = choice.querySelector(".front");
    const back = choice.querySelector(".back");
    front.onclick = () => {
      const choiceText = choice.querySelector(".text").textContent;
      speak(choiceText);
    };
    back.onclick = () => {
      choice.parentNode.style.pointerEvents = "none";
      const backed = filterBacked(choice, choices);
      if (front.classList.contains("d-none")) {
        backed.push(choice);
        const choiceText = choice.querySelector(".text").textContent;
        const msg = speak(choiceText);

        // iOS API is broken
        if (/(iPad|iPhone|iPod|Macintosh)/.test(navigator.userAgent)) {
          setTimeout(() => {
            speechOnEnd(choice, choiceText, choices, backed);
          }, 2000);
        } else {
          msg.onend = () => {
            speechOnEnd(choice, choiceText, choices, backed);
          };
        }
      }
      rotateCard(front, back);
    };
  });
}

function initProblems() {
  fetch(`/emoji-concentration/data/${originalLang}.csv`)
    .then((response) => response.text())
    .then((tsv) => {
      let prevEn;
      tsv.trimEnd().split("\n").forEach((line) => {
        const [emoji, category, en, _] = line.split(",");
        if (category in problems === false) {
          problems[category] = [];
        }
        if (prevEn == en) {
          const p = problems[category];
          const last = p[p.length - 1];
          last[0].push(emoji);
        } else {
          problems[category].push([[emoji], en]);
        }
        prevEn = en;
      });
    });
}

// https://qiita.com/rspmharada7645/items/f32875b723ec8838c9f1
function rotateCard(front, back) {
  function rotateAnimationLoop(obj, deg) {
    if (deg <= 180) {
      rotateAnimation(obj, deg);
      setTimeout(() => {
        rotateAnimationLoop(obj, deg += 5);
      }, 1);
    } else {
      obj.style.transform = null;
    }
  }

  function rotateAnimation(obj, deg) {
    if (90 === deg) {
      if (obj == front) {
        front.classList.add("d-none");
        back.classList.remove("d-none");
      } else {
        front.classList.remove("d-none");
        back.classList.add("d-none");
      }
    } else {
      obj.style.transform = `rotateY(${deg}deg)`;
    }
  }

  if (front.classList.contains("d-none")) {
    rotateAnimationLoop(back, 0);
  } else {
    rotateAnimationLoop(front, 0);
  }
}

function changeLevel() {
  const level = document.getElementById("levelOption").selectedIndex;
  const choicesObj = document.getElementById("choices");
  while (choicesObj.firstChild) choicesObj.removeChild(choicesObj.firstChild);

  const target = {};
  const problemLength = 3 + level * 2;
  while (true) {
    if (Object.keys(target).length < problemLength) {
      const course = document.getElementById("courseOption");
      const category = categories[course.selectedIndex];
      const [emoji, text] = selectRandomEmoji(category);
      target[text] = emoji;
    } else {
      break;
    }
  }

  const targetEntries = Object.entries(target);
  const choices = [];
  for (let i = 0; i < targetEntries.length; i++) {
    const choiceBox = document.getElementById("choice-box")
      .content.cloneNode(true);
    const choice = choiceBox.querySelector(".card");
    const [text, emoji] = targetEntries[i];
    choice.querySelector(".emoji").textContent = emoji;
    choice.querySelector(".text").textContent = text;
    choices.push(choice);
    choices.push(choice.cloneNode(true));
  }
  shuffle(choices);
  choices.forEach((choice) => choicesObj.appendChild(choice));
  initEvents();
}

initEvents();
initProblems();
catsWalk();

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
const furiganaButton = document.getElementById("addFurigana");
if (furiganaButton) furiganaButton.onclick = addFurigana;
document.getElementById("mode").onclick = changeMode;
document.getElementById("levelOption").onchange = changeLevel;
document.getElementById("courseOption").onchange = changeLevel;
document.getElementById("lang").onchange = changeLang;
document.addEventListener("click", unlockAudio, {
  once: true,
  useCapture: true,
});
