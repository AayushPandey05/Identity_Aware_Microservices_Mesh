document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btn-login");
  const btnSignup = document.getElementById("btn-signup");
  const formTitle = document.getElementById("form-title");
  const formSubtitle = document.getElementById("form-subtitle");
  const groupName = document.getElementById("group-name");
  const submitText = document.getElementById("submit-text");
  const authForm = document.getElementById("auth-form");
  const submitBtn = document.getElementById("submit-btn");
  const spinner = submitBtn.querySelector(".spinner");

  // Social Buttons
  const googleBtn = document.querySelector(".google-btn");
  const oktaBtn = document.querySelector(".sso-btn");
  const auth0Btn = document.querySelector(".auth0-btn");
  const toastContainer = document.getElementById("toast-container");

  // Google Modal Elements
  const googleModalBackdrop = document.getElementById("google-modal-backdrop");
  const googleModal = document.getElementById("google-modal");
  const googleAccounts = document.querySelectorAll(".google-account-item");

  let isLoginMode = true;

  // --- TOGGLE MODE LOGIC ---
  function setMode(login) {
    isLoginMode = login;
    if (login) {
      btnLogin.classList.add("active");
      btnSignup.classList.remove("active");
      formTitle.textContent = "Welcome Back";
      formSubtitle.textContent = "Please enter your details to sign in.";
      groupName.classList.add("hidden");
      document.getElementById("fullName").removeAttribute("required");
      submitText.textContent = "Log In";
    } else {
      btnSignup.classList.add("active");
      btnLogin.classList.remove("active");
      formTitle.textContent = "Create an Account";
      formSubtitle.textContent =
        "Sign up to get started with our food delivery.";
      groupName.classList.remove("hidden");
      document.getElementById("fullName").setAttribute("required", "true");
      submitText.textContent = "Sign Up";
    }
  }

  if (btnLogin) btnLogin.addEventListener("click", () => setMode(true));
  if (btnSignup) btnSignup.addEventListener("click", () => setMode(false));

  // --- FORM SUBMIT LOGIC ---
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // UI Loading state
      submitBtn.disabled = true;
      submitText.textContent = isLoginMode
        ? "Logging in..."
        : "Creating account...";
      spinner.classList.remove("hidden");

      const email = document.getElementById("email").value;
      let name = "User";

      if (!isLoginMode) {
        name = document.getElementById("fullName").value || "User";
      } else {
        name = email.split("@")[0];
      }

      // Simulate API Call (Sync with auth.js)
      setTimeout(() => {
        localStorage.setItem("foodapp_user", name);
        showToast("success", `Welcome, ${name}! Redirecting...`);

        setTimeout(() => {
          // 🔥 FIXED: Redirecting to dashboard.html instead of index.html
          window.location.href = "dashboard.html";
        }, 1500);
      }, 1200);
    });
  }

  // --- GOOGLE MODAL HANDLERS ---
  if (googleBtn) {
    googleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (googleModalBackdrop && googleModal) {
        googleModalBackdrop.classList.add("active");
        googleModal.classList.add("active");
      } else {
        // Fallback if modal elements aren't in HTML yet
        showToast("success", "Logging in with Google...");
        setTimeout(() => {
          localStorage.setItem("foodapp_user", "Google User");
          window.location.href = "dashboard.html";
        }, 1500);
      }
    });
  }

  if (googleModalBackdrop) {
    googleModalBackdrop.addEventListener("click", () => {
      googleModalBackdrop.classList.remove("active");
      googleModal.classList.remove("active");
    });
  }

  if (googleAccounts) {
    googleAccounts.forEach((account) => {
      account.addEventListener("click", () => {
        const name = account.getAttribute("data-name");
        if (name) {
          googleModalBackdrop.classList.remove("active");
          googleModal.classList.remove("active");
          showToast("success", `Logging in as ${name}...`);
          setTimeout(() => {
            localStorage.setItem("foodapp_user", name);
            // 🔥 FIXED: Redirecting to dashboard.html
            window.location.href = "dashboard.html";
          }, 1500);
        } else {
          showToast("error", "Add another account logic not implemented");
        }
      });
    });
  }

  // --- OKTA / SSO HANDLERS ---
  if (oktaBtn) {
    oktaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("success", "Redirecting to Okta Identity Cloud...");
      setTimeout(() => {
        localStorage.setItem("foodapp_user", "Okta User");
        // 🔥 FIXED: Redirecting to dashboard.html
        window.location.href = "dashboard.html";
      }, 1500);
    });
  }

  if (auth0Btn) {
    auth0Btn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("success", "Redirecting to Auth0...");
    });
  }

  // --- TOAST SYSTEM ---
  function showToast(type, message) {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fadeOut");
      toast.addEventListener("animationend", () => toast.remove());
    }, 3000);
  }
});
