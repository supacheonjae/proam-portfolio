/* 실제 캡처 파일과 설명은 이 배열에서 관리합니다. */
const demonstrations = [
  {category:'HOME · DISCOVERY',title:'서비스를 한눈에, 홈 탐색',image:'assets/home-poster.webp',video:'assets/home-demo.mp4',alt:'모두의프로암 홈에서 이벤트, 레슨, 소식 영역으로 스크롤하는 실제 앱 시연',description:'이벤트·레슨·소식을 하나의 탐색 흐름으로 구성했습니다. 공통 내비게이션과 목록 화면을 연결한 실제 홈 화면입니다.'},
  {category:'PROAM · EVENT',title:'이벤트의 맥락을 담은 상세 화면',image:'assets/proam-poster.webp',video:'assets/proam-demo.mp4',alt:'테일러메이드 프로암 이벤트의 대표 이미지에서 행사 안내로 스크롤하는 실제 앱 시연',description:'대표 이미지부터 응원 상태, 일정과 참가 안내까지 연결했습니다. 로그인 여부에 따른 행동 버튼과 서버 상태를 화면에 반영합니다.'},
  {category:'CLUB · MEDIA',title:'피드에서 이어지는 이미지 탐색',image:'assets/gallery-poster.webp',video:'assets/gallery-demo.mp4',alt:'공식 계정 피드에 첨부된 이미지를 썸네일로 전환하는 실제 앱 시연',description:'피드의 첨부 이미지를 전체 화면에서 살펴보고 썸네일로 전환합니다. 이미지 준비·업로드 구조는 아래 기술 사례에서 설명합니다.'}
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
