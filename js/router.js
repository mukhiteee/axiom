class AxiomRouter {
    constructor() {
        this.currentView = 'overview';
        this.views = ['overview', 'habits', 'calendar', 'analytics', 'wrapped', 'profile', 'settings'];
        this.contentArea = document.getElementById('main-content');
    }

    init() {
        const hash = window.location.hash.slice(1) || 'overview';
        this.loadView(hash);
        window.addEventListener('hashchange', () => this.loadView(window.location.hash.slice(1)));
    }

    async loadView(view) {
        if (!this.views.includes(view)) view = 'overview';
        
        try {
            const response = await fetch(`pages/${view}.html?t=${Date.now()}`);
            this.contentArea.innerHTML = await response.text();
            
            // Re-run any scripts found in the new HTML
            this.contentArea.querySelectorAll('script').forEach(s => {
                const newScript = document.createElement('script');
                newScript.textContent = s.textContent;
                s.parentNode.replaceChild(newScript, s);
            });

            // Fire the Handshake
            document.dispatchEvent(new CustomEvent('view-loaded', { detail: { view } }));
            
        } catch (err) {
            console.error("Router failed:", err);
        }
    }
}

window.AxiomRouter = new AxiomRouter();
document.addEventListener('DOMContentLoaded', () => window.AxiomRouter.init());