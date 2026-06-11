import { state, saveState, WASTE_TYPES } from '../data.js';

export const CollectionsScreen = {
    render: () => {
        const isSme = state.currentUser && state.currentUser.role === "sme";
        
        // Render collections table
        const rows = state.declarations.map(d => {
            const wInfo = WASTE_TYPES[d.wasteType];
            const displayValue = d.value > 0 ? 
                `<span style="color: var(--primary-dark); font-weight:600;">+${d.value.toLocaleString()} FCFA</span>` :
                `<span style="color: var(--danger); font-weight:600;">-${Math.abs(d.value).toLocaleString()} FCFA</span>`;
            
            let statusBadge = `<span class="badge badge-warning">${d.status}</span>`;
            if (d.status === "Completed") {
                statusBadge = `<span class="badge badge-success">Completed</span>`;
            } else if (d.status === "Matched") {
                statusBadge = `<span class="badge badge-success" style="background-color: var(--secondary-light); color: var(--secondary);">Matched</span>`;
            }

            let actionBtn = "";
            if (!isSme && d.status === "Matched") {
                actionBtn = `<a href="#/recycler/scanner" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;">Validate QR</a>`;
            } else if (isSme && d.status === "Pending Match") {
                actionBtn = `<span style="font-size:12px; color: var(--text-secondary);">Awaiting match</span>`;
            }

            return `
            <tr>
                <td style="font-weight:600;">#${d.id}</td>
                <td>${d.date}</td>
                ${isSme ? '' : `<td>${d.company}</td>`}
                <td>${wInfo ? wInfo.emoji : ''} ${wInfo ? wInfo.name : d.wasteType}</td>
                <td>${d.weight} ${wInfo ? wInfo.unit : 'kg'}</td>
                <td>${displayValue}</td>
                <td>${statusBadge}</td>
                <td>${actionBtn || '—'}</td>
            </tr>
            `;
        }).reverse().join("");

        return `
        <div class="topbar animate-fade-in">
            <div>
                <h1 class="page-title">Waste Collections</h1>
                <p style="color: var(--text-secondary); font-size:14px; margin-top: 4px;">Monitor ongoing collections, matches, and operational tickets.</p>
            </div>
            ${isSme ? `
                <a href="#/sme/declare" class="btn btn-primary">
                    <i data-lucide="plus-circle" style="width: 18px; height: 18px;"></i> Request Collection
                </a>
            ` : ''}
        </div>

        <div class="card animate-fade-in">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date Ordered</th>
                            ${isSme ? '' : '<th>SME Client</th>'}
                            <th>Waste Stream</th>
                            <th>Weight/Volume</th>
                            <th>Net Transaction</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--text-secondary);">No collections recorded yet.</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
        `;
    },
    afterRender: () => {
        // No extra operations needed
    }
};
