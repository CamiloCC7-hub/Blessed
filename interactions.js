(() => {
  document.querySelectorAll('img[data-fallback-src]').forEach((image) => {
    image.addEventListener('error', () => {
      if (!image.dataset.fallbackUsed) {
        image.dataset.fallbackUsed = 'true';
        image.src = image.dataset.fallbackSrc;
      } else {
        image.hidden = true;
        image.closest('.dish-visual')?.classList.add('image-unavailable');
      }
    });
  });

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
    celebrate: { label: 'PLAN REDONDO', text: 'Cumpleaños en Cecilia: postre de regalo, serenata y un motivo adicional para soplar las velas con ganas.', source: '' },
    cecilia: { label: 'EL NOMBRE DE LA CASA', text: 'Cecilia es la madre del dueño. El restaurante lleva su nombre para honrar a la mujer cuyo esfuerzo abrió camino para toda su familia.', source: '' },
    roots: { label: 'CINCO HIJOS, MUCHOS SUEÑOS', text: 'Cecilia vendía empanadas, fritos y arepas para mantener a sus cinco hijos y ayudarles a estudiar. Su perseverancia está en el origen de esta historia.', source: '' },
    journey: { label: 'UNA HISTORIA QUE CRECIÓ', text: 'La familia comenzó con un pequeño restaurante en El Chocó. Después llegaron sucursales en Montería y Chinú, y la historia siguió hasta Sahagún, Córdoba.', source: '' },
    wine: { label: 'EL COLOR VINO', text: 'En esta propuesta, el vino da continuidad a la identidad de Cecilia y aporta una sensación de calidez alrededor de la mesa.', source: '' },
    gold: { label: 'EL DETALLE DORADO', text: 'El dorado aparece como un acento de celebración: un pequeño destello para enmarcar los momentos especiales.', source: '' },
    ivory: { label: 'UN RESPIRO MARFIL', text: 'El marfil abre espacio y deja descansar la vista entre los tonos profundos y los detalles cálidos.', source: '' }
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

  const dishCards = Array.from(document.querySelectorAll('[data-dish-card]'));
  const dishFeedback = document.querySelector('#dish-feedback');
  const pointerTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  dishCards.forEach((card) => {
    const button = card.querySelector('[data-dish-toggle]');
    const label = card.querySelector('.dish-select-label');
    const title = card.querySelector('h3').innerText.replace(/\s+/g, ' ').trim();
    button.addEventListener('click', () => {
      const selected = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(selected));
      card.classList.toggle('is-selected', selected);
      label.textContent = selected ? 'Guardado en mi lista' : 'Guardar mi antojo';
      card.querySelector('.heart-icon').textContent = selected ? '♥' : '♡';
      button.classList.remove('is-tapped');
      requestAnimationFrame(() => button.classList.add('is-tapped'));
      sparkle(button);
      const saved = dishCards.filter((item) => item.querySelector('[data-dish-toggle]').getAttribute('aria-pressed') === 'true').map((item) => item.querySelector('h3').innerText.replace(/\s+/g, ' ').trim());
      dishFeedback.textContent = saved.length ? 'Tu lista de antojos: ' + saved.join(' y ') + '. Solo queda visualmente guardada; no genera un pedido.' : 'Toca “Guardar mi antojo” y arma tu pequeña lista. Es solo una interacción visual; no genera un pedido.';
    });

    const zoomButton = card.querySelector('.zoom-toggle');
    const zoomLabel = zoomButton.querySelector('span');
    zoomButton.addEventListener('click', () => {
      const zoomed = zoomButton.getAttribute('aria-pressed') !== 'true';
      zoomButton.setAttribute('aria-pressed', String(zoomed));
      card.classList.toggle('is-zoomed', zoomed);
      zoomLabel.textContent = zoomed ? 'Cerrar detalle' : 'Ver de cerca';
      sparkle(zoomButton);
    });

    if (pointerTilt) {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty('--tilt-x', ((.5 - y) * 3.5) + 'deg');
        card.style.setProperty('--tilt-y', ((x - .5) * 4.5) + 'deg');
        card.style.setProperty('--shine-x', (x * 100) + '%');
        card.style.setProperty('--shine-y', (y * 100) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    }
  });

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
