import { state, saveState, COTE_DIVOIRE_ZONES, BUSINESS_SECTORS } from '../data.js';

export const RegisterSmeScreen = {
    render: () => {
        const zoneOptions = COTE_DIVOIRE_ZONES.map(z => `<option value="${z}">${z}</option>`).join("");
        const sectorOptions = BUSINESS_SECTORS.map(s => `<option value="${s}">${s}</option>`).join("");

        return `
        <div class="auth-container animate-fade-in">
            <div class="auth-hero" style="background: linear-gradient(135deg, #0f3d30 0%, #1e3a8a 100%);">
                <div class="logo-container" style="margin-bottom: 24px;">
                    <div class="logo-icon" style="background: white; color: var(--primary);">♻️</div>
                    <div class="logo-text" style="background: white; -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; color: white;">EcoCycle CI</div>
                </div>
                <h1 class="auth-hero-title">Join Côte d'Ivoire's SME Circular Network</h1>
                <p class="auth-hero-desc">Register your business to monetize recyclables, track waste streams, optimize disposal costs, and generate export-ready ESG reports.</p>
            </div>
            
            <div class="auth-form-side" style="padding-top: 40px; padding-bottom: 40px; justify-content: flex-start; overflow-y: auto;">
                <div style="margin-bottom: 24px;">
                    <a href="#/login" style="color: var(--text-secondary); text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 16px;">
                        <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i> Back to Login
                    </a>
                    <h2 style="font-family: var(--font-heading); font-size: 28px; font-weight: 700; margin-bottom: 6px;">SME Registration</h2>
                    <p style="color: var(--text-secondary);">Set up your industrial producer profile</p>
                </div>
                
                <form id="register-sme-form">
                    <div class="form-group">
                        <label class="form-label" for="company-name">Company Name (Raison Sociale)</label>
                        <input type="text" id="company-name" class="form-control" placeholder="e.g. SIPRA Industries" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="industrial-zone">Industrial Zone (Zone Industrielle)</label>
                        <select id="industrial-zone" class="form-control" required>
                            <option value="" disabled selected>Select industrial zone</option>
                            ${zoneOptions}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="business-sector">Business Sector</label>
                        <select id="business-sector" class="form-control" required>
                            <option value="" disabled selected>Select business sector</option>
                            ${sectorOptions}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="phone">Phone Number (Côte d'Ivoire)</label>
                        <input type="tel" id="phone" class="form-control" placeholder="e.g. +225 07 00 00 00 00" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="email">Account Owner Email</label>
                        <input type="email" id="email" class="form-control" placeholder="owner@company.ci" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 28px;">
                        <label class="form-label" for="password">Password</label>
                        <input type="password" id="password" class="form-control" placeholder="••••••••" required>
                    </div>

                    <button type="submit" class="btn btn-primary btn-full" style="padding: 14px; font-size: 16px;">
                        Create SME Account <i data-lucide="user-plus"></i>
                    </button>
                </form>
            </div>
        </div>
        `;
    },
    afterRender: () => {
        document.getElementById("register-sme-form").addEventListener("submit", (e) => {
            e.preventDefault();
            
            const companyName = document.getElementById("company-name").value;
            const industrialZone = document.getElementById("industrial-zone").value;
            const businessSector = document.getElementById("business-sector").value;
            const phone = document.getElementById("phone").value;
            const email = document.getElementById("email").value;

            state.currentUser = {
                role: "sme",
                companyName: companyName,
                email: email,
                details: {
                    industrialZone,
                    businessSector,
                    phone
                }
            };

            saveState();
            window.location.hash = "/sme/dashboard";
        });
    }
};
