(function (global) {
  function createAuthApp({
    documentRef = global.document,
    localStorageRef = global.localStorage,
    fetchImpl = global.fetch,
  } = {}) {
    if (!documentRef || !localStorageRef) {
      throw new Error("Auth app requires document and localStorage");
    }
    const storageKeys = {
      accessToken: "authLabAccessToken",
      refreshToken: "authLabRefreshToken",
      challengeId: "authLabChallengeId",
      lastCode: "authLabLastCode",
      lastEmail: "authLabLastEmail",
      currentView: "authLabCurrentView",
    };

    const state = {
      accessToken: localStorageRef.getItem(storageKeys.accessToken) || "",
      refreshToken: localStorageRef.getItem(storageKeys.refreshToken) || "",
      challengeId: localStorageRef.getItem(storageKeys.challengeId) || "",
      lastCode: localStorageRef.getItem(storageKeys.lastCode) || "",
      lastEmail: localStorageRef.getItem(storageKeys.lastEmail) || "",
      currentView: localStorageRef.getItem(storageKeys.currentView) || "register",
      isBusy: false,
    };

    const apiBase = "/api/auth";
    const flowOrder = [
      "register",
      "verify-email",
      "login",
      "login-code",
      "forgot-password",
      "reset-password",
      "session",
    ];
    const flowTitles = {
      register: {
        title: "Create your account",
        subtitle:
          "Start with your details and continue through the same journey a customer would use.",
      },
      "verify-email": {
        title: "Verify your email",
        subtitle: "Enter the code that was sent to your inbox.",
      },
      login: {
        title: "Sign in",
        subtitle: "Use your email and password to continue.",
      },
      "login-code": {
        title: "Enter one-time code",
        subtitle: "Finish sign-in with the verification code from your email.",
      },
      "forgot-password": {
        title: "Recover your password",
        subtitle: "Request a reset code and continue the recovery flow.",
      },
      "reset-password": {
        title: "Choose a new password",
        subtitle: "Use the reset code and set a new password for your account.",
      },
      session: {
        title: "Session ready",
        subtitle: "You are signed in and can manage the session like a real user.",
      },
    };

    const responseBox = documentRef.getElementById("responseBox");
    const previewBox = documentRef.getElementById("previewBox");
    const stateBox = documentRef.getElementById("stateBox");
    const sessionLabel = documentRef.getElementById("sessionLabel");
    const apiBaseLabel = documentRef.getElementById("apiBaseLabel");
    const flowTitle = documentRef.getElementById("flowTitle");
    const flowSubtitle = documentRef.getElementById("flowSubtitle");
    const flowStep = documentRef.getElementById("flowStep");
    const flowMessage = documentRef.getElementById("flowMessage");
    const progressFill = documentRef.getElementById("progressFill");

    const forms = Array.from(documentRef.querySelectorAll("form"));
    const stepButtons = Array.from(documentRef.querySelectorAll("[data-step]"));
    const flowCards = Array.from(documentRef.querySelectorAll(".flow-card"));
    const passwordToggles = Array.from(
      documentRef.querySelectorAll('[data-action="toggle-password"]'),
    );

    if (apiBaseLabel) {
      apiBaseLabel.textContent = apiBase;
    }

    function persist() {
      localStorageRef.setItem(storageKeys.accessToken, state.accessToken || "");
      localStorageRef.setItem(storageKeys.refreshToken, state.refreshToken || "");
      localStorageRef.setItem(storageKeys.challengeId, state.challengeId || "");
      localStorageRef.setItem(storageKeys.lastCode, state.lastCode || "");
      localStorageRef.setItem(storageKeys.lastEmail, state.lastEmail || "");
      localStorageRef.setItem(storageKeys.currentView, state.currentView || "register");
      renderState();
    }

    function renderState() {
      if (sessionLabel) {
        sessionLabel.textContent = state.accessToken ? "signed in" : "empty";
      }

      if (stateBox) {
        stateBox.textContent = JSON.stringify(
          {
            accessToken: state.accessToken || null,
            refreshToken: state.refreshToken || null,
            challengeId: state.challengeId || null,
            lastCode: state.lastCode || null,
            lastEmail: state.lastEmail || null,
            currentView: state.currentView || null,
          },
          null,
          2,
        );
      }
    }

    function setBusy(value) {
      state.isBusy = Boolean(value);
      forms.forEach((form) => {
        Array.from(form.querySelectorAll("button, input, select, textarea")).forEach(
          (control) => {
            if (control.hasAttribute("data-preserve-enabled")) return;
            control.disabled = state.isBusy;
          },
        );
      });
    }

    function showResponse(value) {
      if (!responseBox) return;
      responseBox.textContent =
        typeof value === "string" ? value : JSON.stringify(value, null, 2);
    }

    function showPreview(value) {
      if (!previewBox) return;
      previewBox.textContent = value
        ? JSON.stringify(value, null, 2)
        : "No preview yet.";
    }

    function describeExpiry(preview) {
      if (!preview || typeof preview !== "object") return "";

      const expiryAt = preview.expiresAt;
      const expiresInMinutes =
        preview.expiresInMinutes ?? preview.expiresInSeconds / 60;
      if (!expiryAt && !Number.isFinite(expiresInMinutes)) return "";

      if (expiryAt) {
        const parsed = new Date(expiryAt);
        return parsed.toString() !== "Invalid Date"
          ? `Code expires at ${parsed.toLocaleString()}.`
          : "";
      }

      return `Code expires in ${Math.max(0, Math.round(expiresInMinutes))} minutes.`;
    }

    function setFlowMessage(message, tone = "info") {
      if (!flowMessage) return;
      flowMessage.textContent = message || "";
      flowMessage.className = "flow-banner";
      if (tone === "success") flowMessage.classList.add("success");
      if (tone === "error") flowMessage.classList.add("error");
      if (tone === "info") flowMessage.classList.add("info");
    }

    function updateProgress(view) {
      const index = Math.max(0, flowOrder.indexOf(view));
      const progress = progressFill
        ? ((index + 1) / flowOrder.length) * 100
        : 0;
      if (progressFill) {
        progressFill.style.width = `${progress}%`;
      }
      stepButtons.forEach((button) => {
        button.classList.toggle("active", button.getAttribute("data-step") === view);
      });
    }

    function setView(view, { persistView = true } = {}) {
      state.currentView = flowOrder.includes(view) ? view : "register";
      flowCards.forEach((card) => {
        card.classList.toggle(
          "active",
          card.getAttribute("data-view") === state.currentView,
        );
      });

      const current = flowTitles[state.currentView] || flowTitles.register;
      if (flowTitle) flowTitle.textContent = current.title;
      if (flowSubtitle) flowSubtitle.textContent = current.subtitle;
      if (flowStep) {
        const index = flowOrder.indexOf(state.currentView);
        flowStep.textContent =
          index >= 0 ? `Step ${index + 1} / ${flowOrder.length}` : "Step 1 / 6";
      }

      updateProgress(state.currentView);
      if (persistView) persist();
    }

    function focusFirstInput(view) {
      const card = documentRef.querySelector(`.flow-card[data-view="${view}"]`);
      const input = card ? card.querySelector("input, select, textarea") : null;
      if (input && typeof input.focus === "function") {
        window.setTimeout(() => input.focus(), 0);
      }
    }

    function announceAndNavigate(view, message, tone = "info") {
      setView(view);
      if (message) setFlowMessage(message, tone);
      focusFirstInput(view);
    }

    async function request(path, options = {}) {
      const response = await fetchImpl(`${apiBase}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        },
        credentials: "include",
        ...options,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const contentType = response.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const error = new Error(
          (payload && payload.message) || response.statusText || "Request failed",
        );
        error.payload = payload;
        error.status = response.status;
        throw error;
      }

      return payload;
    }

    function formData(form) {
      if (!form) return {};
      if (typeof global.FormData === "function" && form instanceof global.FormData) {
        return Object.fromEntries(form.entries());
      }
      if (form && typeof form.entries === "function") {
        return Object.fromEntries(form.entries());
      }
      if (form && typeof form.data === "object" && form.data !== null) {
        return { ...form.data };
      }
      if (form && typeof form.getAttribute === "function") {
        return Object.fromEntries(new global.FormData(form).entries());
      }
      return {};
    }

    function normalizePreview(result) {
      if (!result || typeof result !== "object") return result;
      if (result.developmentPreview) {
        return { ...result, developmentPreview: result.developmentPreview };
      }
      return result;
    }
    function syncPreviewFromResult(result) {
      const preview = result?.developmentPreview || result?.preview || null;
      showPreview(preview);
      if (!preview) return;

      const expiryMessage = describeExpiry(preview);
      if (expiryMessage) {
        setFlowMessage(expiryMessage, "info");
      }

      if (preview.verificationCode) {
        state.lastCode = preview.verificationCode;
        const codeField = documentRef.querySelector(
          '#verifyEmailForm [name="code"]',
        );
        if (codeField) codeField.value = preview.verificationCode;
      }

      if (preview.resetCode) {
        state.lastCode = preview.resetCode;
        const codeField = documentRef.querySelector(
          '#resetPasswordForm [name="code"]',
        );
        if (codeField) codeField.value = preview.resetCode;
      }

      if (preview.code && preview.challengeId) {
        state.challengeId = preview.challengeId;
        const challengeField = documentRef.querySelector(
          '#verifyCodeForm [name="challengeId"]',
        );
        const codeField = documentRef.querySelector('#verifyCodeForm [name="code"]');
        if (challengeField) challengeField.value = preview.challengeId;
        if (codeField) codeField.value = preview.code;
      }

      persist();
    }

    function setFieldValue(selector, value) {
      const field = documentRef.querySelector(selector);
      if (field) field.value = value;
    }

    function fillRegisterDemo(kind = "customer") {
      const isPartner = kind === "partner";
      setFieldValue('#registerForm [name="name"]', isPartner ? "Partner User" : "Test User");
      setFieldValue(
        '#registerForm [name="email"]',
        isPartner ? "partner.user@example.com" : "test.user@example.com",
      );
      setFieldValue('#registerForm [name="password"]', isPartner ? "Partner@123" : "Abhi@1234");
      setFieldValue('#registerForm [name="role"]', kind);
      setFieldValue('#registerForm [name="phone"]', isPartner ? "9876543210" : "9998887776");
      setFieldValue(
        '#registerForm [name="companyName"]',
        isPartner ? "Harghar Services" : "",
      );
      setView("register");
      setFlowMessage(
        isPartner
          ? "Partner demo data is ready. Submit to create a partner account."
          : "Customer demo data is ready. Submit to create an account.",
        "success",
      );
      focusFirstInput("register");
    }

    function fillLoginDemo() {
      setFieldValue('#loginForm [name="email"]', state.lastEmail || "test.user@example.com");
      setFieldValue('#loginForm [name="password"]', "Abhi@1234");
      setView("login");
      setFlowMessage("Sign-in demo data is ready.", "success");
      focusFirstInput("login");
    }

    function fillRecoveryDemo() {
      setFieldValue(
        '#forgotPasswordForm [name="email"]',
        state.lastEmail || "test.user@example.com",
      );
      setView("forgot-password");
      setFlowMessage("Recovery email is ready.", "success");
      focusFirstInput("forgot-password");
    }

    function fillResetDemo() {
      setFieldValue('#resetPasswordForm [name="code"]', state.lastCode || "");
      setFieldValue('#resetPasswordForm [name="password"]', "NewPass@123");
      setView("reset-password");
      setFlowMessage("Reset demo data is ready.", "success");
      focusFirstInput("reset-password");
    }

    function togglePasswordVisibility(trigger) {
      const label = trigger.closest(".password-field");
      const input = label ? label.querySelector('input[type="password"], input[type="text"]') : null;
      if (!input) return;
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      trigger.textContent = isHidden ? "Hide" : "Show";
    }

    function wireJumpButtons(selector, targetView, message) {
      Array.from(documentRef.querySelectorAll(selector)).forEach((button) => {
        button.addEventListener("click", () => {
          announceAndNavigate(targetView, message || flowTitles[targetView].subtitle, "info");
        });
      });
    }

    const registerForm = documentRef.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = formData(event.currentTarget);
        data.role = data.role || "customer";
        data.experienceYears = data.experienceYears ? Number(data.experienceYears) : undefined;
        data.maxConcurrentJobs = data.maxConcurrentJobs
          ? Number(data.maxConcurrentJobs)
          : undefined;

        try {
          setBusy(true);
          const result = await request("/register", {
            method: "POST",
            body: data,
          });
          state.lastEmail = data.email;
          syncPreviewFromResult(result);
          setView("verify-email");
          setFlowMessage(
            result?.message ||
              "Account created. Check your inbox for the verification code.",
            "success",
          );
          showResponse(normalizePreview(result));
        } catch (error) {
          setView("register");
          setFlowMessage(error.message || "Registration could not be completed.", "error");
          showResponse({
            error: error.message,
            payload: error.payload || null,
          });
        } finally {
          setBusy(false);
          renderState();
        }
      });
    }

    const verifyEmailForm = documentRef.getElementById("verifyEmailForm");
    if (verifyEmailForm) {
      verifyEmailForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const { code } = formData(event.currentTarget);
        try {
          setBusy(true);
          const result = await request("/verify-email", {
            method: "POST",
            body: { code },
          });
          state.lastCode = code;
          setView("login");
          setFlowMessage(
            result?.message || "Email verified successfully. You can now sign in.",
            "success",
          );
          showPreview(null);
          persist();
          showResponse(result);
        } catch (error) {
          setFlowMessage(
            error.message || "The verification code was invalid or expired.",
            "error",
          );
          showResponse({
            error: error.message,
            payload: error.payload || null,
          });
        } finally {
          setBusy(false);
        }
      });
    }

    const resendVerificationButton = documentRef.getElementById("resendVerificationButton");
    if (resendVerificationButton) {
      resendVerificationButton.addEventListener("click", async () => {
        const email = state.lastEmail || "";
        if (!email) {
          setFlowMessage("Enter your email on the registration step first.", "error");
          return;
        }

        try {
          setBusy(true);
          const result = await request("/resend-verification", {
            method: "POST",
            body: { email },
          });
          syncPreviewFromResult(result);
          setFlowMessage(
            result?.message || "A fresh verification code has been sent to your inbox.",
            "success",
          );
          showResponse(result);
        } catch (error) {
          setFlowMessage(
            error.message || "We could not resend the verification code.",
            "error",
          );
          showResponse({
            error: error.message,
            payload: error.payload || null,
          });
        } finally {
          setBusy(false);
        }
      });
    }

    const loginForm = documentRef.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = formData(event.currentTarget);
        try {
          setBusy(true);
          const result = await request("/login", {
            method: "POST",
            body: data,
          });
          if (result.accessToken) state.accessToken = result.accessToken;
          if (result.refreshToken) state.refreshToken = result.refreshToken;
          if (result.challengeId) state.challengeId = result.challengeId;
          state.lastEmail = data.email;
          syncPreviewFromResult(result);
          setView("login-code");
          setFlowMessage(
            result?.message || "Check your email for the sign-in verification code.",
            "success",
          );
          persist();
          showResponse(result);
        } catch (error) {
          setFlowMessage(error.message || "Sign-in could not be completed.", "error");
          showResponse({
            error: error.message,
            payload: error.payload || null,
          });
        } finally {
          setBusy(false);
        }
      });
    }

    const verifyCodeForm = documentRef.getElementById("verifyCodeForm");
    if (verifyCodeForm) {
      verifyCodeForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = formData(event.currentTarget);
        if (!data.challengeId && state.challengeId) {
          data.challengeId = state.challengeId;
        }

        try {
          setBusy(true);
          const result = await request("/login/verify-code", {
            method: "POST",
            body: data,
          });
          if (result.accessToken) state.accessToken = result.accessToken;
          if (result.refreshToken) state.refreshToken = result.refreshToken;
          setView("session");
          setFlowMessage(
            result?.message || "Signed in successfully. Your session is now active.",
            "success",
          );
          showPreview(null);
          persist();
          showResponse(result);
        } catch (error) {
          setFlowMessage(error.message || "The one-time code was invalid.", "error");
          showResponse({
            error: error.message,
            payload: error.payload || null,
          });
        } finally {
          setBusy(false);
        }
      });
    }

    const resendLoginCodeButton = documentRef.querySelector(
      '[data-action="resend-login-code"]',
    );
    if (resendLoginCodeButton) {
      resendLoginCodeButton.addEventListener("click", async () => {
        if (!state.challengeId) {
          setFlowMessage("Sign in first so we have a challenge ID to resend.", "error");
          return;
        }
        try {
          setBusy(true);
          const result = await request("/login/resend-code", {
            method: "POST",
            body: { challengeId: state.challengeId },
          });
          syncPreviewFromResult(result);
          setFlowMessage(
            result?.message || "A new sign-in code was sent to your inbox.",
            "success",
          );
          showResponse(result);
        } catch (error) {
          setFlowMessage(error.message || "We could not resend the sign-in code.", "error");
          showResponse({
            error: error.message,
            payload: error.payload || null,
          });
        } finally {
          setBusy(false);
        }
      });
    }

    const forgotPasswordForm = documentRef.getElementById("forgotPasswordForm");
    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = formData(event.currentTarget);
        try {
          setBusy(true);
          const result = await request("/forgot-password", {
            method: "POST",
            body: data,
          });
          state.lastEmail = data.email;
          syncPreviewFromResult(result);
          setView("reset-password");
          setFlowMessage(
            result?.message || "A password reset code has been sent to your email.",
            "success",
          );
          showResponse(result);
        } catch (error) {
          setFlowMessage(
            error.message || "We could not start the password reset flow.",
            "error",
          );
          showResponse({
            error: error.message,
            payload: error.payload || null,
          });
        } finally {
          setBusy(false);
        }
      });
    }

    const resetPasswordForm = documentRef.getElementById("resetPasswordForm");
    if (resetPasswordForm) {
      resetPasswordForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = formData(event.currentTarget);
        try {
          setBusy(true);
          const result = await request("/reset-password", {
            method: "POST",
            body: data,
          });
          state.lastCode = data.code;
          setView("login");
          setFlowMessage(
            result?.message || "Password updated successfully. Please sign in again.",
            "success",
          );
          showPreview(null);
          persist();
          showResponse(result);
        } catch (error) {
          setFlowMessage(error.message || "The reset code was invalid.", "error");
          showResponse({
            error: error.message,
            payload: error.payload || null,
          });
        } finally {
          setBusy(false);
        }
      });
    }

    const sessionForm = documentRef.getElementById("sessionForm");
    if (sessionForm) {
      sessionForm.addEventListener("submit", (event) => {
        event.preventDefault();
      });
    }

    const meButton = documentRef.querySelector('[data-action="me"]');
    if (meButton) {
      meButton.addEventListener("click", async () => {
        try {
          setBusy(true);
          const result = await request("/me", {
            method: "GET",
            token: state.accessToken,
          });
          showResponse(result);
          setFlowMessage("Your profile was loaded successfully.", "success");
        } catch (error) {
          setFlowMessage(error.message || "Could not load your profile.", "error");
          showResponse({
            error: error.message,
            payload: error.payload || null,
          });
        } finally {
          setBusy(false);
        }
      });
    }

    const refreshButton = documentRef.querySelector('[data-action="refresh"]');
    if (refreshButton) {
      refreshButton.addEventListener("click", async () => {
        try {
          setBusy(true);
          const result = await request("/refresh", {
            method: "POST",
            body: { refreshToken: state.refreshToken },
          });
          if (result.accessToken) state.accessToken = result.accessToken;
          if (result.refreshToken) state.refreshToken = result.refreshToken;
          persist();
          showResponse(result);
          setFlowMessage("Your session was refreshed successfully.", "success");
        } catch (error) {
          setFlowMessage(error.message || "Your session could not be refreshed.", "error");
          showResponse({
            error: error.message,
            payload: error.payload || null,
          });
        } finally {
          setBusy(false);
        }
      });
    }

    const logoutButton = documentRef.querySelector('[data-action="logout"]');
    if (logoutButton) {
      logoutButton.addEventListener("click", async () => {
        try {
          setBusy(true);
          const result = await request("/logout", {
            method: "POST",
            body: { refreshToken: state.refreshToken },
          });
          state.accessToken = "";
          state.refreshToken = "";
          setView("register");
          setFlowMessage(result?.message || "You have been signed out.", "success");
          persist();
          showResponse(result);
        } catch (error) {
          setFlowMessage(error.message || "Logout failed.", "error");
          showResponse({
            error: error.message,
            payload: error.payload || null,
          });
        } finally {
          setBusy(false);
        }
      });
    }

    const clearButton = documentRef.querySelector('[data-action="clear-all"]');
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        state.accessToken = "";
        state.refreshToken = "";
        state.challengeId = "";
        state.lastCode = "";
        state.lastEmail = "";
        state.currentView = "register";
        Object.values(storageKeys).forEach((key) => localStorageRef.removeItem(key));
        setView("register", { persistView: false });
        setFlowMessage(
          "The local session was cleared. You can start a new auth flow.",
          "success",
        );
        renderState();
        showResponse("Local state cleared.");
        showPreview(null);
      });
    }

    const copyButton = documentRef.querySelector('[data-action="copy-state"]');
    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        const snapshot = {
          accessToken: state.accessToken || null,
          refreshToken: state.refreshToken || null,
          challengeId: state.challengeId || null,
          lastCode: state.lastCode || null,
          lastEmail: state.lastEmail || null,
          currentView: state.currentView || null,
        };
        const payload = JSON.stringify(snapshot, null, 2);
        try {
          if (global.navigator?.clipboard?.writeText) {
            await global.navigator.clipboard.writeText(payload);
            showResponse({ copied: true, snapshot });
            setFlowMessage(
              "The session snapshot was copied to your clipboard.",
              "success",
            );
          } else {
            showResponse(payload);
            setFlowMessage(
              "Clipboard access is unavailable, so the snapshot is shown in the response panel.",
              "info",
            );
          }
        } catch (error) {
          showResponse(payload);
          setFlowMessage(
            "Clipboard access was blocked, so the snapshot is shown in the response panel.",
            "info",
          );
        }
      });
    }

    stepButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.getAttribute("data-step") || "register";
        setView(target);
        setFlowMessage(flowTitles[target].subtitle, "info");
        focusFirstInput(target);
      });
    });

    wireJumpButtons('[data-action="jump-register"]', "register", "Back to registration.");
    wireJumpButtons('[data-action="jump-login"]', "login", "Go to sign in.");
    wireJumpButtons('[data-action="jump-recovery"]', "forgot-password", "Open account recovery.");

    Array.from(documentRef.querySelectorAll('[data-action="demo-register"]')).forEach(
      (button) => {
        button.addEventListener("click", () => fillRegisterDemo("customer"));
      },
    );
    Array.from(documentRef.querySelectorAll('[data-action="fill-customer"]')).forEach(
      (button) => {
        button.addEventListener("click", () => fillRegisterDemo("customer"));
      },
    );
    Array.from(documentRef.querySelectorAll('[data-action="fill-partner"]')).forEach(
      (button) => {
        button.addEventListener("click", () => fillRegisterDemo("partner"));
      },
    );
    Array.from(documentRef.querySelectorAll('[data-action="demo-login"]')).forEach(
      (button) => {
        button.addEventListener("click", fillLoginDemo);
      },
    );
    Array.from(documentRef.querySelectorAll('[data-action="demo-recovery"]')).forEach(
      (button) => {
        button.addEventListener("click", fillRecoveryDemo);
      },
    );
    Array.from(documentRef.querySelectorAll('[data-action="demo-reset"]')).forEach(
      (button) => {
        button.addEventListener("click", fillResetDemo);
      },
    );

    passwordToggles.forEach((button) => {
      button.addEventListener("click", () => togglePasswordVisibility(button));
    });

    setView(state.currentView || "register", { persistView: false });
    setFlowMessage(
      "Use the quick actions to move through the flow like a real customer.",
      "info",
    );
    renderState();
    showPreview(null);

    return {
      state,
      request,
      syncPreviewFromResult,
      persist,
      renderState,
      showResponse,
      showPreview,
      setView,
      setFlowMessage,
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { createAuthApp };
  }

  if (typeof global.document !== "undefined" && global.document.getElementById) {
    createAuthApp();
  }
})(typeof window !== "undefined" ? window : globalThis);
