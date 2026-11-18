(() => {
  // Dato dinámico desde el archivo REST local: sirve para practicar Fetch y async/await.
  const dailyFactContent = document.querySelector('#daily-fact-content');
  const dailyFactTitle = document.querySelector('#daily-fact-title');
  const dailyFactSource = document.querySelector('#daily-fact-source');
  const dailyFactStatus = document.querySelector('#daily-fact-status');
  const dailyFactButton = document.querySelector('#refresh-daily-fact');
  if (dailyFactContent && dailyFactStatus && dailyFactButton) {
    let facts = [];
    let factIndex = -1;
    async function loadDailyFacts() {
      dailyFactButton.disabled = true;
      dailyFactStatus.textContent = 'Cargando curiosidades…';
      dailyFactContent.classList.add('is-loading');
      try {
        const response = await fetch('./data.json', { headers: { Accept: 'application/json' } });
        if (response.status === 404) throw new Error('No encontramos el archivo de curiosidades (404).');
        if (response.status === 500) throw new Error('El servicio de curiosidades tuvo un problema (500).');
        if (!response.ok) throw new Error('El servicio respondió con un error (' + response.status + ').');
        const payload = await response.json();
        if (!Array.isArray(payload.facts) || !payload.facts.length) throw new Error('El archivo no contiene curiosidades disponibles.');
        facts = payload.facts;
        showNextFact();
        dailyFactStatus.textContent = 'Curiosidades cargadas desde data.json';
      } catch (error) {
        facts = [
          { title: 'El mote tiene su carácter', text: 'El ñame le da cuerpo al mote de queso y el queso costeño suma ese punto salado que sabe a cocina cordobesa.', source: 'https://www.cordoba.gov.co/publicaciones/18/turismo/' },
          { title: 'Queso costeño: sal que conserva', text: 'Su sabor salado también cumple una función práctica: en el calor y la humedad del Caribe, ayuda a conservar el queso.', source: 'https://mng.mincultura.gov.co/Sitios/patrimonio/bibliotecas-de-cocinas/tomo10.pdf' },
          { title: 'Un equipo elegido en casa', text: 'La familia Cecilia recorrió restaurantes de Sahagún para invitar a su equipo a sumarse con mejores oportunidades. Hoy son parte de esta mesa.' },
          { title: 'El bocachico viaja río arriba', text: 'Durante la subienda, este pez migra hacia las cabeceras de los ríos para desovar. Por eso su temporada también marcaba el ritmo de muchas cocinas ribereñas.', source: 'https://patrimonio.mincultura.gov.co/SiteAssets/Paginas/Publicaciones-biblioteca-cocinas/biblioteca%2011.pdf' },
          { title: 'Un dulce que se toma su tiempo', text: 'Algunas preparaciones tradicionales de mongo-mongo pueden pasar cerca de 24 horas al fuego lento, mientras sus frutas y sabores se integran.', source: 'https://patrimonio.mincultura.gov.co/SiteAssets/Paginas/Publicaciones-biblioteca-cocinas/biblioteca16.pdf' },
          { title: 'La cocina caribeña cuenta muchos encuentros', text: 'En sus mesas dialogan ingredientes y saberes indígenas, africanos, europeos y de otras comunidades. Cada receta guarda parte de esa historia compartida.', source: 'https://www.senalcolombia.tv/cultura/comida-colombiana-por-regiones' },
          { title: 'El maíz ya estaba en la mesa', text: 'Antes de la llegada española, distintos pueblos indígenas de Colombia ya preparaban con maíz alimentos como arepas, chicha y mazamorra.', source: 'https://www.senalcolombia.tv/documental/top-5-comida-ancestral-colombiana' },
          { title: 'Un recetario vivo', text: 'La Gobernación de Córdoba documenta recetas tradicionales como mote de queso, cabeza de gato y gallina guisada, con variaciones que siguen pasando de cocina en cocina.', source: 'https://www.cordoba.gov.co/publicaciones/785/mujeres-con-sabor-a-cordoba-exploracion-creativa-culinaria/' },
          { title: 'Cumpleaños con coro incluido', text: 'En Cecilia, quien celebra su cumpleaños recibe un postre y una serenata de cortesía. La afinación corre por cuenta de la emoción.' },
          { title: 'La sobremesa también cuenta', text: 'En Córdoba, los platos de tradición suelen reunir ñame, queso costeño, suero y conversación. La última parte no aparece en la cuenta.' }
        ];
        factIndex = -1;
        showNextFact();
        dailyFactStatus.textContent = location.protocol === 'file:' ? 'Mostrando datos locales. Para probar Fetch, abre la página publicada.' : 'Error de carga: ' + (error.message || 'respuesta inesperada') + '. Mostramos una copia local.';
        dailyFactButton.textContent = 'Otro dato ✦';
      } finally {
        dailyFactContent.classList.remove('is-loading');
        dailyFactButton.disabled = false;
      }
    }
    function showNextFact() {
      if (!facts.length) return loadDailyFacts();
      factIndex = (factIndex + 1) % facts.length;
      dailyFactContent.textContent = facts[factIndex].text;
      dailyFactTitle.textContent = facts[factIndex].title;
      dailyFactSource.hidden = !facts[factIndex].source;
      if (facts[factIndex].source) dailyFactSource.href = facts[factIndex].source;
      dailyFactContent.classList.remove('fact-arrive');
      requestAnimationFrame(() => dailyFactContent.classList.add('fact-arrive'));
      dailyFactStatus.textContent = 'Dato ' + (factIndex + 1) + ' de ' + facts.length;
    }
    dailyFactButton.addEventListener('click', () => facts.length ? showNextFact() : loadDailyFacts());
    loadDailyFacts();
  }

  // Calendario de demostración (noviembre 2026–diciembre 2027); disponibilidad real se confirma con el equipo.
  const bookingDialog = document.querySelector('#booking-dialog');
  if (bookingDialog) {
    const openBooking = document.querySelector('#open-booking');
    const monthLabel = document.querySelector('#calendar-month');
    const calendarGrid = document.querySelector('#calendar-grid');
    const calendarStatus = document.querySelector('#calendar-status');
    const bookingStep = document.querySelector('#booking-step');
    const bookingForm = document.querySelector('#booking-form');
    const timeOptions = document.querySelector('#time-options');
    const confirmation = document.querySelector('#booking-confirmation');
    const monthNames = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const firstMonth = new Date(Date.UTC(2026, 10, 1));
    const defaultReservedDays = ['2026-11-14','2026-11-21','2026-12-08','2026-12-24','2026-12-25','2026-12-31','2027-01-01','2027-02-14','2027-03-19','2027-05-10','2027-06-20','2027-07-20','2027-09-15','2027-10-31','2027-12-24','2027-12-25','2027-12-31'];
    const reservedDays = new Set();
    const reservationWindow = 15 * 60 * 1000;
    const demoHoldKey = 'cecilia-demo-hold-expiry-v1';
    let demoHoldExpires = Date.now() + reservationWindow;
    try {
      const savedDemoHold = localStorage.getItem(demoHoldKey);
      demoHoldExpires = savedDemoHold === null ? Date.now() + reservationWindow : Number(savedDemoHold);
      if (savedDemoHold === null) localStorage.setItem(demoHoldKey, String(demoHoldExpires));
      if (demoHoldExpires > Date.now()) defaultReservedDays.forEach((date) => reservedDays.add(date));
      JSON.parse(localStorage.getItem('cecilia-booking-requests-v1') || '[]').forEach((booking) => {
        const expires = Number(booking.expiresAt) || (Date.parse(booking.createdAt || '') + reservationWindow);
        if (booking.date && expires > Date.now()) reservedDays.add(booking.date);
      });
    } catch { /* Usa los días de demostración si el almacenamiento no está disponible. */ }
    let monthOffset = 0;
    let selectedDate = '';
    const isoDate = (year, month, day) => [year, String(month + 1).padStart(2,'0'), String(day).padStart(2,'0')].join('-');
    function renderCalendar() {
      const year = 2026 + Math.floor((10 + monthOffset) / 12);
      const month = (10 + monthOffset) % 12;
      const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      const mondayOffset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
      monthLabel.textContent = monthNames.format(new Date(Date.UTC(year, month, 1)));
      calendarGrid.replaceChildren();
      for (let i = 0; i < mondayOffset; i++) { const blank = document.createElement('span'); blank.className = 'calendar-blank'; blank.setAttribute('aria-hidden','true'); calendarGrid.append(blank); }
      for (let day = 1; day <= daysInMonth; day++) {
        const date = isoDate(year, month, day);
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'calendar-day'; button.textContent = day; button.dataset.date = date;
        if (reservedDays.has(date)) { button.disabled = true; button.classList.add('is-booked'); button.setAttribute('aria-label', day + ', reservado'); button.title = 'Reservado'; }
        else { button.setAttribute('aria-label', day + ', disponible'); button.addEventListener('click', () => chooseDate(date, button)); }
        if (date === selectedDate) button.classList.add('is-selected');
        calendarGrid.append(button);
      }
      document.querySelector('#calendar-prev').disabled = monthOffset === 0;
      document.querySelector('#calendar-next').disabled = monthOffset === 13;
    }
    function chooseDate(date, button) {
      selectedDate = date; renderCalendar();
      const prettyDate = new Intl.DateTimeFormat('es-CO', { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
      calendarStatus.textContent = 'Fecha elegida: ' + prettyDate;
      bookingStep.hidden = false; bookingForm.hidden = true; confirmation.hidden = true;
      document.querySelector('#chosen-date-label').textContent = 'Ahora elige la hora · ' + prettyDate;
      timeOptions.replaceChildren();
      ['12:00 p. m.','1:30 p. m.','4:00 p. m.','6:30 p. m.','8:00 p. m.'].forEach((time) => {
        const option = document.createElement('button'); option.type = 'button'; option.className = 'time-option'; option.textContent = time;
        option.addEventListener('click', () => { timeOptions.querySelectorAll('.time-option').forEach((item) => item.classList.remove('is-selected')); option.classList.add('is-selected'); bookingForm.hidden = false; bookingForm.dataset.date = date; bookingForm.dataset.time = time; });
        timeOptions.append(option);
      });
      button?.focus({ preventScroll: true });
    }
    openBooking?.addEventListener('click', () => { renderCalendar(); bookingDialog.showModal(); });
    document.querySelector('#calendar-prev').addEventListener('click', () => { monthOffset = Math.max(0, monthOffset - 1); renderCalendar(); });
    document.querySelector('#calendar-next').addEventListener('click', () => { monthOffset = Math.min(13, monthOffset + 1); renderCalendar(); });
    bookingDialog.addEventListener('click', (event) => { if (event.target === bookingDialog) bookingDialog.close(); });
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!bookingForm.reportValidity() || !bookingForm.dataset.time) return;
      const entry = Object.fromEntries(new FormData(bookingForm));
      entry.date = bookingForm.dataset.date; entry.time = bookingForm.dataset.time; entry.createdAt = new Date().toISOString(); entry.expiresAt = Date.now() + reservationWindow;
      try {
        const bookings = JSON.parse(localStorage.getItem('cecilia-booking-requests-v1') || '[]');
        bookings.push(entry); localStorage.setItem('cecilia-booking-requests-v1', JSON.stringify(bookings));
      } catch { /* La solicitud aún puede prepararse aunque el almacenamiento esté desactivado. */ }
      reservedDays.add(entry.date); renderCalendar(); bookingForm.hidden = true; confirmation.hidden = false;
      const dateText = new Intl.DateTimeFormat('es-CO', { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(entry.date + 'T12:00:00Z'));
      const message = 'Hola, Cecilia. Quiero solicitar una reserva para ' + entry.name + '. Fecha: ' + dateText + ', hora: ' + entry.time + ', personas: ' + entry.guests + '. Teléfono: ' + entry.phone + '. Correo: ' + entry.email + '. Por favor, confirmen disponibilidad.';
      const wa = 'https://wa.me/573017222769?text=' + encodeURIComponent(message);
      const mailSubject = encodeURIComponent('Solicitud de reserva Cecilia · ' + dateText);
      const mailBody = encodeURIComponent('Hola ' + entry.name + ',\n\nRecibimos tu solicitud para el ' + dateText + ' a las ' + entry.time + '. En breve confirmaremos contigo los detalles.\n\nCecilia Restaurante');
      confirmation.innerHTML = '<h3>¡Gracias por elegir Cecilia!</h3><p>Tu solicitud quedó registrada y guardada. En breve te contactaremos para confirmar los detalles.</p><div class="confirmation-actions"><a class="button button-gold" href="' + wa + '" target="_blank" rel="noopener noreferrer">Continuar en el chat privado ↗</a><a class="button button-outline" href="mailto:' + encodeURIComponent(entry.email) + '?subject=' + mailSubject + '&body=' + mailBody + '">Abrir correo ↗</a></div><small>Por seguridad, reservamos este horario por 15 minutos mientras confirmas tu reserva en el chat privado.</small>';
      calendarStatus.textContent = 'Tu horario quedó apartado por 15 minutos.';
      window.setTimeout(() => {
        if (Date.now() >= entry.expiresAt) { reservedDays.delete(entry.date); renderCalendar(); calendarStatus.textContent = 'El lapso de reserva terminó; el horario vuelve a estar disponible.'; }
      }, reservationWindow);
    });
    document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => document.getElementById(button.dataset.closeDialog)?.close()));
    renderCalendar();
    window.setTimeout(() => {
      if (Date.now() >= demoHoldExpires) { defaultReservedDays.forEach((date) => reservedDays.delete(date)); renderCalendar(); }
    }, Math.max(0, demoHoldExpires - Date.now()));
  }

  const surveyDialog = document.querySelector('#survey-dialog');
  const surveyOpen = document.querySelector('#open-survey');
  const surveyForm = document.querySelector('#survey-form');
  surveyOpen?.addEventListener('click', () => surveyDialog.showModal());
  surveyForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!surveyForm.reportValidity()) return;
    const response = Object.fromEntries(new FormData(surveyForm)); response.sentAt = new Date().toISOString();
    try { const list = JSON.parse(localStorage.getItem('cecilia-satisfaction-surveys-v1') || '[]'); list.push(response); localStorage.setItem('cecilia-satisfaction-surveys-v1', JSON.stringify(list)); } catch {}
    document.querySelector('#survey-status').textContent = '¡Gracias! Tu opinión quedó registrada en este dispositivo para esta demostración.';
    surveyForm.reset();
  });
  surveyDialog?.addEventListener('click', (event) => { if (event.target === surveyDialog) surveyDialog.close(); });

  const siteHeader = document.querySelector('#site-header');
  const navPeek = document.querySelector('.nav-peek');
  if (siteHeader && navPeek) {
    let navOpen = false;
    const collapseAfter = 145;
    const syncNavigation = () => {
      const scrolled = window.scrollY > collapseAfter;
      document.body.classList.toggle('nav-scrolled', scrolled);
      if (!scrolled) navOpen = false;
      document.body.classList.toggle('nav-open', scrolled && navOpen);
      navPeek.hidden = !scrolled;
      navPeek.setAttribute('aria-expanded', String(scrolled && navOpen));
      navPeek.setAttribute('aria-label', scrolled && navOpen ? 'Recoger navegación' : 'Mostrar navegación');
      navPeek.querySelector('span').textContent = scrolled && navOpen ? '⌃' : '⌄';
      siteHeader.inert = scrolled && !navOpen;
    };
    navPeek.addEventListener('click', () => {
      navOpen = !navOpen;
      syncNavigation();
      if (navOpen) siteHeader.querySelector('.main-nav a')?.focus({ preventScroll: true });
    });
    siteHeader.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
      if (window.scrollY > collapseAfter) { navOpen = false; syncNavigation(); }
    }));
    window.addEventListener('scroll', syncNavigation, { passive: true });
    syncNavigation();
  }

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
    cecilia: { label: 'PISTA RESUELTA · EL NOMBRE', text: 'La inspiración fue Cecilia, la madre del dueño. Con cinco hijos y pocos recursos, se rebuscaba vendiendo empanadas, fritos y arepas para darles estudio y una vida mejor. Por eso esta casa lleva su nombre.', source: '' },
    roots: { label: 'PISTA RESUELTA · EL PRIMER PASO', text: 'Después de estudiar y graduarse, sus hijos abrieron un pequeño restaurante en El Chocó. Esa primera mesa fue el comienzo del camino de la familia.', source: '' },
    journey: { label: 'PISTA RESUELTA · EL CAMINO', text: 'Después del primer restaurante en El Chocó, la familia abrió sucursales en Montería y Chinú; hace alrededor de cinco meses llegó a su sede más reciente en Sahagún, Córdoba.', source: '' },
    cordobaMote: { label: 'PISTA DE CÓRDOBA · EL MOTE', text: 'El mote de queso se apoya en dos protagonistas: ñame y queso costeño. El ñame le aporta su cuerpo y el queso, su carácter salado. Está entre los platos emblemáticos de las sabanas de Córdoba y Sucre.', source: 'https://mng.mincultura.gov.co/Sitios/patrimonio/bibliotecas-de-cocinas/tomos/tomo15.pdf' },
    cordobaGallina: { label: 'PISTA DE CÓRDOBA · LA GALLINA', text: 'La gallina guisada forma parte de las recetas tradicionales que la Gobernación de Córdoba destaca junto al mote de queso en su proyecto “Mujeres con sabor a Córdoba”, que también llegó a Sahagún.', source: 'https://www.cordoba.gov.co/publicaciones/785/mujeres-con-sabor-a-cordoba-exploracion-creativa-culinaria/' },
    cordobaBocachico: { label: 'PISTA DE CÓRDOBA · EL RÍO', text: 'El sancocho de bocachico aparece entre los sabores típicos que la Gobernación destaca en la cocina cordobesa: una pista de cuánto conversa esta cocina con sus ríos.', source: 'https://www.cordoba.gov.co/publicaciones/18/turismo/' },
    cordobaArroz: { label: 'PISTA DE CÓRDOBA · LA MESA', text: 'Mote de queso, sancocho de bocachico, arroz con coco, queso costeño y suero: la Gobernación reúne estos sabores entre los platos representativos del departamento. ¿Cuál te falta probar?', source: 'https://www.cordoba.gov.co/publicaciones/18/turismo/' },
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
  const randomFacts = ['smell', 'herbs', 'eyes', 'chili', 'vegetables', 'slow', 'cordobaMote', 'cordobaGallina', 'cordobaBocachico', 'cordobaArroz'];

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
    title.textContent = key === 'birthday' || key === 'celebrate' ? '¡Que empiece la celebración!' : key === 'familia' ? 'Talento hecho en Sahagún' : key === 'quality' ? 'Una promesa con cariño' : key === 'cecilia' || key === 'roots' || key === 'journey' || key.startsWith('cordoba') ? 'Pista resuelta' : '¿Lo sabías?';
    sourceLink.hidden = !fact.source;
    if (fact.source) sourceLink.href = fact.source;
    sourceLink.textContent = 'Ver de dónde viene la pista ↗';
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


  // Solicitud sin backend: se prepara un mensaje editable que la persona envía desde WhatsApp.
  const inquiryForm = document.querySelector('#inquiry-form');
  if (inquiryForm) {
    const draftKey = 'cecilia-reservation-draft-v1';
    const status = document.querySelector('#inquiry-status');
    const fields = Array.from(inquiryForm.querySelectorAll('input, textarea'));
    const validationMessage = (field) => {
      let message = field.parentElement.querySelector('[data-validation-message]');
      if (!message) { message = document.createElement('small'); message.dataset.validationMessage = ''; message.setAttribute('aria-live', 'polite'); field.insertAdjacentElement('afterend', message); }
      return message;
    };
    const validateField = (field) => {
      const message = validationMessage(field);
      const valid = field.checkValidity();
      field.classList.toggle('field-invalid', !valid && (field.value.length > 0 || field.dataset.touched === 'true'));
      field.classList.toggle('field-valid', valid && field.value.length > 0);
      message.textContent = valid ? (field.value ? 'Se ve bien.' : '') : field.validationMessage;
      return valid;
    };
    try {
      const saved = JSON.parse(localStorage.getItem(draftKey) || '{}');
      fields.forEach((field) => { if (saved[field.name]) { field.value = saved[field.name]; validateField(field); } });
      if (Object.keys(saved).length) status.textContent = 'Recuperamos tu borrador guardado en este navegador. Puedes borrarlo cuando quieras.';
    } catch { status.textContent = 'No pudimos recuperar el borrador guardado en este navegador.'; }
    const saveDraft = () => {
      const draft = Object.fromEntries(fields.map((field) => [field.name, field.value]));
      try { localStorage.setItem(draftKey, JSON.stringify(draft)); status.textContent = 'Borrador guardado solo en este navegador.'; } catch { status.textContent = 'No se pudo guardar el borrador en este navegador.'; }
    };
    fields.forEach((field) => {
      field.addEventListener('input', () => { field.dataset.touched = 'true'; validateField(field); saveDraft(); });
      field.addEventListener('change', () => { field.dataset.touched = 'true'; validateField(field); saveDraft(); });
      field.addEventListener('blur', () => { field.dataset.touched = 'true'; validateField(field); });
    });
    let clearDraft = inquiryForm.querySelector('[data-clear-draft]');
    if (!clearDraft) { clearDraft = document.createElement('button'); clearDraft.type = 'button'; clearDraft.className = 'clear-draft'; clearDraft.dataset.clearDraft = ''; clearDraft.textContent = 'Borrar borrador guardado'; inquiryForm.append(clearDraft); }
    clearDraft.addEventListener('click', () => { localStorage.removeItem(draftKey); inquiryForm.reset(); fields.forEach((field) => { field.classList.remove('field-valid','field-invalid'); field.dataset.touched = 'false'; validationMessage(field).textContent = ''; }); status.textContent = 'Borrador borrado de este navegador.'; });
    const dateInput = inquiryForm.querySelector('input[name="fecha"]');
    const dateValue = (date) => [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
    const today = new Date(); const latestDate = new Date(today); latestDate.setFullYear(latestDate.getFullYear()+1);
    dateInput.min = dateValue(today); dateInput.max = dateValue(latestDate);
    inquiryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!fields.every(validateField)) { inquiryForm.reportValidity(); status.textContent = 'Revisa los campos marcados antes de continuar.'; return; }
      const data = new FormData(inquiryForm);
      const message = ['Hola, Cecilia. Quisiera consultar una reserva:', 'Nombre: ' + data.get('nombre'), 'Correo: ' + data.get('email'), 'Teléfono: ' + data.get('telefono'), 'Fecha: ' + data.get('fecha'), 'Personas: ' + data.get('personas'), data.get('mensaje') ? 'Ocasión o detalle: ' + data.get('mensaje') : ''].filter(Boolean).join('\n');
      const whatsappUrl = 'https://wa.me/573017222769?text=' + encodeURIComponent(message);
      const opened = window.open(whatsappUrl, '_blank');
      if (opened) opened.opener = null;
      if (opened) { localStorage.removeItem(draftKey); }
      const status = document.querySelector('#inquiry-status');
      status.textContent = opened ? 'Listo: revisa los datos en WhatsApp y envía el mensaje para coordinar. La reserva aún no está confirmada.' : 'El navegador bloqueó la ventana. Permite abrir WhatsApp o escríbenos al 301 722 2769.';
      if (opened) sparkle(inquiryForm.querySelector('button[type="submit"]'));
    });
  }

  const menuToggle = document.querySelector('#menu-toggle');
  const moreMenu = document.querySelector('#more-menu');
  if (menuToggle && moreMenu) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(expanded));
      moreMenu.hidden = !expanded;
      moreMenu.classList.toggle('is-open', expanded);
      menuToggle.querySelector('.menu-toggle-label').textContent = expanded ? 'Ocultar los demás platos' : '¿Quieres ver los demás platos?';
      menuToggle.querySelector('.menu-toggle-prompt').innerHTML = expanded ? 'Ya puedes curiosear la carta <span class="menu-toggle-icon" aria-hidden="true">−</span>' : '¿Quieres saber de qué te estás perdiendo? <span class="menu-toggle-icon" aria-hidden="true">＋</span>';
      sparkle(menuToggle);
    });
  }
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeFact(); });
  document.addEventListener('click', (event) => {
    if (!panel.hidden && !panel.contains(event.target) && !event.target.closest('[data-fact]')) closeFact();
  });


  const dishLightbox = document.querySelector('#dish-lightbox');
  const lightboxImage = document.querySelector('#dish-lightbox-image');
  const lightboxTitle = document.querySelector('#dish-lightbox-title');
  const lightboxClose = dishLightbox?.querySelector('.lightbox-close');
  let activeDishImage = null;
  function openDishImage(image) {
    if (!dishLightbox || !lightboxImage) return;
    activeDishImage = image;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = image.alt.replace(/^Imagen ilustrativa de /, '');
    image.setAttribute('aria-pressed', 'true');
    dishLightbox.showModal();
    sparkle(image);
  }
  function closeDishImage() {
    if (!dishLightbox?.open) return;
    dishLightbox.close();
  }
  document.querySelectorAll('.dish-card[data-dish-card] .dish-visual img[role="button"]').forEach((image) => {
    image.addEventListener('click', () => openDishImage(image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openDishImage(image); }
    });
  });
  lightboxClose?.addEventListener('click', closeDishImage);
  dishLightbox?.addEventListener('click', (event) => { if (event.target === dishLightbox) closeDishImage(); });
  dishLightbox?.addEventListener('close', () => {
    if (activeDishImage) { activeDishImage.setAttribute('aria-pressed', 'false'); activeDishImage.focus({ preventScroll: true }); }
  });

  const dishCards = Array.from(document.querySelectorAll('[data-dish-card]'));
  const dishName = (card) => card.dataset.dishName || card.querySelector('h3')?.innerText.replace(/\s+/g, ' ').trim() || card.querySelector('.dish-image-name')?.textContent.replace(/\s+/g, ' ').trim() || 'Plato Cecilia';
  const dishFeedback = document.querySelector('#dish-feedback');
  const pointerTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  dishCards.forEach((card) => {
    const button = card.querySelector('[data-dish-toggle]');
    const label = card.querySelector('.dish-select-label');
    const title = dishName(card);
    button.addEventListener('click', () => {
      const selected = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(selected));
      card.classList.toggle('is-selected', selected);
      label.textContent = selected ? 'Guardado en mi lista' : 'Guardar mi antojo';
      card.querySelector('.heart-icon').textContent = selected ? '♥' : '♡';
      button.classList.remove('is-tapped');
      requestAnimationFrame(() => button.classList.add('is-tapped'));
      sparkle(button);
      const saved = dishCards.filter((item) => item.querySelector('[data-dish-toggle]').getAttribute('aria-pressed') === 'true').map((item) => dishName(item));
      dishFeedback.textContent = saved.length ? 'Tu lista de antojos: ' + saved.join(' y ') + '. Solo queda visualmente guardada; no genera un pedido.' : 'Toca “Guardar mi antojo” y arma tu pequeña lista. Es solo una interacción visual; no genera un pedido.';
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


  // Evaluación opcional: el diálogo modal pausa la navegación solo tras aceptar.
  const quizDialog = document.querySelector('#cecilia-quiz');
  const startQuiz = document.querySelector('#start-quiz');
  const skipQuiz = document.querySelector('#skip-quiz');
  const quizForm = document.querySelector('#quiz-form');
  const quizQuestion = document.querySelector('#quiz-question');
  const quizNext = document.querySelector('#quiz-next');
  const quizError = document.querySelector('#quiz-error');
  const quizResult = document.querySelector('#quiz-result');
  const quizProgress = document.querySelector('#quiz-progress');
  const quizCounter = document.querySelector('#quiz-counter');
  const evaluationNote = document.querySelector('#evaluation-note');
  const quizAttemptKey = 'cecilia-quiz-complete-v1';
  const questions = [
    { prompt: '¿Por qué el restaurante lleva el nombre Cecilia?', answers: [{id:'mother',text:'En honor a la madre del dueño, cuyo esfuerzo inspira a la familia.'},{id:'dish',text:'Por el nombre de la primera receta de la carta.'},{id:'town',text:'Por una antigua forma de llamar al municipio.'}], correct:'mother' },
    { prompt: '¿Dónde comenzó el camino de restaurantes de la familia?', answers: [{id:'monteria',text:'En Montería, antes de abrir en otros municipios.'},{id:'choco',text:'En El Chocó, con un pequeño restaurante familiar.'},{id:'sahagun',text:'En Sahagún, como primera sede.'}], correct:'choco' },
    { prompt: 'Además de la comida, ¿qué pone Cecilia en el centro de la experiencia?', answers: [{id:'decor',text:'La decoración de cada mesa.'},{id:'speed',text:'Servir todo en tiempo récord.'},{id:'service',text:'La calidad de la atención y hacerte sentir especial.'}], correct:'service' }
  ];
  let quizIndex = 0;
  let quizScore = 0;
  let quizLocked = false;

  function renderQuizQuestion() {
    const question = questions[quizIndex];
    const choices = [...question.answers];
    for (let i = choices.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [choices[i], choices[j]] = [choices[j], choices[i]]; }
    quizCounter.textContent = 'PREGUNTA ' + (quizIndex + 1) + ' DE ' + questions.length;
    quizProgress.value = quizIndex + 1;
    quizNext.disabled = true;
    quizNext.innerHTML = (quizIndex === questions.length - 1 ? 'Ver mi resultado' : 'Siguiente') + ' <span aria-hidden="true">→</span>';
    quizError.hidden = true;
    quizQuestion.classList.remove('question-arrive');
    quizQuestion.innerHTML = '<fieldset class="quiz-fieldset"><legend>' + question.prompt + '</legend><div class="quiz-options">' + choices.map((choice, i) => '<label class="quiz-option" for="quiz-answer-' + i + '"><input id="quiz-answer-' + i + '" type="radio" name="quiz-answer" value="' + choice.id + '" required><span>' + choice.text + '</span><i aria-hidden="true">✦</i></label>').join('') + '</div></fieldset>';
    requestAnimationFrame(() => quizQuestion.classList.add('question-arrive'));
    quizQuestion.querySelectorAll('input[name="quiz-answer"]').forEach((input) => input.addEventListener('change', () => { quizNext.disabled = false; quizQuestion.querySelectorAll('.quiz-option').forEach((option) => option.classList.toggle('is-chosen', option.contains(input) && input.checked)); sparkle(input.closest('.quiz-option')); }));
  }

  function finishQuiz() {
    const percent = quizScore === 3 ? 12 : quizScore === 2 ? 10 : quizScore === 1 ? 5 : 0;
    quizForm.hidden = true;
    quizProgress.hidden = true;
    quizCounter.textContent = 'RETO COMPLETADO · ' + quizScore + ' DE 3';
    quizResult.hidden = false;
    quizResult.innerHTML = '<span class="quiz-result-spark" aria-hidden="true">✦</span><p class="eyebrow">' + (percent ? '¡QUÉ BIEN NOS CONOCES!' : 'GRACIAS POR JUGAR') + '</p><h3>' + (percent ? '¡Felicidades! Has obtenido' : 'Esta vez no hubo aciertos') + '</h3>' + (percent ? '<p class="quiz-reward">' + percent + '<span>%</span></p><p class="quiz-result-copy">de descuento, por ' + quizScore + ' respuesta' + (quizScore === 1 ? '' : 's') + ' correcta' + (quizScore === 1 ? '' : 's') + '.</p>' : '<p class="quiz-result-copy">La historia ya es tuya; sigue disfrutando la visita.</p>') + '<p class="quiz-validation">Muestra este resultado al equipo Cecilia para validar el beneficio. La página no emite un cupón.</p><button class="button button-gold quiz-return" id="quiz-return" type="button">Volver a la página <span aria-hidden="true">↗</span></button>';
    sessionStorage.setItem(quizAttemptKey, JSON.stringify({ score: quizScore, percent, completedAt: new Date().toISOString() }));
    sparkle(quizResult.querySelector('.quiz-return'));
    quizResult.querySelector('#quiz-return').addEventListener('click', () => { quizLocked = false; document.body.classList.remove('quiz-locked'); quizDialog.close(); startQuiz.focus({preventScroll:true}); });
  }

  if (quizDialog && startQuiz && quizForm) {
    const previousAttempt = sessionStorage.getItem(quizAttemptKey);
    if (previousAttempt) { startQuiz.disabled = true; startQuiz.textContent = 'Ya participaste en esta visita'; evaluationNote.textContent = 'Esta evaluación ya se respondió en esta pestaña. Para validar un descuento, consulta al equipo Cecilia.'; }
    startQuiz.addEventListener('click', () => {
      if (sessionStorage.getItem(quizAttemptKey)) { evaluationNote.textContent = 'Esta evaluación ya se respondió en esta pestaña; el resultado debe validarse con el equipo Cecilia.'; return; }
      quizIndex = 0; quizScore = 0; quizLocked = true;
      quizForm.hidden = false; quizResult.hidden = true; quizProgress.hidden = false; quizNext.disabled = true;
      quizDialog.showModal(); document.body.classList.add('quiz-locked'); renderQuizQuestion(); sparkle(startQuiz);
    });
    skipQuiz.addEventListener('click', () => { evaluationNote.textContent = 'Perfecto, sigue mirando a tu ritmo. El reto seguirá aquí si cambias de opinión.'; sparkle(skipQuiz); });
    quizForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const chosen = quizForm.querySelector('input[name="quiz-answer"]:checked');
      if (!chosen) { quizError.hidden = false; return; }
      if (chosen.value === questions[quizIndex].correct) quizScore++;
      quizIndex++;
      if (quizIndex < questions.length) renderQuizQuestion(); else finishQuiz();
    });
    quizDialog.addEventListener('cancel', (event) => { if (quizLocked) event.preventDefault(); });
    quizDialog.addEventListener('close', () => { if (quizLocked) { quizLocked = false; document.body.classList.remove('quiz-locked'); } });
  }

  // Un destello corto confirma los toques sin añadir controles innecesarios.
  document.addEventListener('pointerdown', (event) => {
    if (reducedMotion) return;
    const control = event.target.closest('.button, .curiosity-trigger, .dish-select, .menu-reveal-button, .palette-chip, .social-icon, .nav-cta, .image-peek, .location-link, .quiz-option, .quiz-decline, .lightbox-close');
    if (!control || control.matches(':disabled') || control.closest('.quiz-option')) return;
    const rect = control.getBoundingClientRect();
    control.style.setProperty('--ripple-x', (event.clientX - rect.left) + 'px');
    control.style.setProperty('--ripple-y', (event.clientY - rect.top) + 'px');
    const ripple = document.createElement('span'); ripple.className = 'interaction-ripple'; ripple.setAttribute('aria-hidden', 'true');
    control.append(ripple); ripple.addEventListener('animationend', () => ripple.remove(), {once:true});
  }, {passive:true});

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

