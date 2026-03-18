const BACKEND_URL = "http://3.109.212.103";

// --- AUTH LOGIC ---

async function handleAuth(event) {
  if (event) event.preventDefault();

  // Check if we are in Sign Up mode (if the Name field is visible)
  const nameField = document.getElementById("group-name");
  const isSignUp = nameField && !nameField.classList.contains("hidden");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (isSignUp) {
    const username = document.getElementById("fullName").value;
    updateDevMonitor(`Initiating Sign-Up for ${username}...`);
    await registerUser(username, email, password);
  } else {
    const username = email.split("@")[0]; // Fallback if name not available
    updateDevMonitor(`Initiating Login for ${email}...`);
    await loginUser(email, password);
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
      updateDevMonitor("✅ RDS: User Saved | Kafka: Event Produced");
      alert(`Shabaash Aayush! User ${username} registered.`);
      window.location.href = "index.html";
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
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("foodapp_user", data.username);
      updateDevMonitor(`✅ Welcome back ${data.username}! JWT Verified.`);
      window.location.href = "index.html";
    } else {
      alert("Invalid credentials!");
      updateDevMonitor("❌ Login Denied: Unauthorized.");
    }
  } catch (error) {
    updateDevMonitor("❌ Backend Offline!");
  }
}

// --- RECRUITER MONITOR LOGIC ---

async function updateDevMonitor(eventMsg) {
  const feed = document.getElementById("event-feed");
  const status = document.getElementById("ngrok-status");
  if (!status) return;

  // 🔥 FIXED: Check health using our new dedicated route
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

// Auto-check status every 15 seconds to keep ngrok alive
setInterval(() => updateDevMonitor(), 15000);

document.addEventListener("DOMContentLoaded", () => {
  updateDevMonitor("System Ready.");

  // Attach event listener to the form if it exists
  const authForm = document.getElementById("auth-form");
  if (authForm) {
    authForm.addEventListener("submit", handleAuth);
  }
});
