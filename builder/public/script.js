fetch('/apps')
  .then(res => res.json())
  .then(apps => {
    const container = document.getElementById('appsList');
    apps.forEach(app => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = app;
      checkbox.name = 'apps';
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + app));
      container.appendChild(label);
      container.appendChild(document.createElement('br'));
    });
  });

document.getElementById('buildForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const checkboxes = document.querySelectorAll('input[name="apps"]:checked');
  const selected = Array.from(checkboxes).map(cb => cb.value);
  const apiUrl = document.getElementById('apiUrl').value;
  const status = document.getElementById('status');

  status.textContent = '⏳ Build en cours...';

  const res = await fetch('/build', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apps: selected, apiUrl })
  });

  if (res.ok) {
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dist.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    status.textContent = '✅ Build terminé. Téléchargement lancé.';
  } else {
    status.textContent = '❌ Erreur pendant le build.';
  }
});
