(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const category = document.body.dataset.category;
  let filter = category;
  const grid = $("#service-grid");
  const dialog = $("#service-dialog");
  const labels = {
    driving: "Driving licence",
    vehicle: "Vehicle services",
    other: "More services",
  };
  const symbols = { driving: "â†—", vehicle: "â–±", other: "âŒ˜" };
  function text(tag, value, className) {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  }
  function showService(service) {
    $("#dialog-title").textContent = service.title;
    $("#dialog-description").textContent = service.description;
    $("#dialog-steps").replaceChildren(
      ...service.steps.map((step) => text("li", step)),
    );
    dialog.showModal();
  }
  function renderServices() {
    const query = $("#service-search").value.trim().toLowerCase();
    const services = window.SERVICES.filter(
      (service) =>
        (filter === "all" || service.category === filter) &&
        `${service.title} ${service.description} ${labels[service.category]}`
          .toLowerCase()
          .includes(query),
    );
    grid.replaceChildren(
      ...services.map((service) => {
        const card = text("article", "", "service-card");
        const trigger = text("button", "", "service-trigger");
        trigger.type = "button";
        trigger.setAttribute("aria-label", `Read guide: ${service.title}`);
        const top = text("span", "", "service-card-top");
        top.append(
          text("span", symbols[service.category], "service-symbol"),
          text("span", service.number, "service-number"),
        );
        const bottom = text("span", "", "service-card-bottom");
        bottom.append(
          text("span", labels[service.category]),
          text("span", "â†—"),
        );
        card.append(
          top,
          text("h3", service.title),
          text("p", service.description),
          bottom,
          trigger,
        );
        trigger.addEventListener("click", () => showService(service));
        return card;
      }),
    );
    $(".no-results").hidden = services.length > 0;
    $("#service-count").textContent = `${services.length} services found`;
  }
  $("#service-search").addEventListener("input", renderServices);
  $$("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      $$("[data-filter]").forEach((item) => {
        item.classList.toggle("selected", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      renderServices();
    }),
  );
  $(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
  $(".menu-toggle").addEventListener("click", () => {
    const expanded = $(".menu-toggle").getAttribute("aria-expanded") !== "true";
    $(".menu-toggle").setAttribute("aria-expanded", String(expanded));
    $("#main-nav").classList.toggle("open", expanded);
  });
  const current = location.pathname.split("/").pop() || "index.html";
  $$("#main-nav a").forEach((link) => {
    if (link.getAttribute("href") === current)
      link.setAttribute("aria-current", "page");
  });
  const records = {
    "DEMO-CAR-001": {
      type: "vehicle",
      rows: [
        ["Record", "Fictional vehicle"],
        ["Vehicle type", "Private motor car"],
        ["Registration", "Sample active record"],
        ["Fuel", "Electric"],
      ],
    },
    "DEMO-DL-001": {
      type: "licence",
      rows: [
        ["Record", "Fictional driving licence"],
        ["Holder", "Sample Driver"],
        ["Class", "Sample light motor vehicle"],
        ["Status", "Demo record only"],
      ],
    },
  };
  let recordType = "vehicle";
  function selectType(type) {
    recordType = type;
    $$("[data-type]").forEach((button) => {
      button.classList.toggle("selected", button.dataset.type === type);
      button.setAttribute("aria-pressed", String(button.dataset.type === type));
    });
    $("#record-id").placeholder =
      type === "vehicle" ? "DEMO-CAR-001" : "DEMO-DL-001";
    $("#record-id").value = "";
    $("#lookup-result").replaceChildren(
      text("p", "Your sample result will appear here."),
    );
  }
  function lookup() {
    const id = $("#record-id").value.trim().toUpperCase();
    $("#record-id").value = id;
    const result = $("#lookup-result");
    const record = records[id];
    result.replaceChildren();
    if (!record || record.type !== recordType) {
      result.append(
        text("strong", "No matching sample record"),
        text(
          "p",
          "Use the sample button for the selected record type. Real identifiers are not supported.",
        ),
      );
      return;
    }
    result.append(
      text("span", "FICTIONAL SAMPLE Â· NO LIVE DATA", "result-badge"),
    );
    record.rows.forEach(([key, value]) => {
      const row = text("div", "", "record-row");
      row.append(text("span", key), text("strong", value));
      result.append(row);
    });
  }
  if ($("#lookup-form")) {
    $("#lookup-form").addEventListener("submit", (event) => {
      event.preventDefault();
      lookup();
    });
    $$("[data-type]").forEach((button) =>
      button.addEventListener("click", () => selectType(button.dataset.type)),
    );
    $$("[data-sample]").forEach((button) =>
      button.addEventListener("click", () => {
        const id = button.dataset.sample;
        selectType(records[id].type);
        $("#record-id").value = id;
        lookup();
      }),
    );
  }
  function toggleHelp(open) {
    $("#help-panel").hidden = !open;
    $(".help-launcher").setAttribute("aria-expanded", String(open));
    if (open) $("#help-close").focus();
    else $(".help-launcher").focus();
  }
  $(".help-launcher").addEventListener("click", () =>
    toggleHelp($("#help-panel").hidden),
  );
  $("#help-close").addEventListener("click", () => toggleHelp(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("#help-panel").hidden) toggleHelp(false);
  });
  const answers = {
    licence:
      "Open Driving licence in the navigation to explore first licences, renewals, duplicate licences, and international permits. Each guide points to the official portal.",
    vehicle:
      "Open Vehicle services to explore registration, ownership transfer, fitness, and duplicate registration guides. No real application is submitted here.",
    demo: "This independent student project runs entirely in your browser. Lookups use fictional sample data. The help guide is scripted and does not contact an AI service.",
  };
  $$("[data-help]").forEach((button) =>
    button.addEventListener("click", () => {
      $("#help-answer").textContent = answers[button.dataset.help];
    }),
  );
  renderServices();
})();
