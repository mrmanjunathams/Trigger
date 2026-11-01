// Trigger'18 — shared site behaviour (no dependencies)
(function () {
  'use strict';

  // ----- Navbar: shadow on scroll + mobile toggle -----
  var navbar = document.querySelector('.navbar');
  var toggle = document.querySelector('.nav-toggle');

  function onScroll() {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----- Highlight the nav link of the section in view -----
  var sectionLinks = Array.prototype.filter.call(
    document.querySelectorAll('.nav-links a[href^="#"]'),
    function (a) { return a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href')); }
  );
  if (sectionLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sectionLinks.forEach(function (a) { spy.observe(document.querySelector(a.getAttribute('href'))); });
  }

  // ----- Reveal on scroll -----
  // Content stays visible unless this runs, so a script failure never hides anything
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revealer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // ----- Gallery filter -----
  var tabs = document.querySelectorAll('.tab');
  var items = document.querySelectorAll('.gallery-item');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = tab.dataset.filter;
      tabs.forEach(function (t) {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab);
      });
      items.forEach(function (item) {
        var cats = (item.dataset.cat || '').split(' ');
        item.classList.toggle('hidden', filter !== 'all' && cats.indexOf(filter) === -1);
      });
    });
  });

  // ----- Lightbox -----
  var lightbox = document.querySelector('.lightbox');
  if (lightbox && items.length) {
    var lbImg = lightbox.querySelector('img');
    var current = 0;

    function visibleItems() {
      return Array.prototype.filter.call(items, function (i) { return !i.classList.contains('hidden'); });
    }
    function show(index) {
      var list = visibleItems();
      current = (index + list.length) % list.length;
      var img = list[current].querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
    }
    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        show(visibleItems().indexOf(item));
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    lightbox.querySelector('.lb-close').addEventListener('click', close);
    lightbox.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    lightbox.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  // ----- Testimonial slider -----
  var slider = document.querySelector('.slider');
  if (slider) {
    var track = slider.querySelector('.slides');
    var slides = track.querySelectorAll('.slide');
    var dotsWrap = slider.querySelector('.dots');
    var idx = 0;
    var timer;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll('.dot');

    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.scrollTo({ left: track.clientWidth * idx });
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { go(idx + 1); }, 6000);
    }

    // Keep dots in sync with manual swipes too
    track.addEventListener('scroll', function () {
      var i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== idx) idx = i;
      dots.forEach(function (d, n) { d.classList.toggle('active', n === i); });
    }, { passive: true });

    slider.querySelector('.slider-prev').addEventListener('click', function () { go(idx - 1); restart(); });
    slider.querySelector('.slider-next').addEventListener('click', function () { go(idx + 1); restart(); });
    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);
    window.addEventListener('resize', function () { track.scrollTo({ left: track.clientWidth * idx, behavior: 'auto' }); });
    restart();
  }
})();
