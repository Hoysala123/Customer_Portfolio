export function blockBackButton() {
  // Prevent browser back button
  window.history.pushState(null, '', window.location.href);

  window.addEventListener('popstate', function () {
    window.history.pushState(null, '', window.location.href);
  });
}