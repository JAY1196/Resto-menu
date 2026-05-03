export function triggerCartAnimation(e) {
  if (!e || !e.currentTarget) return;
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  
  // Try to find the floating cart button or bottom nav cart icon
  const cartBtn = document.getElementById('floating-cart-btn') || document.querySelector('.bottom-nav-tab:nth-child(3)') || document.querySelector('[data-cart-icon]');
  
  if (!cartBtn) return;
  const cartRect = cartBtn.getBoundingClientRect();

  const dot = document.createElement('div');
  dot.style.position = 'fixed';
  dot.style.left = rect.left + rect.width / 2 - 8 + 'px';
  dot.style.top = rect.top + rect.height / 2 - 8 + 'px';
  dot.style.width = '16px';
  dot.style.height = '16px';
  dot.style.backgroundColor = '#dc2626';
  dot.style.borderRadius = '50%';
  dot.style.zIndex = '99999';
  dot.style.boxShadow = '0 0 10px rgba(220, 38, 38, 0.8)';
  dot.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
  dot.style.pointerEvents = 'none';

  document.body.appendChild(dot);

  // Force reflow
  dot.getBoundingClientRect();

  // Move to cart
  dot.style.left = cartRect.left + cartRect.width / 2 - 8 + 'px';
  dot.style.top = cartRect.top + cartRect.height / 2 - 8 + 'px';
  dot.style.transform = 'scale(0.3)';
  dot.style.opacity = '0';

  setTimeout(() => {
    dot.remove();
    cartBtn.classList.add('cart-bounce-anim');
    setTimeout(() => cartBtn.classList.remove('cart-bounce-anim'), 400);
  }, 600);
}
