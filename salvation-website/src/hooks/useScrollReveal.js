/**
 * useScrollReveal
 *
 * Attaches an IntersectionObserver to every element that has any of these
 * classes:  reveal | reveal-left | reveal-right | reveal-zoom
 *
 * When the element enters the viewport it receives the class "revealed",
 * which triggers the CSS transition defined in index.css.
 *
 * Call this hook once at the App level — it re-runs whenever the current
 * page hash changes so newly mounted elements are picked up immediately.
 */
import { useEffect } from 'react';

const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-zoom';

export default function useScrollReveal(dep) {
  useEffect(() => {
    // Small delay so the new page's DOM is painted before we observe
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(SELECTOR);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target); // animate once
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 60);

    return () => clearTimeout(timer);
  }, [dep]);
}
