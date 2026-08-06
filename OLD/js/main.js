document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector('.toggle-css');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', function () {
    const stylesheet = document.querySelector('link[href="css/style.css"]');
    if (stylesheet.disabled) {
      stylesheet.disabled = false;
      this.textContent = 'Disable CSS';
    } else {
      stylesheet.disabled = true;
      this.textContent = 'Enable CSS';
    }
  });
});
