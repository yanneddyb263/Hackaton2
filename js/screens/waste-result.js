import { state, saveState, WASTE_TYPES } from '../data.js';

export const WasteResultScreen = {
    render: () => {
        const item = state.tempDeclaration;
        if (!item) {
            return `
            <div class="card animate-fade-in" style="text-align: center; padding: 48px; max-width: 600px; margin: 40px auto;">
                <i data-lucide="alert-triangle" style="width: 48px; height: 48px; color: var(--warning); margin-bottom: 16px;"></i>
                <h2>No Active Qualification</h2>
                <p style="color: var(--text-secondary); margin-top: 8px;">Please declare waste first to qualify it.</p>
                <a href="#/sme/declare" class="btn btn-primary" style="margin-top: 24px;">Start New Declaration</a>
            </div>
            `;
        }

        const wInfo = WASTE_TYPES[item.wasteType];
        const isRecyclable = wInfo.recyclable;
        const formattedValue = Math.abs(item.value).toLocaleString() + " FCFA";

        return `
        <div class="topbar animate-fade-in">
            <h1 class="page-title">Waste Qualification Result</h1>
        </div>

        <div class="animate-fade-in" style="max-width: 650px; margin: 0 auto;">
            ${isRecyclable ? `
                <div class="card" style="border-top: 8px solid var(--primary); padding: 32px; background: linear-gradient(to bottom, #f0fdf4, #ffffff);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
                        <div>
                            <span class="badge badge-success" style="font-size: 13px; margin-bottom: 12px;">✅ Scenario A: Recyclable Waste</span>
                            <h2 style="font-family: var(--font-heading); font-size: 28px; font-weight: 800; color: #14532d;">Valuable Stream Qualified</h2>
                        </div>
                        <div style="font-size: 48px;">${wInfo.emoji}</div>
                    </div>

                    <div style="background-color: white; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 28px; box-shadow: var(--shadow-sm);">
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 12px;">
                            <span style="color: var(--text-secondary);">Waste Stream:</span>
                            <span style="font-weight: 600;">${wInfo.name}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 12px;">
                            <span style="color: var(--text-secondary);">Declared Quantity:</span>
                            <span style="font-weight: 600;">${item.weight} ${wInfo.unit}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 12px;">
                            <span style="color: var(--text-secondary);">Market Value:</span>
                            <span style="font-weight: 600;">${wInfo.pricePerKg} FCFA / ${wInfo.unit}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding-top: 4px; align-items: center;">
                            <span style="font-weight: 700; color: #166534;">Estimated Revenue:</span>
                            <span style="font-size: 24px; font-weight: 800; color: var(--primary-dark);">${formattedValue}</span>
                        </div>
                    </div>

                    <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 28px; line-height: 1.5;">
                        ♻️ <strong>CO₂ Impact:</strong> By routing this recyclable stream to a licensed collector, you avoid approximately <strong>${item.co2Avoided.toLocaleString()} kg of CO₂</strong> emissions.
                    </p>

                    <div style="display: flex; gap: 16px;">
                        <button id="btn-find-recycler" class="btn btn-primary" style="flex: 1; padding: 14px;">Find Certified Recyclers <i data-lucide="search"></i></button>
                        <a href="#/sme/dashboard" class="btn btn-secondary" style="padding: 14px;">Go to Dashboard</a>
                    </div>
                </div>
            ` : `
                <div class="card" style="border-top: 8px solid var(--warning); padding: 32px; background: linear-gradient(to bottom, #fffbeb, #ffffff);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
                        <div>
                            <span class="badge badge-warning" style="font-size: 13px; margin-bottom: 12px;">⚠️ Scenario B: Disposal Required</span>
                            <h2 style="font-family: var(--font-heading); font-size: 28px; font-weight: 800; color: #78350f;">Disposal Stream Qualified</h2>
                        </div>
                        <div style="font-size: 48px;">${wInfo.emoji}</div>
                    </div>

                    <div style="background-color: white; border: 1px solid #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 28px; box-shadow: var(--shadow-sm);">
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 12px;">
                            <span style="color: var(--text-secondary);">Waste Stream:</span>
                            <span style="font-weight: 600;">${wInfo.name}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 12px;">
                            <span style="font-weight: 600; color: var(--danger); font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
                                <i data-lucide="alert-octagon" style="width: 12px; height: 12px;"></i> Special handling required
                            </span>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 12px;">
                            <span style="color: var(--text-secondary);">Declared Quantity:</span>
                            <span style="font-weight: 600;">${item.weight} ${wInfo.unit}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 12px;">
                            <span style="color: var(--text-secondary);">Disposal Handling Cost:</span>
                            <span style="font-weight: 600;">${wInfo.pricePerKg} FCFA / ${wInfo.unit}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding-top: 4px; align-items: center;">
                            <span style="font-weight: 700; color: #92400e;">Collection Cost (SME Pays):</span>
                            <span style="font-size: 24px; font-weight: 800; color: var(--warning);">${formattedValue}</span>
                        </div>
                    </div>

                    <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 28px; line-height: 1.5;">
                        ⚖️ <strong>Compliance:</strong> As an industrial operator in Côte d'Ivoire, you are legally responsible for routing non-recyclable or hazardous waste to MINEDD-approved collectors.
                    </p>

                    <div style="display: flex; gap: 16px;">
                        <button id="btn-find-collector" class="btn btn-primary" style="flex: 1; padding: 14px; background: linear-gradient(135deg, var(--warning), #d97706);">Find Licensed Collectors <i data-lucide="truck"></i></button>
                        <a href="#/sme/dashboard" class="btn btn-secondary" style="padding: 14px;">Go to Dashboard</a>
                    </div>
                </div>
            `}
        </div>
        `;
    },
    afterRender: () => {
        const item = state.tempDeclaration;
        if (!item) return;

        const wInfo = WASTE_TYPES[item.wasteType];
        const btn = wInfo.recyclable ? document.getElementById("btn-find-recycler") : document.getElementById("btn-find-collector");

        if (btn) {
            btn.addEventListener("click", () => {
                // Perform Match routing & add to declarations list
                const now = new Date();
                const dateString = now.toISOString().split('T')[0];

                const finalRecord = {
                    id: "dec-" + (100 + state.declarations.length + 1),
                    date: dateString,
                    company: state.currentUser ? state.currentUser.companyName : "SIPRA Industries",
                    zone: state.currentUser && state.currentUser.details ? state.currentUser.details.industrialZone : "Zone Industrielle de Yopougon",
                    wasteType: item.wasteType,
                    weight: item.weight,
                    recyclable: wInfo.recyclable,
                    status: "Pending Match",
                    value: item.value,
                    co2Avoided: item.co2Avoided,
                    collector: null
                };

                state.declarations.push(finalRecord);
                state.tempDeclaration = null; // reset
                saveState();

                // If recyclable: simulate matched recycler. If non-recyclable: simulate matched collector.
                alert(wInfo.recyclable ? 
                    `🎉 Match requested! We are routing this opportunity to recyclers operating in your industrial zone.` :
                    `🚛 Collection request sent! Collectors in your zone have been notified for handling.`
                );

                window.location.hash = "/sme/collections";
            });
        }
    }
};
