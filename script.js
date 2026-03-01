/* =============================================================================
   WILFREDO VALLE — PORTRAIT PHOTOGRAPHY
   script.js — Landing fade-out → navigate to work.html
   ============================================================================= */

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
