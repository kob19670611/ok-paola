(() => {
  const images = [...document.querySelectorAll('img[data-deferred-src]')];
  function load(img) {
    if (!img.dataset.deferredSrc) return;
    if (img.dataset.deferredSrcset) img.srcset = img.dataset.deferredSrcset;
    img.src = img.dataset.deferredSrc;
    delete img.dataset.deferredSrc;
    delete img.dataset.deferredSrcset;
  }
  window.loadDeferredImages = () => images.forEach(load);
  if (!('IntersectionObserver' in window)) {
    window.loadDeferredImages();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { load(entry.target); observer.unobserve(entry.target); }
    });
  }, {rootMargin: '250px 0px'});
  images.forEach(img => observer.observe(img));
  // WebKit может не сообщить пересечение изображения под SVG-маской.
  // Проверка его рамки при прокрутке сохраняет тот же порог загрузки.
  let scheduled = false;
  function checkFrames() {
    scheduled = false;
    images.forEach(img => {
      if (!img.dataset.deferredSrc) return;
      const rect = img.getBoundingClientRect();
      if (rect.bottom >= -250 && rect.top <= innerHeight + 250) {
        load(img); observer.unobserve(img);
      }
    });
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(checkFrames); }
  }
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', schedule, {passive: true});
  schedule();
})();
