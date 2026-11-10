/**
 * Comparison Slider Controller — Beresheet Dead Sea
 * Handles mouse, touch, pointer, and keyboard interactions with full accessibility support.
 */

document.addEventListener('DOMContentLoaded', () => {
  initComparisonSliders();
});

/**
 * Initializes all comparison slider instances on the page
 */
export function initComparisonSliders() {
  const sliders = document.querySelectorAll('[data-comparison-slider]');
  sliders.forEach((slider) => setupSliderInstance(slider));
}

/**
 * Sets up event listeners and state management for a single slider instance
 * @param {HTMLElement} container
 */
function setupSliderInstance(container) {
  const rangeInput = container.querySelector('.comparison-range-input');
  if (!rangeInput) return;

  let isDragging = false;

  /**
   * Updates slider visual state and synchronizes range input
   * @param {number} percent - Position between 0 and 100
   */
  function setPosition(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    container.style.setProperty('--position', `${clamped}%`);
    if (rangeInput.value !== String(clamped)) {
      rangeInput.value = clamped;
    }
    rangeInput.setAttribute('aria-valuenow', Math.round(clamped));
  }

  // Initialize at 50%
  setPosition(50);

  // Synchronize range input changes (keyboard navigation and accessibility tools)
  rangeInput.addEventListener('input', (e) => {
    setPosition(parseFloat(e.target.value));
  });

  // Additional keyboard precision shortcuts
  rangeInput.addEventListener('keydown', (e) => {
    let current = parseFloat(rangeInput.value);
    const step = e.shiftKey ? 10 : 2;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setPosition(current - step);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setPosition(current + step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setPosition(100);
    }
  });

  /**
   * Computes percentage from clientX relative to container bounding box
   * @param {PointerEvent} e
   */
  function updateFromPointer(e) {
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) return;
    const offsetX = e.clientX - rect.left;
    const percent = (offsetX / rect.width) * 100;
    setPosition(percent);
  }

  // Unified Pointer Events (Mouse, Touch, Stylus)
  container.addEventListener('pointerdown', (e) => {
    // Primary button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isDragging = true;
    container.classList.add('is-dragging');
    try {
      container.setPointerCapture(e.pointerId);
    } catch (err) {
      // Fallback if pointer capture is unsupported
    }
    updateFromPointer(e);
  });

  container.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    updateFromPointer(e);
  });

  function stopDragging(e) {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove('is-dragging');
    try {
      if (container.hasPointerCapture(e.pointerId)) {
        container.releasePointerCapture(e.pointerId);
      }
    } catch (err) {
      // Graceful fallback
    }
  }

  container.addEventListener('pointerup', stopDragging);
  container.addEventListener('pointercancel', stopDragging);
}
