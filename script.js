/* 실제 캡처 파일과 설명은 이 배열에서 관리합니다. */
const demonstrations = [];
const grid = document.querySelector('#demo-grid');
for (const [index, demo] of demonstrations.entries()) {
  const card = document.createElement('article');
  card.className = 'demo-card';
  const stage = document.createElement('div');
  stage.className = 'demo-stage';
  const phone = document.createElement('div');
  phone.className = 'phone';
  if (demo.video) {
    const video = document.createElement('video');
    video.src = demo.video;
    video.poster = demo.image;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('aria-label', demo.alt);
    phone.append(video);
    const toggle = document.createElement('button');
    toggle.className = 'media-controls';
    toggle.type = 'button';
    toggle.textContent = '시연 재생 ▶';
    toggle.addEventListener('click', () => {
      video.dataset.userPaused = video.paused ? 'false' : 'true';
      if (video.paused) video.play().catch(() => {}); else video.pause();
    });
    video.addEventListener('play', () => { toggle.textContent = '시연 일시정지 Ⅱ'; });
    video.addEventListener('pause', () => { toggle.textContent = '시연 재생 ▶'; });
    stage.append(toggle);
  } else {
    const image = document.createElement('img');
    image.src = demo.image;
    image.alt = demo.alt;
    image.loading = 'lazy';
    image.width = 440;
    image.height = 956;
    phone.append(image);
  }
  stage.append(phone);
  card.append(stage);
  const number = document.createElement('span');
  number.className = 'demo-index';
  number.textContent = `0${index + 1} / ${demo.category}`;
  const heading = document.createElement('h3');
  heading.textContent = demo.title;
  const description = document.createElement('p');
  description.textContent = demo.description;
  card.append(number, heading, description);
  grid.append(card);
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mediaObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const video = entry.target;
    if (entry.isIntersecting && !reduceMotion.matches && video.dataset.userPaused !== 'true') {
      video.play().catch(() => {});
    } else video.pause();
  }
}, { threshold: 0.6 });
document.querySelectorAll('video').forEach(video => mediaObserver.observe(video));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) document.querySelectorAll('video').forEach(video => video.pause());
});
reduceMotion.addEventListener('change', event => {
  if (event.matches) document.querySelectorAll('video').forEach(video => video.pause());
});
const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      document.querySelectorAll('.case-nav a').forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }
}, {rootMargin: '-10% 0px -65% 0px'});
document.querySelectorAll('.case').forEach(section => sectionObserver.observe(section));
