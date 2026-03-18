document.addEventListener('DOMContentLoaded', () => {
  const btnLogin = document.getElementById('btn-login');
  const btnSignup = document.getElementById('btn-signup');
  const formTitle = document.getElementById('form-title');
  const formSubtitle = document.getElementById('form-subtitle');
  const groupName = document.getElementById('group-name');
  const submitText = document.getElementById('submit-text');
  const authForm = document.getElementById('auth-form');
  const submitBtn = document.getElementById('submit-btn');
  const spinner = submitBtn.querySelector('.spinner');
  
  const googleBtn = document.querySelector('.google-btn');
  const oktaBtn = document.querySelector('.okta-btn');
  const auth0Btn = document.querySelector('.auth0-btn');
  const toastContainer = document.getElementById('toast-container');

  let isLoginMode = true;

  // Toggle Mode
  function setMode(login) {
    isLoginMode = login;
    if (login) {
      btnLogin.classList.add('active');
      btnSignup.classList.remove('active');
      formTitle.textContent = 'Welcome Back';
      formSubtitle.textContent = 'Please enter your details to sign in.';
      groupName.classList.add('hidden');
      document.getElementById('fullName').removeAttribute('required');
      submitText.textContent = 'Log In';
    } else {
      btnSignup.classList.add('active');
      btnLogin.classList.remove('active');
      formTitle.textContent = 'Create an Account';
      formSubtitle.textContent = 'Sign up to get started with our food delivery.';
      groupName.classList.remove('hidden');
      document.getElementById('fullName').setAttribute('required', 'true');
      submitText.textContent = 'Sign Up';
    }
  }

  btnLogin.addEventListener('click', () => setMode(true));
  btnSignup.addEventListener('click', () => setMode(false));

  // Form Submit
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // UI Loading state
    submitBtn.disabled = true;
    submitText.textContent = isLoginMode ? 'Logging in...' : 'Creating account...';
    spinner.classList.remove('hidden');

    const email = document.getElementById('email').value;
    let name = 'User';

    if (!isLoginMode) {
      name = document.getElementById('fullName').value || 'User';
    } else {
      // If login, just extract name from email or use a dummy
      name = email.split('@')[0];
    }

    // Simulate API Call
    setTimeout(() => {
      localStorage.setItem('foodapp_user', name);
      showToast('success', `Welcome, ${name}! Redirecting...`);
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
      
    }, 1200);
  });

  // Social Logins - Google Modal Implementation
  const googleModalBackdrop = document.getElementById('google-modal-backdrop');
  const googleModal = document.getElementById('google-modal');
  const googleAccounts = document.querySelectorAll('.google-account-item');

  googleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    googleModalBackdrop.classList.add('active');
    googleModal.classList.add('active');
  });

  googleModalBackdrop.addEventListener('click', () => {
    googleModalBackdrop.classList.remove('active');
    googleModal.classList.remove('active');
  });

  googleAccounts.forEach(account => {
    account.addEventListener('click', () => {
      const name = account.getAttribute('data-name');
      if (name) {
        googleModalBackdrop.classList.remove('active');
        googleModal.classList.remove('active');
        showToast('success', `Logging in as ${name}...`);
        setTimeout(() => {
          localStorage.setItem('foodapp_user', name);
          window.location.href = 'index.html';
        }, 1500);
      } else {
        showToast('error', 'Add another account logic not implemented');
      }
    });
  });

  oktaBtn.addEventListener('click', () => {
    showToast('success', 'Redirecting to Okta Identity Cloud...');
    setTimeout(() => {
      localStorage.setItem('foodapp_user', 'Okta User');
      window.location.href = 'index.html';
    }, 1500);
  });

  if (auth0Btn) {
    auth0Btn.addEventListener('click', (e) => {
      // Prevent form submission if it accidentally triggers
      e.preventDefault();
      // loginSSO() is called via inline onclick handler
      showToast('success', 'Redirecting to Auth0...');
    });
  }

  // Toast System
  function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fadeOut');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
  }
});
