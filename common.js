document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('sevaMessages');

  async function loadSevaMessages() {
    const res = await fetch('/gau-seva-messages');
    const messages = await res.json();
    console.log("Fetched messages:", messages);

    // Render message cards
    container.innerHTML = messages.map(msg => {
      const formattedTime = new Date(msg.timestamp).toLocaleString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true
      });

      return `
        <div class="card">
          <h3>${msg.name}</h3>
          <p>${msg.message}</p>
          ${msg.photo ? `<img src="${msg.photo}" width="200" style="margin: 10px 0;">` : ''}
          ${msg.latitude && msg.longitude ? `
            <p>Location: (${msg.latitude}, ${msg.longitude})<br>
            <a href="https://www.google.com/maps?q=${msg.latitude},${msg.longitude}" target="_blank" style="color:#ffd54f;">📍 Open in Google Maps</a></p>
          ` : ''}
          <small>${formattedTime}</small>
        </div>
      `;
    }).join('');

    // Initialize map
    const map = L.map('sevaMap').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Add markers to map
    messages.forEach(msg => {
      if (msg.latitude && msg.longitude) {
        L.marker([msg.latitude, msg.longitude]).addTo(map)
          .bindPopup(`<strong>${msg.name}</strong><br>${msg.message}`);
      }
    });
  }

  loadSevaMessages(); 
});