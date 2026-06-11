import { state, WASTE_TYPES } from '../data.js';
import { createCategoryBreakdownChart, createWasteTrendChart } from '../charts.js';

export const SmeDashboardScreen = {
    render: () => {
        // Calculate dynamic dashboard stats based on the mock data
        let totalWaste = 0;
        let revenue = 0;
        let costs = 0;
        let completed = 0;
        let co2 = 0;

        state.declarations.forEach(d => {
            totalWaste += d.weight;
            if (d.value > 0) {
                revenue += d.value;
            } else {
                costs += Math.abs(d.value);
            }
            if (d.status === "Completed") {
                completed++;
            }
            co2 += d.co2Avoided;
        });

        const tableRows = state.declarations.map(d => {
            const wInfo = WASTE_TYPES[d.wasteType];
            const badgeClass = d.status === "Completed" ? "badge-success" : "badge-warning";
            const valDisplay = d.value > 0 ? 
                `<span style="color: var(--primary-dark); font-weight: 600;">+${d.value.toLocaleString()} FCFA</span>` : 
                `<span style="color: var(--danger); font-weight: 600;">-${Math.abs(d.value).toLocaleString()} FCFA</span>`;

            return `
            <tr>
                <td style="font-weight: 600;">#${d.id}</td>
                <td>${d.date}</td>
                <td>${wInfo ? wInfo.emoji : ''} ${wInfo ? wInfo.name : d.wasteType}</td>
                <td>${d.weight} ${wInfo ? wInfo.unit : 'kg'}</td>
                <td>${valDisplay}</td>
                <td><span class="badge ${badgeClass}">${d.status}</span></td>
            </tr>
            `;
        }).reverse().slice(0, 4).join(""); // Recent 4

        return `
        <div class="topbar animate-fade-in">
            <div>
                <h1 class="page-title">SME Dashboard</h1>
                <p style="color: var(--text-secondary); font-size: 14px; margin-top: 4px;">Welcome back, ${state.currentUser ? state.currentUser.companyName : 'SIPRA Industries'}</p>
            </div>
            <div>
                <a href="#/sme/declare" class="btn btn-primary">
                    <i data-lucide="plus-circle" style="width: 18px; height: 18px;"></i> Declare Waste
                </a>
            </div>
        </div>

        <div class="kpi-grid animate-fade-in">
            <div class="card kpi-card">
                <div class="kpi-icon" style="background-color: var(--secondary-light); color: var(--secondary);">📊</div>
                <div class="kpi-details">
                    <span class="kpi-label">Total Generated</span>
                    <span class="kpi-value">${(totalWaste / 1000).toFixed(1)} Tons</span>
                </div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-icon" style="background-color: var(--primary-light); color: var(--primary-dark);">💰</div>
                <div class="kpi-details">
                    <span class="kpi-label">Recyclable Revenue</span>
                    <span class="kpi-value" style="color: var(--primary-dark);">${revenue.toLocaleString()} FCFA</span>
                </div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-icon" style="background-color: #FEE2E2; color: var(--danger);">💸</div>
                <div class="kpi-details">
                    <span class="kpi-label">Disposal Costs</span>
                    <span class="kpi-value" style="color: var(--danger);">${costs.toLocaleString()} FCFA</span>
                </div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-icon" style="background-color: #FEF3C7; color: #D97706;">🚚</div>
                <div class="kpi-details">
                    <span class="kpi-label">Collections Done</span>
                    <span class="kpi-value">${completed}</span>
                </div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-icon" style="background-color: #E0F2FE; color: #0284C7;">🍀</div>
                <div class="kpi-details">
                    <span class="kpi-label">CO₂ Avoided</span>
                    <span class="kpi-value" style="color: #0284C7;">${(co2 / 1000).toFixed(1)} Tons</span>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 32px;" class="desktop-split">
            <div class="card">
                <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; margin-bottom: 20px;">Waste Generation Volume Trend</h3>
                <div style="height: 240px; position: relative;">
                    <canvas id="sme-trend-chart"></canvas>
                </div>
            </div>
            <div class="card">
                <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; margin-bottom: 20px;">Categories Breakdown</h3>
                <div style="height: 240px; position: relative;">
                    <canvas id="sme-pie-chart"></canvas>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 2.2fr 1fr; gap: 24px;" class="desktop-split animate-fade-in">
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700;">Recent Declarations & Collections</h3>
                    <a href="#/sme/collections" style="color: var(--primary); font-size: 14px; font-weight: 600; text-decoration: none;">View All</a>
                </div>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Net Value</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows || `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No recent declarations found.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; margin-bottom: 12px;">Quick Actions</h3>
                    <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 20px;">Common operations for SME managers</p>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <a href="#/sme/declare" class="btn btn-secondary" style="justify-content: flex-start; gap: 12px; padding: 14px;">
                        <span>📦</span> Declare New Waste Stream
                    </a>
                    <button class="btn btn-secondary" style="justify-content: flex-start; gap: 12px; padding: 14px;" onclick="window.location.hash='#/sme/collections'">
                        <span>🚛</span> Request Pick-up Collection
                    </button>
                    <a href="#/sme/esg" class="btn btn-secondary" style="justify-content: flex-start; gap: 12px; padding: 14px;">
                        <span>📄</span> Download ESG Performance Report
                    </a>
                </div>
            </div>
        </div>
        `;
    },
    afterRender: () => {
        // Aggregate volumes for trends
        // We'll populate some static trend arrays representing months or sectors based on declarations
        const trendLabels = ["Feb", "Mar", "Apr", "May", "Jun"];
        const trendData = [1800, 2400, 3100, 2900, 0];

        // Add current month data dynamically
        let currentMonthVol = 0;
        state.declarations.forEach(d => {
            currentMonthVol += d.weight;
        });
        trendData[4] = currentMonthVol;

        // Breakdown categories: Plastic, Cardboard, Metal, Used Oil, Mixed/Hazardous
        const breakdownData = [0, 0, 0, 0, 0];
        state.declarations.forEach(d => {
            if (d.wasteType === 'plastic') breakdownData[0] += d.weight;
            else if (d.wasteType === 'cardboard') breakdownData[1] += d.weight;
            else if (d.wasteType === 'metal') breakdownData[2] += d.weight;
            else if (d.wasteType === 'oil') breakdownData[3] += d.weight;
            else breakdownData[4] += d.weight;
        });

        // Initialize charts
        createWasteTrendChart("sme-trend-chart", trendLabels, trendData);
        createCategoryBreakdownChart("sme-pie-chart", breakdownData);
    }
};
