document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('loginOverlay');
    const loginForm = document.getElementById('loginForm');
    const adminDashboard = document.getElementById('adminDashboard');
    const appointmentsList = document.getElementById('appointmentsList');
    const logoutBtn = document.getElementById('logoutBtn');
    
    let adminToken = localStorage.getItem('adminToken');

    // Check if already logged in
    if (adminToken) {
        showDashboard();
    }

    // --- Login Logic ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;

        // Local Storage Login Demo
        if (password === 'nav1234') {
            adminToken = 'demo-token';
            localStorage.setItem('adminToken', adminToken);
            showDashboard();
        } else {
            alert('Invalid password. Please try again.');
        }
    });

    // --- Logout Logic ---
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        location.reload();
    });

    // --- Dashboard Functions ---
    function showDashboard() {
        loginOverlay.style.display = 'none';
        adminDashboard.style.display = 'block';
        loadAppointments();
    }

    function loadAppointments() {
        appointmentsList.classList.add('loading');
        
        // Mock fetch with local storage
        setTimeout(() => {
            try {
                const data = JSON.parse(localStorage.getItem('appointments') || '[]');
                renderAppointments(data);
            } catch (err) {
                console.error(err);
                appointmentsList.innerHTML = '<tr><td colspan="6" class="empty-state">Error loading appointments.</td></tr>';
            } finally {
                appointmentsList.classList.remove('loading');
            }
        }, 500);
    }

    function renderAppointments(appointments) {
        if (!appointments || appointments.length === 0) {
            appointmentsList.innerHTML = '<tr><td colspan="6" class="empty-state">No appointments found yet.</td></tr>';
            return;
        }

        // Sort by id (timestamp) descending: newest first
        appointments.sort((a, b) => b.id - a.id);

        appointmentsList.innerHTML = appointments.map(booking => `
            <tr>
                <td>
                    <strong>${formatDate(booking.date)}</strong><br/>
                    <small style="color:var(--rose)">${booking.time || 'Any Time'}</small>
                </td>
                <td>
                    <strong>${booking.name}</strong><br/>
                    <small style="color:var(--muted)">Age: ${booking.age || 'N/A'}</small>
                </td>
                <td>
                    <a href="tel:${booking.phone}">${booking.phone}</a>
                </td>
                <td>
                    <span class="badge-treatment">${booking.treatment || 'General'}</span>
                </td>
                <td style="max-width: none; font-size: 0.85rem; color: var(--mid);">
                    ${booking.message || '—'}
                </td>
                <td>
                    <button class="status-new" style="background:none; border:none; cursor:pointer;" onclick="alert('Booking ID: ${booking.id}')">View</button>
                </td>
            </tr>
        `).join('');
    }

    function formatDate(dateStr) {
        if (!dateStr) return 'Not set';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
});
