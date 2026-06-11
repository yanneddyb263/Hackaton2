import { state, saveState } from '../data.js';

export const LoginScreen = {
    render: () => {
        return `
        <div class="auth-container animate-fade-in">
            <div class="auth-hero">
                <div class="logo-container" style="margin-bottom: 24px;">
                    <div class="logo-icon" style="background: white; color: var(--primary);">♻️</div>
                    <div class="logo-text" style="background: white; -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; color: white;">EcoCycle CI</div>
                </div>
                <h1 class="auth-hero-title">Industrial Waste to Resource Platform</h1>
                <p class="auth-hero-desc">Connecting Côte d'Ivoire's SMEs with authorized waste collectors and recyclers to build a sustainable, circular economy.</p>
                
                <div style="margin-top: 48px; display: flex; gap: 24px; opacity: 0.9;">
                    <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); flex: 1;">
                        <h4 style="font-weight: 700; margin-bottom: 8px;">SME Producers</h4>
                        <p style="font-size: 13px;">Declare waste, generate revenue or calculate disposal costs instantly, and download ESG metrics.</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); flex: 1;">
                        <h4 style="font-weight: 700; margin-bottom: 8px;">Recyclers & Collectors</h4>
                        <p style="font-size: 13px;">Receive matching opportunities, validate pick-ups via QR codes, and scale operations.</p>
                    </div>
                </div>
            </div>
            
            <div class="auth-form-side">
                <div style="margin-bottom: 32px;">
                    <h2 style="font-family: var(--font-heading); font-size: 32px; font-weight: 700; margin-bottom: 8px;">Welcome Back</h2>
                    <p style="color: var(--text-secondary);">Select your workspace role to sign in</p>
                </div>
                
                <div style="display: flex; gap: 12px; margin-bottom: 24px; background-color: var(--bg-light); padding: 6px; border-radius: 10px;">
                    <button id="btn-tab-sme" class="btn btn-secondary" style="flex: 1; border: none; padding: 10px; border-radius: 8px; font-size: 14px;" data-role="sme">SME Producer</button>
                    <button id="btn-tab-recycler" class="btn btn-secondary" style="flex: 1; border: none; padding: 10px; border-radius: 8px; font-size: 14px;" data-role="recycler">Recycler / Collector</button>
                </div>
                
                <form id="login-form">
                    <div class="form-group">
                        <label class="form-label" for="email">Business Email</label>
                        <input type="email" id="email" class="form-control" placeholder="contact@company.ci" required>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 32px;">
                        <label class="form-label" for="password">Password</label>
                        <input type="password" id="password" class="form-control" placeholder="••••••••" required>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-full" style="padding: 14px; font-size: 16px;">
                        Sign In to Workspace <i data-lucide="arrow-right"></i>
                    </button>
                </form>
                
                <div style="margin-top: 32px; text-align: center; font-size: 14px; color: var(--text-secondary);">
                    Don't have an account? <a id="link-register" href="#/register/sme" style="color: var(--primary); font-weight: 600; text-decoration: none;">Create one here</a>
                </div>
            </div>
        </div>
        `;
    },
    afterRender: () => {
        let selectedRole = "sme";
        const btnSme = document.getElementById("btn-tab-sme");
        const btnRecycler = document.getElementById("btn-tab-recycler");
        const linkRegister = document.getElementById("link-register");
        const emailInput = document.getElementById("email");

        const updateTabUI = () => {
            if (selectedRole === "sme") {
                btnSme.style.backgroundColor = "white";
                btnSme.style.boxShadow = "var(--shadow-sm)";
                btnSme.style.color = "var(--primary-dark)";
                btnSme.style.fontWeight = "600";
                
                btnRecycler.style.backgroundColor = "transparent";
                btnRecycler.style.boxShadow = "none";
                btnRecycler.style.color = "var(--text-secondary)";
                btnRecycler.style.fontWeight = "500";
                
                linkRegister.href = "#/register/sme";
                emailInput.value = "producer@sipra.ci";
            } else {
                btnRecycler.style.backgroundColor = "white";
                btnRecycler.style.boxShadow = "var(--shadow-sm)";
                btnRecycler.style.color = "var(--secondary)";
                btnRecycler.style.fontWeight = "600";
                
                btnSme.style.backgroundColor = "transparent";
                btnSme.style.boxShadow = "none";
                btnSme.style.color = "var(--text-secondary)";
                btnSme.style.fontWeight = "500";
                
                linkRegister.href = "#/register/recycler";
                emailInput.value = "contact@recyclage.ci";
            }
        };

        btnSme.addEventListener("click", () => {
            selectedRole = "sme";
            updateTabUI();
        });

        btnRecycler.addEventListener("click", () => {
            selectedRole = "recycler";
            updateTabUI();
        });

        updateTabUI();

        // Handle Login Submission
        document.getElementById("login-form").addEventListener("submit", (e) => {
            e.preventDefault();
            
            state.currentUser = {
                email: emailInput.value,
                role: selectedRole,
                companyName: selectedRole === "sme" ? "SIPRA Industries" : "Société Ivoirienne de Recyclage"
            };
            
            saveState();

            if (selectedRole === "sme") {
                window.location.hash = "/sme/dashboard";
            } else {
                window.location.hash = "/recycler/dashboard";
            }
        });
    }
};
