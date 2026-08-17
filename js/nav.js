document.addEventListener('click', (event) => {
  const link = event.target.closest('a[aria-disabled="true"]');
  if (link) {
    event.preventDefault();
  }
});
