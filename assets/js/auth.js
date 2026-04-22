const BACKEND_URL = "http://65.2.37.48";

// --- CUSTOM AUTH LOGIC ---
async function handleAuth(event) {
  if (event) event.preventDefault();

  const submitBtn = document.getElementById("submit-btn");
  const spinner = submitBtn.querySelector(".spinner");
  const btnText = submitBtn.querySelector(".btn-text");

  // UI Feedback: Button ko loading state mein dalo
  if (spinner) spinner.classList.remove("hidden");
  if (btnText) btnText.innerText = "Authenticating...";

  // Nayi IDs se value pick karo
  const username = document.getElementById("user-full-name").value;
  const email = document.getElementById("user-email-address").value;

  if (username && email) {
    // 🚀 JWT Creation (Instant Generation)
    const mockPayload = btoa(
      JSON.stringify({
        name: username,
        email: email,
        iat: Math.floor(Date.now() / 1000),
      }),
    );
    const manualToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${mockPayload}.Verified_By_Aayush_Core`;

    // LocalStorage mein data save karo
    localStorage.setItem("authToken", manualToken);
    localStorage.setItem("foodapp_user", username);
    localStorage.setItem("user_email", email);

    // Chota sa delay (sirf real feel ke liye, slow karne ke liye nahi)
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 400);
  } else {
    alert("Bhai, dono fields bharna zaroori hai!");
    if (spinner) spinner.classList.add("hidden");
    if (btnText) btnText.innerText = "Log In";
  }
}

async function registerUser(username, email, password) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (response.ok && data.status === "success") {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("foodapp_user", username);
      localStorage.setItem("user_email", email); // Dynamic Email Save
      updateDevMonitor("✅ RDS: User Saved | Kafka: Event Produced");
      alert(`New User ${username} registered. Please login now.`);
      window.location.reload();
    }
  } catch (error) {
    updateDevMonitor("❌ Registration Failed! Check Backend Logs.");
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok && data.status === "success") {
      // AGAR BACKEND TOKEN BHEJ RAHA HAI TO WO USE KARO, WARNA DYNAMIC MOCK BANAAO
      const manualToken =
        data.token ||
        `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ email, user: data.username }))}.Manual_Signature`;

      localStorage.setItem("authToken", manualToken);
      localStorage.setItem("foodapp_user", data.username);
      localStorage.setItem("user_email", email);

      updateDevMonitor(
        `✅ Welcome ${data.username}! Manual HS256 Token Active.`,
      );
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid credentials!");
    }
  } catch (error) {
    console.error("Login Error:", error);
    updateDevMonitor("❌ Backend Offline: Using Local Session...");

    // INTERVIEWER FLEX: Agar backend offline hai toh bhi unhe flow dikhane ke liye mock set kar do
    const fallbackToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.Offline_Payload.Sig`;
    localStorage.setItem("authToken", fallbackToken);
    localStorage.setItem("foodapp_user", "Guest_User");
    window.location.href = "dashboard.html";
  }
}

// --- SMART MOCK GOOGLE OAUTH FLOW ---

function handleGoogleLogin() {
  updateDevMonitor("Initializing Google OAuth 2.0...");
  alert(
    "System Notice: Project deployed on HTTP EC2 Instance. Real Google OAuth requires HTTPS domain.\n\nSimulating JWT authentication flow for Architecture Demonstration.",
  );

  updateDevMonitor(
    "⚠️ HTTP Environment Detected. Bypassing UI & Simulating Auth...",
  );

  setTimeout(() => {
    // Creating a mock JWT with user data encoded
    const mockJWT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnb29nbGUtY2hlY2siLCJuYW1lIjoiR29vZ2xlIEd1ZXN0IiwiZW1haWwiOiJnb29nbGVAZXhhbXBsZS5jb20ifQ";
    updateDevMonitor("✅ Google OAuth Simulated Success! JWT Stored.");

    localStorage.setItem("authToken", mockJWT);
    localStorage.setItem("foodapp_user", "Google Guest");
    localStorage.setItem("user_email", "google_user@gmail.com");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  }, 1500);
}

// --- SMART MOCK ENTERPRISE SSO (AUTH0/OKTA) ---
function handleAuth0Login() {
  updateDevMonitor("Initializing Enterprise SSO (Auth0/Okta)...");
  alert(
    "Enterprise SSO Notice: Secure OIDC/SAML policies prevent real Auth0 callbacks on non-HTTPS public IPs.\n\nSimulating Enterprise JWT flow for B2B Architecture Demonstration.",
  );

  updateDevMonitor(
    "⚠️ HTTP Environment: Bypassing Okta Gateway & Simulating Auth...",
  );

  setTimeout(() => {
    const mockSSO_JWT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlbnRlcnByaXNlLWNoZWNrIiwibmFtZSI6IkNvcnBvcmF0ZSBVc2VyIiwiZW1haWwiOiJjb3Jwb3JhdGVAZGV2LmNvbSJ9";
    updateDevMonitor("✅ Auth0 SSO Simulated Success! Enterprise JWT Stored.");

    localStorage.setItem("authToken", mockSSO_JWT);
    localStorage.setItem("foodapp_user", "Corporate User");
    localStorage.setItem("user_email", "sso_admin@enterprise.com");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  }, 1500);
}

// --- RECRUITER MONITOR LOGIC ---

async function updateDevMonitor(eventMsg) {
  const feed = document.getElementById("event-feed");
  const status = document.getElementById("ngrok-status");
  if (!status) return;

  try {
    const healthCheck = await fetch(`${BACKEND_URL}/api/health`);
    if (healthCheck.ok) {
      status.innerText = "CONNECTED";
      status.style.color = "#00ff00";

      
    } else {
      throw new Error();
    }
  } catch (err) {
    status.innerText = "OFFLINE";
    status.style.color = "#ff0000";
  }

  if (eventMsg && feed) {
    const time = new Date().toLocaleTimeString().split(" ")[0];
    feed.innerHTML = `> ${time}: ${eventMsg}<br>` + feed.innerHTML;
  }
}

setInterval(() => updateDevMonitor(), 15000);

document.addEventListener("DOMContentLoaded", () => {
  // updateDevMonitor("System Ready.");
  const authForm = document.getElementById("auth-form");
  if (authForm) {
    authForm.addEventListener("submit", handleAuth);
  }
});
