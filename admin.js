(function () {
  "use strict";

  const data = window.VITAREI_DATA;
  const editor = document.getElementById("admin-price-editor");
  const status = document.getElementById("admin-status");

  function showError(message) {
    status.textContent = message;
    status.className = "admin-status-error";
  }

  function loadPrices() {
    const saved = localStorage.getItem(data.storageKey);
    if (saved === null) return data.prices.map((item) => ({ ...item }));
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length !== data.prices.length ||
        !parsed.every((item) => item && typeof item.category === "string" &&
          typeof item.name === "string" && typeof item.price === "string" &&
          typeof item.details === "string")) {
      throw new Error("Datele salvate au un format invalid. Încearcă restaurarea valorilor arhivate.");
    }
    return parsed;
  }

  function makeField(labelText, value, field, required) {
    const label = document.createElement("label");
    label.className = `admin-field admin-field-${field}`;
    label.textContent = labelText;
    const input = document.createElement("input");
    input.type = "text";
    input.name = field;
    input.value = value;
    input.maxLength = field === "price" ? 60 : 120;
    input.required = required;
    label.append(input);
    return label;
  }

  function render() {
    const prices = loadPrices();
    const categories = [...new Set(prices.map((item) => item.category))];
    editor.replaceChildren();
    categories.forEach((category) => {
      const section = document.createElement("section");
      section.className = "admin-category";
      const heading = document.createElement("h2");
      heading.textContent = category;
      section.append(heading);
      prices.forEach((item, index) => {
        if (item.category !== category) return;
        const row = document.createElement("div");
        row.className = "admin-price-row";
        row.dataset.index = String(index);
        row.append(
          makeField("Serviciu", item.name, "name", true),
          makeField("Preț", item.price, "price", true),
          makeField("Durată / detalii", item.details, "details", false)
        );
        section.append(row);
      });
      editor.append(section);
    });
  }

  document.getElementById("save-prices").addEventListener("click", () => {
    const rows = [...editor.querySelectorAll(".admin-price-row")];
    if (!rows.every((row) => row.querySelectorAll("input")[0].reportValidity() &&
        row.querySelectorAll("input")[1].reportValidity())) {
      showError("Completează denumirea și prețul fiecărui serviciu înainte de salvare.");
      return;
    }
    try {
      const prices = loadPrices();
      rows.forEach((row) => {
        const item = prices[Number(row.dataset.index)];
        const fields = row.querySelectorAll("input");
        item.name = fields[0].value.trim();
        item.price = fields[1].value.trim();
        item.details = fields[2].value.trim();
      });
      localStorage.setItem(data.storageKey, JSON.stringify(prices));
      status.textContent = "Tarife salvate în acest browser.";
      status.className = "admin-status-success";
    } catch (error) {
      showError(`Nu s-au putut salva tarifele: ${error.message}`);
      console.error(error);
    }
  });

  document.getElementById("reset-prices").addEventListener("click", () => {
    try {
      localStorage.removeItem(data.storageKey);
      render();
      status.textContent = "Au fost restaurate valorile arhivate din 2025.";
      status.className = "admin-status-success";
    } catch (error) {
      showError(`Nu s-au putut restaura valorile: ${error.message}`);
      console.error(error);
    }
  });

  try {
    render();
  } catch (error) {
    showError(error.message);
    const resetButton = document.getElementById("reset-prices");
    resetButton.focus();
    console.error(error);
  }
})();
