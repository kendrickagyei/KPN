function mountComponent(targetId, markup) {
  const target = document.getElementById(targetId);
  if (!target) {
    throw new Error(`Missing component mount point: #${targetId}`);
  }

  target.innerHTML = markup;
}
