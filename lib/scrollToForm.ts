/**
 * Utility function to scroll to the course form and focus on email input
 */
export function scrollToFormAndFocus() {
  // Find the hero section (form container)
  const heroSection = document.querySelector('section');
  if (!heroSection) return;

  // Scroll to form with smooth behavior
  heroSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Wait for scroll to complete, then focus on email input
  setTimeout(() => {
    const emailInput = document.querySelector('input[type="email"][name="email"]') as HTMLInputElement;
    if (emailInput) {
      emailInput.focus();
      // Optional: highlight the input briefly
      emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 500); // Wait 500ms for scroll animation
}
