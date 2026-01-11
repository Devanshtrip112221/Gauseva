
async function api(endpoint, data) {
  const response = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await response.json();
}

document.addEventListener('DOMContentLoaded', () => {
  const uploadInput = document.getElementById('photo-upload');
  const preview = document.getElementById('preview');
  const locationBtn = document.getElementById('share-location');
  const locationDisplay = document.getElementById('location-display');
  const userDataDiv = document.getElementById('userData');
  const logoutBtn = document.getElementById('logoutBtn');


  if (uploadInput && preview) {
    document.querySelector('.upload-label')?.addEventListener('click', () => {
      uploadInput.click();
    });

    uploadInput.addEventListener('change', () => {
      const file = uploadInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.innerHTML = `<img src="${e.target.result}" alt="User Photo" style="max-width:200px;">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }


  locationBtn?.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        locationDisplay.textContent = ` You're here: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;

        if (document.getElementById('map')?._leaflet_id) {
          document.getElementById('map').innerHTML = "";
        }

        const map = L.map('map').setView([lat, lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.marker([lat, lon]).addTo(map)
          .bindPopup("You are here!")
          .openPopup();
      },
      () => {
        locationDisplay.textContent = "Location access denied. Please enable GPS.";
      }
    );
  });


  const loginForm = document.getElementById('loginForm');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const res = await api('login', { email, password });
    handleLoginSuccess(res, email);
  });

  // Register form
  const registerForm = document.getElementById('registerForm');
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    const res = await api('register', { name, email, phone, password });
    if (res.success) {
      localStorage.setItem('userEmail', email);
      window.location.href = 'index2.html';
    } else {
      alert(res.error || 'Registration failed');
    }
  });

  // User info display
  const userEmail = localStorage.getItem('userEmail');
  if (userDataDiv && userEmail) {
    userDataDiv.textContent = 'Loading user info...';
    fetch('/api/getUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          userDataDiv.innerHTML = `
            <h2>Welcome, ${data.user.name}</h2>
            <p><strong>Email:</strong> ${data.user.email}</p>
            <p><strong>Phone:</strong> ${data.user.phone || '-'}</p>
          `;
        } else {
          userDataDiv.textContent = 'User info not found';
        }
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        userDataDiv.textContent = 'Error loading user info';
      });
  }

  
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
  });

  
  document.getElementById('shareLocationBtn')?.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;

      const name = prompt("Enter your name for location sharing:");
      const message = prompt("Write a short message for Gau Seva:");

      if (!name || !message) {
        alert("Name and message are required.");
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('message', message);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);

      const res = await fetch('/submit-gau-seva', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        alert("Location shared successfully!");
        loadMessages();
      } else {
        alert("Failed to share location.");
      }
    }, () => {
      alert("Location access denied.");
    });
  });

  
  async function loadMessages() {
    const res = await fetch('/gau-seva-messages');
    const messages = await res.json();
    const container = document.getElementById('gauSevaMessages');
    if (!container) return;

    container.innerHTML = messages.map(msg => `
      <div class="card">
        <h4>${msg.name}</h4>
        <p>${msg.message}</p>
        ${msg.photo ? `<img src="${msg.photo}" width="200">` : ''}
        ${msg.latitude && msg.longitude ? `<p>Location: ${msg.latitude}, ${msg.longitude}</p>` : ''}
        <small>${new Date(msg.timestamp).toLocaleString()}</small>
      </div>
    `).join('');
  }

  loadMessages(); 
});

function handleLoginSuccess(res, email) {
  if (res.success && res.user) {
    localStorage.setItem('userEmail', res.user.email);
    window.location.href = 'index2.html';
  } else if (res.success) {
    localStorage.setItem('userEmail', email);
    window.location.href = 'index2.html';
  } else {
    alert(res.error || 'Login failed');
  }
}



// {msg.latitude && msg.longitude ? `
//   <p>
//     Location: (${msg.latitude}, ${msg.longitude})<br>
//     <a href="https://www.google.com/maps?q=${msg.latitude},${msg.longitude}" target="_blank" style="color:#ffd54f;"> Open in Google Maps</a>
//   </p>
// ` : ''}