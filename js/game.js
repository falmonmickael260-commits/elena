import {QUESTION_BANK} from "./questions.js";import {WORLDS} from "./worlds.js";import {load,save,reset} from "./save.js";import {speak,repeat} from "./voice.js";
const $=s=>document.querySelector(s), state=load();let world=0,current=null,step=0,story=0;
const intro=[
"Il était une fois une petite fille merveilleuse qui s'appelait Elena…",
"Elena était une petite aventurière très curieuse. Elle aimait découvrir de nouvelles choses et résoudre des mystères…",
"Un jour, une mystérieuse lumière apparut devant elle…",
"Elena s'approcha doucement… et soudain, une porte magique s'ouvrit !",
"Derrière cette porte se cachait un monde rempli de magie, de jeux, de trésors et de surprises.",
"Mais ce monde avait besoin d'une aventurière courageuse… et cette aventurière, c'était Elena !",
"✨ Elena, es-tu prête à commencer ta grande aventure ?"
];
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.toggle("active",x.id===id))}
function ui(){["stars","gameStars"].forEach(id=>$( "#"+id).textContent=state.stars)}
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("toast-show");setTimeout(()=>e.classList.remove("toast-show"),1700)}
function renderMap(){const box=$("#worldList");box.innerHTML="";WORLDS.forEach((w,i)=>{const b=document.createElement("button");b.className="world"+(i+1>state.unlocked?" locked":"");b.innerHTML=`<span class="emoji">${w.icon}</span>${w.name}<small>${i+1>state.unlocked?"🔒 Monde à découvrir":"✨ Partir à l'aventure"}</small>`;b.onclick=()=>i+1<=state.unlocked?startWorld(i):toast("✨ Cette aventure sera bientôt débloquée !");box.append(b)})}
function startWorld(i){world=i;step=state.worldProgress[i]||0;$("#worldTitle").textContent=WORLDS[i].icon+" "+WORLDS[i].name;show("game");nextQuestion()}
function nextQuestion(){const pool=QUESTION_BANK.filter(q=>q!==current);current=pool[Math.floor(Math.random()*pool.length)];$("#questionVisual").textContent=current.visual;$("#questionText").textContent=current.q;$("#answers").innerHTML="";$("#progressBar").style.width=(step/5*100)+"%";const shuffled=[...current.a].sort(()=>Math.random()-.5);shuffled.forEach(a=>{const b=document.createElement("button");b.className="answer";b.innerHTML=`<span>${a[0]}</span><span class="sr">${a[1]}</span>`;b.onclick=()=>answer(b,a[2]);$("#answers").append(b)});speak("Elena, "+current.q)}
function answer(btn,ok){document.querySelectorAll(".answer").forEach(b=>b.disabled=true);if(!ok){btn.classList.add("wrong");speak("Presque Elena ! Regarde encore une fois. Essaie encore !");setTimeout(()=>document.querySelectorAll(".answer").forEach(b=>{b.disabled=false;b.classList.remove("wrong")}),700);return}btn.classList.add("correct");state.stars+=10;step++;state.worldProgress[world]=step;save(state);ui();speak("Bravo Elena ! Tu as trouvé la bonne réponse !");setTimeout(openDoor,700)}
function openDoor(){show("door");const d=$("#door");d.classList.remove("open");$("#doorEmoji").textContent=WORLDS[world].door;$("#doorText").textContent=step>=5?"✨ Bravo Elena ! Une nouvelle aventure t'attend !":"✨ La porte magique s'ouvre !";requestAnimationFrame(()=>d.classList.add("open"));setTimeout(()=>{d.classList.remove("open");if(step>=5){if(!state.completed.includes(world))state.completed.push(world);state.unlocked=Math.min(WORLDS.length,Math.max(state.unlocked,world+2));state.worldProgress[world]=0;save(state);ui();if(state.completed.length===WORLDS.length){show("ending");$("#endingText").textContent="Elena, tu as traversé tous les mondes ! Grâce à ton courage, ta curiosité et ton intelligence, le Cristal des Mondes est de nouveau complet. ✨";speak("Bravo Elena ! Le Cristal des Mondes est réparé !")}else{renderMap();show("map");toast("🏅 Nouveau monde découvert !")}}else{show("game");nextQuestion()}},1700)}
$("#startBtn").onclick=()=>{story=0;show("story");$("#storyText").textContent=intro[0];speak(intro[0])};
$("#storyNext").onclick=()=>{story++;if(story<intro.length){$("#storyText").textContent=intro[story];speak(intro[story])}else{renderMap();ui();show("map");speak("Bienvenue dans ton monde magique Elena ! Choisis une aventure.")}};
$("#storyVoice").onclick=()=>speak($("#storyText").textContent);$("#mapVoice").onclick=()=>speak("Bienvenue dans les aventures d'Elena ! Choisis ton aventure.");$("#repeatBtn").onclick=repeat;$("#backMap").onclick=()=>{renderMap();show("map")};$("#resetBtn").onclick=()=>{if(confirm("Recommencer l'aventure d'Elena ?"))reset()};$("#endingMap").onclick=()=>{renderMap();show("map")};
ui();renderMap();
