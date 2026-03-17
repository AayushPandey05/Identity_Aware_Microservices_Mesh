let auth0 = null;

// 🛡️ SMART CONFIGURATION: Detects if you're on Localhost or GitHub + SDK Ready Check
const configureClient = async () => {
  // 🚦 WAIT UNTIL SDK IS READY: If the script hasn't loaded yet, wait 500ms and try again
  if (typeof createAuth0Client === "undefined") {
    console.warn("Auth0 SDK not ready yet, retrying in 500ms...");
    setTimeout(configureClient, 500);
    return;
  }

  // This detects the current URL automatically (No more hardcoded localhost!)
  const targetRedirect = window.location.origin + window.location.pathname;

  try {
    auth0 = await createAuth0Client({
      domain: "dev-tpfjrh1yyggihvc8.us.auth0.com",
      client_id: "nPhm2PIW29hUiaK2dHPjtDouPY9FOHtv",
      authorizationParams: {
        redirect_uri: targetRedirect,
      },
    });
    console.log("✅ Auth0 Client Configured");
  } catch (err) {
    console.error("❌ Auth0 Configuration failed:", err);
  }
};

// 🔐 HANDLE THE RETURN TRIP: This runs after you login with Google
const handleAuth = async () => {
  // If configureClient is still retrying, auth0 will be null. Wait for it.
  if (!auth0) {
    setTimeout(handleAuth, 500);
    return;
  }

  const query = window.location.search;

  // Check if URL has the 'code' from Auth0
  if (query.includes("code=") && query.includes("state=")) {
    try {
      await auth0.handleRedirectCallback();
      // Clean the URL (removes the ?code= part)
      window.history.replaceState({}, document.title, window.location.pathname);
      console.log("✅ Login Successful!");
    } catch (err) {
      console.error("❌ Error handling redirect:", err);
    }
  }

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    const user = await auth0.getUser();

    // 🛠️ UPDATE THE UI: Targets both potential IDs
    const loginBtn =
      document.getElementById("login-btn") ||
      document.getElementById("submit-btn");
    if (loginBtn) {
      loginBtn.innerText = `Welcome, ${user.nickname || user.name} ✅`;
      loginBtn.style.backgroundColor = "#4CAF50";
      loginBtn.style.color = "white";
    }

    console.log("👤 User Identity Verified:", user);
  }
};

// 🏁 INITIALIZE ON PAGE LOAD
window.onload = async () => {
  await configureClient();
  await handleAuth();
};

// 🚀 TRIGGER LOGIN: Call this from your button
const loginSSO = async () => {
  if (!auth0) {
    alert("Auth0 is still loading, please try again in a second!");
    return;
  }

  try {
    console.log("Initiating Auth0 Redirect...");
    await auth0.loginWithRedirect();
  } catch (err) {
    console.error("❌ Login failed:", err);
  }
};
