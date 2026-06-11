import { state, WASTE_TYPES } from '../data.js';

export const EsgReportScreen = {
    render: () => {
        let totalWaste = 0;
        let recycledWaste = 0;
        let disposalWaste = 0;
        let co2Avoided = 0;

        state.declarations.forEach(d => {
            if (d.status === "Completed") {
                totalWaste += d.weight;
                if (d.recyclable) {
                    recycledWaste += d.weight;
                } else {
                    disposalWaste += d.weight;
                }
                co2Avoided += d.co2Avoided;
            }
        });

        // Compute scores
        const circularContribution = totalWaste > 0 ? Math.round((recycledWaste / totalWaste) * 100) : 0;
        const environmentalValue = (recycledWaste * 150) - (disposalWaste * 50);

        return `
        <div class="topbar animate-fade-in" style="justify-content: space-between; align-items: center;">
            <div>
                <h1 class="page-title">ESG Impact Report</h1>
                <p style="color: var(--text-secondary); font-size: 14px; margin-top: 4px;">Verified environmental metrics for regulatory and investor auditing.</p>
            </div>
            <div>
                <button id="btn-download-esg" class="btn btn-primary">
                    <i data-lucide="download"></i> Download Official PDF
                </button>
            </div>
        </div>

        <!-- Professional PDF container template -->
        <div class="card animate-fade-in" id="esg-pdf-document" style="max-width: 900px; margin: 0 auto; background: white; padding: 48px; border: 1px solid #CBD5E1; box-shadow: var(--shadow-lg); border-radius: 8px;">
            
            <!-- Document Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--primary); padding-bottom: 24px; margin-bottom: 32px;">
                <div>
                    <div class="logo-container" style="margin-bottom: 8px;">
                        <div class="logo-icon" style="width: 32px; height: 32px; font-size: 16px;">♻️</div>
                        <span class="logo-text" style="font-size: 20px;">EcoCycle CI</span>
                    </div>
                    <p style="color: var(--text-secondary); font-size: 12px;">Sustainable Waste Routing Protocol</p>
                </div>
                <div style="text-align: right;">
                    <h2 style="font-family: var(--font-heading); font-size: 20px; font-weight: 700; color: var(--text-primary);">ESG Performance Summary</h2>
                    <p style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Reporting Entity: <strong>${state.currentUser ? state.currentUser.companyName : 'SIPRA Industries'}</strong></p>
                    <p style="font-size: 12px; color: var(--text-secondary);">Reporting Period: Year-to-Date (June 2026)</p>
                </div>
            </div>

            <!-- Score Summary Cards -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 40px;">
                <div style="border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; background-color: #F8FAFC;">
                    <span style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">CO₂ Emission Avoided</span>
                    <h3 style="font-family: var(--font-heading); font-size: 32px; font-weight: 800; color: var(--primary-dark); margin-top: 8px;">
                        ${(co2Avoided / 1000).toFixed(2)} Tons
                    </h3>
                    <p style="font-size: 11px; color: var(--text-secondary); margin-top: 6px;">Compared to standard landfill routes.</p>
                </div>
                <div style="border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; background-color: #F8FAFC;">
                    <span style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Circular Economy Index</span>
                    <h3 style="font-family: var(--font-heading); font-size: 32px; font-weight: 800; color: var(--secondary); margin-top: 8px;">
                        ${circularContribution}%
                    </h3>
                    <div style="width: 100%; height: 6px; background-color: #E2E8F0; border-radius: 3px; margin-top: 10px; overflow: hidden;">
                        <div style="width: ${circularContribution}%; height: 100%; background-color: var(--secondary); border-radius: 3px;"></div>
                    </div>
                </div>
                <div style="border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; background-color: #F8FAFC;">
                    <span style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Est. Environmental Value</span>
                    <h3 style="font-family: var(--font-heading); font-size: 32px; font-weight: 800; color: #0369A1; margin-top: 8px;">
                        ${environmentalValue.toLocaleString()} FCFA
                    </h3>
                    <p style="font-size: 11px; color: var(--text-secondary); margin-top: 6px;">Net savings from waste value recovery.</p>
                </div>
            </div>

            <!-- Material Balance Section -->
            <div style="margin-bottom: 40px;">
                <h4 style="font-family: var(--font-heading); font-size: 16px; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
                    Material Recovery Stream Metrics (kg)
                </h4>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                            <span>♻️ Recycled (Plastic, Cardboard, Metal, Oil)</span>
                            <span style="font-weight: 600; color: var(--primary-dark);">${recycledWaste.toLocaleString()} kg</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                            <span>🗑️ Disposed (Mixed & Contaminated)</span>
                            <span style="font-weight: 600; color: var(--warning);">${disposalWaste.toLocaleString()} kg</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; border-top: 1px dashed var(--border); padding-top: 8px; margin-top: 8px;">
                            <span>Total Waste Handled</span>
                            <span>${totalWaste.toLocaleString()} kg</span>
                        </div>
                    </div>
                    
                    <div style="background-color: #F0FDFA; border-radius: 8px; padding: 16px; border: 1px solid #CCFBF1; font-size: 13px; line-height: 1.5; color: #115E59;">
                        <strong>Sustainability Statement:</strong> All materials listed under the recycled streams have been channeled to authorized recovery units operating in Côte d'Ivoire. Disposal materials were safely routed via licensed entities ensuring minimal biosphere infiltration.
                    </div>
                </div>
            </div>

            <!-- Verification Footer -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 24px; font-size: 11px; color: var(--text-secondary);">
                <div>
                    <p>Secured via EcoCycle Ledger Protocol</p>
                    <p style="margin-top: 2px;">Verification Hash: <strong>sha256:4d603a...ae89d1</strong></p>
                </div>
                <div style="text-align: right;">
                    <p>Issued by MINEDD National Waste Registry</p>
                    <p style="margin-top: 2px;">Date: June 11, 2026</p>
                </div>
            </div>
        </div>
        `;
    },
    afterRender: () => {
        const btn = document.getElementById("btn-download-esg");
        if (btn) {
            btn.addEventListener("click", () => {
                alert("📥 Simulating PDF download... The audited report is generated and saved as EcoCycle_ESG_Report.pdf.");
            });
        }
    }
};
