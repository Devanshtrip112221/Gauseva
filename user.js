   const userDataDiv = document.getElementById('userData');
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
      fetch(`/api/user?email=${encodeURIComponent(userEmail)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            userDataDiv.innerHTML = `
              <h3>Welcome, ${data.user.name}</h3>
              <p>Email: ${data.user.email}</p>
              <p>Phone: ${data.user.phone || '-'}</p>
            `;
          } else {
            userDataDiv.textContent = 'User info not found';
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          userDataDiv.textContent = `Welcome, ${userEmail}! (Error loading details)`;
        });
    } else {
      userDataDiv.textContent = 'No user logged in. Please login first.';
      // Optional redirect
      // setTimeout(() => window.location.href = 'index.html', 2000);
    }