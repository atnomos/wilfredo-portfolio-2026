/* =============================================================================
   WILFREDO VALLE — PORTRAIT PHOTOGRAPHY
   script.js — Landing fade-out → navigate to work.html
   ============================================================================= */

// Word intro — typewriter effect + Matrix rain, plays once per session
(function () {
  'use strict';

  var intro = document.getElementById('js-intro');
  if (!intro) return;

  if (sessionStorage.getItem('intro-seen')) { intro.remove(); return; }

  var display = intro.querySelector('.word-intro__display');
  var skipBtn = intro.querySelector('.word-intro__skip');
  var canvas  = intro.querySelector('.word-intro__canvas');
  var ctx     = canvas.getContext('2d');

  // --- Matrix rain ---
  var FONT_SIZE = 14;
  var CHARS      = '01101001011010011011010110100101101001010110100110110101アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ';
  var NAME_CHARS = 'WILFREDOVALE';
  var drops, rainInterval;

  function initCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    // Fill black so rain looks correct from frame 1
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drops = new Array(Math.floor(canvas.width / FONT_SIZE)).fill(1);
  }

  function drawRain() {
    // Slight black overlay fades older characters — creates the trail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = FONT_SIZE + 'px monospace';

    for (var i = 0; i < drops.length; i++) {
      // 8% chance to inject a letter from the name with a random glow
      var isName = Math.random() < 0.08;
      var char = isName
        ? NAME_CHARS[Math.floor(Math.random() * NAME_CHARS.length)]
        : CHARS[Math.floor(Math.random() * CHARS.length)];

      if (isName) {
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur  = 10 + Math.random() * 25;
        ctx.fillStyle   = Math.random() < 0.4 ? '#ffffff' : '#ccffcc';
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle  = drops[i] === 1 ? '#ccffcc' : '#00ff41';
      }

      ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);
      ctx.shadowBlur = 0; // always reset so glow doesn't bleed

      if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  initCanvas();
  window.addEventListener('resize', initCanvas);
  rainInterval = setInterval(drawRain, 33); // ~30 fps

  // --- Typewriter ---
  var WORDS      = ['Creative', 'Designer', 'Technologist', 'Program Manager', 'AI Evangelist'];
  var HOLD      = 900;
  var CLEAR_GAP = 220;
  var timer;

  // Randomised delay per character — mimics natural typing rhythm
  function charDelay(ch) {
    var base = ch === ' ' ? 180 : 120;          // spaces feel like a beat
    var jitter = Math.random() * 100;            // ±0–100ms natural variance
    var hesitate = Math.random() < 0.12 ? 200 : 0; // occasional micro-pause
    return base + jitter + hesitate;
  }

  function dismiss() {
    clearTimeout(timer);
    clearInterval(rainInterval);
    window.removeEventListener('resize', initCanvas);
    sessionStorage.setItem('intro-seen', '1');
    intro.classList.add('is-done');
    setTimeout(function () { intro.remove(); }, 700);
    // Restart monogram animation from the top so it plays fresh when landing appears
    var mv = document.querySelector('.monogram--landing video');
    var mi = document.querySelector('.logo-static');
    if (mv) {
      mv.style.opacity = '1';
      mv.style.pointerEvents = '';
      if (mi) { mi.style.opacity = '0'; mi.style.pointerEvents = 'none'; }
      mv.currentTime = 0;
      mv.play();
    }
  }

  function typeWord(wordIdx, charIdx) {
    if (wordIdx >= WORDS.length) { dismiss(); return; }
    var word = WORDS[wordIdx];
    display.textContent = word.slice(0, charIdx);
    if (charIdx < word.length) {
      timer = setTimeout(function () { typeWord(wordIdx, charIdx + 1); }, charDelay(word[charIdx]));
    } else {
      timer = setTimeout(function () {
        display.textContent = '';
        timer = setTimeout(function () { typeWord(wordIdx + 1, 0); }, CLEAR_GAP);
      }, HOLD);
    }
  }

  skipBtn.addEventListener('click', dismiss);
  typeWord(0, 0);
}());

(function () {
  'use strict';

  var enterBtn = document.getElementById('js-enter');
  var landing  = document.getElementById('js-landing');

  if (!enterBtn || !landing) return;

  enterBtn.addEventListener('click', function () {
    // Fade out the landing screen, then navigate to the portfolio page
    landing.classList.add('is-hidden');
    setTimeout(function () {
      window.location.href = 'work.html';
    }, 800); // matches the 800ms transition on .landing.is-hidden
  });

}());

(function () {
  'use strict';
  var replayBtn = document.getElementById('js-replay');
  if (!replayBtn) return;
  replayBtn.addEventListener('click', function () {
    sessionStorage.removeItem('intro-seen');
    window.location.reload();
  });
}());

(function () {
  'use strict';
  var video = document.querySelector('.monogram--landing video');
  var img   = document.querySelector('.logo-static');
  if (!video || !img) return;

  video.addEventListener('ended', function () {
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';
    img.style.opacity = '1';
    img.style.pointerEvents = 'auto';
  });
}());
