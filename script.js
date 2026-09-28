/* 실제 캡처 파일과 설명은 이 배열에서 관리합니다. */
const demonstrations = [
  {duration:'약 13초', related:'#consistency', relatedLabel:'좋아요 상태 동기화 설계', category:'HOME · INTERACTION',title:'홈 탐색에서 좋아요까지',image:'assets/home-device-poster.webp',video:'assets/home-device.mp4',alt:'홈을 스크롤하여 지금 핫한 인기 게시물의 첫 피드에 좋아요를 누르는 실제 앱 시연',description:'홈의 이벤트·레슨·소식을 지나 인기 게시물로 이동합니다. 첫 피드의 좋아요를 누르면 하트와 숫자가 함께 바뀝니다.'},
  {duration:'약 15초', related:'#architecture', relatedLabel:'화면과 기능을 나눈 구조', category:'PROAM · EXPLORATION',title:'이벤트에서 스폰서 갤러리로',image:'assets/proam-device-poster.webp',video:'assets/proam-device.mp4',alt:'프로암 탭의 첫 이벤트에 진입하고 공식 스폰서 갤러리의 이미지를 두 번 스와이프하는 실제 앱 시연',description:'프로암 탭에서 첫 이벤트의 상세 안내를 읽고 공식 스폰서로 이동합니다. 상단 갤러리를 두 번 스와이프하며 화면 간 탐색 흐름을 보여줍니다.'},
  {duration:'약 23초', related:'#consistency', relatedLabel:'보상 후 잔액 갱신 설계', category:'CLUB · DWELL REWARD',title:'읽는 시간에서 체류 보상까지',image:'assets/club-device-poster.webp',video:'assets/club-device.mp4',alt:'클럽 피드를 천천히 스크롤하며 15초 카운트다운과 1공 보상 완료를 보여주는 실제 앱 시연',description:'클럽 피드를 천천히 읽으며 스크롤합니다. 15초 카운트다운 이후 보상 확인과 “1공을 받았어요” 안내까지 배속 없이 담았습니다.'}
];
const viewer = document.querySelector('.video-dialog');
const viewerVideo = viewer.querySelector('video');
let viewerTrigger;
function openViewer(demo, trigger) {
  viewerTrigger = trigger;
  viewer.querySelector('h2').textContent = demo.title;
  viewer.querySelector('.viewer-description').textContent = demo.description;
  viewer.querySelector('.viewer-file').href = demo.video;
  viewerVideo.src = demo.video;
  viewerVideo.poster = demo.image;
  viewerVideo.muted = true;
  viewerVideo.setAttribute('aria-label', demo.alt);
  document.querySelectorAll('#demo-grid video').forEach(video => video.pause());
  viewer.showModal();
  document.body.classList.add('viewer-open');
  viewerVideo.play().catch(() => {});
}
viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => {
  const rect = viewer.getBoundingClientRect();
  if (event.target === viewer && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) viewer.close();
});
viewer.addEventListener('close', () => {
  viewerVideo.pause();
  viewerVideo.removeAttribute('src');
  viewerVideo.load();
  document.body.classList.remove('viewer-open');
  viewerTrigger?.focus();
  resumePreviews();
});
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
    video.id = `demo-video-${index + 1}`;
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
    toggle.textContent = '재생 ▶';
    toggle.setAttribute('aria-controls', video.id);
    toggle.setAttribute('aria-label', `${demo.title} 재생`);
    toggle.addEventListener('click', () => {
      video.dataset.userPaused = video.paused ? 'false' : 'true';
      if (video.paused) video.play().catch(() => {}); else video.pause();
    });
    video.addEventListener('play', () => { toggle.textContent = '일시정지 Ⅱ'; toggle.setAttribute('aria-label', `${demo.title} 일시정지`); });
    video.addEventListener('pause', () => { toggle.textContent = '재생 ▶'; toggle.setAttribute('aria-label', `${demo.title} 재생`); });
    stage.append(toggle);
    const expand = document.createElement('button');
    expand.type = 'button';
    expand.className = 'media-expand';
    expand.textContent = '크게 보기 ⤢';
    expand.setAttribute('aria-label', `${demo.title} 영상 크게 보기`);
    expand.setAttribute('aria-haspopup', 'dialog');
    expand.addEventListener('click', () => openViewer(demo, expand));
    stage.append(expand);
    const duration = document.createElement('span');
    duration.className = 'demo-duration';
    duration.textContent = demo.duration;
    stage.append(duration);
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
  const related = document.createElement('a');
  related.className = 'demo-related';
  related.href = demo.related;
  related.textContent = `${demo.relatedLabel} ↓`;
  card.append(number, heading, description, related);
  grid.append(card);
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mediaObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const video = entry.target;
    video.dataset.inView = entry.intersectionRatio >= 0.6 ? 'true' : 'false';
    if (entry.intersectionRatio >= 0.6 && !document.hidden && !viewer.open && !reduceMotion.matches && video.dataset.userPaused !== 'true') {
      video.play().catch(() => {});
    } else video.pause();
  }
}, { threshold: 0.6 });
document.querySelectorAll('#demo-grid video').forEach(video => mediaObserver.observe(video));
function resumePreviews() {
  document.querySelectorAll('#demo-grid video').forEach(video => {
    if (!viewer.open && !document.hidden && video.dataset.inView === 'true' && video.dataset.userPaused !== 'true' && !reduceMotion.matches) video.play().catch(() => {});
  });
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) document.querySelectorAll('video').forEach(video => video.pause());
  else resumePreviews();
});
reduceMotion.addEventListener('change', event => {
  if (event.matches) document.querySelectorAll('#demo-grid video').forEach(video => video.pause());
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
