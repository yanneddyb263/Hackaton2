import { state, saveState, COTE_DIVOIRE_ZONES } from '../data.js';

export const RegisterRecyclerScreen = {
    render: () => {
        const zoneCheckboxes = COTE_DIVOIRE_ZONES.map((z, idx) => `
            <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 14px; cursor: pointer;">
                <input type="checkbox" name="service-zone" value="${z}" ${idx < 2 ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--primary);">
                ${z}
            </label>
        `).join("");

        return `
        <div class="auth-container animate-fade-in" style="flex-direction: row-reverse;">
            <div class="auth-hero" style="background: linear-gradient(135deg, #1e3a8a 0%, #0D9F6E 100%);">
                <div class="logo-container" style="margin-bottom: 24px;">
                    <div class="logo-icon" style="background: white; color: var(--secondary);">♻️</div>
                    <div class="logo-text" style="background: white; -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; color: white;">EcoCycle CI</div>
                </div>
                <h1 class="auth-hero-title">Expand Your Recycling & Collection Portfolio</h1>
                <p class="auth-hero-desc">Access direct industrial waste leads from Abidjan's busiest zones, offer competitive pricing, and streamline collections with digital signatures and validation.</p>
            </div>
            
            <div class="auth-form-side" style="padding-top: 40px; padding-bottom: 40px; justify-content: flex-start; overflow-y: auto;">
                <div style="margin-bottom: 24px;">
                    <a href="#/login" style="color: var(--text-secondary); text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 16px;">
                        <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i> Back to Login
                    </a>
                    <h2 style="font-family: var(--font-heading); font-size: 28px; font-weight: 700; margin-bottom: 6px;">Recycler Setup</h2>
                    <p style="color: var(--text-secondary);">Configure your collector / operator profile</p>
                </div>
                
                <form id="register-recycler-form">
                    <div class="form-group">
                        <label class="form-label" for="recycler-company-name">Company Name (Raison Sociale)</label>
                        <input type="text" id="recycler-company-name" class="form-control" placeholder="e.g. Société Ivoirienne de Recyclage" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Business Model Type</label>
                        <div style="display: flex; gap: 16px; margin-top: 4px;">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="business-type" value="recycler" checked style="accent-color: var(--primary);"> Recycler (Buy waste)
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="business-type" value="collector" style="accent-color: var(--primary);"> Collector (Dispose waste)
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="radio" name="business-type" value="both" style="accent-color: var(--primary);"> Both
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Service Operating Zones</label>
                        <div style="background-color: var(--bg-light); border: 1px solid var(--border); padding: 12px; border-radius: 10px; max-height: 140px; overflow-y: auto;">
                            ${zoneCheckboxes}
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="license">Environmental License (MINEDD Authorization)</label>
                        <div style="border: 2px dashed var(--border); border-radius: 10px; padding: 16px; text-align: center; background-color: var(--bg-light); cursor: pointer;" onclick="document.getElementById('license').click()">
                            <i data-lucide="upload-cloud" style="width: 32px; height: 32px; color: var(--text-secondary); margin-bottom: 8px;"></i>
                            <p style="font-size: 13px; font-weight: 500;" id="license-label">Upload authorization PDF (Max 5MB)</p>
                            <input type="file" id="license" style="display: none;" accept="application/pdf,image/*">
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 28px;">
                        <label class="form-label">Default Buy/Sell Rates Setup (FCFA per kg/L)</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background-color: var(--bg-light); padding: 12px; border-radius: 10px; border: 1px solid var(--border);">
                            <div>
                                <label style="font-size: 12px; color: var(--text-secondary);">🥤 Plastic Rate (SME gets)</label>
                                <input type="number" id="rate-plastic" class="form-control" value="150" style="padding: 6px 10px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; color: var(--text-secondary);">📦 Cardboard Rate (SME gets)</label>
                                <input type="number" id="rate-cardboard" class="form-control" value="80" style="padding: 6px 10px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; color: var(--text-secondary);">⚙️ Metal Rate (SME gets)</label>
                                <input type="number" id="rate-metal" class="form-control" value="350" style="padding: 6px 10px; margin-top: 4px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; color: var(--text-secondary);">🛢️ Used Oil Rate (SME gets)</label>
                                <input type="number" id="rate-oil" class="form-control" value="200" style="padding: 6px 10px; margin-top: 4px;">
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-full" style="padding: 14px; font-size: 16px;">
                        Save & Configure Profile <i data-lucide="check-circle"></i>
                    </button>
                </form>
            </div>
        </div>
        `;
    },
    afterRender: () => {
        // File Upload preview simulation
        const licenseInput = document.getElementById("license");
        const licenseLabel = document.getElementById("license-label");

        if (licenseInput) {
            licenseInput.addEventListener("change", (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    licenseLabel.innerText = `📄 ${e.target.files[0].name} uploaded successfully`;
                    licenseLabel.style.color = "var(--primary-dark)";
                }
            });
        }

        document.getElementById("register-recycler-form").addEventListener("submit", (e) => {
            e.preventDefault();
            
            const companyName = document.getElementById("recycler-company-name").value;
            const businessType = document.querySelector('input[name="business-type"]:checked').value;
            const checkedZones = Array.from(document.querySelectorAll('input[name="service-zone"]:checked')).map(el => el.value);

            state.currentUser = {
                role: "recycler",
                companyName: companyName,
                email: "operator@company.ci"
            };

            state.recyclerConfig = {
                companyName,
                businessType,
                zones: checkedZones,
                prices: {
                    plastic: parseInt(document.getElementById("rate-plastic").value),
                    cardboard: parseInt(document.getElementById("rate-cardboard").value),
                    metal: parseInt(document.getElementById("rate-metal").value),
                    oil: parseInt(document.getElementById("rate-oil").value),
                    mixed: 50,
                    hazardous: 250
                }
            };

            saveState();
            window.location.hash = "/recycler/dashboard";
        });
    }
};
