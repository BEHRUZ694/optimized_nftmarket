// NFT Marketplace JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menu Functionality
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function() {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = hamburgerBtn.classList.contains('active');
            hamburgerBtn.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnButton = hamburgerBtn.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnButton && navMenu.classList.contains('active')) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Newsletter Form Submission
    const newsletterForms = document.querySelectorAll('.subscribe-form, .subscribe-form-2, .newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = form.querySelector('.enter-your-email, .newsletter-input');
            if (emailInput && emailInput.value) {
                // Sanitize input
                const sanitizedEmail = sanitizeInput(emailInput.value);
                if (isValidEmail(sanitizedEmail)) {
                    showNotification('Thank you for subscribing to our newsletter!', 'success');
                    emailInput.value = '';
                } else {
                    showNotification('Please enter a valid email address.', 'error');
                }
            } else {
                showNotification('Please enter your email address.', 'error');
            }
        });
    });
    
    // Search Functionality (Marketplace page)
    const searchInput = document.querySelector('.rank-artist');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Filter NFT cards based on search input
            const searchTerm = this.value.toLowerCase().trim();
            const nftCards = document.querySelectorAll('.NFT-card, .table-row');
            
            nftCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm) || searchTerm === '') {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Tab Functionality (Rankings page)
    const tabButtons = document.querySelectorAll('.tab-item, .tab, .tab-2');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            const allTabs = this.parentElement.querySelectorAll('.tab-item, .tab, .tab-2');
            allTabs.forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Update content based on selected tab (if needed)
            const selectedTab = this.dataset.tab || this.textContent.trim().toLowerCase();
            updateRankingsContent(selectedTab);
        });
    });
    
    // NFT Card Interactions
    const nftCards = document.querySelectorAll('.NFT-card, .collection-card, .category-card');
    nftCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // You can add navigation logic here
            console.log('Card clicked:', this);
        });
        
        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Button Hover Effects
    const buttons = document.querySelectorAll('.button, .button-2, .button-3, .button-4, .button-6, .create-account-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Add focus styles for accessibility
        button.addEventListener('focus', function() {
            this.style.outline = '2px solid #a259ff';
            this.style.outlineOffset = '2px';
        });
        
        button.addEventListener('blur', function() {
            this.style.outline = '';
        });
    });
    
    // Form Validation (Register page)
    const registerForm = document.querySelector('.input-group');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = this.querySelector('input[type="text"]')?.value;
            const email = this.querySelector('input[type="email"]')?.value;
            const password = this.querySelector('input[type="password"]')?.value;
            const confirmPassword = this.querySelectorAll('input[type="password"]')[1]?.value;
            
            if (!validateForm(username, email, password, confirmPassword)) {
                return;
            }
            
            showNotification('Account created successfully! Welcome to NFT Marketplace!', 'success');
            this.reset();
        });
    }
    
    // Connect Wallet Buttons
    const connectWalletButtons = document.querySelectorAll('.wallet-connect-btn');
    connectWalletButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            const walletType = this.getAttribute('data-wallet');

            if (!walletType) {
                showNotification('Wallet type not specified', 'error');
                return;
            }

            // Disable button during connection
            this.disabled = true;
            this.textContent = 'Connecting...';

            try {
                await connectWallet(walletType);
            } catch (error) {
                console.error('Wallet connection error:', error);
                showNotification('Failed to connect wallet. Please try again.', 'error');
            } finally {
                // Re-enable button
                this.disabled = false;
                this.textContent = `Connect ${this.textContent.replace('Connecting...', '').replace('Connect ', '')}`;
            }
        });
    });

    // Legacy wallet buttons (for other pages)
    const walletButtons = document.querySelectorAll('a[href="#connect-wallet"]');
    walletButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Please visit the Connect Wallet page to connect your wallet.', 'info');
        });
    });
    
    // Smooth Scroll for Internal Links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Lazy Loading for Images
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }

    // Check for existing wallet connection
    checkWalletConnection();
});

// Utility Functions
function validateForm(username, email, password, confirmPassword) {
    let isValid = true;
    let message = '';
    
    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword);
    
    if (!sanitizedUsername || sanitizedUsername.length < 3) {
        message = 'Username must be at least 3 characters long.';
        isValid = false;
    } else if (!sanitizedEmail || !isValidEmail(sanitizedEmail)) {
        message = 'Please enter a valid email address.';
        isValid = false;
    } else if (!sanitizedPassword || sanitizedPassword.length < 6) {
        message = 'Password must be at least 6 characters long.';
        isValid = false;
    } else if (sanitizedPassword !== sanitizedConfirmPassword) {
        message = 'Passwords do not match.';
        isValid = false;
    }
    
    if (!isValid) {
        showNotification(message, 'error');
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    // Remove potentially harmful characters
    return input.replace(/[<>"'&]/g, function(match) {
        switch (match) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#x27;';
            case '&': return '&amp;';
            default: return match;
        }
    }).trim();
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ac4f' : type === 'error' ? '#ff4444' : '#a259ff'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function updateRankingsContent(period) {
    // This function can be extended to filter rankings by different time periods
    console.log('Updating rankings for period:', period);
    
    // You could add logic here to show different data based on selected period
    // For now, we'll just add a visual indicator
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach(row => {
        row.style.opacity = '0.7';
        setTimeout(() => {
            row.style.opacity = '1';
        }, 200);
    });
}

// Wallet Connection Functions
let web3;
let currentAccount = null;

async function connectWallet(walletType) {
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            if (walletType === 'metamask') {
                throw new Error('MetaMask is not installed. Please install MetaMask extension.');
            } else {
                throw new Error('No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.');
            }
        }

        // Initialize Web3
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        } else {
            throw new Error('No Web3 provider found. Please install MetaMask or another Web3 wallet.');
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts.length === 0) {
            throw new Error('No accounts found. Please unlock your wallet and try again.');
        }

        currentAccount = accounts[0];

        // Get network information
        const networkId = await web3.eth.net.getId();
        const networkName = getNetworkName(networkId);

        // Update UI
        updateWalletUI(walletType, currentAccount, networkName);

        // Store connection state
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletType', walletType);
        localStorage.setItem('walletAddress', currentAccount);

        showNotification(`Successfully connected to ${walletType} on ${networkName}!`, 'success');

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountChange);
        window.ethereum.on('chainChanged', handleChainChange);

    } catch (error) {
        console.error('Wallet connection error:', error);

        if (error.code === 4001) {
            // User rejected the request
            throw new Error('Connection rejected by user.');
        } else if (error.code === -32002) {
            // Request already pending
            throw new Error('Connection request already pending. Check your wallet.');
        } else {
            throw error;
        }
    }
}

function getNetworkName(networkId) {
    const networks = {
        1: 'Ethereum Mainnet',
        3: 'Ropsten Testnet',
        4: 'Rinkeby Testnet',
        5: 'Goerli Testnet',
        42: 'Kovan Testnet',
        56: 'Binance Smart Chain',
        137: 'Polygon Mainnet',
        80001: 'Mumbai Testnet',
        43114: 'Avalanche C-Chain',
        250: 'Fantom Opera',
        42161: 'Arbitrum One'
    };
    return networks[networkId] || `Network ${networkId}`;
}

function updateWalletUI(walletType, address, network) {
    // Update wallet buttons to show connected state
    const connectButtons = document.querySelectorAll('.wallet-connect-btn');
    connectButtons.forEach(button => {
        if (button.getAttribute('data-wallet') === walletType) {
            button.textContent = `Connected (${address.slice(0, 6)}...${address.slice(-4)})`;
            button.disabled = true;
            button.style.backgroundColor = '#00ac4f';
        } else {
            button.style.display = 'none'; // Hide other wallet options when connected
        }
    });

    // Add disconnect button
    const walletSection = document.querySelector('.wallet-cards-container');
    if (walletSection && !document.querySelector('.disconnect-wallet-btn')) {
        const disconnectBtn = document.createElement('button');
        disconnectBtn.className = 'wallet-connect-btn disconnect-wallet-btn';
        disconnectBtn.innerHTML = `Disconnect Wallet (${network})`;
        disconnectBtn.style.backgroundColor = '#ff4444';
        disconnectBtn.style.marginTop = '20px';

        disconnectBtn.addEventListener('click', disconnectWallet);
        walletSection.appendChild(disconnectBtn);
    }

    // Update navigation if it exists
    const navWalletBtn = document.querySelector('a[href="connect-wallet.html"] .button');
    if (navWalletBtn) {
        navWalletBtn.textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
}

function disconnectWallet() {
    // Clear connection state
    currentAccount = null;
    web3 = null;
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletType');
    localStorage.removeItem('walletAddress');

    // Reset UI
    const connectButtons = document.querySelectorAll('.wallet-connect-btn');
    connectButtons.forEach(button => {
        button.disabled = false;
        button.style.display = '';
        button.style.backgroundColor = '';
        const walletType = button.getAttribute('data-wallet');
        if (walletType) {
            const walletNames = {
                metamask: 'MetaMask',
                walletconnect: 'WalletConnect',
                coinbase: 'Coinbase',
                ledger: 'Ledger',
                trezor: 'Trezor',
                trust: 'Trust Wallet'
            };
            button.textContent = `Connect ${walletNames[walletType] || walletType}`;
        }
    });

    // Remove disconnect button
    const disconnectBtn = document.querySelector('.disconnect-wallet-btn');
    if (disconnectBtn) {
        disconnectBtn.remove();
    }

    // Update navigation
    const navWalletBtn = document.querySelector('a[href="connect-wallet.html"] .button');
    if (navWalletBtn) {
        navWalletBtn.textContent = 'Connect a wallet';
    }

    showNotification('Wallet disconnected successfully.', 'info');

    // Remove event listeners
    if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
        window.ethereum.removeListener('chainChanged', handleChainChange);
    }
}

function handleAccountChange(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
        showNotification('Wallet disconnected - no accounts found.', 'error');
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        localStorage.setItem('walletAddress', currentAccount);
        showNotification('Account changed successfully.', 'success');
        // Refresh the page to update UI
        setTimeout(() => location.reload(), 1000);
    }
}

function handleChainChange(chainId) {
    // Reload the page when network changes
    showNotification('Network changed. Refreshing page...', 'info');
    setTimeout(() => location.reload(), 1000);
}

// Check for existing wallet connection on page load
function checkWalletConnection() {
    const isConnected = localStorage.getItem('walletConnected') === 'true';
    const walletType = localStorage.getItem('walletType');
    const walletAddress = localStorage.getItem('walletAddress');

    if (isConnected && walletType && walletAddress && typeof window.ethereum !== 'undefined') {
        // Verify the connection is still valid
        window.ethereum.request({ method: 'eth_accounts' })
            .then(accounts => {
                if (accounts.length > 0 && accounts[0] === walletAddress) {
                    currentAccount = walletAddress;
                    web3 = new Web3(window.ethereum);
                    return web3.eth.net.getId();
                } else {
                    // Connection is invalid, clear storage
                    localStorage.removeItem('walletConnected');
                    localStorage.removeItem('walletType');
                    localStorage.removeItem('walletAddress');
                }
            })
            .then(networkId => {
                if (networkId) {
                    const networkName = getNetworkName(networkId);
                    updateWalletUI(walletType, walletAddress, networkName);

                    // Re-attach event listeners
                    window.ethereum.on('accountsChanged', handleAccountChange);
                    window.ethereum.on('chainChanged', handleChainChange);
                }
            })
            .catch(error => {
                console.error('Error checking wallet connection:', error);
                // Clear invalid connection
                localStorage.removeItem('walletConnected');
                localStorage.removeItem('walletType');
                localStorage.removeItem('walletAddress');
            });
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-close:hover,
    .notification-close:focus {
        opacity: 0.8;
        outline: 2px solid white;
        outline-offset: 2px;
    }

    .disconnect-wallet-btn {
        width: 100% !important;
        max-width: 400px !important;
        margin: 20px auto 0 !important;
        display: block !important;
    }

    .disconnect-wallet-btn:hover {
        background-color: #cc0000 !important;
        transform: scale(0.98) !important;
    }
`;
document.head.appendChild(style);