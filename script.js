const welcome = document.querySelector('#welcome');
const firstMoment = document.querySelector('#first-moment');

const music = document.querySelector('#background-music');
const musicToggle = document.querySelector('#music-toggle');
let musicChosen = false;
music.volume = 0.3;

function updateMusicButton() {
  musicToggle.textContent = music.paused ? '♫ Activer la musique' : '♫ Couper la musique';
  musicToggle.setAttribute('aria-label', music.paused ? 'Activer la musique' : 'Couper la musique');
  musicToggle.setAttribute('aria-pressed', String(!music.paused));
}

async function playMusic() {
  try {
    await music.play();
    musicChosen = true;
  } catch {
    // Si la lecture est bloquée, le bouton permet de réessayer.
  }
  updateMusicButton();
}

music.addEventListener('play', updateMusicButton);
music.addEventListener('pause', updateMusicButton);
musicToggle.addEventListener('click', () => {
  musicChosen = true;
  if (music.paused) playMusic();
  else music.pause();
});

function startMusicOnInteraction(event) {
  if (musicChosen || event.target.closest('#music-toggle')) return;
  if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
  playMusic();
}

document.addEventListener('click', startMusicOnInteraction);
document.addEventListener('keydown', startMusicOnInteraction);

const go = document.querySelector('#go');
const kadirDialog = document.querySelector('#kadir-dialog');
const kadirAnswer = document.querySelector('#kadir-answer');
const next = document.querySelector('#next');
const expectedAnswer = 'Kadir est intelligent';
let escapes = 0;

function escapePointer(event) {
  const bounds = go.getBoundingClientRect();
  const margin = 20;
  const top = Math.max(margin, musicToggle.getBoundingClientRect().bottom + margin);
  const right = Math.max(margin, window.innerWidth - bounds.width - margin);
  const bottom = Math.max(top, window.innerHeight - bounds.height - margin);
  const positions = [
    [margin, top], [right, top],
    [margin, bottom], [right, bottom],
  ];
  // Choisir le coin le plus éloigné du pointeur, toujours dans l’écran.
  positions.sort((a, b) => {
    const distance = ([x, y]) => Math.hypot(
      x + bounds.width / 2 - event.clientX,
      y + bounds.height / 2 - event.clientY,
    );
    return distance(b) - distance(a);
  });
  go.classList.add('escaping');
  go.style.left = `${positions[0][0]}px`;
  go.style.top = `${positions[0][1]}px`;
  escapes += 1;
}

go.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'mouse' && escapes < 3) escapePointer(event);
});

window.addEventListener('resize', () => {
  // Revenir dans le flux si la fenêtre change, sans réinitialiser les essais.
  go.classList.remove('escaping');
  go.style.removeProperty('left');
  go.style.removeProperty('top');
});

go.addEventListener('click', (event) => {
  // Le clavier reste utilisable ; les clics et taps doivent attraper le bouton.
  if (event.detail !== 0 && escapes < 3) {
    escapePointer(event);
    return;
  }
  kadirAnswer.value = '';
  next.disabled = true;
  kadirDialog.showModal();
});

kadirAnswer.addEventListener('input', () => {
  next.disabled = kadirAnswer.value !== expectedAnswer;
});

document.querySelector('#kadir-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (kadirAnswer.value !== expectedAnswer) return;
  kadirDialog.close();
  welcome.hidden = true;
  firstMoment.hidden = false;
  document.querySelector('#moment-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

document.querySelector('#next-moment').addEventListener('click', () => {
  firstMoment.hidden = true;
  document.querySelector('#niyazi-moment').hidden = false;
  document.querySelector('#niyazi-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

document.querySelector('#next-hilmi').addEventListener('click', () => {
  document.querySelector('#niyazi-moment').hidden = true;
  document.querySelector('#hilmi-moment').hidden = false;
  document.querySelector('#hilmi-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

document.querySelector('#next-yelda').addEventListener('click', () => {
  document.querySelector('#hilmi-moment').hidden = true;
  document.querySelector('#yelda-moment').hidden = false;
  document.querySelector('#yelda-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

document.querySelector('#next-ismail').addEventListener('click', () => {
  document.querySelector('#yelda-moment').hidden = true;
  document.querySelector('#ismail-moment').hidden = false;
  document.querySelector('#ismail-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

document.querySelector('#next-family').addEventListener('click', () => {
  document.querySelector('#ismail-moment').hidden = true;
  document.querySelector('#family-moment').hidden = false;
  document.querySelector('#family-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

document.querySelector('#next-laya').addEventListener('click', () => {
  document.querySelector('#family-moment').hidden = true;
  document.querySelector('#laya-moment').hidden = false;
  document.querySelector('#laya-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

document.querySelector('#next-sayani').addEventListener('click', () => {
  document.querySelector('#laya-moment').hidden = true;
  document.querySelector('#sayani-moment').hidden = false;
  document.querySelector('#sayani-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

document.querySelector('#next-mention').addEventListener('click', () => {
  document.querySelector('#sayani-moment').hidden = true;
  document.querySelector('#mention-moment').hidden = false;
  document.querySelector('#mention-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

document.querySelector('#next-plok').addEventListener('click', () => {
  document.querySelector('#mention-moment').hidden = true;
  document.querySelector('#plok-moment').hidden = false;
  document.querySelector('#plok-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

const stageDarkness = document.querySelector('#stage-darkness');
let finaleAudioStarted = false;

stageDarkness.addEventListener('transitionend', (event) => {
  if (event.propertyName !== 'opacity' || finaleAudioStarted) return;
  finaleAudioStarted = true;
  musicChosen = true;
  music.pause();
  // Réutiliser le lecteur déjà activé pour le vocal final, sans boucle.
  music.loop = false;
  music.src = 'audios/salutCestNinho.mp3';
  music.volume = 1;
  music.addEventListener('playing', () => {
    document.querySelector('#ninho-surprise').hidden = false;
  }, { once: true });
  playMusic();
});
music.addEventListener('ended', updateMusicButton);

document.querySelector('#next-finale').addEventListener('click', () => {
  document.querySelector('#plok-moment').hidden = true;
  document.querySelector('#finale-moment').hidden = false;
  document.querySelector('#finale-title').focus({ preventScroll: true });
  window.scrollTo(0, 0);
  window.setTimeout(() => {
    stageDarkness.classList.add('lights-out');
  }, 2000);
});

// La photo reste masquée jusqu’à ce que pics/p0.jpeg soit disponible.
const welcomePhoto = document.querySelector('#p0');
welcomePhoto.addEventListener('load', () => {
  document.querySelector('#welcome-photo').hidden = false;
});
welcomePhoto.src = 'pics/p0.jpeg';
