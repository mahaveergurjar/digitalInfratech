const test = require("node:test");
const assert = require("node:assert/strict");
const { createAuthApp } = require("../frontend/app");

function createDom() {
  const elements = new Map();
  function makeElement(id) {
    const element = {
      id,
      textContent: "",
      value: "",
      listeners: {},
      addEventListener(type, handler) {
        this.listeners[type] = handler;
      },
      dispatchEvent(event) {
        const eventWithDefaults = {
          ...event,
          preventDefault() {},
          stopPropagation() {},
        };
        if (this.listeners[eventWithDefaults.type]) {
          this.listeners[eventWithDefaults.type](eventWithDefaults);
        }
      },
    };
    elements.set(id, element);
    return element;
  }

  function makeForm(id, data = {}) {
    const form = makeElement(id);
    form.data = data;
    return form;
  }

  const documentRef = {
    getElementById(id) {
      return elements.get(id) || null;
    },
    querySelector(selector) {
      if (selector === '[data-action="me"]')
        return elements.get("meButton") || null;
      if (selector === '[data-action="refresh"]')
        return elements.get("refreshButton") || null;
      if (selector === '[data-action="logout"]')
        return elements.get("logoutButton") || null;
      if (selector === '[data-action="clear-all"]')
        return elements.get("clearAllButton") || null;
      if (selector === '[data-action="copy-state"]')
        return elements.get("copyStateButton") || null;
      if (selector === '#verifyEmailForm [name="code"]')
        return elements.get("verifyCodeField") || null;
      if (selector === '#resetPasswordForm [name="code"]')
        return elements.get("resetCodeField") || null;
      if (selector === '#verifyCodeForm [name="challengeId"]')
        return elements.get("challengeIdField") || null;
      if (selector === '#verifyCodeForm [name="code"]')
        return elements.get("verifyLoginCodeField") || null;
      return null;
    },
  };

  makeElement("responseBox");
  makeElement("previewBox");
  makeElement("stateBox");
  makeElement("sessionLabel");
  makeElement("apiBaseLabel");
  makeForm("registerForm");
  makeForm("verifyEmailForm");
  makeForm("loginForm", { email: "", password: "" });
  makeForm("verifyCodeForm");
  makeForm("forgotPasswordForm");
  makeForm("resetPasswordForm");
  makeElement("sessionForm");
  makeElement("meButton");
  makeElement("refreshButton");
  makeElement("logoutButton");
  makeElement("clearAllButton");
  makeElement("copyStateButton");
  makeElement("verifyCodeField");
  makeElement("resetCodeField");
  makeElement("challengeIdField");
  makeElement("verifyLoginCodeField");

  return { documentRef, elements };
}

function createStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
  };
}

test("createAuthApp stores login preview data and populates the verification form", async () => {
  const { documentRef } = createDom();
  const storage = createStorage();
  const calls = [];
  const app = createAuthApp({
    documentRef,
    localStorageRef: storage,
    fetchImpl: async (url, options = {}) => {
      calls.push({ url, options });
      return {
        ok: true,
        headers: { get: () => "application/json" },
        json: async () => ({
          success: true,
          developmentPreview: { challengeId: "challenge-123", code: "654321" },
        }),
      };
    },
  });

  const loginForm = documentRef.getElementById("loginForm");
  loginForm.dispatchEvent({ type: "submit", currentTarget: loginForm });

  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(app.state.challengeId, "challenge-123");
  assert.equal(
    documentRef.getElementById("verifyLoginCodeField").value,
    "654321",
  );
  assert.equal(
    documentRef.getElementById("challengeIdField").value,
    "challenge-123",
  );
  assert.equal(storage.getItem("authLabChallengeId"), "challenge-123");
  assert.equal(
    calls[0].options.body,
    JSON.stringify({ email: "", password: "" }),
  );
});

test("createAuthApp surfaces request errors without pretending the flow succeeded", async () => {
  const { documentRef } = createDom();
  const storage = createStorage();
  const app = createAuthApp({
    documentRef,
    localStorageRef: storage,
    fetchImpl: async () => ({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: { get: () => "application/json" },
      json: async () => ({ message: "Invalid credentials" }),
    }),
  });

  const loginForm = documentRef.getElementById("loginForm");
  loginForm.dispatchEvent({ type: "submit", currentTarget: loginForm });

  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(app.state.accessToken, "");
  assert.equal(
    documentRef.getElementById("responseBox").textContent,
    JSON.stringify(
      {
        error: "Invalid credentials",
        payload: { message: "Invalid credentials" },
      },
      null,
      2,
    ),
  );
});
