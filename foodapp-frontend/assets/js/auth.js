const BACKEND_URL = "https://synthia-semidivine-therese.ngrok-free.dev";

// --- AUTH LOGIC ---

async function handleAuth(event) {
  event.preventDefault();

  // Check if we are in Sign Up mode (if the Name field is visible)
  const isSignUp = !document
    .getElementById("group-name")
    ?.classList.contains("hidden");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (isSignUp) {
    const username = document.getElementById("fullName").value;
    updateDevMonitor(`Initiating Sign-Up for ${username}...`);
    await registerUser(username, email, password);
  } else {
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
    updateDevMonitor("❌ Connection Failed!");
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
    }
  } catch (error) {
    updateDevMonitor("❌ Backend Offline!");
  }
}

// --- RECRUITER MONITOR LOGIC ---

function updateDevMonitor(event) {
  const feed = document.getElementById("event-feed");
  const status = document.getElementById("ngrok-status");
  if (!feed || !status) return;

  // Check backend health
  fetch(BACKEND_URL + "/api/register", { method: "OPTIONS" })
    .then(() => {
      status.innerText = "CONNECTED";
      status.style.color = "#00ff00";
    })
    .catch(() => {
      status.innerText = "OFFLINE";
      status.style.color = "#ff0000";
    });

  if (event) {
    const time = new Date().toLocaleTimeString().split(" ")[0];
    feed.innerHTML = `> ${time}: ${event}<br>` + feed.innerHTML;
  }
}

// Auto-check status every 10 seconds
setInterval(() => updateDevMonitor(), 10000);
document.addEventListener("DOMContentLoaded", () =>
  updateDevMonitor("System Ready."),
);
