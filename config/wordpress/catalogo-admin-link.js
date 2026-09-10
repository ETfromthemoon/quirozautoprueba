(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  ready(function () {
    var group = document.getElementById("acf-group_catalogo_privado_venta");
    var tokenInput = document.getElementById("acf-field_catalogo_003");
    var enabledInput = document.getElementById("acf-field_catalogo_002");

    if (!group || !tokenInput || document.getElementById("quiroz-brochure-actions")) {
      return;
    }

    var slugInput = document.getElementById("post_name");
    var permalink = document.querySelector("#sample-permalink a");
    var slug = slugInput && slugInput.value
      ? slugInput.value
      : (permalink && permalink.pathname.split("/").filter(Boolean).pop()) || "";

    var panel = document.createElement("div");
    panel.id = "quiroz-brochure-actions";
    panel.style.cssText = "margin:16px 12px 20px;padding:18px;border:1px solid #c3c4c7;border-left:4px solid #d63638;border-radius:6px;background:#fff;box-shadow:0 1px 1px rgba(0,0,0,.04)";
    panel.innerHTML = [
      '<strong style="display:block;font-size:14px;margin-bottom:6px">Enlace del brochure privado</strong>',
      '<p class="quiroz-brochure-help" style="margin:0 0 12px;color:#50575e">Guarda o actualiza el vehículo antes de compartir este enlace.</p>',
      '<input class="quiroz-brochure-url" type="text" readonly style="width:100%;margin:0 0 12px;font-family:monospace" aria-label="Enlace privado del brochure">',
      '<div style="display:flex;flex-wrap:wrap;gap:8px">',
      '<a class="button button-primary quiroz-brochure-open" target="_blank" rel="noopener noreferrer">Ver brochure</a>',
      '<button type="button" class="button quiroz-brochure-copy">Copiar enlace</button>',
      '<span class="quiroz-brochure-status" style="align-self:center;color:#646970"></span>',
      '</div>'
    ].join("");

    var tokenField = tokenInput.closest(".acf-field");
    (tokenField || group.querySelector(".inside") || group).insertAdjacentElement("afterend", panel);

    var urlInput = panel.querySelector(".quiroz-brochure-url");
    var openButton = panel.querySelector(".quiroz-brochure-open");
    var copyButton = panel.querySelector(".quiroz-brochure-copy");
    var status = panel.querySelector(".quiroz-brochure-status");

    function update() {
      var token = tokenInput.value.trim();
      var enabled = !enabledInput || enabledInput.checked;
      var url = slug && token
        ? "https://quirozautomotriz.cl/informe/" + encodeURIComponent(slug) + "?k=" + encodeURIComponent(token)
        : "";

      urlInput.value = url;
      openButton.href = url || "#";
      openButton.style.pointerEvents = url && enabled ? "auto" : "none";
      openButton.style.opacity = url && enabled ? "1" : ".5";
      copyButton.disabled = !(url && enabled);
      status.textContent = !enabled
        ? "Catálogo deshabilitado"
        : !token
          ? "Agrega un token privado"
          : !slug
            ? "Guarda el vehículo para generar el enlace"
            : "Listo para compartir";
    }

    copyButton.addEventListener("click", function () {
      var url = urlInput.value;
      if (!url) return;

      var copied = navigator.clipboard && window.isSecureContext
        ? navigator.clipboard.writeText(url)
        : Promise.reject();

      copied.catch(function () {
        urlInput.focus();
        urlInput.select();
        document.execCommand("copy");
      }).finally(function () {
        copyButton.textContent = "Enlace copiado";
        window.setTimeout(function () {
          copyButton.textContent = "Copiar enlace";
        }, 1800);
      });
    });

    tokenInput.addEventListener("input", update);
    if (enabledInput) enabledInput.addEventListener("change", update);
    update();
  });
})();
