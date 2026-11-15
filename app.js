(function () {
  "use strict";

  const data = window.VITAREI_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function icon(name) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", `#i-${name}`);
    svg.append(use);
    return svg;
  }

  /* ---------- Dialog helpers ---------- */
  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.documentElement.classList.add("no-scroll");
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  }

  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("close", () => document.documentElement.classList.remove("no-scroll"));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target.closest("[data-close]")) closeDialog(dialog);
    });
  });

  /* ---------- Services ---------- */
  const serviceModal = $("#service-modal");

  function openService(service) {
    $("#service-modal-title").textContent = service.title;
    $("#service-modal-icon").replaceChildren(icon(service.icon));
    const body = $("#service-modal-body");
    body.innerHTML = service.details;
    body.scrollTop = 0;
    openDialog(serviceModal);
  }

  function renderServices() {
    const grid = $("#service-grid");
    if (!grid) return;
    data.services.forEach((service, index) => {
      const card = make("article", "service-card reveal");
      const head = make("div", "service-head");
      const badge = make("span", "service-icon");
      badge.append(icon(service.icon));
      head.append(badge, make("span", "service-number", String(index + 1).padStart(2, "0")));

      const tags = make("ul", "service-tags");
      service.tags.forEach((tag) => tags.append(make("li", "", tag)));

      const button = make("button", "service-link");
      button.type = "button";
      button.append(document.createTextNode("Detalii serviciu"), icon("arrow"));
      button.setAttribute("aria-label", `Detalii despre ${service.title}`);
      button.addEventListener("click", () => openService(service));

      card.append(head, make("h3", "", service.title), make("p", "", service.summary), tags, button);
      grid.append(card);
    });
  }

  /* ---------- Prices ---------- */
  function readPrices() {
    let saved = null;
    try { saved = localStorage.getItem(data.storageKey); } catch (e) { /* storage blocked */ }
    if (saved === null) return data.prices;
    const parsed = JSON.parse(saved);
    const valid = Array.isArray(parsed) && parsed.length === data.prices.length &&
      parsed.every((item) => item && ["category", "name", "price", "details"].every((k) => typeof item[k] === "string"));
    return valid ? parsed : data.prices;
  }

  function renderPrices() {
    const tabs = $("#pricing-tabs");
    const list = $("#pricing-list");
    if (!tabs || !list) return;

    let prices;
    try { prices = readPrices(); } catch (e) { prices = data.prices; }
    const categories = [...new Set(prices.map((item) => item.category))];

    function show(category) {
      $$("button", tabs).forEach((tab) => {
        const active = tab.dataset.category === category;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      list.replaceChildren();
      prices.filter((item) => item.category === category).forEach((item) => {
        const row = make("div", "price-row");
        const info = make("div", "price-info");
        info.append(make("h4", "", item.name));
        if (item.details) info.append(make("p", "", item.details));
        row.append(info, make("span", "price-dots"), make("strong", "price-amount", item.price));
        list.append(row);
      });
    }

    categories.forEach((category) => {
      const tab = make("button", "pricing-tab", category);
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.dataset.category = category;
      tab.addEventListener("click", () => show(category));
      tabs.append(tab);
    });

    tabs.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const all = $$("button", tabs);
      const current = all.indexOf(document.activeElement);
      if (current < 0) return;
      const next = all[(current + (event.key === "ArrowRight" ? 1 : -1) + all.length) % all.length];
      next.focus();
      next.click();
    });

    show(categories[0]);
  }

  /* ---------- Gallery lightbox ---------- */
  function setupGallery() {
    const items = $$("#gallery-grid .gallery-item");
    const lightbox = $("#lightbox");
    if (!items.length || !lightbox) return;
    const img = $("#lightbox-img");
    const caption = $("#lightbox-caption");
    let current = 0;

    function show(index) {
      current = (index + items.length) % items.length;
      const source = $("img", items[current]);
      img.src = source.currentSrc || source.src;
      img.alt = source.alt;
      caption.textContent = `${$("span", items[current]).textContent} · ${current + 1} / ${items.length}`;
    }

    items.forEach((item, index) => item.addEventListener("click", () => { show(index); openDialog(lightbox); }));
    $(".lightbox-prev", lightbox).addEventListener("click", () => show(current - 1));
    $(".lightbox-next", lightbox).addEventListener("click", () => show(current + 1));
    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(current - 1);
      if (event.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---------- Header & navigation ---------- */
  function setupNavigation() {
    const header = $("#site-header");
    const toggle = $(".menu-toggle");
    const nav = $("#main-nav");

    function setMenu(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Închide meniul" : "Deschide meniul");
      nav.classList.toggle("is-open", open);
      document.documentElement.classList.toggle("menu-open", open);
    }

    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (event) => { if (event.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") setMenu(false); });

    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (!("IntersectionObserver" in window)) return;
    const links = $$('.main-nav a[href^="#"]');
    const sections = links.map((link) => $(link.getAttribute("href"))).filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- Reveal on scroll ---------- */
  function setupReveal() {
    const elements = $$(".reveal");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    elements.forEach((el) => observer.observe(el));
  }

  /* ---------- Contact form ---------- */
  function setupContactForm() {
    const form = $("#contact-form");
    if (!form) return;
    const status = $("#form-status");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        status.textContent = "Te rugăm să completezi câmpurile obligatorii.";
        status.className = "form-status is-error";
        return;
      }
      const fd = new FormData(form);
      const subject = `Programare / întrebare: ${fd.get("subject")}`;
      const body = [
        `Nume: ${fd.get("name")}`,
        `Telefon: ${fd.get("phone") || "-"}`,
        `E-mail: ${fd.get("email")}`,
        "",
        String(fd.get("message"))
      ].join("\n");
      status.textContent = "Se deschide aplicația ta de e-mail cu mesajul completat — apasă „Trimite” pentru a-l expedia.";
      status.className = "form-status is-success";
      window.location.href = `mailto:contact@vitareikineto.ro?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  renderServices();
  renderPrices();
  setupGallery();
  setupNavigation();
  setupContactForm();
  setupReveal();
})();
