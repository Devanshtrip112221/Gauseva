async function api(endpoint, data) {
  const response = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await response.json();
}


document.getElementById('registerBtn')?.addEventListener('click', async () => {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;

  const resultEl = document.getElementById('result');
  resultEl.style.display = 'block';

  if (!name || !email || !password) {
    resultEl.textContent = 'Please fill in all required fields';
    return;
  }

  resultEl.textContent = 'Registering...';

  try {
    const res = await api('register', { name, email, phone, password });
    if (res.success) {
      localStorage.setItem('userEmail', email);
      resultEl.textContent = 'Account created. Redirecting...';
      setTimeout(() => window.location.href = 'index2.html', 1000);
    } else {
      resultEl.textContent = 'Error: ' + res.error;
    }
  } catch (e) {
    resultEl.textContent = 'Network error';
  }
});

document.getElementById('showLogin')?.addEventListener('click', () => {
  const box = document.getElementById('loginBox');
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
});


document.getElementById('loginBtn')?.addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const resultEl = document.getElementById('result');
  resultEl.style.display = 'block';

  if (!email || !password) {
    resultEl.textContent = 'Please enter both email and password';
    return;
  }

  resultEl.textContent = 'Logging in...';

  try {
    const res = await api('login', { email, password });
    if (res.success && res.user) {
      localStorage.setItem('userEmail', res.user.email);
      resultEl.textContent = 'Login successful. Redirecting...';
      setTimeout(() => window.location.href = 'index2.html', 1000);
    } else {
      resultEl.textContent = 'Error: ' + res.error;
    }
  } catch (e) {
    resultEl.textContent = 'Network error';
  }
});














