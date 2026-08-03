(() => {
  "use strict";

  const TARGET_GROUP = "SteamCollege";
  const INTERNAL_STEAM_PATH = "/relax/calc/local/steam/local/0";

  function canonicalizeAddress() {
    if (window.location.pathname === INTERNAL_STEAM_PATH) {
      window.history.replaceState(
        window.history.state,
        "",
        `/${window.location.search}${window.location.hash}`
      );
    }
  }

  const normalize = (value) =>
    (value || "")
      .toString()
      .trim()
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const hiddenLabels = [
    "group editor",
    "editor de grupos",
    "sql group editor",
    "github gist",
    "load gist",
    "cargar gist",
    "new group",
    "nuevo grupo",
    "edit group",
    "editar grupo",
    "data sources",
    "fuentes de datos"
  ];

  function labelOf(element) {
    return normalize(
      [
        element.textContent,
        element.getAttribute("aria-label"),
        element.getAttribute("title"),
        element.getAttribute("href")
      ]
        .filter(Boolean)
        .join(" ")
    );
  }

  function hideDatasetEditingControls() {
    document
      .querySelectorAll("button, a, [role='button'], li, [role='menuitem']")
      .forEach((element) => {
        const label = labelOf(element);

        if (hiddenLabels.some((candidate) => label.includes(candidate))) {
          element.classList.add("college-hidden");
        }
      });

    document.querySelectorAll("nav, header, [role='navigation']").forEach((nav) => {
      const visibleInteractive = [...nav.querySelectorAll("button, a, [role='button']")]
        .filter((item) => !item.classList.contains("college-hidden"));

      if (visibleInteractive.length === 0 && normalize(nav.textContent) === "") {
        nav.classList.add("college-empty-nav");
      }
    });
  }

  function selectSteamDataset() {
    document.querySelectorAll("select").forEach((select) => {
      const option = [...select.options].find(
        (candidate) => normalize(candidate.textContent) === normalize(TARGET_GROUP)
      );

      if (!option) return;

      if (select.value !== option.value) {
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }

      select.classList.add("college-dataset-locked");
      select.setAttribute("aria-label", `Dataset fijo: ${TARGET_GROUP}`);
      select.tabIndex = -1;
    });

    // Some UI libraries render dropdowns without a native <select>.
    document
      .querySelectorAll("[role='combobox'], button, [class*='select']")
      .forEach((element) => {
        if (normalize(element.textContent).includes(normalize(TARGET_GROUP))) {
          element.classList.add("college-dataset-locked");
          element.setAttribute("aria-label", `Dataset fijo: ${TARGET_GROUP}`);
        }
      });
  }

  function keepRelationalAlgebraTab() {
    const tabs = [...document.querySelectorAll("[role='tab'], button, a")];
    const raTab = tabs.find((tab) => {
      const label = labelOf(tab);
      return (
        label === "relational algebra" ||
        label === "algebra relacional" ||
        label.includes("relational algebra")
      );
    });

    const sqlTabs = tabs.filter((tab) => {
      const label = labelOf(tab);
      return label === "sql" || label.includes("sql editor");
    });

    sqlTabs.forEach((tab) => tab.classList.add("college-hidden"));

    if (
      raTab &&
      raTab.getAttribute("aria-selected") === "false" &&
      !raTab.dataset.collegeActivated
    ) {
      raTab.dataset.collegeActivated = "true";
      raTab.click();
    }
  }

  function applyCollegeMode() {
    canonicalizeAddress();
    hideDatasetEditingControls();
    selectSteamDataset();
    keepRelationalAlgebraTab();
    document.documentElement.dataset.collegeMode = "steam";
  }

  let scheduled = false;
  const scheduleApply = () => {
    if (scheduled) return;
    scheduled = true;

    window.requestAnimationFrame(() => {
      scheduled = false;
      applyCollegeMode();
    });
  };

  const observer = new MutationObserver(scheduleApply);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-selected", "class"]
  });

  document.addEventListener("DOMContentLoaded", scheduleApply);
  window.addEventListener("load", scheduleApply);
  setTimeout(scheduleApply, 250);
  setTimeout(scheduleApply, 1000);
})();
