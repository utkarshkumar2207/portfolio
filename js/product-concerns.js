/**
 * Product Concerns Feature — Beresheet Dead Sea (Feature 02)
 * 1. Makes horizontally scrollable screenshot frames keyboard-reachable.
 * 2. Opens screenshots at full size in an accessible modal <dialog>.
 * Without JavaScript, the "View full size" links open the image directly.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollFrames();
  initShotViewers();
});

/**
 * Adds a focus stop and region semantics to a screenshot frame only while it
 * actually overflows, so keyboard users can scroll it with the arrow keys.
 */
export function initScrollFrames() {
  const frames = document.querySelectorAll('[data-scroll-frame]');
  if (!frames.length) return;

  function update(frame) {
    const isScrollable = frame.scrollWidth > frame.clientWidth + 1;
    if (isScrollable) {
      frame.setAttribute('tabindex', '0');
      frame.setAttribute('role', 'region');
      frame.setAttribute('aria-label', frame.dataset.label || 'Scrollable screenshot');
    } else {
      frame.removeAttribute('tabindex');
      frame.removeAttribute('role');
      frame.removeAttribute('aria-label');
    }
  }

  frames.forEach((frame) => {
    update(frame);
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(() => update(frame));
      observer.observe(frame);
      const img = frame.querySelector('img');
      if (img) observer.observe(img);
    }
  });

  if (!('ResizeObserver' in window)) {
    window.addEventListener('resize', () => frames.forEach(update));
  }
}

/**
 * Full-size screenshot viewer built on the native <dialog> element, which
 * provides focus trapping and Escape-to-close.
 */
export function initShotViewers() {
  const triggers = document.querySelectorAll('[data-shot-viewer]');
  if (!triggers.length || typeof HTMLDialogElement === 'undefined') return;

  let dialog;
  let image;
  let title;
  let closeButton;
  let lastTrigger = null;

  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'shot-viewer';
    dialog.setAttribute('aria-labelledby', 'shot-viewer-title');

    const bar = document.createElement('div');
    bar.className = 'shot-viewer-bar';

    title = document.createElement('span');
    title.className = 'shot-viewer-title';
    title.id = 'shot-viewer-title';

    closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'shot-viewer-close';
    closeButton.textContent = 'Close';
    closeButton.setAttribute('aria-label', 'Close full-size screenshot');

    bar.append(title, closeButton);

    const body = document.createElement('div');
    body.className = 'shot-viewer-body';

    image = document.createElement('img');
    image.width = 1024;
    body.append(image);

    dialog.append(bar, body);
    document.body.append(dialog);

    closeButton.addEventListener('click', () => dialog.close());

    // Clicking the backdrop targets the dialog element itself
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('viewer-open');
      if (lastTrigger) lastTrigger.focus();
    });
  }

  function open(trigger) {
    if (!dialog) build();
    lastTrigger = trigger;
    image.src = trigger.href;
    image.alt = trigger.dataset.alt || '';
    title.textContent = trigger.dataset.title || 'Full-size screenshot';
    document.documentElement.classList.add('viewer-open');
    dialog.showModal();
    dialog.querySelector('.shot-viewer-body').scrollTo(0, 0);
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      // Preserve default behavior for new-tab / modifier clicks
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      open(trigger);
    });
  });
}
