/** Lightweight session password gate. Password: pinic */
const GATE_KEY = "pin-ring-unlocked";
const PASS = "pinic";

function isUnlocked() {
  return sessionStorage.getItem(GATE_KEY) === "1";
}

function unlock() {
  sessionStorage.setItem(GATE_KEY, "1");
}

function tryKeyFromQuery() {
  try {
    const params = new URLSearchParams(location.search);
    const key = params.get("key");
    if (key === PASS) {
      unlock();
      params.delete("key");
      const q = params.toString();
      history.replaceState(
        null,
        "",
        location.pathname + (q ? `?${q}` : "") + location.hash,
      );
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

function showApp() {
  document.getElementById("gate")?.setAttribute("hidden", "");
  document.getElementById("app")?.removeAttribute("hidden");
}

function showGate() {
  document.getElementById("gate")?.removeAttribute("hidden");
  document.getElementById("app")?.setAttribute("hidden", "");
}

function acceptPassword(val) {
  if ((val || "").trim() === PASS) {
    unlock();
    window.dispatchEvent(new CustomEvent("pin-unlocked"));
    showApp();
    return true;
  }
  window.dispatchEvent(
    new CustomEvent("radial-gate-error", {
      detail: { message: "Неверный пароль" },
    }),
  );
  return false;
}

export function initAuth() {
  if (tryKeyFromQuery() || isUnlocked()) {
    showApp();
    return true;
  }

  showGate();

  const form = document.getElementById("gate-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("gate-pass");
    acceptPassword(input?.value || "");
  });

  window.addEventListener("radial-gate-submit", (e) => {
    const password = e.detail?.password ?? "";
    acceptPassword(password);
  });

  // Focus once Fluid gate mounts (scrubbers.js after app.js)
  const focusPass = () => document.getElementById("gate-pass")?.focus?.();
  requestAnimationFrame(focusPass);
  setTimeout(focusPass, 50);

  return false;
}
