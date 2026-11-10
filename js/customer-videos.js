/**
 * Customer Experiences Feature — Beresheet Dead Sea (Feature 03)
 * Handles interactive playback, mutual pause exclusivity, overlay controls,
 * and carousel navigation for customer UGC videos.
 */

export function initCustomerVideos() {
  const galleries = document.querySelectorAll('[data-customer-videos]');
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const track = gallery.querySelector('[data-video-track]');
    const cards = gallery.querySelectorAll('[data-video-card]');
    const prevBtn = gallery.querySelector('[data-video-prev]');
    const nextBtn = gallery.querySelector('[data-video-next]');
    const allVideos = Array.from(gallery.querySelectorAll('video'));

    // 1. Play / Pause & Mutual Exclusivity
    cards.forEach((card) => {
      const video = card.querySelector('video');
      const overlay = card.querySelector('[data-video-overlay]');
      const playBtn = card.querySelector('[data-video-play-btn]');
      if (!video) return;

      const togglePlay = () => {
        if (video.paused || video.ended) {
          // Pause all other videos across all galleries
          allVideos.forEach((otherVideo) => {
            if (otherVideo !== video && !otherVideo.paused) {
              otherVideo.pause();
            }
          });
          video.play().catch((err) => {
            console.warn('Playback could not start:', err);
          });
        } else {
          video.pause();
        }
      };

      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          togglePlay();
        });
      }

      if (overlay) {
        overlay.addEventListener('click', () => {
          togglePlay();
        });
      }

      video.addEventListener('play', () => {
        card.setAttribute('data-playing', 'true');
        // Ensure all other videos are paused
        allVideos.forEach((otherVideo) => {
          if (otherVideo !== video && !otherVideo.paused) {
            otherVideo.pause();
          }
        });
      });

      video.addEventListener('pause', () => {
        card.removeAttribute('data-playing');
      });

      video.addEventListener('ended', () => {
        card.removeAttribute('data-playing');
        video.currentTime = 0;
      });

      video.addEventListener('error', () => {
        console.error('Video error encountered for:', video.src);
        card.removeAttribute('data-playing');
      });
    });

    // 2. Carousel Nav Arrows (if track exists)
    if (track && prevBtn && nextBtn) {
      const updateNavButtons = () => {
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;
        prevBtn.disabled = scrollLeft <= 4;
        nextBtn.disabled = scrollLeft >= maxScroll - 4;
      };

      const getScrollAmount = () => {
        const firstCard = cards[0];
        if (firstCard) {
          const cardWidth = firstCard.getBoundingClientRect().width;
          const gap = 20;
          return cardWidth + gap;
        }
        return 320;
      };

      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      });

      track.addEventListener('scroll', updateNavButtons, { passive: true });
      window.addEventListener('resize', updateNavButtons, { passive: true });
      updateNavButtons();
    }
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomerVideos);
} else {
  initCustomerVideos();
}
