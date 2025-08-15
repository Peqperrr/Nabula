/*
 * NABULA Common Functions
 * This file contains all common functions for the NABULA template's
 * and can be used by any HTML page.
 * @author Maik
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===============================
    // General Interactions
    // ===============================

    // Cursor follower effect
    const cursor = document.querySelector('.cursor-follower');
    if (cursor) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });

        const interactiveElements = document.querySelectorAll('a, button, .nav-item, .settings-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function(event) {
                cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(2)`;
            });
            element.addEventListener('mouseleave', function(event) {
                cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(1)`;
            });
        });
    }

    // Button glow effect
    const glowButtons = document.querySelectorAll('.discord-login, .submit-button');
    glowButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            const glow = this.querySelector('span[class$="-glow"]');
            if (glow) glow.style.opacity = '1';
        });
        button.addEventListener('mouseleave', function() {
            const glow = this.querySelector('span[class$="-glow"]');
            if (glow) glow.style.opacity = '0';
        });
    });

    // ===============================
    // Login Functionality
    // ===============================
    const loginForm = document.querySelector('.auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, validation and a login request would happen here
            window.location.href = 'setting.html'; // Navigate to a dashboard page
        });
    }

    const discordLoginBtn = document.querySelector('.discord-login');
    if (discordLoginBtn) {
        discordLoginBtn.addEventListener('click', function() {
            // In a real app, this would redirect to the Discord OAuth flow
            window.location.href = 'setting.html'; // Navigate to a dashboard page
        });
    }

    // ===============================
    // Add Notification Styles
    // ===============================
    addNotificationStyles();
});


// ===============================
// Helper Functions
// ===============================

function showNotification(message, type = 'info') {
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    const closeButton = document.createElement('span');
    closeButton.className = 'close-notification';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', function() {
        notification.remove();
    });

    notification.appendChild(closeButton);
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

function addNotificationStyles() {
    if (!document.querySelector('#notification-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'notification-styles';
        styleElement.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .notification {
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 250px;
                backdrop-filter: blur(5px);
                animation: slideInFromRight 0.3s ease-out;
                position: relative;
            }
            .notification.success {
                border-left: 4px solid var(--accent-cyan, #00fff7);
            }
            .notification.error {
                border-left: 4px solid var(--accent-pink, #ff00c8);
            }
            .notification.info {
                border-left: 4px solid #3498db;
            }
            .close-notification {
                cursor: pointer;
                font-size: 18px;
                margin-left: 10px;
            }
            .notification.fade-out {
                opacity: 0;
                transform: translateX(50px);
                transition: opacity 0.5s, transform 0.5s;
            }
            @keyframes slideInFromRight {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Global navigation function
window.navigateTo = function(page) {
    window.location.href = page;
};
