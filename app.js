(function () {
  "use strict";

  const data = window.VITAREI_DATA;
  const priceContainer = document.getElementById("pricing-list");
  const serviceContainer = document.getElementById("service-grid");

  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function readPrices() {
    const saved = localStorage.getItem(data.storageKey);
    if (saved === null) return data.prices;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length !== data.prices.length ||
        !parsed.every((item) => item && typeof item.category === "string" &&
          typeof item.name === "string" && typeof item.price === "string" &&
          typeof item.details === "string")) {
      throw new Error("Lista de tarife salvată local are un format invalid.");
    }
    return parsed;
  }

  function renderPrices() {
    if (!priceContainer) return;
    try {
      const prices = readPrices();
      const categories = [...new Set(prices.map((item) => item.category))];
      priceContainer.replaceChildren();
      categories.forEach((category) => {
        const group = make("section", "price-group");
        const heading = make("h3", "price-category", category);
        const list = make("div", "price-items");
        prices.filter((item) => item.category === category).forEach((item) => {
          const row = make("article", "price-row");
          const info = make("div", "price-info");
          info.append(make("h4", "", item.name));
          if (item.details) info.append(make("p", "", item.details));
          row.append(info, make("strong", "price-amount", item.price));
          list.append(row);
        });
        group.append(heading, list);
        priceContainer.append(group);
      });
    } catch (error) {
      const message = make("p", "error-message", "Tarifele nu au putut fi încărcate. Deschide panoul de administrare pentru a restaura valorile inițiale.");
      priceContainer.replaceChildren(message);
      console.error(error);
    }
  }

  function getServiceContent(title) {
    if (title === "Kinetoterapie") {
      return `
        <div class="service-modal-body">
          <h3 id="service-modal-title">Kinetoterapie</h3>
          <p>Kinetoterapia are la bază mișcarea efectuată prin programe, bine structurate, adecvate vârstei, stării de sănătate a subiecților și obiectivelor urmărite.</p>
          <p>Kinetoterapia este utilizată pentru a îmbunătăți rezistența, mobilitatea și forța unei persoane.</p>
          <p>Kinetoterapia profilactică cuprinde totalitatea metodelor și mijloacelor kinetologice care se adresează menținerii și întăririi stării de sănătate, deci prevenirii stării de boală.</p>
          <p>Principalele grupe de afecțiuni cărora se adresează:</p>
          <ol>
            <li>Unele boli ale aparatului locomotor:
              <ul>
                <li>afecțiuni reumatismale, cronice, în special mecanice lombare;</li>
                <li>tulburări de postură și aliniament al corpului;</li>
                <li>unele deficiențe congenitale, cu sau fără abordare chirurgicală;</li>
                <li>sechele definitive, organo-funcționale ale aparatului mioartrokinetic;</li>
              </ul>
            </li>
            <li>Unele boli ale aparatului cardiovascular, în primul rând ateroscleroza;</li>
            <li>Unele boli de nutriție și metabolism, mai ales diabetul, obezitatea;</li>
            <li>Unele boli ale aparatului respirator;</li>
            <li>Bolile funcționale ale sistemului nervos.</li>
          </ol>
          <p>Kinetoterapia profilactică include și programe de gimnastică care au ca scop dezvoltarea armonioasă a copiilor și tinerilor.</p>
          <p>Kinetoterapia în scop terapeutic cuprinde totalitatea metodelor și mijloacelor kinetologice care se adresează refacerii unor funcții diminuate.</p>
          <p>Principalele grupe de afecțiuni cărora se adresează:</p>
          <ol>
            <li>Afecțiuni ale aparatului locomotor;</li>
            <li>Afecțiuni ale aparatului cardiovascular;</li>
            <li>Afecțiuni ale aparatului respirator;</li>
            <li>Afecțiuni neurologice;</li>
          </ol>
          <p>Kinetoterapia de recuperare cuprinde totalitatea metodelor și mijloacelor kinetologice care se adresează recuperării funcționale.</p>
          <p>Principalele grupe de afecțiuni cărora se adresează:</p>
          <ol>
            <li>Sechele posttraumatice ale aparatului locomotor (contuzii, entorse, luxații, fracturi, rupturi musculare, artroplastii, intervenții articulare ortopedice)</li>
            <li>Întregului domeniu al deficitului funcțional din bolile cronice (scleroze, boli metabolice), în special ale aparatelor locomotor și cardiorespirator.</li>
          </ol>
          <p>Deși suntem tentați să minimizăm importanța acestei terapii, adevărata ei valoare o putem aprecia doar după ce simțim noi înșine beneficiile acesteia.</p>
        </div>
      `;
    }

    if (title === "Fizioterapie") {
      return `
        <div class="service-modal-body">
          <h3 id="service-modal-title">Fizioterapie</h3>
          <p>Fizioterapia se adresează unei game largi de afecțiuni:</p>
          <ol>
            <li>afecțiuni metabolice;</li>
            <li>afecțiuni ale sistemului osteo-articular;</li>
            <li>afecțiuni ale sistemului muscular;</li>
            <li>afecțiuni ale sistemului nervos;</li>
            <li>afecțiuni ale sistemului circulator;</li>
          </ol>
          <p>Tipuri de fizioterapii practicate de centrul nostru:</p>
          <ul>
            <li>Terapia Tecar</li>
            <li>Terapia prin ultrasunete</li>
            <li>Magnetoterapie</li>
            <li>Aromoterapie</li>
            <li>Electroterapie</li>
            <li>Terapie cu lumină</li>
            <li>Terapia interferențială (CIF)</li>
          </ul>
          <h4>Terapia Tecar</h4>
          <p>Terapia Tecar este o metodă inovativă de recuperare care folosește energia electromagnetică pentru a stimula procesele naturale de vindecare a organismului. Permite tratarea, fără intervenție chirurgicală, a unor traumatisme, afecțiuni musculare sau dureri articulare. Terapia TECAR presupune conversia energiei electromagnetice, produse printr-un curent alternativ de frecvență foarte înaltă, în căldură ce se transmite la nivelul tuturor straturilor de țesut aflate sub electrod, indiferent de profunzimea acestora.</p>
          <p>Se utilizează pentru:</p>
          <ol>
            <li>Relaxare musculară;</li>
            <li>Regenerarea şi vindecarea accelerată a ţesutului ca urmare a îmbunătăţirii metabolismului la nivel celular, a creşterii cantităţii de energie la acest nivel, asociat cu resorbţia rapidă a hematoamelor post-traumă;</li>
            <li>Reducerea edemului prin echilibrarea fortelor Starling şi dezobstrucţia capilarelor limfatice;</li>
            <li>Ameliorarea durerii este un rezultat al efectelor biologice însumate (a relaxării mușchiului, reducerii edemului, regenerării şi vindecării ţesutului).</li>
          </ol>
          <p>Beneficii ale Terapiei Tecar</p>
          <ul>
            <li>este noninvazivă și nedureroasă, pacientul simțind o senzație plăcută în timpul terapiei, asemeni unui masaj;</li>
            <li>reduce edemul și ameliorează rapid durerea;</li>
            <li>contribuie la regenerarea ţesuturilor și accelerează vindecarea;</li>
            <li>reduce durata de tratament, rezultatele făcându-se vizibile încă de la primele ședințe;</li>
            <li>are aplicabilitate în numeroase afecțiuni, atât ale țesuturilor moi (mușchi), cât și ale celor mai dure (oase, cartilaje, ligamente, articulații etc);</li>
            <li>se poate aplica inclusiv în zona cervicală;</li>
            <li>poate fi folosită imediat după traumă sau în faza acută a unui proces inflamator;</li>
            <li>are efect relaxant.</li>
          </ul>
          <h4>Ultrasunete</h4>
          <p>Terapia cu ultrasunete are la bază utilizarea undelor sonore de frecvență mare din afara spectrului auzibil al urechii umane (de la 16Hz la aproape 15-20.000HZ). Tratamentul cu ultrasunete produce un micromasaj la nivelul tesuturilor, asigurand o penetrare in profunzime a substantelor antiinflamatoare sub forma de gel; in functie de doza poate produce o incalzire a tesuturilor tratate.</p>
          <p>Beneficii:</p>
          <ul>
            <li>este noninvazivă și nedureroasă, pacientul simțind o senzație plăcută în timpul terapiei, asemeni unui masaj;</li>
            <li>reduce edemul și ameliorează durerea;</li>
            <li>contribuie la regenerarea ţesuturilor și accelerează vindecarea;</li>
            <li>reduce durata de tratament, rezultatele făcându-se vizibile încă de la primele ședințe;</li>
            <li>are aplicabilitate în numeroase afecțiuni, atât ale țesuturilor moi (mușchi), cât și ale celor mai dure (oase, cartilaje, ligamente, articulații etc);</li>
            <li>se poate aplica inclusiv în zona cervicală;</li>
            <li>poate fi folosită imediat după traumă sau în faza acută a unui proces inflamator;</li>
            <li>are efect relaxant.</li>
          </ul>
          <h4>Magnetoterapie</h4>
          <p>Magnetoterapia este o tehnică care exploatează efectul câmpului magnetic asupra organismului uman. În cadrul centrului Vitareikineto se utilizează atât terapia cu magneți cât și terapia pulsatilă.</p>
          <p>Beneficii:</p>
          <ul>
            <li>este noninvazivă și nedureroasă;</li>
            <li>are efect relaxant;</li>
            <li>echilibrează întregul organism, contribuind astfel la prevenirea îmbolnăvirii;</li>
            <li>accelerează procesul de vindecare, chiar și în cazul unor afecțiuni grave, precum bolile degenerative, cancerul și depresiile;</li>
            <li>nu are efecte secundare.</li>
          </ul>
          <h4>Terapie cu lumină</h4>
          <p>Terapia cu lumina este o terapie inovativă, care folosește lumina polarizată.</p>
          <p>Beneficii:</p>
          <ul>
            <li>este noninvazivă și nedureroasă;</li>
            <li>are efect relaxant;</li>
            <li>stimulează capacitatea de autovindecare a organismului;</li>
            <li>activează sistemul imunitar;</li>
            <li>echilibrează energetic organismul;</li>
            <li>nu are efecte secundare.</li>
          </ul>
          <h4>Aromoterapie</h4>
          <p>Aromoterapia este o ramură a medicinei alternative care are la bază folosirea proprietăților uleiurilor esențiale din plante și este utilizată atât cu scop preventiv, cât și curativ.</p>
          <p>Beneficii:</p>
          <ul>
            <li>ameliorarea durerilor asociate diverselor afecțiuni;</li>
            <li>reducerea stresului;</li>
            <li>echilibrare emoțională;</li>
            <li>are efect relaxant;</li>
            <li>echilibrează energetic organismul.</li>
          </ul>
          <h4>Electroterapia</h4>
          <p>Este o metodă terapeutică care are la bază utilizarea curentului electric în scop profilactic, curativ și de recuperare.</p>
          <p>Beneficii:</p>
          <ul>
            <li>este non-invazivă și non-dependente;</li>
            <li>nu interacționează cu alte medicamente;</li>
            <li>nu are efecte secundare;</li>
            <li>se adresează în mod direct zonelor cu durere;</li>
            <li>eficientă în reducerea durerii, a edemelor și în stimularea contracției musculare;</li>
            <li>promovează vindecarea tisulară.</li>
          </ul>
        </div>
      `;
    }

    if (title === "Masaj") {
      return `
        <div class="service-modal-body">
          <h3 id="service-modal-title">Masaj</h3>
          <p>Masajul reprezintă un set de manevre de tip manual sau tehnic, prin care se ia contact cu tegumentul pentru a stimula pielea și țesuturile adiacente, cu scopul determinării unor reacții vasculare, biochimice, de stimulare senzitivă și de inducere de reacții de tip reflex în vecinătatea zonei de masaj sau la distanță. Scopul inducerii unor astfel de reacții poate fi igienic, profilactic, terapeutic și/sau recuperator.</p>
          <p>Beneficii:</p>
          <ul>
            <li>intensificarea circulației sanguine la nivelul sistemului circulator și a celui limfatic;</li>
            <li>relaxează mușchii răniți și suprasolicitați;</li>
            <li>reduce spasmele și crampele;</li>
            <li>crește flexibilitatea articulațiilor;</li>
            <li>scurtează perioada de recuperare, ajută la pregătirea pentru antrenamente intense și elimină durerile ulterioare ale sportivilor;</li>
            <li>ajută la eliberarea de endorfine (analgezice naturale ale corpului);</li>
            <li>reduce aderentele post-chirurgicale și edemul;</li>
            <li>diminuarea și realinierea țesutului cicatricial după ce vindecarea a avut loc;</li>
            <li>îmbunătățește flexibilitatea și scade disconfortul în cazul pacienților care suferă de dureri minore de spate;</li>
            <li>calmează durerile persoanelor care suferă de migrene și scade frecvența utilizării medicamentelor;</li>
            <li>detoxifierea organismului;</li>
            <li>remodelare corporală;</li>
            <li>nu interacționează cu tratamentul medicamentos;</li>
            <li>întărește sistemul imunitar.</li>
          </ul>
          <p>În cadrul centrului Vitareikineto practicăm următoarele tipuri de masaj:</p>
          <ul>
            <li>Masaj de relaxare</li>
            <li>Masaj terapeutic</li>
            <li>Masaj anticelulitic</li>
            <li>Masaj sportiv</li>
            <li>Masaj Prenatal</li>
            <li>Masaj Reflexogen</li>
            <li>Drenaj Limfatic</li>
            <li>Shiatsu</li>
          </ul>
        </div>
      `;
    }

    if (title === "Terapie Reiki") {
      return `
        <div class="service-modal-body">
          <h3 id="service-modal-title">Reiki</h3>
          <p>Reiki este “energia universală care susține toate formele de viață”. De origine japoneză, cuvântul ”Reiki” este format din 2 ideograme: Rei și Ki. Ideograma Rei se poate traduce prin mai multe cuvinte: universal, cosmic, divin, spirit, iar ideograma Ki – reprezintă energia ce înconjoară, întrepătrunde și susține tot ceea ce este viu. Corpul uman, ca sistem energetic, este alcătuit din 3 componente de bază: corpuri de materie subtilă sau corpuri energetice, chakre sau centrii de energie și canale de energie numite nadi. Premisa de la care pleacă practica japoneză Reiki este aceea că sănătatea unei persoane este legată în mod direct de echilibrul ei energetic. (Risvan Vlad Rusu)</p>
          <p>Scopul Reiki este să conecteze persoana la sursa universală de energie, prin sincronizarea vibrațiilor și să mențină această conexiune pe o perioadă cât mai lungă de timp.</p>
          <p>Beneficii ale practicii Reiki</p>
          <ul>
            <li>îmbunătățirea stării de sănătate;</li>
            <li>depășirea situațiilor psihice dificile, stărilor de stres și de frică;</li>
            <li>echilibrarea energetică a corpului;</li>
            <li>dezvoltarea creativității și intuiției;</li>
            <li>îmbunătățirea relațiilor interumane;</li>
            <li>autocunoașterea.</li>
          </ul>
          <p>Afecțiuni care pot fi tratate prin Reiki:</p>
          <ul>
            <li>afecțiuni dermatologice;</li>
            <li>afecțiuni ale aparatului cardio-vascular;</li>
            <li>afecțiuni ale aparatului respirator;</li>
            <li>afecțiuni ale aparatului uro-genital;</li>
            <li>afecțiuni ale aparatului digestiv;</li>
            <li>afecțiuni ale sistemului nervos;</li>
            <li>afecțiuni metabolice;</li>
            <li>afecțiuni ale sistemului endocrin;</li>
            <li>afecțiuni ale sistemului osos.</li>
          </ul>
        </div>
      `;
    }

    return `
      <div class="service-modal-body">
        <h3 id="service-modal-title">${title}</h3>
        <p>Informații detaliate despre acest serviciu vor fi disponibile în curând.</p>
      </div>
    `;
  }

  function openServiceModal(title) {
    const modal = document.getElementById("service-modal");
    const content = document.getElementById("service-modal-content");
    if (!modal || !content) return;

    content.innerHTML = getServiceContent(title);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeServiceModal() {
    const modal = document.getElementById("service-modal");
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function renderServices() {
    if (!serviceContainer) return;
    data.services.forEach((service, index) => {
      const card = make("article", "service-card");
      const icon = make("span", "service-icon", service.icon);
      icon.setAttribute("aria-hidden", "true");
      card.append(icon, make("p", "service-number", `0${index + 1}`), make("h3", "", service.title), make("p", "service-description", service.description));
      const link = make("a", "text-link", "Află mai multe →");
      link.href = service.title === "Kinetoterapie" ? "#" : "#contact";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        openServiceModal(service.title);
      });
      card.append(link);
      serviceContainer.append(card);
    });
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      navigation.classList.toggle("is-open", !expanded);
    });
    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        menuToggle.setAttribute("aria-expanded", "false");
        navigation.classList.remove("is-open");
      }
    });
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const formData = new FormData(contactForm);
      const subject = encodeURIComponent(String(formData.get("subject")));
      const body = encodeURIComponent(
        `Nume: ${formData.get("name")}\nE-mail: ${formData.get("email")}\n\n${formData.get("message")}`
      );
      const formStatus = document.getElementById("form-status");
      if (formStatus) {
        formStatus.textContent = "Se deschide aplicația de e-mail. Mesajul nu este transmis de acest prototip.";
      }
      window.location.href = `mailto:contact@vitareikineto.ro?subject=${subject}&body=${body}`;
    });
  }

  const serviceModal = document.getElementById("service-modal");
  if (serviceModal) {
    serviceModal.addEventListener("click", (event) => {
      if (event.target instanceof HTMLElement && event.target.dataset.close === "true") {
        closeServiceModal();
      }
    });

    const closeModalButton = serviceModal.querySelector(".service-modal-close");
    if (closeModalButton) {
      closeModalButton.addEventListener("click", closeServiceModal);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !serviceModal.hidden) {
        closeServiceModal();
      }
    });
  }

  const yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = String(new Date().getFullYear());
  renderServices();
  renderPrices();
})();
