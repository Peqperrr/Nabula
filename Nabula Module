/*
 * Als grundlegender rechtlicher Rahmen für unser Projekt gilt die folgende Lizenz:
 *
 * © 2025 Nabula / [Maik Reinecker]
 *
 * Dieses Projekt ist unter der **Apache License, Version 2.0** ("die Lizenz") lizenziert. Sie dürfen diese Datei nur in Übereinstimmung mit der Lizenz verwenden.
 *
 * Eine Kopie der Lizenz finden Sie unter:
 * 🔗 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Sofern nicht durch geltendes Recht vorgeschrieben oder schriftlich vereinbart, wird die unter der Lizenz verteilte Software **„WIE BESEHEN"** verteilt, **OHNE JEGLICHE GARANTIEN ODER BEDINGUNGEN**, weder ausdrücklich noch stillschweigend. Informationen zu den spezifischen Rechten und Einschränkungen unter der Lizenz finden Sie in der Lizenz.
 */

// Diagramm initialisieren
const ctx = document.getElementById('channelChart').getContext('2d');
let channelChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Tag 1', 'Tag 5', 'Tag 10', 'Tag 15', 'Tag 20', 'Tag 25', 'Tag 30'],
        datasets: [{
            label: 'Tempkanäle der letzten 30 Tage',
            data: [8, 12, 7, 15, 10, 14, 9],
            backgroundColor: 'rgba(0, 255, 247, 0.1)',
            borderColor: '#00fff7',
            pointBackgroundColor: '#ff00c8',
            pointBorderColor: '#ffffff',
            pointRadius: 4,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#9a9a9a'
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#9a9a9a'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#f4f4f4',
                bodyColor: '#f4f4f4',
                borderColor: '#00fff7',
                borderWidth: 1
            }
        }
    }
});

// Formularübermittlung zur Kanalerstellung
document.querySelector('.create-channel-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const channelName = document.getElementById('channel-name').value;
    const userLimit = document.getElementById('channel-limit').value;
    const selectedDesign = document.querySelector('.design-option.selected').dataset.design;
    
    if (!channelName || !userLimit) {
        showNotification('Alle Felder müssen ausgefüllt sein');
        return;
    }
    
    // Create new channel card
    const channelsGrid = document.querySelector('.channels-grid');
    const newChannel = document.createElement('div');
    newChannel.className = 'channel-card';
    
    newChannel.innerHTML = `
        <div class="card-header">
            <h2 class="card-title">#${channelName}</h2>
            <div class="card-count">${userLimit}/15</div>
        </div>
        
        <div class="card-content ${selectedDesign}">
            <div class="channel-info">
                <span class="channel-icon">🎤</span>
                <span class="channel-created">Erstellt vor 0 minuten</span>
            </div>
            
            <div class="channel-actions">
                <button class="action-button view-button">
                    <span class="button-icon">👁️</span>
                    <span class="button-tooltip">Anzeigen</span>
                </button>
                <button class="action-button kick-button">
                    <span class="button-icon">👢</span>
                    <span class="button-tooltip">Kick</span>
                </button>
                <button class="action-button mute-button">
                    <span class="button-icon">🔇</span>
                    <span class="button-tooltip">Stummschalten</span>
                </button>
                <button class="action-button transfer-button">
                    <span class="button-icon">🔄</span>
                    <span class="button-tooltip">Übernehmen</span>
                </button>
                <button class="action-button delete-button">
                    <span class="button-icon">🗑️</span>
                    <span class="button-tooltip">Löschen</span>
                </button>
            </div>
        </div>
    `;
    
    channelsGrid.appendChild(newChannel);
    
    // Reset form
    document.getElementById('channel-name').value = '';
    document.getElementById('channel-limit').value = '';
    
    // Show success notification
    showNotification(`Kanal #${channelName} erfolgreich erstellt`);
    
    // Add event listeners to new buttons
    addChannelEventListeners(newChannel);
});

// Ereignis-Listener zu Kanalaktionen hinzufügen
function addChannelEventListeners(channelElement) {
    channelElement.querySelector('.view-button')?.addEventListener('click', () => {
        const channelName = channelElement.querySelector('.card-title').textContent;
        showNotification(`Zeige Kanal ${channelName}`);
    });
    
    channelElement.querySelector('.kick-button')?.addEventListener('click', () => {
        const channelName = channelElement.querySelector('.card-title').textContent;
        showNotification(`Benutzer aus ${channelName} gekickt`);
    });
    
    channelElement.querySelector('.mute-button')?.addEventListener('click', () => {
        const channelName = channelElement.querySelector('.card-title').textContent;
        showNotification(`Benutzer in ${channelName} stummgeschaltet`);
    });
    
    channelElement.querySelector('.transfer-button')?.addEventListener('click', () => {
        const channelName = channelElement.querySelector('.card-title').textContent;
        showNotification(`Rechte für ${channelName} übernommen`);
    });
    
    channelElement.querySelector('.delete-button')?.addEventListener('click', () => {
        channelElement.remove();
        const channelName = channelElement.querySelector('.card-title').textContent;
        showNotification(`Kanal ${channelName} gelöscht`);
    });
}

// Auswahl der Design-Option
document.querySelectorAll('.design-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.design-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // Update preview based on selected design
        const designType = option.dataset.design;
        const previews = document.querySelectorAll('.design-preview');
        previews.forEach(preview => {
            preview.className = `design-preview ${designType}`;
        });
        
        showNotification(`Ausgewähltes Design: ${option.querySelector('.design-name').textContent}`);
    });
});

// Vorlagenauswahl
document.querySelector('.template-select')?.addEventListener('change', () => {
    const selectedTemplate = document.querySelector('.template-select').value;
    showNotification(`Vorlage geändert zu ${selectedTemplate}`);
});

// Dauerauswahl
document.querySelector('.apply-button')?.addEventListener('click', () => {
    const duration = document.querySelector('.duration-select').value;
    showNotification(`Maximale Dauer gesetzt auf ${getDurationText(duration)}`);
});

// Benutzer-Limit-Schieberegler
document.querySelector('.user-limit-slider')?.addEventListener('input', (e) => {
    const value = e.target.value;
    document.querySelector('.slider-value').textContent = value;
    
    // Show live update
    document.querySelectorAll('.channel-count').forEach(count => {
        count.textContent = `${value}/15`;
    });
});

// Auto-Bereinigung-Umschalter
document.querySelector('.switch input[type="checkbox"]')?.addEventListener('change', (e) => {
    const autoCleanup = e.target.checked;
    showNotification(`Auto-Cleanup ${autoCleanup ? 'aktiviert' : 'deaktiviert'}`);
});

// Namensfilter-Eingabe
document.querySelector('.name-filter-input')?.addEventListener('input', (e) => {
    const filterCount = e.target.value.split('\n').filter(word => word.trim() !== '').length;
    
    if (filterCount > 0) {
        document.querySelector('.name-filter-input').style.borderColor = '#ff00c8';
    } else {
        document.querySelector('.name-filter-input').style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }
});

// Schaltfläche zum Speichern der Einstellungen
document.querySelector('.save-settings')?.addEventListener('click', () => {
    const template = document.querySelector('.template-select').value;
    const duration = document.querySelector('.duration-select').value;
    const userLimit = document.querySelector('.user-limit-slider').value;
    const autoCleanup = document.querySelector('.switch input[type="checkbox"]').checked;
    const nameFilter = document.querySelector('.name-filter-input').value;
    
    if (!template || !duration || !userLimit) {
        showNotification('Alle Einstellungen müssen konfiguriert werden');
        return;
    }
    
    // In a real application, this would send a request to the server
    showNotification('Einstellungen erfolgreich gespeichert');
});

// Vorlagengalerie-Auswahl
document.querySelectorAll('.template-item')?.forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.template-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        
        showNotification(`Designvorlage geändert zu ${item.querySelector('.template-name').textContent}`);
    });
});

// Kanal-Bearbeitungsschaltflächen
const allChannels = document.querySelectorAll('.channel-card');
allChannels.forEach(channel => {
    addChannelEventListeners(channel);
});

// Hilfsfunktionen
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `<span class="notification-icon">✅</span>${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getDurationText(duration) {
    switch(duration) {
        case '30m': return '30 Minuten';
        case '1h': return '1 Stunde';
        case '2h': return '2 Stunden';
        default: return 'Unbegrenzt';
    }
}
setInterval(() => {
    document.querySelectorAll('.channel-created').forEach(element => {
        const currentText = element.textContent;
        if (currentText.startsWith('Erstellt vor')) {
            const minutes = parseInt(currentText.replace(/[^\d]/g, '')) + 1;
            element.textContent = `Erstellt vor ${minutes} Minuten`;
        }
    });
}, 60000); // Update every minute