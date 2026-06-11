import { state, loadState } from './data.js';

// Import Screens
import { LoginScreen } from './screens/login.js';
import { RegisterSmeScreen } from './screens/register-sme.js';
import { RegisterRecyclerScreen } from './screens/register-recycler.js';
import { SmeDashboardScreen } from './screens/sme-dashboard.js';
import { WasteDeclarationScreen } from './screens/waste-declaration.js';
import { WasteResultScreen } from './screens/waste-result.js';
import { CollectionsScreen } from './screens/collections.js';
import { EsgReportScreen } from './screens/esg-report.js';
import { ProfileScreen } from './screens/profile.js';
import { MatchingAlertsScreen } from './screens/matching-alert.js';
import { CollectionValidationScreen } from './screens/collection-validation.js';
import { AnalyticsDashboardScreen } from './screens/analytics.js';

const routes = {
    "/login": LoginScreen,
    "/register/sme": RegisterSmeScreen,
    "/register/recycler": RegisterRecyclerScreen,
    "/sme/dashboard": SmeDashboardScreen,
    "/sme/declare": WasteDeclarationScreen,
    "/sme/result": WasteResultScreen,
    "/sme/collections": CollectionsScreen,
    "/sme/esg": EsgReportScreen,
    "/sme/profile": ProfileScreen,
    "/recycler/dashboard": AnalyticsDashboardScreen,
    "/recycler/alerts": MatchingAlertsScreen,
    "/recycler/collections": CollectionsScreen,
    "/recycler/scanner": CollectionValidationScreen,
    "/recycler/profile": ProfileScreen
};

function renderLayout(contentHtml, userRole) {
    if (!userRole) {
        return contentHtml; // Auth screens don't get sidebar or bottom navbar
    }

    const isSme = userRole === "sme";
    const sidebarMenu = isSme ? `
        <li class="nav-item" id="nav-sme-dashboard"><a href="#/sme/dashboard"><i data-lucide="layout-dashboard"></i> Dashboard</a></li>
        <li class="nav-item" id="nav-sme-declare"><a href="#/sme/declare"><i data-lucide="plus-circle"></i> Declare Waste</a></li>
        <li class="nav-item" id="nav-sme-collections"><a href="#/sme/collections"><i data-lucide="truck"></i> Collections</a></li>
        <li class="nav-item" id="nav-sme-esg"><a href="#/sme/esg"><i data-lucide="file-bar-chart"></i> ESG Reports</a></li>
        <li class="nav-item" id="nav-sme-profile"><a href="#/sme/profile"><i data-lucide="user"></i> Profile</a></li>
    ` : `
        <li class="nav-item" id="nav-recycler-dashboard"><a href="#/recycler/dashboard"><i data-lucide="line-chart"></i> Analytics</a></li>
        <li class="nav-item" id="nav-recycler-alerts"><a href="#/recycler/alerts"><i data-lucide="bell"></i> Matching Alerts</a></li>
        <li class="nav-item" id="nav-recycler-collections"><a href="#/recycler/collections"><i data-lucide="truck"></i> Collections</a></li>
        <li class="nav-item" id="nav-recycler-scanner"><a href="#/recycler/scanner"><i data-lucide="qr-code"></i> QR Scanner</a></li>
        <li class="nav-item" id="nav-recycler-profile"><a href="#/recycler/profile"><i data-lucide="user"></i> Profile</a></li>
    `;

    const mobileMenu = isSme ? `
        <a href="#/sme/dashboard" class="mobile-nav-item" id="mob-sme-dashboard"><i data-lucide="layout-dashboard"></i>Dashboard</a>
        <a href="#/sme/declare" class="mobile-nav-item" id="mob-sme-declare"><i data-lucide="plus-circle"></i>Declare</a>
        <a href="#/sme/collections" class="mobile-nav-item" id="mob-sme-collections"><i data-lucide="truck"></i>Collections</a>
        <a href="#/sme/esg" class="mobile-nav-item" id="mob-sme-esg"><i data-lucide="file-bar-chart"></i>ESG</a>
        <a href="#/sme/profile" class="mobile-nav-item" id="mob-sme-profile"><i data-lucide="user"></i>Profile</a>
    ` : `
        <a href="#/recycler/dashboard" class="mobile-nav-item" id="mob-recycler-dashboard"><i data-lucide="line-chart"></i>Analytics</a>
        <a href="#/recycler/alerts" class="mobile-nav-item" id="mob-recycler-alerts"><i data-lucide="bell"></i>Alerts</a>
        <a href="#/recycler/collections" class="mobile-nav-item" id="mob-recycler-collections"><i data-lucide="truck"></i>Collections</a>
        <a href="#/recycler/scanner" class="mobile-nav-item" id="mob-recycler-scanner"><i data-lucide="qr-code"></i>Scanner</a>
        <a href="#/recycler/profile" class="mobile-nav-item" id="mob-recycler-profile"><i data-lucide="user"></i>Profile</a>
    `;

    return `
        <div class="sidebar">
            <div class="logo-container">
                <div class="logo-icon">♻️</div>
                <div class="logo-text">EcoCycle CI</div>
            </div>
            <ul class="nav-menu">
                ${sidebarMenu}
            </ul>
            <div class="sidebar-footer">
                <div class="avatar">${state.currentUser ? state.currentUser.companyName.charAt(0) : 'E'}</div>
                <div class="user-info">
                    <div class="user-name">${state.currentUser ? state.currentUser.companyName : 'Guest'}</div>
                    <div class="user-role">${state.currentUser ? state.currentUser.role.toUpperCase() : 'USER'}</div>
                </div>
            </div>
        </div>
        <div class="main-layout">
            <div id="screen-container">
                ${contentHtml}
            </div>
        </div>
        <nav class="mobile-nav">
            ${mobileMenu}
        </nav>
    `;
}

function updateActiveNavLinks(path) {
    // Clear all active classes
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    document.querySelectorAll(".mobile-nav-item").forEach(item => item.classList.remove("active"));

    // Set active based on path
    const normalized = path.replace("/", "").replace("/", "-");
    const deskNav = document.getElementById(`nav-${normalized}`);
    const mobNav = document.getElementById(`mob-${normalized}`);

    if (deskNav) deskNav.classList.add("active");
    if (mobNav) mobNav.classList.add("active");
}

async function router() {
    loadState();
    const appEl = document.getElementById("app");
    const rawHash = window.location.hash;
    let path = rawHash.slice(1) || "/";

    // Unauthenticated Redirects
    if (!state.currentUser && path !== "/register/sme" && path !== "/register/recycler") {
        path = "/login";
        window.location.hash = "/login";
    }

    // Default authenticated dashboard routing
    if (state.currentUser && (path === "/" || path === "/login")) {
        if (state.currentUser.role === "sme") {
            path = "/sme/dashboard";
            window.location.hash = "/sme/dashboard";
        } else {
            path = "/recycler/dashboard";
            window.location.hash = "/recycler/dashboard";
        }
    }

    const screen = routes[path];
    if (screen) {
        appEl.innerHTML = renderLayout(screen.render(), state.currentUser ? state.currentUser.role : null);
        updateActiveNavLinks(path);
        
        // Setup icons
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Trigger afterRender setup functions
        if (screen.afterRender) {
            screen.afterRender();
        }
    } else {
        // Fallback
        appEl.innerHTML = renderLayout(`
            <div style="text-align: center; padding: 48px;">
                <h1>404 — Page Not Found</h1>
                <p style="color: var(--text-secondary); margin-top: 12px;">The screen you are trying to view does not exist.</p>
                <a href="#/" class="btn btn-primary" style="margin-top: 24px;">Back Home</a>
            </div>
        `, state.currentUser ? state.currentUser.role : null);
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

// Listen for route changes
window.addEventListener("hashchange", router);
window.addEventListener("load", router);
