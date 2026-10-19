// ====================================================================
// ✨ ULTRA-ROMANTIC 3D BIRTHDAY EXPERIENCE (Awwwards Level) ✨
// ====================================================================

const CONFIG = {
  girlfriendName: "حبيبة قلبي ونور عيني",
  partnerName: "حبيبكِ للأبد",
  photo1Url: "photo1.jpg",
  photo2Url: "photo2.jpg",
  scene2Title: "كل ثانية جنبك حياة ❤️",
  scene2Message: "وجودك في الدنيا هو أحلى وأعظم هدية ربنا رزقني بيها، ضحكتك بتنوّر كل أيامي.",
  loveBadges: [
    "👑 ملكة قلبي",
    "✨ أجمل صدفة",
    "❤️ راحتي وسعادتي",
    "🌸 أحلى البنات"
  ],
  constellationStars: [
    { title: "أول ضحكة", quote: "من أول لحظة شوفتك فيها والدنيا ضحكتلي ✨" },
    { title: "أمان روحي", quote: "معاكِ بس بحس إني في أحسن مكان في الكون 💖" },
    { title: "أمنية العمر", quote: "كل سنة وكل يوم وانتي منورة حياتي وعمري كله 🌟" }
  ],
  finalLetterTitle: "رسالة حب من أعماق قلبي 💌",
  finalLetterBody: `حبيبتي ونور عيني {name}،

النهاردة مش مجرد يوم عادي، النهاردة اتولدت روحي التانية وأغلى شخص دخل حياتي وغيّر كل تفاصيلها للأجمل. 

كل سنة وأنتِ الضحكة اللي بتطمن قلبي، كل سنة وأنتِ الحب اللي مبيخلصش، والأمان اللي بهرب ليه من الدنيا.

بتمنى ليكي سنة جديدة شبه نقاء قلبك وجمال روحك، تحققي فيها كل اللي بتتمنيه، وأفضل جنبك في كل خطوة، سندك وحبيبك وصاحبك اللي ملوش غيرك في الدنيا.

بحبك من هنا لآخر النجوم، وكل ثانية وأنتِ أجمل نعم ربنا عليا. ❤️`,
  // Song: Mitski - My Love Mine All Mine
  audioUrl: "my_love_mine_all_mine.m4a"
};

/* ====================================================================
   1. ROMANTIC AUDIO SYNTHESIZER & PLAYER
   Fallback Web Audio API Piano Chimes so music NEVER fails to play!
==================================================================== */
class RomanticAudio {
  constructor() {
    this.audioEl = document.getElementById('romantic-audio');
    this.vinyl = document.getElementById('vinyl-icon');
    this.isPlaying = false;
    this.audioCtx = null;
    this.synthInterval = null;

    if (this.audioEl && CONFIG.audioUrl) {
      this.audioEl.src = CONFIG.audioUrl;
    }

    document.getElementById('music-toggle').addEventListener('click', () => this.toggle());
  }

  initSynth() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playChime(freq, duration = 1.8, delay = 0) {
    if (!this.audioCtx) return;
    setTimeout(() => {
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.2, this.audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch (e) {}
    }, delay * 1000);
  }

  startRomanticArpeggio() {
    this.initSynth();
    // Pentatonic romantic notes in Hz
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    let step = 0;
    this.synthInterval = setInterval(() => {
      if (!this.isPlaying) return;
      const note = notes[step % notes.length];
      this.playChime(note, 2.2, 0);
      if (step % 2 === 0) {
        this.playChime(notes[(step + 2) % notes.length], 2.0, 0.2);
      }
      step = (step + 1) % notes.length;
    }, 700);
  }

  play() {
    this.isPlaying = true;
    this.vinyl.classList.remove('paused');
    this.initSynth();

    // Try HTML5 Audio element first
    if (this.audioEl) {
      const promise = this.audioEl.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // If network / CORS blocks, run beautiful ambient synth
          this.startRomanticArpeggio();
        });
      }
    } else {
      this.startRomanticArpeggio();
    }
  }

  pause() {
    this.isPlaying = false;
    this.vinyl.classList.add('paused');
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

let soundEngine;

/* ====================================================================
   2. THREE.JS 3D ENGINE (Particle Cosmos + 3D Heart + Hyperspace)
==================================================================== */
let scene, camera, renderer;
let starField, heartParticles;
let clock = new THREE.Clock();
let mouseX = 0, mouseY = 0;
let targetCameraZ = 60;
let isWarping = false;

function initThree() {
  const canvas = document.getElementById('three-canvas');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06020f, 0.004);

  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, targetCameraZ);

  // 1) 3D Particle Starfield (4,000 cosmic dust points)
  const starCount = 3500;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starCols = new Float32Array(starCount * 3);

  const gold = new THREE.Color(0xffd066);
  const rose = new THREE.Color(0xff4382);
  const white = new THREE.Color(0xffffff);

  for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 800;
    const y = (Math.random() - 0.5) * 800;
    const z = (Math.random() - 0.5) * 1200;
    starPos[i * 3] = x;
    starPos[i * 3 + 1] = y;
    starPos[i * 3 + 2] = z;

    const r = Math.random();
    const c = r < 0.4 ? gold : (r < 0.7 ? rose : white);
    starCols[i * 3] = c.r;
    starCols[i * 3 + 1] = c.g;
    starCols[i * 3 + 2] = c.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCols, 3));

  const starMat = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // 2) 3D Pulsing Particle Heart Formation
  const heartCount = 1200;
  const heartGeo = new THREE.BufferGeometry();
  const heartPos = new Float32Array(heartCount * 3);
  const heartCols = new Float32Array(heartCount * 3);

  for (let i = 0; i < heartCount; i++) {
    const t = Math.PI * 2 * Math.random();
    // Heart parametric equations
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const hz = (Math.random() - 0.5) * 8;

    const scale = 0.8 + Math.random() * 0.2;
    heartPos[i * 3] = hx * scale;
    heartPos[i * 3 + 1] = hy * scale;
    heartPos[i * 3 + 2] = hz;

    const col = Math.random() > 0.3 ? rose : gold;
    heartCols[i * 3] = col.r;
    heartCols[i * 3 + 1] = col.g;
    heartCols[i * 3 + 2] = col.b;
  }

  heartGeo.setAttribute('position', new THREE.BufferAttribute(heartPos, 3));
  heartGeo.setAttribute('color', new THREE.BufferAttribute(heartCols, 3));

  const heartMat = new THREE.PointsMaterial({
    size: 2.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  heartParticles = new THREE.Points(heartGeo, heartMat);
  heartParticles.position.set(0, 5, 0);
  scene.add(heartParticles);

  // Mouse & touch parallax handlers
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    }
  });
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const trailCanvas = document.getElementById('trail-canvas');
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}

function animateThree() {
  requestAnimationFrame(animateThree);
  const elapsedTime = clock.getElapsedTime();

  // Gentle floating & heartbeat pulse
  const heartbeat = 1 + Math.sin(elapsedTime * 3) * 0.08 + (Math.sin(elapsedTime * 6) > 0.8 ? 0.05 : 0);
  heartParticles.scale.set(heartbeat, heartbeat, heartbeat);
  heartParticles.rotation.y = Math.sin(elapsedTime * 0.5) * 0.25;

  if (isWarping) {
    // Warp speed acceleration
    starField.rotation.z += 0.05;
    camera.position.z += (5 - camera.position.z) * 0.08;
  } else {
    // Gentle natural drift
    starField.rotation.y = elapsedTime * 0.02;
    starField.rotation.x = elapsedTime * 0.01;

    // Smooth camera parallax
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
    camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
  }

  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}

/* ====================================================================
   3. MAGIC FINGER & TOUCH STARDUST TRAIL (2D Interactive Canvas)
==================================================================== */
function initTrail() {
  const canvas = document.getElementById('trail-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];

  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 2.5;
      this.vy = (Math.random() - 0.5) * 2.5 - 0.5;
      this.size = Math.random() * 4 + 2;
      this.color = Math.random() > 0.5 ? '#ffd066' : '#ff4382';
      this.life = 1;
      this.decay = Math.random() * 0.025 + 0.015;
      this.isHeart = Math.random() < 0.25;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      
      if (this.isHeart) {
        ctx.font = `${Math.floor(this.size * 2.5)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('❤️', this.x, this.y);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function emit(x, y) {
    for (let i = 0; i < 3; i++) {
      particles.push(new Sparkle(x, y));
    }
  }

  window.addEventListener('mousemove', (e) => emit(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    for (let i = 0; i < e.touches.length; i++) {
      emit(e.touches[i].clientX, e.touches[i].clientY);
    }
  });

  function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}

/* ====================================================================
   4. AMBIENT CONTINUOUS FLOATING HEARTS (Soft romantic background)
==================================================================== */
function initAmbientHearts() {
  const container = document.getElementById('ambient-hearts');
  const hearts = ['❤️', '💖', '✨', '🌸', '💕'];

  function spawn() {
    const el = document.createElement('div');
    el.className = 'floating-heart';
    el.innerText = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = `${Math.random() * 100}vw`;
    const size = Math.random() * 1.5 + 1;
    el.style.fontSize = `${size}rem`;
    const duration = Math.random() * 6 + 7;
    el.style.animationDuration = `${duration}s`;

    container.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, duration * 1000);
  }

  setInterval(spawn, 500);
  for (let i = 0; i < 8; i++) spawn();
}

/* ====================================================================
   5. CINEMATIC 4-STAGE INTERACTIVE JOURNEY
==================================================================== */
const uiContainer = document.getElementById('ui-container');

// ---- STAGE 1: HYPERSPACE HOLD PORTAL ----
function renderStage1() {
  uiContainer.innerHTML = `
    <div id="stage-1" class="interactive-element glass-panel flex flex-col items-center max-w-sm text-center px-6 py-8 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
      <div class="mb-3 inline-block px-4 py-1 rounded-full bg-rose-500/20 border border-romanticPink/40 text-sparkleGold text-xs font-bold tracking-wide">
        ✨ رحلة صُممت خصيصاً لكِ
      </div>

      <h1 class="text-2xl md:text-3xl font-black mb-2 glow-text-pink leading-relaxed">
        عيد ميلاد سعيد يا ${CONFIG.girlfriendName}
      </h1>

      <p class="text-gray-200 text-sm mb-6 font-normal leading-relaxed">
        كل عام وأنتِ النور اللي محلي دنيتي، اضغطي مطولاً بصباعك على القلب لبدء رحلتنا السحرية ✨
      </p>

      <!-- Hold To Enter Button with SVG Ring -->
      <div id="portal-btn" class="relative w-28 h-28 flex items-center justify-center cursor-pointer active:scale-95 transition-transform duration-200">
        <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" stroke="rgba(255, 255, 255, 0.15)" stroke-width="6" fill="none"/>
          <circle id="progress-circle" cx="50" cy="50" r="44" stroke="#ff4382" stroke-width="6" fill="none"
            stroke-dasharray="276.46" stroke-dashoffset="276.46" stroke-linecap="round"/>
        </svg>

        <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-romanticPink to-sparkleGold p-1 shadow-[0_0_25px_rgba(255,67,130,0.8)] flex items-center justify-center">
          <div class="w-full h-full rounded-full bg-cosmicDeep flex flex-col items-center justify-center">
            <span class="text-2xl animate-bounce">💖</span>
            <span class="text-[10px] text-sparkleGold font-bold mt-0.5">اضغطي هنا</span>
          </div>
        </div>
      </div>

      <p id="hold-hint" class="text-xs text-gray-400 mt-4 tracking-wider">
        المسي واستمرّي بالضغط لمدة ثانيتين
      </p>
    </div>
  `;

  const btn = document.getElementById('portal-btn');
  const ring = document.getElementById('progress-circle');
  const circumference = 276.46;
  let holdTimer = null;
  let startTime = 0;
  const holdDuration = 2000; // 2 seconds

  function startHold(e) {
    if (e) e.preventDefault();
    soundEngine.play(); // trigger audio on user interaction!
    startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / holdDuration, 1);
      ring.style.strokeDashoffset = circumference * (1 - progress);

      if (progress < 1) {
        holdTimer = requestAnimationFrame(step);
      } else {
        triggerHyperspace();
      }
    }
    holdTimer = requestAnimationFrame(step);
  }

  function cancelHold() {
    if (holdTimer) {
      cancelAnimationFrame(holdTimer);
      holdTimer = null;
    }
    gsap.to(ring, { strokeDashoffset: circumference, duration: 0.3 });
  }

  btn.addEventListener('mousedown', startHold);
  btn.addEventListener('touchstart', startHold);
  btn.addEventListener('mouseup', cancelHold);
  btn.addEventListener('mouseleave', cancelHold);
  btn.addEventListener('touchend', cancelHold);

  function triggerHyperspace() {
    isWarping = true;
    soundEngine.playChime(523.25, 2.5);
    soundEngine.playChime(659.25, 2.5, 0.2);

    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 }
    });

    gsap.to('#stage-1', {
      scale: 1.5,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 1,
      ease: 'power2.in',
      onComplete: () => {
        isWarping = false;
        targetCameraZ = 45;
        renderStage2();
      }
    });
  }
}

// ---- STAGE 2: 3D HOLOGRAPHIC MEMORY CARD ----
function renderStage2() {
  uiContainer.innerHTML = `
    <div id="stage-2" class="interactive-element flex flex-col items-center max-w-sm w-full opacity-0">
      
      <!-- 3D Holographic Tilt Card -->
      <div id="holo-card" class="relative w-full glass-panel p-5 overflow-hidden transition-transform duration-100 ease-out">
        <div id="glare" class="holographic-glare"></div>

        <!-- Photo Frame -->
        <div class="relative w-full h-72 rounded-2xl overflow-hidden border-2 border-sparkleGold/40 shadow-inner mb-4 bg-purple-950 flex items-center justify-center">
          <img id="card-photo" src="${CONFIG.photo1Url}" alt="Photo" class="w-full h-full object-cover object-center" />
          <div class="absolute inset-0 bg-gradient-to-t from-cosmicDark/90 via-transparent to-transparent"></div>
          <div class="absolute bottom-3 right-3 text-right">
            <span class="text-xs bg-rose-500/80 px-2.5 py-1 rounded-full text-white font-bold">✨ ذكرى غالية</span>
            <h3 class="text-lg font-bold text-warmGold mt-1">${CONFIG.scene2Title}</h3>
          </div>
        </div>

        <p class="text-sm text-gray-200 leading-relaxed text-center mb-4">
          ${CONFIG.scene2Message}
        </p>

        <!-- Orbiting Love Badges -->
        <div class="flex flex-wrap justify-center gap-2 mb-2">
          ${CONFIG.loveBadges.map((badge, idx) => `
            <span class="badge-item px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-sparkleGold shadow-sm">
              ${badge}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Next Step Button -->
      <button id="to-stage-3" class="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-romanticPink via-neonRose to-warmGold text-white font-bold text-sm shadow-[0_0_20px_rgba(255,67,130,0.6)] hover:scale-105 active:scale-95 transition-all">
        اجمعي نجوم أمنياتك ✨
      </button>
    </div>
  `;

  const card = document.getElementById('holo-card');
  const glare = document.getElementById('glare');

  // Fallback for image load error
  const cardImg = document.getElementById('card-photo');
  cardImg.onerror = () => {
    cardImg.src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop';
  };

  // 3D Card Tilt on Mouse / Touch
  function handleTilt(x, y) {
    const rect = card.getBoundingClientRect();
    const px = (x - rect.left) / rect.width;
    const py = (y - rect.top) / rect.height;

    const rotX = (py - 0.5) * -22;
    const rotY = (px - 0.5) * 22;

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    glare.style.opacity = Math.min(Math.abs(px - 0.5) + Math.abs(py - 0.5), 0.6);
  }

  card.addEventListener('mousemove', (e) => handleTilt(e.clientX, e.clientY));
  card.addEventListener('touchmove', (e) => {
    if (e.touches[0]) handleTilt(e.touches[0].clientX, e.touches[0].clientY);
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    glare.style.opacity = '0';
  });

  gsap.to('#stage-2', { opacity: 1, duration: 0.8, ease: 'power2.out' });
  gsap.from('.badge-item', { scale: 0, opacity: 0, stagger: 0.15, duration: 0.6, ease: 'back.out(2)' });

  document.getElementById('to-stage-3').addEventListener('click', () => {
    soundEngine.playChime(659.25, 1.5);
    gsap.to('#stage-2', {
      opacity: 0,
      y: -30,
      duration: 0.6,
      onComplete: renderStage3
    });
  });
}

// ---- STAGE 3: CONSTELLATION UNLOCK & SUPERNOVA ----
function renderStage3() {
  uiContainer.innerHTML = `
    <div id="stage-3" class="interactive-element flex flex-col items-center max-w-sm w-full opacity-0 text-center px-4">
      <span class="text-xs text-sparkleGold font-bold px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-2">
        ✨ كوكبة القلوب
      </span>
      <h2 class="text-2xl font-black mb-2 glow-text-gold">المسي نجومنا التلاتة</h2>
      <p class="text-xs text-gray-300 mb-6">
        كل نجمة شايلة سر وذكرى محفورة في قلبي، اضغطي عليهم عشان تجمعي الكوكبة 🌟
      </p>

      <!-- Constellation Nodes Area -->
      <div id="constellation-area" class="relative w-full h-56 glass-panel flex items-center justify-around px-4 mb-4 overflow-hidden">
        <svg id="constellation-svg" class="absolute inset-0 w-full h-full pointer-events-none">
          <line id="line-1" x1="0" y1="0" x2="0" y2="0" stroke="#ffd066" stroke-width="3" stroke-dasharray="6,6" opacity="0"/>
          <line id="line-2" x1="0" y1="0" x2="0" y2="0" stroke="#ff4382" stroke-width="3" stroke-dasharray="6,6" opacity="0"/>
        </svg>

        ${CONFIG.constellationStars.map((s, i) => `
          <div id="star-${i}" class="constellation-star relative z-10 flex flex-col items-center cursor-pointer group">
            <div class="star-icon w-14 h-14 rounded-full bg-white/10 border-2 border-sparkleGold/60 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(255,208,102,0.4)] transition-all duration-300 group-hover:scale-110">
              ⭐
            </div>
            <span class="text-xs font-bold text-warmGold mt-2">${s.title}</span>
          </div>
        `).join('')}
      </div>

      <!-- Card showing quote when star is touched -->
      <div id="star-quote" class="glass-panel p-4 w-full min-h-[70px] flex items-center justify-center text-center">
        <p class="text-sm text-gray-200">اضغطي على أول نجمة... 💫</p>
      </div>
    </div>
  `;

  gsap.to('#stage-3', { opacity: 1, duration: 0.8 });

  let unlockedCount = 0;
  const stars = document.querySelectorAll('.constellation-star');
  const quoteEl = document.getElementById('star-quote');
  const starCoords = [];

  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      if (star.dataset.unlocked) return;
      star.dataset.unlocked = 'true';
      unlockedCount++;

      soundEngine.playChime(440 + index * 110, 1.8);

      const icon = star.querySelector('.star-icon');
      icon.innerHTML = '💖';
      icon.classList.add('bg-gradient-to-tr', 'from-romanticPink', 'to-sparkleGold', 'border-white', 'shadow-[0_0_30px_#ff4382]');

      gsap.fromTo(icon, { scale: 0.6 }, { scale: 1.25, duration: 0.4, yoyo: true, repeat: 1 });

      confetti({
        particleCount: 35,
        spread: 60,
        origin: {
          x: star.getBoundingClientRect().left / window.innerWidth,
          y: star.getBoundingClientRect().top / window.innerHeight
        }
      });

      quoteEl.innerHTML = `<p class="text-sm font-semibold text-sparkleGold animate-pulse">"${CONFIG.constellationStars[index].quote}"</p>`;

      // Record coordinates for SVG line
      const rect = star.getBoundingClientRect();
      const parentRect = document.getElementById('constellation-area').getBoundingClientRect();
      starCoords[index] = {
        x: rect.left + rect.width / 2 - parentRect.left,
        y: rect.top + rect.height / 2 - parentRect.top
      };

      if (index === 1 && starCoords[0]) {
        const l1 = document.getElementById('line-1');
        l1.setAttribute('x1', starCoords[0].x);
        l1.setAttribute('y1', starCoords[0].y);
        l1.setAttribute('x2', starCoords[1].x);
        l1.setAttribute('y2', starCoords[1].y);
        gsap.to(l1, { opacity: 1, duration: 0.5 });
      } else if (index === 2 && starCoords[1]) {
        const l2 = document.getElementById('line-2');
        l2.setAttribute('x1', starCoords[1].x);
        l2.setAttribute('y1', starCoords[1].y);
        l2.setAttribute('x2', starCoords[2].x);
        l2.setAttribute('y2', starCoords[2].y);
        gsap.to(l2, { opacity: 1, duration: 0.5 });
      }

      if (unlockedCount === 3) {
        setTimeout(triggerSupernova, 1000);
      }
    });
  });

  function triggerSupernova() {
    // Supernova explosion
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.5 }
    });

    gsap.to('#stage-3', {
      scale: 1.1,
      opacity: 0,
      duration: 0.8,
      onComplete: renderStage4
    });
  }
}

// ---- STAGE 4: TANGLED SKY LANTERNS & ROYAL LOVE LETTER ----
function renderStage4() {
  uiContainer.innerHTML = `
    <div id="stage-4" class="interactive-element flex flex-col items-center max-w-md w-full opacity-0 px-2">
      
      <!-- Romantic Lanterns Trigger -->
      <div id="lantern-launcher" class="w-full text-center mb-3">
        <button id="launch-btn" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-warmGold to-romanticPink text-cosmicDark font-black text-sm shadow-[0_0_25px_rgba(255,208,102,0.8)] active:scale-95 transition-all">
          🏮 أطلقي فوانيس حبنا في السماء ✨
        </button>
      </div>

      <!-- Royal Scroll Love Letter -->
      <div class="glass-panel p-6 w-full max-h-[70vh] flex flex-col border border-sparkleGold/30 shadow-[0_0_40px_rgba(255,67,130,0.3)]">
        <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <span class="text-xl">💌</span>
          <h2 class="text-lg md:text-xl font-bold text-sparkleGold glow-text-gold">${CONFIG.finalLetterTitle}</h2>
          <span class="text-xl">✨</span>
        </div>

        <div id="letter-content" class="custom-scroll overflow-y-auto text-right text-gray-100 text-sm md:text-base leading-relaxed whitespace-pre-line pr-2 flex-1">
          <!-- Text will type out -->
        </div>

        <div class="pt-4 border-t border-white/10 mt-3 flex justify-between items-center">
          <span class="text-xs text-sparkleGold font-bold">${CONFIG.partnerName}</span>
          <button id="replay-btn" class="text-xs text-gray-400 hover:text-white underline">
            إعادة الرحلة من البداية 🔄
          </button>
        </div>
      </div>
    </div>
  `;

  gsap.to('#stage-4', { opacity: 1, duration: 0.8 });

  // Typewriter effect for letter
  const fullText = CONFIG.finalLetterBody
    .replace('{name}', CONFIG.girlfriendName);
  
  const contentEl = document.getElementById('letter-content');
  let charIdx = 0;

  function typeLetter() {
    if (charIdx < fullText.length) {
      contentEl.textContent += fullText.charAt(charIdx);
      charIdx++;
      contentEl.scrollTop = contentEl.scrollHeight;
      setTimeout(typeLetter, 25);
    }
  }
  typeLetter();

  // Floating Lanterns
  function launchSkyLanterns() {
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const lantern = document.createElement('div');
        lantern.className = 'sky-lantern';
        lantern.style.left = `${Math.random() * 90 + 5}vw`;
        const scale = Math.random() * 0.6 + 0.7;
        lantern.style.transform = `scale(${scale})`;
        document.body.appendChild(lantern);

        const duration = Math.random() * 4 + 7;
        gsap.to(lantern, {
          y: -window.innerHeight - 150,
          x: (Math.random() - 0.5) * 150,
          rotation: (Math.random() - 0.5) * 30,
          duration: duration,
          ease: 'power1.out',
          onComplete: () => lantern.remove()
        });
      }, i * 200);
    }

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.4 }
    });
  }

  document.getElementById('launch-btn').addEventListener('click', launchSkyLanterns);
  // Auto-launch once as well
  setTimeout(launchSkyLanterns, 500);

  document.getElementById('replay-btn').addEventListener('click', () => {
    location.reload();
  });
}

/* ====================================================================
   6. BOOTSTRAP APPLICATION
==================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  soundEngine = new RomanticAudio();
  initThree();
  initTrail();
  initAmbientHearts();
  animateThree();
  renderStage1();
});
