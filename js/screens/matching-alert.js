import { state, saveState, WASTE_TYPES } from '../data.js';

export const MatchingAlertsScreen = {
    render: () => {
        const alertsList = state.matchingAlerts.map(a => {
            const wInfo = WASTE_TYPES[a.wasteType];
            const isRecyclable = wInfo.recyclable;
            
            return `
            <div class="card alert-card animate-fade-in" data-id="${a.id}" style="border-left: 6px solid ${isRecyclable ? 'var(--primary)' : 'var(--warning)'}; margin-bottom: 20px; transition: var(--transition);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                    <div>
                        <span class="badge ${isRecyclable ? 'badge-success' : 'badge-warning'}" style="margin-bottom: 8px;">
                            ${isRecyclable ? 'Recyclable Purchase Opportunity' : 'Disposal Service Opportunity'}
                        </span>
                        <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">
                            ${a.smeName}
                        </h3>
                        <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px; display: inline-flex; align-items: center; gap: 4px;">
                            📍 Zone: <strong>${a.zone}</strong> (${a.distance} km away)
                        </p>
                    </div>
                    <div style="font-size: 32px;">${wInfo ? wInfo.emoji : '📦'}</div>
                </div>

                <div style="background-color: var(--bg-light); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border: 1px solid var(--border);">
                    <div>
                        <span style="font-size: 12px; color: var(--text-secondary);">Declared Stream</span>
                        <p style="font-weight: 600; font-size: 15px; margin-top: 2px;">${wInfo ? wInfo.name : a.wasteType}</p>
                    </div>
                    <div>
                        <span style="font-size: 12px; color: var(--text-secondary);">Est. Quantity</span>
                        <p style="font-weight: 600; font-size: 15px; margin-top: 2px;">${a.weight} ${wInfo ? wInfo.unit : 'kg'}</p>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 12px; color: var(--text-secondary);">${isRecyclable ? 'Purchase Cost (Pay SME)' : 'Service Revenue (Collect)'}</span>
                        <p style="font-weight: 700; font-size: 16px; color: ${isRecyclable ? 'var(--danger)' : 'var(--primary-dark)'}; margin-top: 2px;">
                            ${a.value.toLocaleString()} FCFA
                        </p>
                    </div>
                </div>

                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="btn btn-secondary btn-decline" data-id="${a.id}">Decline</button>
                    <button class="btn btn-primary btn-accept" data-id="${a.id}">Accept Opportunity <i data-lucide="check"></i></button>
                </div>
            </div>
            `;
        }).join("");

        return `
        <div class="topbar animate-fade-in">
            <div>
                <h1 class="page-title">Matching Opportunities</h1>
                <p style="color: var(--text-secondary); font-size: 14px; margin-top: 4px;">Direct requests matching your location and pricing preferences.</p>
            </div>
        </div>

        <div style="max-width: 750px; margin: 0 auto;">
            ${alertsList || `
                <div class="card animate-fade-in" style="text-align: center; padding: 48px;">
                    <span style="font-size: 48px;">📭</span>
                    <h3 style="font-family: var(--font-heading); margin-top: 16px;">All Caught Up!</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">No new matching declarations in your service zones at the moment.</p>
                </div>
            `}
        </div>
        `;
    },
    afterRender: () => {
        document.querySelectorAll(".btn-accept").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const alertId = e.target.closest("button").dataset.id;
                const matchObj = state.matchingAlerts.find(a => a.id === alertId);
                if (!matchObj) return;

                // Move from matching alerts to collections list
                const now = new Date();
                const dateString = now.toISOString().split('T')[0];
                const wInfo = WASTE_TYPES[matchObj.wasteType];

                const finalRecord = {
                    id: "dec-" + (100 + state.declarations.length + 1),
                    date: dateString,
                    company: matchObj.smeName,
                    zone: matchObj.zone,
                    wasteType: matchObj.wasteType,
                    weight: matchObj.weight,
                    recyclable: wInfo.recyclable,
                    status: "Matched",
                    value: wInfo.recyclable ? matchObj.value : -matchObj.value,
                    co2Avoided: Math.round(matchObj.weight * wInfo.co2SavedPerKg),
                    collector: state.recyclerConfig.companyName
                };

                state.declarations.push(finalRecord);
                state.matchingAlerts = state.matchingAlerts.filter(a => a.id !== alertId);
                
                saveState();
                alert(`🤝 Opportunity accepted! The collection has been scheduled. View details in the collections list.`);
                window.location.hash = "/recycler/collections";
            });
        });

        document.querySelectorAll(".btn-decline").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const alertId = e.target.closest("button").dataset.id;
                state.matchingAlerts = state.matchingAlerts.filter(a => a.id !== alertId);
                saveState();
                window.location.reload();
            });
        });
    }
};
