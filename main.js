(() => {
  const C = window.CONFIG, $ = (s) => document.querySelector(s);

  // Aviso (toast)
  let t;
  window.aviso = (m) => { const a = $('#aviso'); a.textContent = m; a.classList.add('on'); clearTimeout(t); t = setTimeout(() => a.classList.remove('on'), 2800); };

  // Textos desde config.js
  document.querySelectorAll('[data-cfg]').forEach((el) => {
    const v = el.dataset.cfg.split('.').reduce((o, k) => o && o[k], C);
    if (v) el.textContent = v;
  });

  // Video
  const vid = $('#video-intro'), src = vid.querySelector('source');
  vid.poster = C.video.poster; src.src = C.video.src; vid.load();
  src.addEventListener('error', () => { $('#video-aviso').hidden = false; });

  // Galería + visor
  const g = $('#galeria-grid'), vis = $('#visor'), vi = $('#visor-img');
  let cur = 0;
  const abrir = (i) => { cur = i; vi.src = C.galeria[i].src; vi.alt = C.galeria[i].alt || ''; if (!vis.open) vis.showModal(); };
  const ir = (d) => {
    const n = C.galeria.length; let i = cur;
    do { i = (i + d + n) % n; } while (g.children[i].classList.contains('vacia') && i !== cur);
    abrir(i);
  };
  C.galeria.forEach((f, i) => {
    const b = document.createElement('button'), im = new Image();
    b.type = 'button'; b.className = 'foto'; b.setAttribute('aria-label', 'Ver foto ' + (i + 1));
    im.loading = 'lazy'; im.decoding = 'async'; im.alt = f.alt || ''; im.src = f.src;
    im.onerror = () => b.classList.add('vacia');
    b.append(im);
    b.onclick = () => { if (!b.classList.contains('vacia')) abrir(i); };
    g.append(b);
  });
  $('#prev').onclick = () => ir(-1);
  $('#next').onclick = () => ir(1);
  $('#cerrar').onclick = () => vis.close();
  vis.onclick = (e) => { if (e.target === vis) vis.close(); };
  vis.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') ir(-1); if (e.key === 'ArrowRight') ir(1); });

  // Compartir
  $('#compartir').onclick = async () => {
    const d = { title: C.evento.titulo, text: C.compartir.texto, url: location.href.split('#')[0] };
    try {
      if (navigator.share) { await navigator.share(d); return; }
      await navigator.clipboard.writeText(d.text + ' ' + d.url);
      aviso('Enlace copiado');
    } catch (e) { if (e.name !== 'AbortError') aviso('No se pudo compartir. Copia el enlace de la barra.'); }
  };

  // Calendario (.ics generado en el navegador)
  $('#calendario').onclick = () => {
    const E = C.evento, [y, m, d] = E.fecha.split('-'), [h, mi] = E.hora.split(':');
    const ini = `${y}${m}${d}T${h}${mi}00`, fin = `${y}${m}${d}T${String(+h + 2).padStart(2, '0')}${mi}00`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nexus Juvenil//100//ES', 'BEGIN:VEVENT',
      'UID:quien-es-la-100-' + ini + '@nexusjuvenil', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]|\.\d{3}/g, ''),
      'DTSTART:' + ini, 'DTEND:' + fin, 'SUMMARY:' + E.titulo + ' | ' + E.presenta, 'LOCATION:' + E.lugar,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'quien-es-la-100.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };

  // Aparición de secciones al hacer scroll
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
