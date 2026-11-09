(() => {
  const C = window.CONFIG, E = C.evento, cv = document.getElementById('lienzo'), x = cv.getContext('2d'),
    inp = document.getElementById('nombre'), btn = document.getElementById('descargar'),
    W = 1080, H = 1350, K = '#221E1F', B = '#DDBF89', T = '#B8996D', M = '#99714D',
    S1 = "'Alfa Slab One',Georgia,serif", S2 = "Alice,Georgia,serif";
  cv.width = W; cv.height = H;

  const foto = new Image(); let ok = false;
  foto.onload = foto.onerror = () => { ok = foto.naturalWidth > 0; dibujar(); };
  foto.src = C.recuerdo.foto;

  const txt = (t, px, y, f, c, a = 'center') => { x.font = f; x.fillStyle = c; x.textAlign = a; x.textBaseline = 'middle'; x.fillText(t, px, y); };
  const fit = (t, max, px, f) => { while (px > 30) { x.font = px + 'px ' + f; if (x.measureText(t).width <= max) break; px -= 2; } return px; };
  const cinta = (x0, y, w, h) => {
    const n = h * .3; x.beginPath(); x.moveTo(x0, y); x.lineTo(x0 + w, y); x.lineTo(x0 + w - n, y + h / 2);
    x.lineTo(x0 + w, y + h); x.lineTo(x0, y + h); x.lineTo(x0 + n, y + h / 2); x.closePath(); x.fillStyle = K; x.fill();
  };

  function dibujar() {
    const nom = inp.value.trim().toUpperCase().slice(0, 28);
    btn.disabled = !nom;
    // Papel envejecido
    const g = x.createRadialGradient(W / 2, H * .4, 150, W / 2, H / 2, H * .8);
    g.addColorStop(0, B); g.addColorStop(.65, T); g.addColorStop(1, M);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 5000; i++) { x.fillStyle = `rgba(34,30,31,${r() * .07})`; x.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2); }
    // Marco y cabecera
    x.strokeStyle = K; x.lineWidth = 4; x.strokeRect(60, 60, W - 120, H - 120);
    x.lineWidth = 2; x.strokeRect(72, 72, W - 144, H - 144);
    x.beginPath(); x.moveTo(60, 140); x.lineTo(W - 60, 140); x.stroke();
    txt('ÚLTIMAS NOTICIAS', 100, 106, '26px ' + S2, K, 'left');
    txt('URGENTE', W - 100, 106, '26px ' + S2, K, 'right');
    // Título
    const tp = fit('¡ENCONTRADO!', 760, 110, S1);
    txt('¡ENCONTRADO!', W / 2, 225, tp + 'px ' + S1, K);
    txt('★', 130, 225, '44px ' + S1, K); txt('★', W - 130, 225, '44px ' + S1, K);
    // Foto
    const px = 200, py = 300, pw = 680, ph = 430;
    if (ok) {
      const r2 = Math.max(pw / foto.naturalWidth, ph / foto.naturalHeight), sw = pw / r2, sh = ph / r2;
      x.drawImage(foto, (foto.naturalWidth - sw) / 2, (foto.naturalHeight - sh) / 2, sw, sh, px, py, pw, ph);
    } else { x.fillStyle = M; x.fillRect(px, py, pw, ph); }
    x.lineWidth = 4; x.strokeStyle = K; x.strokeRect(px, py, pw, ph);
    // Nombre en cinta
    txt('HOY FUE HALLADO(A)', W / 2, 775, '30px ' + S2, K);
    cinta(100, 805, 880, 140);
    const np = fit(nom || 'TU NOMBRE', 700, 84, S2);
    txt(nom || 'TU NOMBRE', W / 2, 877, np + 'px ' + S2, B);
    // Pregunta y lema
    txt('¿QUIÉN ES LA 100?', W / 2, 1020, '58px ' + S2, K);
    txt(E.lema.toUpperCase(), W / 2, 1085, fit(E.lema.toUpperCase(), 860, 26, S2) + 'px ' + S2, K);
    // Banda de datos
    x.fillStyle = K; x.fillRect(100, 1125, 880, 100);
    txt(E.lugar.toUpperCase(), 290, 1175, fit(E.lugar.toUpperCase(), 340, 28, S2) + 'px ' + S2, B);
    txt(E.horaCorta, 600, 1175, '44px ' + S2, B);
    txt(E.fechaCorta, 850, 1175, '44px ' + S2, B);
    txt('NEXUS JUVENIL', W / 2, 1258, '30px ' + S2, K);
  }

  btn.onclick = () => {
    dibujar();
    try {
      cv.toBlob((b) => {
        if (!b) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b); a.download = 'recuerdo-quien-es-la-100.png'; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      }, 'image/png');
    } catch (e) { aviso('Abre la página desde un servidor (GitHub Pages o local) para descargar.'); }
  };

  inp.addEventListener('input', dibujar);
  if (document.fonts) Promise.all([document.fonts.load("80px 'Alfa Slab One'"), document.fonts.load('40px Alice')]).then(dibujar, dibujar);
  dibujar();
})();
