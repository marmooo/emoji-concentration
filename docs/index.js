const htmlLang=document.documentElement.lang,ttsLang=getTTSLang(),categories=[...document.getElementById("courseOption").options].map(e=>e.value.toLowerCase()),problems={};let englishVoices=[];const audioContext=new AudioContext,audioBufferCache={};loadAudio("correct","/emoji-concentration/mp3/correct3.mp3"),loadAudio("correctAll","/emoji-concentration/mp3/correct1.mp3"),loadAudio("incorrect","/emoji-concentration/mp3/incorrect1.mp3"),loadConfig();function loadConfig(){if(localStorage.getItem("darkMode")==1&&document.documentElement.setAttribute("data-bs-theme","dark"),htmlLang=="ja"&&localStorage.getItem("furigana")==1){const e=document.getElementById("addFurigana");addFurigana(e),e.setAttribute("data-done",!0)}}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),document.documentElement.setAttribute("data-bs-theme","light")):(localStorage.setItem("darkMode",1),document.documentElement.setAttribute("data-bs-theme","dark"))}function addFurigana(){if(htmlLang!="ja")return;const e=document.getElementById("addFurigana");e.getAttribute("data-done")?(localStorage.setItem("furigana",0),location.reload()):(import("https://marmooo.github.io/yomico/yomico.min.js").then(e=>{e.yomico("/emoji-concentration/ja/index.yomi")}),localStorage.setItem("furigana",1),e.setAttribute("data-done",!0))}function changeLang(){const e=document.getElementById("lang"),t=e.options[e.selectedIndex].value;location.href=`/emoji-concentration/${t}/`}function getTTSLang(){switch(htmlLang){case"en":return"en-US";case"ja":return"ja-JP"}}async function playAudio(e,t){const s=await loadAudio(e,audioBufferCache[e]),n=audioContext.createBufferSource();if(n.buffer=s,t){const e=audioContext.createGain();e.gain.value=t,e.connect(audioContext.destination),n.connect(e),n.start()}else n.connect(audioContext.destination),n.start()}async function loadAudio(e,t){if(audioBufferCache[e])return audioBufferCache[e];const s=await fetch(t),o=await s.arrayBuffer(),n=await audioContext.decodeAudioData(o);return audioBufferCache[e]=n,n}function unlockAudio(){audioContext.resume()}function loadVoices(){const e=new Promise(e=>{let t=speechSynthesis.getVoices();if(t.length!==0)e(t);else{let n=!1;speechSynthesis.addEventListener("voiceschanged",()=>{n=!0,t=speechSynthesis.getVoices(),e(t)}),setTimeout(()=>{n||document.getElementById("noTTS").classList.remove("d-none")},500)}}),t=["com.apple.speech.synthesis.voice.Bahh","com.apple.speech.synthesis.voice.Albert","com.apple.speech.synthesis.voice.Hysterical","com.apple.speech.synthesis.voice.Organ","com.apple.speech.synthesis.voice.Cellos","com.apple.speech.synthesis.voice.Zarvox","com.apple.speech.synthesis.voice.Bells","com.apple.speech.synthesis.voice.Trinoids","com.apple.speech.synthesis.voice.Boing","com.apple.speech.synthesis.voice.Whisper","com.apple.speech.synthesis.voice.Deranged","com.apple.speech.synthesis.voice.GoodNews","com.apple.speech.synthesis.voice.BadNews","com.apple.speech.synthesis.voice.Bubbles"];e.then(e=>{englishVoices=e.filter(e=>e.lang==ttsLang).filter(e=>!t.includes(e.voiceURI))})}loadVoices();function speak(e){speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(e);return t.voice=englishVoices[Math.floor(Math.random()*englishVoices.length)],t.lang=ttsLang,speechSynthesis.speak(t),t}function getRandomInt(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e)+e)}function shuffle(e){for(let t=e.length;1<t;t--){const n=Math.floor(Math.random()*t);[e[n],e[t-1]]=[e[t-1],e[n]]}return e}function catWalk(e,t,n){const o=document.getElementById("catsWalk"),a=o.offsetWidth,r=o.offsetHeight,s=document.createElement("span");s.className="emoji walker",s.style.position="absolute",s.textContent=t;const i=128;s.style.top=getRandomInt(0,r-i)+"px",s.style.left=a-i+"px",s.addEventListener("click",()=>{speak(n),s.remove()},{once:!0}),o.appendChild(s);const c=setInterval(()=>{const e=parseInt(s.style.left)-1;e>-i?s.style.left=e+"px":(clearInterval(c),s.remove())},e)}function catsWalk(){setInterval(()=>{if(Math.random()>.995){const[e,t]=selectRandomEmoji();catWalk(getRandomInt(5,20),e,t)}},10)}function selectRandomEmoji(e){e||(e=categories[getRandomInt(0,categories.length)]);const t=problems[e],n=t[getRandomInt(0,t.length)],s=n[0],o=s[getRandomInt(0,s.length)],i=n[1];return[o,i]}function showAllHints(){const e=document.getElementById("choices");[...e.getElementsByClassName("text")].forEach(e=>{e.style.visibility="initial"})}function hideAllHints(){const e=document.getElementById("choices");[...e.getElementsByClassName("text")].forEach(e=>{e.style.visibility="hidden"})}function changeMode(e){e.target.textContent=="EASY"?(e.target.textContent="HARD",hideAllHints()):(e.target.textContent="EASY",showAllHints())}function filterBacked(e,t){return t.filter(t=>{const n=t.querySelector(".back");if(!t.classList.contains("cleared")&&n.classList.contains("d-none"))return!0;if(t==e)return!1})}function rotateCardAll(e){e.forEach(e=>{const t=e.querySelector(".front"),n=e.querySelector(".back");rotateCard(t,n)})}function speechOnEnd(e,t,n,s){if(s.length>=2){const e=s.every(e=>{if(e.querySelector(".text").textContent==t)return!0});if(e){const e=n.filter(e=>e.classList.contains("cleared"));playAudio(e.length==n.length-s.length?"correctAll":"correct, 0.3"),s.forEach(e=>{e.querySelector(".back").onclick=()=>{},e.classList.add("cleared")})}else playAudio("incorrect, 0.3"),rotateCardAll(s)}e.parentNode.style.pointerEvents="auto"}function initEvents(){const e=[...document.getElementById("choices").children];e.forEach(t=>{const n=t.querySelector(".front"),s=t.querySelector(".back");n.onclick=()=>{const e=t.querySelector(".text").textContent;speak(e)},s.onclick=()=>{t.parentNode.style.pointerEvents="none";const o=filterBacked(t,e);if(n.classList.contains("d-none")){o.push(t);const n=t.querySelector(".text").textContent,s=speak(n);/(iPad|iPhone|iPod|Macintosh)/.test(navigator.userAgent)?setTimeout(()=>{speechOnEnd(t,n,e,o)},2e3):s.onend=()=>{speechOnEnd(t,n,e,o)}}rotateCard(n,s)}})}function initProblems(){fetch(`/emoji-concentration/data/${htmlLang}.csv`).then(e=>e.text()).then(e=>{let t;e.trimEnd().split(`
`).forEach(e=>{const[o,n,s,i]=e.split(",");if(n in problems===!1&&(problems[n]=[]),t==s){const e=problems[n],t=e[e.length-1];t[0].push(o)}else problems[n].push([[o],s]);t=s})})}function rotateCard(e,t){function n(e,t){t<=180?(s(e,t),setTimeout(()=>{n(e,t+=5)},1)):e.style.transform=null}function s(n,s){90===s?n==e?(e.classList.add("d-none"),t.classList.remove("d-none")):(e.classList.remove("d-none"),t.classList.add("d-none")):n.style.transform=`rotateY(${s}deg)`}e.classList.contains("d-none")?n(t,0):n(e,0)}function changeLevel(){const o=document.getElementById("levelOption").selectedIndex,e=document.getElementById("choices");for(;e.firstChild;)e.removeChild(e.firstChild);const n={},i=3+o*2;for(;!0;)if(Object.keys(n).length<i){const e=document.getElementById("courseOption"),t=categories[e.selectedIndex],[s,o]=selectRandomEmoji(t);n[o]=s}else break;const s=Object.entries(n),t=[];for(let n=0;n<s.length;n++){const o=document.getElementById("choice-box").content.cloneNode(!0),e=o.querySelector(".card"),[i,a]=s[n];e.querySelector(".emoji").textContent=a,e.querySelector(".text").textContent=i,t.push(e),t.push(e.cloneNode(!0))}shuffle(t),t.forEach(t=>e.appendChild(t)),initEvents()}initEvents(),initProblems(),catsWalk(),document.getElementById("toggleDarkMode").onclick=toggleDarkMode;const furiganaButton=document.getElementById("addFurigana");furiganaButton&&(furiganaButton.onclick=addFurigana),document.getElementById("mode").onclick=changeMode,document.getElementById("levelOption").onchange=changeLevel,document.getElementById("courseOption").onchange=changeLevel,document.getElementById("lang").onchange=changeLang,document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0})