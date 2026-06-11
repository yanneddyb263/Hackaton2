import { state, WASTE_TYPES } from '../data.js';
import { createRevenueTrendChart, createWasteTrendChart } from '../charts.js';

export const AnalyticsDashboardScreen = {
    render: () => {
        let revenue = 0;
        let wasteProcessed = 0;
        let collections = 0;

        state.declarations.forEach(d => {
            if (d.status === "Completed") {
                collections++;
                wasteProcessed += d.weight;
                // Recycler earns service fees on non-recyclables, but spends buying recyclables.
                // We'll calculate gross earnings from disposal operations + sales.
                if (d.value < 0) {
                    revenue += Math.abs(d.value); // SME paid recycler/collector
                } else {
                    // Let's assume recycler processes and sells recyclable goods with markup of 30%
                    revenue += d.value * 0.3;
                }
            }
        });

        return `
        <div class="topbar animate-fade-in">
            <div>
                <h1 class="page-title">Analytics Dashboard</h1>
                <p style="color: var(--text-secondary); font-size: 14px; margin-top: 4px;">Welcome, Recycler Hub Operator</p>
            </div>
            <div>
                <button class="btn btn-secondary" onclick="window.location.hash='#/recycler/alerts'">
                    <i data-lucide="bell" style="width: 18px; height: 18px;"></i> Alerts List
                </button>
            </div>
        </div>

        <div class="kpi-grid animate-fade-in" style="grid-template-columns: repeat(4, 1fr);">
            <div class="card kpi-card">
                <div class="kpi-icon" style="background-color: var(--secondary-light); color: var(--secondary);">💰</div>
                <div class="kpi-details">
                    <span class="kpi-label">Gross Revenue</span>
                    <span class="kpi-value">${Math.round(revenue).toLocaleString()} FCFA</span>
                </div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-icon" style="background-color: var(--primary-light); color: var(--primary-dark);">⚙️</div>
                <div class="kpi-details">
                    <span class="kpi-label">Waste Processed</span>
                    <span class="kpi-value">${(wasteProcessed / 1000).toFixed(1)} Tons</span>
                </div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-icon" style="background-color: #FEF3C7; color: #D97706;">🚚</div>
                <div class="kpi-details">
                    <span class="kpi-label">Collections Done</span>
                    <span class="kpi-value">${collections}</span>
                </div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-icon" style="background-color: #E0F2FE; color: #0284C7;">📈</div>
                <div class="kpi-details">
                    <span class="kpi-label">Perf. Score</span>
                    <span class="kpi-value" style="color: #0284C7;">98.2%</span>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;" class="desktop-split animate-fade-in">
            <div class="card">
                <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; margin-bottom: 20px;">Revenue Growth Trend (FCFA)</h3>
                <div style="height: 250px; position: relative;">
                    <canvas id="recycler-rev-chart"></canvas>
                </div>
            </div>
            <div class="card">
                <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; margin-bottom: 20px;">Waste Weight Trend (kg)</h3>
                <div style="height: 250px; position: relative;">
                    <canvas id="recycler-vol-chart"></canvas>
                </div>
            </div>
        </div>
        `;
    },
    afterRender: () => {
        // Trend dummy lists
        const months = ["Feb", "Mar", "Apr", "May", "Jun"];
        const revData = [450000, 680000, 920000, 890000, 0];
        const volData = [12000, 18500, 24000, 21200, 0];

        // Dynamic addition of current month completed items
        let curVol = 0;
        let curRevVal = 0;
        state.declarations.forEach(d => {
            if (d.status === "Completed") {
                curVol += d.weight;
                if (d.value < 0) {
                    curRevVal += Math.abs(d.value);
                } else {
                    curRevVal += d.value * 0.3;
                }
            }
        });

        revData[4] = Math.round(curRevVal);
        volData[4] = curVol;

        createRevenueTrendChart("recycler-rev-chart", months, revData);
        createWasteTrendChart("recycler-vol-chart", months, volData);
    }
};
