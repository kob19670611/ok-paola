(() => {
  const section = document.getElementById('экран-05');
  const video = section?.querySelector('video');
  if (!video) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let started = false;
  let observer;
  const fallback = () => {
    video.pause();
    section.dataset.videoState = 'still';
  };
  video.muted = true;
  video.addEventListener('playing', () => { section.dataset.videoState = 'playing'; });
  video.addEventListener('ended', () => { section.dataset.videoState = 'finished'; });
  video.addEventListener('error', fallback);
  motion.addEventListener('change', () => { if (motion.matches) fallback(); });
  const start = () => {
    if (started || motion.matches) return;
    started = true;
    observer?.disconnect();
    video.src = video.dataset.src;
    video.play().catch(fallback);
  };
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) start();
    }, { threshold: 0.25 });
    observer.observe(video);
  }
})();
