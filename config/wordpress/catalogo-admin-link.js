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
    var initialToken = tokenInput.value.trim();
    var tokenPendingSave = false;

    tokenInput.readOnly = true;
    tokenInput.style.backgroundColor = "#f6f7f7";

    function generateSecureToken() {
      if (!window.crypto || !window.crypto.getRandomValues) return "";
      var bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      return "qz_" + Array.from(bytes, function (byte) {
        return byte.toString(16).padStart(2, "0");
      }).join("");
    }

    function prepareNewToken() {
      var token = generateSecureToken();
      if (!token) return false;
      tokenInput.value = token;
      tokenPendingSave = token !== initialToken;
      tokenInput.dispatchEvent(new Event("input", { bubbles: true }));
      tokenInput.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }

    var panel = document.createElement("div");
    panel.id = "quiroz-brochure-actions";
    panel.style.cssText = "margin:16px 12px 20px;padding:18px;border:1px solid #c3c4c7;border-left:4px solid #d63638;border-radius:6px;background:#fff;box-shadow:0 1px 1px rgba(0,0,0,.04)";
    panel.innerHTML = [
      '<strong style="display:block;font-size:14px;margin-bottom:6px">Enlace del brochure privado</strong>',
      '<p class="quiroz-brochure-help" style="margin:0 0 12px;color:#50575e">El acceso se genera automáticamente. Después de cualquier cambio, pulsa Actualizar antes de compartir.</p>',
      '<input class="quiroz-brochure-url" type="text" readonly style="width:100%;margin:0 0 12px;font-family:monospace" aria-label="Enlace privado del brochure">',
      '<div style="display:flex;flex-wrap:wrap;gap:8px">',
      '<a class="button button-primary quiroz-brochure-open" target="_blank" rel="noopener noreferrer">Ver brochure</a>',
      '<button type="button" class="button quiroz-brochure-copy">Copiar enlace</button>',
      '<button type="button" class="button quiroz-brochure-share">Compartir</button>',
      '<button type="button" class="button quiroz-brochure-regenerate">Regenerar acceso</button>',
      '<span class="quiroz-brochure-status" style="align-self:center;color:#646970"></span>',
      '</div>'
    ].join("");

    var tokenField = tokenInput.closest(".acf-field");
    (tokenField || group.querySelector(".inside") || group).insertAdjacentElement("afterend", panel);

    var urlInput = panel.querySelector(".quiroz-brochure-url");
    var openButton = panel.querySelector(".quiroz-brochure-open");
    var copyButton = panel.querySelector(".quiroz-brochure-copy");
    var shareButton = panel.querySelector(".quiroz-brochure-share");
    var regenerateButton = panel.querySelector(".quiroz-brochure-regenerate");
    var status = panel.querySelector(".quiroz-brochure-status");

    function update() {
      var token = tokenInput.value.trim();
      var enabled = !enabledInput || enabledInput.checked;
      var url = slug && token
        ? "https://quirozautomotriz.cl/informe/" + encodeURIComponent(slug) + "?k=" + encodeURIComponent(token)
        : "";

      urlInput.value = url;
      openButton.href = url || "#";
      var readyToShare = Boolean(url && enabled && !tokenPendingSave);
      openButton.style.pointerEvents = readyToShare ? "auto" : "none";
      openButton.style.opacity = readyToShare ? "1" : ".5";
      copyButton.disabled = !readyToShare;
      shareButton.disabled = !readyToShare;
      regenerateButton.disabled = !enabled;
      status.textContent = !enabled
        ? "Catálogo deshabilitado"
        : tokenPendingSave
          ? "Token generado: pulsa Actualizar"
        : !token
          ? "No se pudo generar el acceso seguro"
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

    shareButton.addEventListener("click", function () {
      var url = urlInput.value;
      if (!url) return;

      if (navigator.share) {
        navigator.share({
          title: "Brochure privado del vehículo",
          text: "Revisa el brochure privado de este vehículo",
          url: url
        }).catch(function (error) {
          if (!error || error.name !== "AbortError") status.textContent = "No se pudo compartir";
        });
        return;
      }

      var copied = navigator.clipboard && window.isSecureContext
        ? navigator.clipboard.writeText(url)
        : Promise.reject();

      copied.catch(function () {
        urlInput.focus();
        urlInput.select();
        document.execCommand("copy");
      }).finally(function () {
        shareButton.textContent = "Enlace copiado";
        window.setTimeout(function () {
          shareButton.textContent = "Compartir";
        }, 1800);
      });
    });

    regenerateButton.addEventListener("click", function () {
      var confirmed = window.confirm(
        "Al pulsar Actualizar, todos los enlaces compartidos anteriormente dejarán de funcionar. ¿Preparar un acceso nuevo?"
      );
      if (!confirmed) return;
      if (!prepareNewToken()) status.textContent = "El navegador no pudo generar un token seguro";
    });

    tokenInput.addEventListener("input", update);
    if (enabledInput) {
      enabledInput.addEventListener("change", function () {
        if (enabledInput.checked && !tokenInput.value.trim()) prepareNewToken();
        update();
      });
    }
    if ((!enabledInput || enabledInput.checked) && !initialToken) prepareNewToken();
    update();
  });
})();
