/* 실제 캡처 파일과 설명은 이 배열에서 관리합니다. */
const demonstrations = [
  {category:'HOME · INTERACTION',title:'홈 탐색에서 좋아요까지',image:'assets/home-full-poster.webp',video:'assets/home-full.mp4',alt:'홈을 스크롤하여 지금 핫한 인기 게시물의 첫 피드에 좋아요를 누르는 실제 앱 시연',description:'홈의 이벤트·레슨·소식을 지나 인기 게시물로 이동합니다. 첫 피드의 좋아요를 누르면 하트와 숫자가 함께 바뀝니다.'},
  {category:'PROAM · EXPLORATION',title:'이벤트에서 스폰서 갤러리로',image:'assets/proam-full-poster.webp',video:'assets/proam-full.mp4',alt:'프로암 탭의 첫 이벤트에 진입하고 공식 스폰서 갤러리의 이미지를 두 번 스와이프하는 실제 앱 시연',description:'프로암 탭에서 첫 이벤트의 상세 안내를 읽고 공식 스폰서로 이동합니다. 상단 갤러리를 두 번 스와이프하며 화면 간 탐색 흐름을 보여줍니다.'},
  {category:'CLUB · DWELL REWARD',title:'읽는 시간에서 체류 보상까지',image:'assets/club-full-poster.webp',video:'assets/club-full.mp4',alt:'클럽 피드를 천천히 스크롤하며 15초 카운트다운과 1공 보상 완료를 보여주는 실제 앱 시연',description:'클럽 피드를 천천히 읽으며 스크롤합니다. 15초 카운트다운 이후 보상 확인과 “1공을 받았어요” 안내까지 배속 없이 담았습니다.'}
];
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
    const expand = document.createElement('a');
    expand.className = 'media-expand';
    expand.href = demo.video;
    expand.target = '_blank';
    expand.rel = 'noopener noreferrer';
    expand.textContent = '크게 보기 ↗';
    expand.setAttribute('aria-label', `${demo.title} 영상 크게 보기`);
    stage.append(expand);
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

const splash = document.querySelector('#splash-video');
const splashToggle = document.querySelector('.hero-media-control');
splashToggle.addEventListener('click', () => {
  splash.dataset.userPaused = splash.paused ? 'false' : 'true';
  if (splash.paused) splash.play().catch(() => {}); else splash.pause();
});
splash.addEventListener('play', () => { splashToggle.textContent = '시연 일시정지 Ⅱ'; });
splash.addEventListener('pause', () => { splashToggle.textContent = '시연 재생 ▶'; });
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mediaObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const video = entry.target;
    video.dataset.inView = entry.intersectionRatio >= 0.6 ? 'true' : 'false';
    if (entry.intersectionRatio >= 0.6 && !document.hidden && !reduceMotion.matches && video.dataset.userPaused !== 'true') {
      video.play().catch(() => {});
    } else video.pause();
  }
}, { threshold: 0.6 });
document.querySelectorAll('video').forEach(video => mediaObserver.observe(video));
document.addEventListener('visibilitychange', () => {
  document.querySelectorAll('video').forEach(video => {
    if (document.hidden) video.pause();
    else if (video.dataset.inView === 'true' && video.dataset.userPaused !== 'true' && !reduceMotion.matches) video.play().catch(() => {});
  });
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
