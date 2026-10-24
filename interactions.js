(() => {
  const facts = {
    smell: { label: 'CIENCIA DEL SABOR', text: 'Gran parte de lo que reconocemos como sabor también depende del olfato. Por eso un resfriado puede hacer que la comida parezca más plana.', source: 'https://annex.exploratorium.edu/wsw/progress_snacks/your_sense_of_taste/' },
    herbs: { label: 'SECRETO AROMÁTICO', text: 'Muchas hierbas y especias deben su aroma a compuestos volátiles. El calor puede hacer que parte de esos aromas se disipe durante la cocción.', source: 'https://annex.exploratorium.edu/cooking/seasoning/facts.html' },
    eyes: { label: 'COME TAMBIÉN CON LOS OJOS', text: 'La vista influye en cómo interpretamos los aromas. El color puede cambiar la forma en que reconocemos un olor.', source: 'https://annex.exploratorium.edu/mind/judgment/coloryourjudgment/v1/' },
    chili: { label: 'UN PICOR CON CARÁCTER', text: 'El picante del chile no es uno de los sabores básicos: la capsaicina activa receptores asociados a la sensación de ardor.', source: 'https://annex.exploratorium.edu/cooking/seasoning/taste/taste.html' },
    vegetables: { label: 'COCINA EN ACCIÓN', text: 'El calor y el agua pueden cambiar los compuestos aromáticos de un vegetal. Por eso el mismo ingrediente sabe diferente crudo, hervido o asado.', source: 'https://annex.exploratorium.edu/cooking/icooks/06-02-03.html' },
    slow: { label: 'DATO DE SOBREMESA', text: 'A veces el mejor ingrediente de una comida es tener tiempo para compartirla. En Cecilia, la sobremesa puede pedir otra ronda de conversación.', source: '' },
    familia: { label: 'UNA HISTORIA DE SAHAGÚN', text: 'El equipo Cecilia se formó visitando restaurantes del municipio y buscando talento local. A quienes invitaron, les ofrecieron un mejor sueldo y una nueva oportunidad; hoy son parte de la familia Cecilia.', source: '' },
    birthday: { label: 'SÍ, ES UNA SORPRESA REAL', text: 'Si celebras tu cumpleaños en Cecilia, te regalan un postre y una serenata. Sin costo: tú solo tienes que decidir si cantas el coro.', source: '' },
    quality: { label: 'LA PROMESA DE LA CASA', text: 'La apuesta de Cecilia es que la calidad de la comida y el cariño de la atención hagan que la cuenta se sienta pequeña junto a la experiencia. Y que quieras volver.', source: '' },
    celebrate: { label: 'PLAN REDONDO', text: 'Cumpleaños en Cecilia: postre de regalo, serenata y un motivo adicional para soplar las velas con ganas.', source: '' }
  };
  const panel = document.querySelector('#dato-curioso');
  if (!panel) return;
  const text = panel.querySelector('#fact-text');
  const title = panel.querySelector('#fact-title');
  const close = panel.querySelector('.fact-close');
  const sourceLink = panel.querySelector('#fact-source');
  const label = panel.querySelector('.fact-label');
  const sparkleLayer = document.querySelector('.sparkle-layer');
  let lastTrigger = null;
  let randomIndex = 0;
  const randomFacts = Object.keys(facts);

  function sparkle(target) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !sparkleLayer) return;
    const rect = target.getBoundingClientRect();
    ['✦', '✧', '·', '✦', '✧'].forEach((symbol, index) => {
      const particle = document.createElement('span');
      particle.className = 'sparkle';
      particle.textContent = symbol;
      particle.style.left = (rect.left + rect.width * (0.2 + Math.random() * 0.6)) + 'px';
      particle.style.top = (rect.top + rect.height * 0.45) + 'px';
      particle.style.setProperty('--drift', ((Math.random() - 0.5) * 54) + 'px');
      particle.style.setProperty('--size', (10 + Math.random() * 9) + 'px');
      particle.style.animationDelay = (index * 28) + 'ms';
      sparkleLayer.append(particle);
      particle.addEventListener('animationend', () => particle.remove(), { once: true });
    });
  }

  function openFact(trigger) {
    const requested = trigger.dataset.fact;
    const key = requested === 'random' ? randomFacts[randomIndex++ % randomFacts.length] : requested;
    const fact = facts[key] || facts.smell;
    lastTrigger = trigger;
    label.textContent = fact.label;
    text.textContent = fact.text;
    title.textContent = key === 'birthday' || key === 'celebrate' ? '¡Que empiece la celebración!' : key === 'familia' ? 'Talento hecho en Sahagún' : key === 'quality' ? 'Una promesa con cariño' : '¿Lo sabías?';
    sourceLink.hidden = !fact.source;
    if (fact.source) sourceLink.href = fact.source;
    panel.hidden = false;
    panel.classList.remove('is-open');
    requestAnimationFrame(() => panel.classList.add('is-open'));
    trigger.setAttribute('aria-expanded', 'true');
    sparkle(trigger);
    close.focus({ preventScroll: true });
  }

  function closeFact() {
    if (panel.hidden) return;
    panel.hidden = true;
    panel.classList.remove('is-open');
    if (lastTrigger) {
      lastTrigger.setAttribute('aria-expanded', 'false');
      lastTrigger.focus({ preventScroll: true });
    }
  }

  document.querySelectorAll('[data-fact]').forEach((button) => {
    button.setAttribute('aria-controls', 'dato-curioso');
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => openFact(button));
  });
  close.addEventListener('click', closeFact);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeFact(); });
  document.addEventListener('click', (event) => {
    if (!panel.hidden && !panel.contains(event.target) && !event.target.closest('[data-fact]')) closeFact();
  });

  const reservationForm = document.querySelector('.reservation-form');
  const feedback = document.querySelector('#reservation-feedback');
  if (reservationForm && feedback) {
    reservationForm.addEventListener('submit', (event) => {
      event.preventDefault();
      feedback.textContent = '¡Qué buen plan! Esta maqueta no envía solicitudes reales. Contacta al restaurante para consultar y confirmar tu reserva.';
      feedback.hidden = false;
      sparkle(reservationForm.querySelector('button[type=submit]'));
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('.intro, .menu-section, .quote-band, .spaces, .team-story, .birthday, .little-surprise, .reservation, .contact');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    document.body.classList.add('has-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((section) => revealObserver.observe(section));
  }

  const progress = document.querySelector('.scroll-progress');
  let scrollQueued = false;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { window.requestAnimationFrame(updateProgress); scrollQueued = true; }
  }, { passive: true });
  updateProgress();
})();
