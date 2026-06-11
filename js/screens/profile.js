import { state, saveState } from '../data.js';

export const ProfileScreen = {
    render: () => {
        const user = state.currentUser;
        const isSme = user && user.role === "sme";

        return `
        <div class="topbar animate-fade-in">
            <h1 class="page-title">Profile Settings</h1>
        </div>

        <div class="card animate-fade-in" style="max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 32px;">
                <div class="avatar" style="width: 80px; height: 80px; font-size: 32px; margin: 0 auto 16px auto;">
                    ${user ? user.companyName.charAt(0) : 'U'}
                </div>
                <h2 style="font-family: var(--font-heading); font-size: 22px; font-weight: 700;">${user ? user.companyName : 'Guest'}</h2>
                <span class="badge ${isSme ? 'badge-success' : 'badge-success'}" style="margin-top: 8px; ${!isSme ? 'background-color: var(--secondary-light); color: var(--secondary);' : ''}">
                    ${user ? user.role.toUpperCase() : 'UNKNOWN'} ROLE
                </span>
            </div>

            <form id="profile-form">
                <div class="form-group">
                    <label class="form-label" for="profile-email">Login Email</label>
                    <input type="email" id="profile-email" class="form-control" value="${user ? user.email : ''}" readonly style="background-color: var(--bg-light); cursor: not-allowed;">
                </div>

                <div class="form-group">
                    <label class="form-label" for="profile-name">Company Display Name</label>
                    <input type="text" id="profile-name" class="form-control" value="${user ? user.companyName : ''}" required>
                </div>

                ${isSme ? `
                    <div class="form-group">
                        <label class="form-label" for="profile-zone">Industrial Zone</label>
                        <input type="text" id="profile-zone" class="form-control" value="${user.details ? user.details.industrialZone : 'Zone Industrielle de Yopougon'}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="profile-sector">Business Sector</label>
                        <input type="text" id="profile-sector" class="form-control" value="${user.details ? user.details.businessSector : 'Plastiques & Emballages'}" required>
                    </div>
                ` : `
                    <div class="form-group">
                        <label class="form-label">Pricing Configurations</label>
                        <a href="#/register/recycler" class="btn btn-secondary btn-full" style="padding: 10px; font-size:14px; text-decoration: none;">Configure Buy/Sell Rates Setup</a>
                    </div>
                `}

                <div style="margin-top: 32px; display: flex; gap: 16px;">
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Update Profile Details</button>
                    <button id="btn-logout" type="button" class="btn btn-danger">Sign Out</button>
                </div>
            </form>
        </div>
        `;
    },
    afterRender: () => {
        const form = document.getElementById("profile-form");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const newName = document.getElementById("profile-name").value;
                
                if (state.currentUser) {
                    state.currentUser.companyName = newName;
                    
                    if (state.currentUser.role === "sme") {
                        state.currentUser.details = state.currentUser.details || {};
                        state.currentUser.details.industrialZone = document.getElementById("profile-zone").value;
                        state.currentUser.details.businessSector = document.getElementById("profile-sector").value;
                    }
                    saveState();
                    alert("✅ Profile updated successfully.");
                    window.location.reload();
                }
            });
        }

        const logoutBtn = document.getElementById("btn-logout");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                state.currentUser = null;
                saveState();
                window.location.hash = "/login";
            });
        }
    }
};
