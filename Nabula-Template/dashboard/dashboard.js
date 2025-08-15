/*
 * NABULA Dashboard Specific Functions
 * This file handles the logic for the main dashboard page.
 * 
 * @author Maik
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===============================
    // Dashboard Initialization
    // ===============================
    
    // Mock data for server statistics
    const serverStats = {
        server1: [
            { icon: '👥', value: '1,234', label: 'Total Members' },
            { icon: '🟢', value: '150', label: 'Online Members' },
            { icon: '💬', value: '5,678', label: 'Messages Today' },
            { icon: '🏆', value: 'Level 42', label: 'Highest Level' }
        ],
        server2: [
            { icon: '👥', value: '456', label: 'Total Members' },
            { icon: '🟢', value: '50', label: 'Online Members' },
            { icon: '💬', value: '1,234', label: 'Messages Today' },
            { icon: '🏆', value: 'Level 21', label: 'Highest Level' }
        ]
    };

    const statsGrid = document.getElementById('stats-grid');
    const serverSelector = document.getElementById('server-selector');

    /**
     * Renders the statistics cards on the dashboard.
     * @param {string} serverId The ID of the selected server.
     */
    function renderStats(serverId) {
        if (!statsGrid) return;

        // Clear previous stats
        statsGrid.innerHTML = '';

        const stats = serverStats[serverId] || [];

        if (stats.length === 0) {
            statsGrid.innerHTML = '<div class="settings-card">No stats available for this server.</div>';
            return;
        }

        stats.forEach(stat => {
            const card = document.createElement('div');
            card.className = 'settings-card'; // Using settings-card style for consistency
            
            card.innerHTML = `
                <div class="settings-card-body" style="align-items: center; text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">${stat.icon}</div>
                    <div style="font-size: 2rem; font-weight: 600; color: var(--accent-pink);">${stat.value}</div>
                    <div style="color: var(--text-muted);">${stat.label}</div>
                </div>
            `;
            statsGrid.appendChild(card);
        });
    }

    // Event listener for the server selector dropdown
    if (serverSelector) {
        serverSelector.addEventListener('change', function() {
            const selectedServer = this.value;
            // In a real app, you would fetch new data from the API here
            showNotification(`Loading stats for ${this.options[this.selectedIndex].text}...`, 'info');
            renderStats(selectedServer);
        });
    }

    // Initial render of stats for the default selected server
    if (serverSelector) {
        renderStats(serverSelector.value);
    }
});
