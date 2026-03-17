const BACKEND_URL = "https://synthia-semidivine-therese.ngrok-free.dev";

async function handleAuth(event) {
  event.preventDefault();

  const isSignUp = !document
    .getElementById("group-name")
    .classList.contains("hidden");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Grab the name if Signing Up, otherwise use a fallback
  const username = isSignUp
    ? document.getElementById("fullName").value
    : email.split("@")[0];

  if (isSignUp) {
    await registerUser(username, email, password);
  } else {
    // 🚀 Login logic (Aayush, we can build the C++ /api/login route next!)
    console.log("Login logic will go here next!");
    alert("Login logic is coming soon, Aayush! Use Sign Up for now.");
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
      // ✅ Save everything to LocalStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("foodapp_user", username); // This updates your Navbar!

      alert(`Shabaash Aayush! User ${username} registered successfully.`);
      window.location.href = "index.html";
    } else {
      alert("Error: " + (data.message || "User already exists in AWS RDS"));
    }
  } catch (error) {
    console.error("Connection Error:", error);
    alert("Bhai Aayush, check if your ngrok tunnel is still active!");
  }
}

/**
 * 🛠️ Logout Function
 */
function logoutUser() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("foodapp_user");
  alert("Logged out! See you soon, Aayush.");
  window.location.href = "login.html";
}

// Ensure the Logout button works if it exists on the page
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });
  }
});
