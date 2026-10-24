(() => {
  const facts = {
    smell: 'Gran parte de lo que reconocemos como sabor también depende del olfato. Por eso un resfriado puede hacer que la comida parezca más plana.',
    herbs: 'Muchas hierbas y especias deben su aroma a compuestos volátiles. El calor puede hacer que parte de esos aromas se disipe durante la cocción.',
    eyes: 'La vista también influye en cómo interpretamos los aromas: cuando el color y el olor parecen corresponder, podemos percibirlos de otra manera.',
    chili: 'El picor del chile no es uno de los sabores básicos: la capsaicina activa receptores asociados a la sensación de ardor.',
    vegetables: 'Al cocinar un vegetal, el calor y el agua pueden cambiar sus compuestos aromáticos; por eso el mismo ingrediente sabe distinto crudo, hervido o asado.'
  };
  const sources = {
    smell: 'https://annex.exploratorium.edu/wsw/progress_snacks/your_sense_of_taste/',
    herbs: 'https://annex.exploratorium.edu/cooking/seasoning/facts.html',
    eyes: 'https://annex.exploratorium.edu/mind/judgment/coloryourjudgment/v1/',
    chili: 'https://annex.exploratorium.edu/cooking/seasoning/taste/taste.html',
    vegetables: 'https://annex.exploratorium.edu/cooking/icooks/06-02-03.html'
  };
  const panel = document.querySelector('#dato-curioso');
  if (!panel) return;
  const text = panel.querySelector('#fact-text');
  const title = panel.querySelector('#fact-title');
  const close = panel.querySelector('.fact-close');
  const sourceLink = panel.querySelector('#fact-source');
  const sparkleLayer = document.querySelector('.sparkle-layer');
  let lastTrigger = null;
  let lastFact = '';
  let randomIndex = 0;
  const randomFacts = ['smell', 'herbs', 'eyes', 'chili', 'vegetables'];

  function sparkle(target) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !sparkleLayer) return;
    const rect = target.getBoundingClientRect();
    const symbols = ['✦', '✧', '·', '✦', '✧'];
    symbols.forEach((symbol, index) => {
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
    let key = requested;
    if (requested === 'random') {
      if (randomIndex === 0 && lastFact) randomIndex = (randomFacts.indexOf(lastFact) + 1) % randomFacts.length;
      key = randomFacts[randomIndex % randomFacts.length];
      randomIndex += 1;
    }
    if (!facts[key]) key = 'smell';
    lastFact = key;
    lastTrigger = trigger;
    title.textContent = key === 'random' ? 'Una curiosidad nueva' : '¿Lo sabías?';
    text.textContent = facts[key];
    sourceLink.href = sources[key];
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
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeFact();
  });
  document.addEventListener('click', (event) => {
    if (!panel.hidden && !panel.contains(event.target) && !event.target.closest('[data-fact]')) closeFact();
  });
})();
