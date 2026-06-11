import { state, saveState, WASTE_TYPES } from '../data.js';

export const CollectionValidationScreen = {
    render: () => {
        // Find if there is any "Matched" collection we can validate
        const matchObj = state.declarations.find(d => d.status === "Matched");

        return `
        <div class="topbar animate-fade-in">
            <h1 class="page-title">Validate QR Collection</h1>
        </div>

        <div class="animate-fade-in" style="max-width: 500px; margin: 0 auto;">
            ${matchObj ? `
                <div class="card" style="padding: 24px; text-align: center;">
                    <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 14px;">Scan the SME's dispatch QR code to validate waste collection receipt.</p>
                    
                    <!-- Simulated Camera view -->
                    <div style="position: relative; width: 100%; aspect-ratio: 1; background-color: #000; border-radius: 16px; overflow: hidden; margin-bottom: 24px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-lg);">
                        
                        <!-- Viewfinder brackets -->
                        <div style="position: absolute; top: 30px; left: 30px; width: 40px; height: 40px; border-top: 4px solid var(--primary); border-left: 4px solid var(--primary);"></div>
                        <div style="position: absolute; top: 30px; right: 30px; width: 40px; height: 40px; border-top: 4px solid var(--primary); border-right: 4px solid var(--primary);"></div>
                        <div style="position: absolute; bottom: 30px; left: 30px; width: 40px; height: 40px; border-bottom: 4px solid var(--primary); border-left: 4px solid var(--primary);"></div>
                        <div style="position: absolute; bottom: 30px; right: 30px; width: 40px; height: 40px; border-bottom: 4px solid var(--primary); border-right: 4px solid var(--primary);"></div>
                        
                        <!-- Scanning line -->
                        <div style="position: absolute; left: 0; width: 100%; height: 3px; background-color: var(--primary); box-shadow: 0 0 10px var(--primary); animation: scanEffect 2s infinite ease-in-out;"></div>
                        
                        <div style="color: #64748B; text-align: center; z-index: 10; padding: 20px;">
                            <i data-lucide="aperture" style="width: 48px; height: 48px; color: #fff; margin-bottom: 12px; opacity: 0.85;"></i>
                            <p style="color: #fff; font-size: 14px; font-weight: 500;">Simulated Camera Viewfinder</p>
                            <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 4px;">Aim scanner at SME's mobile screen</p>
                        </div>
                    </div>

                    <!-- Scan metadata & Details -->
                    <div style="background-color: var(--bg-light); border-radius: 12px; padding: 16px; text-align: left; margin-bottom: 24px; border: 1px solid var(--border);">
                        <div style="font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                            <span>Active Match Detected</span>
                            <span class="badge" style="background-color: var(--secondary-light); color: var(--secondary);">Ticket #${matchObj.id}</span>
                        </div>
                        <p style="font-size: 13px; margin-bottom: 6px;">🏢 SME: <strong>${matchObj.company}</strong></p>
                        <p style="font-size: 13px; margin-bottom: 6px;">📍 Zone: <strong>${matchObj.zone}</strong></p>
                        <p style="font-size: 13px; margin-bottom: 6px;">📦 Waste Stream: <strong>${WASTE_TYPES[matchObj.wasteType].name}</strong></p>
                        <p style="font-size: 13px;">⚖️ Declared Weight: <strong>${matchObj.weight} ${WASTE_TYPES[matchObj.wasteType].unit}</strong></p>
                    </div>

                    <button id="btn-validate-collection" class="btn btn-primary btn-full" style="padding: 14px;">
                        Simulate Scan & Complete Collection <i data-lucide="qr-code"></i>
                    </button>
                </div>
            ` : `
                <div class="card" style="text-align: center; padding: 48px;">
                    <i data-lucide="qr-code" style="width: 54px; height: 54px; color: var(--text-secondary); margin-bottom: 16px;"></i>
                    <h2>No Scheduled Collections</h2>
                    <p style="color: var(--text-secondary); margin-top: 8px;">Please accept a matching alert opportunity first to activate the QR Validator.</p>
                    <a href="#/recycler/alerts" class="btn btn-primary" style="margin-top: 24px;">View Matching Alerts</a>
                </div>
            `}
        </div>

        <style>
            @keyframes scanEffect {
                0% { top: 10%; }
                50% { top: 90%; }
                100% { top: 10%; }
            }
        </style>
        `;
    },
    afterRender: () => {
        const btn = document.getElementById("btn-validate-collection");
        if (btn) {
            btn.addEventListener("click", () => {
                // Find active matched transaction
                const matchIndex = state.declarations.findIndex(d => d.status === "Matched");
                if (matchIndex === -1) return;

                state.declarations[matchIndex].status = "Completed";
                saveState();

                alert(`🎉 QR Code Validated! Collection Ticket #${state.declarations[matchIndex].id} has been marked as Completed. Funds/metrics updated successfully.`);
                window.location.hash = "/recycler/dashboard";
            });
        }
    }
};
