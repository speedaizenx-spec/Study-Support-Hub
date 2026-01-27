// FindIt School Lost & Found System - Professional Version

// ===== APPLICATION STATE =====
const state = {
    currentUser: null,
    users: [],
    items: [],
    comments: [],
    messages: [],
    passwordRequests: [],
    currentPage: 'home',
    notifications: [],
    search: {
        lost: '',
        found: ''
    }
};

// ===== DOM ELEMENTS =====
const elements = {
    // Navigation
    navMenu: document.getElementById('navMenu'),
    mobileToggle: document.getElementById('mobileToggle'),
    navLinks: document.querySelectorAll('.nav-link'),
    authBtn: document.getElementById('authBtn'),
    inboxBtn: document.getElementById('inboxBtn'),
    adminBtn: document.getElementById('adminBtn'),
    userProfile: document.getElementById('userProfile'),
    profileTrigger: document.getElementById('profileTrigger'),
    profileMenu: document.getElementById('profileMenu'),
    userName: document.getElementById('userName'),
    logoutBtn: document.getElementById('logoutBtn'),
    viewProfileBtn: document.getElementById('viewProfileBtn'),
    myReportsBtn: document.getElementById('myReportsBtn'),
    myInboxBtn: document.getElementById('myInboxBtn'),
    inboxCount: document.getElementById('inboxCount'),
    
    // Pages
    pages: document.querySelectorAll('.page'),
    
    // Auth Modals
    modals: {
        signin: document.getElementById('signinModal'),
        signup: document.getElementById('signupModal'),
        forgotPassword: document.getElementById('forgotPasswordModal'),
        profile: document.getElementById('profileModal'),
        userView: document.getElementById('userViewModal'),
        inbox: document.getElementById('inboxModal'),
        adminPanel: document.getElementById('adminPanelModal')
    },
    
    // Forms
    forms: {
        signin: document.getElementById('signinForm'),
        signup: document.getElementById('signupForm'),
        forgotPassword: document.getElementById('forgotPasswordForm'),
        itemReport: document.getElementById('itemReportForm'),
        contact: document.getElementById('contactForm')
    },
    
    // Report Form
    reporterGrade: document.getElementById('reporterGrade'),
    itemImage: document.getElementById('itemImage'),
    selectImageBtn: document.getElementById('selectImageBtn'),
    imagePreview: document.getElementById('imagePreview'),
    previewImage: document.getElementById('previewImage'),
    removeImageBtn: document.getElementById('removeImageBtn'),
    uploadBox: document.getElementById('uploadBox'),
    submitReportBtn: document.getElementById('submitReportBtn'),
    
    // Search
    searchLostInput: document.getElementById('searchLostInput'),
    searchFoundInput: document.getElementById('searchFoundInput'),
    
    // Items Containers
    lostItemsGrid: document.getElementById('lostItemsGrid'),
    foundItemsGrid: document.getElementById('foundItemsGrid'),
    noLostItems: document.getElementById('noLostItems'),
    noFoundItems: document.getElementById('noFoundItems'),
    
    // Profile
    profileName: document.getElementById('profileName'),
    profileEmail: document.getElementById('profileEmail'),
    profileGrade: document.getElementById('profileGrade'),
    profileRole: document.getElementById('profileRole'),
    reportedCount: document.getElementById('reportedCount'),
    recoveredCount: document.getElementById('recoveredCount'),
    profileAvatarContainer: document.getElementById('profileAvatarContainer'),
    profileAvatarIcon: document.getElementById('profileAvatarIcon'),
    profileAvatarImage: document.getElementById('profileAvatarImage'),
    avatarUploadBtn: document.getElementById('avatarUploadBtn'),
    avatarUpload: document.getElementById('avatarUpload'),
    
    // User View Profile
    viewProfileName: document.getElementById('viewProfileName'),
    viewProfileEmail: document.getElementById('viewProfileEmail'),
    viewProfileGrade: document.getElementById('viewProfileGrade'),
    viewProfileRole: document.getElementById('viewProfileRole'),
    viewProfileAvatar: document.getElementById('viewProfileAvatar'),
    viewProfileAvatarIcon: document.getElementById('viewProfileAvatarIcon'),
    viewProfileAvatarImage: document.getElementById('viewProfileAvatarImage'),
    viewReportedCount: document.getElementById('viewReportedCount'),
    viewRecoveredCount: document.getElementById('viewRecoveredCount'),
    
    // Admin Panel
    inboxBadge: document.getElementById('inboxBadge'),
    messageList: document.getElementById('messageList'),
    messageView: document.getElementById('messageView'),
    searchUsersInput: document.getElementById('searchUsersInput'),
    usersList: document.getElementById('usersList'),
    passwordRequests: document.getElementById('passwordRequests'),
    searchAdminItemsInput: document.getElementById('searchAdminItemsInput'),
    adminItemsList: document.getElementById('adminItemsList'),
    
    // User Inbox
    userMessageList: document.getElementById('userMessageList'),
    userMessageView: document.getElementById('userMessageView')
};

// ===== BROWSER COMPATIBILITY =====
function setupBrowserCompatibility() {
    // Fix for Edge/Firefox date input
    const dateInput = document.getElementById('itemDate');
    if (dateInput) {
        dateInput.addEventListener('input', function(e) {
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
        });
    }
    
    // Fix for all browsers - Ensure localStorage works
    if (typeof localStorage === 'undefined') {
        console.error('localStorage is not supported in this browser');
        return;
    }
    
    // Fix for password visibility toggle in all browsers
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
            
            // Force reflow for all browsers
            input.blur();
            input.focus();
        });
    });
}

// ===== INITIALIZATION =====
function init() {
    loadData();
    setupEventListeners();
    setupBrowserCompatibility();
    checkAuth();
    showPage('home');
    cleanupOldItems();
    
    setTimeout(() => {
        document.querySelector('.intro-animation').style.display = 'none';
    }, 2000);
    
    console.log('FindIt System Initialized - Cross Browser/Device Compatible');
}

// ===== DATA MANAGEMENT =====
function loadData() {
    try {
        // Load users
        const savedUsers = localStorage.getItem('findit_users');
        if (savedUsers) {
            state.users = JSON.parse(savedUsers);
        } else {
            // Add default admin user
            state.users = [{
                id: 1,
                name: 'Admin',
                email: 'howardemia37@gmail.com',
                password: 'AdminPanel67',
                grade: 'Grade 12',
                role: 'admin',
                profileImage: '',
                createdAt: new Date().toISOString(),
                reportedItems: [],
                recoveredItems: [],
                unreadMessages: 0,
                isActive: true
            }];
            saveUsers();
        }
        
        // Load items
        const savedItems = localStorage.getItem('findit_items');
        state.items = savedItems ? JSON.parse(savedItems) : [];
        
        // Load comments
        const savedComments = localStorage.getItem('findit_comments');
        state.comments = savedComments ? JSON.parse(savedComments) : [];
        
        // Load messages
        const savedMessages = localStorage.getItem('findit_messages');
        state.messages = savedMessages ? JSON.parse(savedMessages) : [];
        
        // Load password requests
        const savedRequests = localStorage.getItem('findit_password_requests');
        state.passwordRequests = savedRequests ? JSON.parse(savedRequests) : [];
        
        // Load current user from ALL devices
        const savedUser = localStorage.getItem('findit_currentUser');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            const user = state.users.find(u => u.email === userData.email);
            if (user && user.password === userData.password && user.isActive) {
                state.currentUser = user;
            } else {
                localStorage.removeItem('findit_currentUser');
            }
        }
    } catch (error) {
        console.error('Error loading data:', error);
        resetData();
    }
}

function saveData() {
    localStorage.setItem('findit_items', JSON.stringify(state.items));
    localStorage.setItem('findit_comments', JSON.stringify(state.comments));
    localStorage.setItem('findit_messages', JSON.stringify(state.messages));
    localStorage.setItem('findit_password_requests', JSON.stringify(state.passwordRequests));
    saveUsers();
    
    // Save current user for ALL devices
    if (state.currentUser) {
        localStorage.setItem('findit_currentUser', JSON.stringify({
            email: state.currentUser.email,
            password: state.currentUser.password,
            lastLogin: new Date().toISOString(),
            device: navigator.userAgent
        }));
    }
}

function saveUsers() {
    localStorage.setItem('findit_users', JSON.stringify(state.users));
}

// ===== CLEANUP OLD ITEMS =====
function cleanupOldItems() {
    const now = new Date();
    const twentyDaysAgo = new Date(now.getTime() - (20 * 24 * 60 * 60 * 1000));
    
    state.items = state.items.filter(item => {
        if (item.status === 'found' && item.isFound) {
            const foundDate = new Date(item.foundAt || item.createdAt);
            return foundDate > twentyDaysAgo;
        }
        return true;
    });
    
    saveData();
    console.log('Cleaned up old found items (20+ days)');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Mobile Toggle
    if (elements.mobileToggle) {
        elements.mobileToggle.addEventListener('click', () => {
            elements.navMenu.classList.toggle('show');
        });
    }
    
    // Navigation Links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
            if (elements.navMenu) elements.navMenu.classList.remove('show');
        });
    });
    
    // Footer Links
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Hero Section Buttons - Fixed for ALL devices
    document.querySelectorAll('.hero-actions a').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Auth Button
    if (elements.authBtn) {
        elements.authBtn.addEventListener('click', () => showModal('signin'));
    }
    
    // Inbox Button
    if (elements.inboxBtn) {
        elements.inboxBtn.addEventListener('click', () => {
            showModal('inbox');
            loadUserInbox();
        });
    }
    
    // Admin Button
    if (elements.adminBtn) {
        elements.adminBtn.addEventListener('click', () => {
            showModal('adminPanel');
            loadAdminPanel();
        });
    }
    
    // Profile Menu
    if (elements.profileTrigger) {
        elements.profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.profileMenu.classList.toggle('show');
        });
    }
    
    // Close profile menu when clicking outside
    document.addEventListener('click', () => {
        if (elements.profileMenu) {
            elements.profileMenu.classList.remove('show');
        }
    });
    
    // Profile Actions
    if (elements.viewProfileBtn) {
        elements.viewProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('profile');
            updateProfile();
            if (elements.profileMenu) elements.profileMenu.classList.remove('show');
        });
    }
    
    if (elements.myReportsBtn) {
        elements.myReportsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('lost');
            filterMyItems();
            if (elements.profileMenu) elements.profileMenu.classList.remove('show');
        });
    }
    
    if (elements.myInboxBtn) {
        elements.myInboxBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('inbox');
            loadUserInbox();
            if (elements.profileMenu) elements.profileMenu.classList.remove('show');
        });
    }
    
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
            if (elements.profileMenu) elements.profileMenu.classList.remove('show');
        });
    }
    
    // Modal Close Buttons
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Close modal on outside click (only for overlay)
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Auth Form Switches
    document.querySelectorAll('.switch-to-signup').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            showModal('signup');
        });
    });
    
    document.querySelectorAll('.switch-to-signin').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            showModal('signin');
        });
    });
    
    document.querySelectorAll('.forgot-password-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            showModal('forgotPassword');
        });
    });
    
    // Form Submissions
    if (elements.forms.signin) {
        elements.forms.signin.addEventListener('submit', handleSignIn);
    }
    
    if (elements.forms.signup) {
        elements.forms.signup.addEventListener('submit', handleSignUp);
    }
    
    if (elements.forms.forgotPassword) {
        elements.forms.forgotPassword.addEventListener('submit', handleForgotPassword);
    }
    
    if (elements.forms.itemReport) {
        elements.forms.itemReport.addEventListener('submit', handleItemReport);
    }
    
    if (elements.forms.contact) {
        elements.forms.contact.addEventListener('submit', handleContact);
    }
    
    // Image Upload for Report
    if (elements.selectImageBtn) {
        elements.selectImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.itemImage.click();
        });
    }
    
    if (elements.itemImage) {
        elements.itemImage.addEventListener('change', handleItemImageUpload);
    }
    
    if (elements.removeImageBtn) {
        elements.removeImageBtn.addEventListener('click', removeItemImage);
    }
    
    if (elements.uploadBox) {
        elements.uploadBox.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn')) {
                elements.itemImage.click();
            }
        });
    }
    
    // Profile Image Upload
    if (elements.avatarUploadBtn) {
        elements.avatarUploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.avatarUpload.click();
        });
    }
    
    if (elements.avatarUpload) {
        elements.avatarUpload.addEventListener('change', handleProfileImageUpload);
    }
    
    // Search Functionality
    if (elements.searchLostInput) {
        elements.searchLostInput.addEventListener('input', debounce(() => {
            state.search.lost = elements.searchLostInput.value;
            displayItems('lost');
        }, 300));
    }
    
    if (elements.searchFoundInput) {
        elements.searchFoundInput.addEventListener('input', debounce(() => {
            state.search.found = elements.searchFoundInput.value;
            displayItems('found');
        }, 300));
    }
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const itemDateInput = document.getElementById('itemDate');
    if (itemDateInput) {
        itemDateInput.value = today;
    }
    
    // Admin Panel Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchAdminTab(tab);
        });
    });
    
    // Fix for all password visibility toggles
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
}

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    // Update active page
    elements.pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });
    
    // Update active nav link
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    state.currentPage = pageId;
    
    // Page-specific actions
    switch(pageId) {
        case 'lost':
            displayItems('lost');
            break;
        case 'found':
            displayItems('found');
            break;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== AUTHENTICATION (Cross-Device Compatible) =====
function checkAuth() {
    if (state.currentUser) {
        if (elements.authBtn) elements.authBtn.style.display = 'none';
        if (elements.userProfile) {
            elements.userProfile.style.display = 'block';
        }
        if (elements.inboxBtn) {
            elements.inboxBtn.style.display = 'flex';
        }
        if (elements.userName) {
            elements.userName.textContent = state.currentUser.name.split(' ')[0];
        }
        
        // Show admin button for admin users
        if (state.currentUser.role === 'admin' && elements.adminBtn) {
            elements.adminBtn.style.display = 'flex';
        } else if (elements.adminBtn) {
            elements.adminBtn.style.display = 'none';
        }
        
        // Load profile image if exists
        if (state.currentUser.profileImage && elements.profileAvatarImage && elements.profileAvatarIcon) {
            elements.profileAvatarImage.src = state.currentUser.profileImage;
            elements.profileAvatarImage.style.display = 'block';
            elements.profileAvatarIcon.style.display = 'none';
        }
        
        // Update inbox count
        updateInboxCount();
    } else {
        if (elements.authBtn) elements.authBtn.style.display = 'flex';
        if (elements.userProfile) elements.userProfile.style.display = 'none';
        if (elements.inboxBtn) elements.inboxBtn.style.display = 'none';
        if (elements.adminBtn) elements.adminBtn.style.display = 'none';
    }
}

function handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('signinEmail')?.value.trim();
    const password = document.getElementById('signinPassword')?.value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const user = state.users.find(u => u.email === email && u.password === password && u.isActive);
    
    if (user) {
        state.currentUser = user;
        saveData();
        checkAuth();
        closeAllModals();
        showNotification(`Welcome back, ${user.name}!`, 'success');
        if (elements.forms.signin) elements.forms.signin.reset();
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleSignUp(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const grade = document.getElementById('signupGrade')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('signupConfirmPassword')?.value;
    
    // Validation
    if (!name || !email || !grade || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Check if user exists
    if (state.users.some(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }
    
    // Create user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        grade: `Grade ${grade}`,
        role: 'student',
        profileImage: '',
        createdAt: new Date().toISOString(),
        reportedItems: [],
        recoveredItems: [],
        unreadMessages: 0,
        isActive: true,
        lastLogin: new Date().toISOString()
    };
    
    state.users.push(newUser);
    state.currentUser = newUser;
    saveData();
    checkAuth();
    
    closeAllModals();
    showNotification('Account created successfully!', 'success');
    if (elements.forms.signup) elements.forms.signup.reset();
}

function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail')?.value.trim();
    const user = state.users.find(u => u.email === email);
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    if (!user) {
        showNotification('Email not found in our system', 'error');
        return;
    }
    
    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store reset code temporarily
    localStorage.setItem('reset_code', resetCode);
    localStorage.setItem('reset_email', email);
    localStorage.setItem('reset_expires', Date.now() + 3600000); // 1 hour
    
    // Send notification to user
    sendMessageToUser(user.id, {
        toName: user.name,
        subject: 'Password Reset Code',
        message: `Your password reset code is: ${resetCode}\n\nThis code will expire in 1 hour.`,
        type: 'password_reset'
    });
    
    // Send notification to admin
    sendMessageToAdmin({
        fromName: 'System',
        fromEmail: 'system@findit.edu',
        subject: 'Password Reset Request',
        message: `User ${user.name} (${email}) requested a password reset. Reset code has been sent to their inbox.`,
        type: 'password_reset'
    });
    
    closeAllModals();
    showModal('signin');
    showNotification(`Password reset code sent to ${email}. Check your inbox.`, 'success');
    if (elements.forms.forgotPassword) elements.forms.forgotPassword.reset();
}

function logout() {
    state.currentUser = null;
    localStorage.removeItem('findit_currentUser');
    checkAuth();
    showNotification('Signed out successfully', 'success');
    showPage('home');
}

// ===== ITEM MANAGEMENT (Visible to ALL) =====
function handleItemReport(e) {
    e.preventDefault();
    
    if (!state.currentUser) {
        showNotification('Please sign in to report items', 'warning');
        showModal('signin');
        return;
    }
    
    // Get form values
    const itemData = {
        id: Date.now(),
        name: document.getElementById('itemName')?.value.trim() || '',
        category: document.getElementById('itemCategory')?.value || 'other',
        description: document.getElementById('itemDescription')?.value.trim() || '',
        date: document.getElementById('itemDate')?.value || new Date().toISOString().split('T')[0],
        location: document.getElementById('itemLocation')?.value.trim() || '',
        status: document.querySelector('input[name="itemStatus"]:checked')?.value || 'lost',
        grade: document.getElementById('reporterGrade')?.value || '12',
        reporterId: state.currentUser.id,
        reporterName: state.currentUser.name,
        reporterEmail: state.currentUser.email,
        image: elements.previewImage?.src || '',
        createdAt: new Date().toISOString(),
        isFound: false,
        comments: [],
        adminLikes: 0,
        lastUpdated: new Date().toISOString(),
        visibleToAll: true // Ensures item is visible to ALL users
    };
    
    // Validation
    if (!itemData.name || !itemData.description || !itemData.location) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Add item
    state.items.unshift(itemData);
    
    if (state.currentUser && !state.currentUser.reportedItems.includes(itemData.id)) {
        state.currentUser.reportedItems.push(itemData.id);
    }
    
    saveData();
    showNotification(`Item reported as ${itemData.status}!`, 'success');
    
    // Reset form
    if (elements.forms.itemReport) elements.forms.itemReport.reset();
    removeItemImage();
    
    const today = new Date().toISOString().split('T')[0];
    const itemDateInput = document.getElementById('itemDate');
    if (itemDateInput) itemDateInput.value = today;
    
    const reporterGrade = document.getElementById('reporterGrade');
    if (reporterGrade) reporterGrade.value = '12';
    
    // Redirect to items page
    setTimeout(() => {
        showPage(itemData.status);
    }, 1500);
}

function displayItems(type) {
    const container = type === 'lost' ? elements.lostItemsGrid : elements.foundItemsGrid;
    const noItems = type === 'lost' ? elements.noLostItems : elements.noFoundItems;
    const searchQuery = state.search[type].toLowerCase();
    
    // Filter items - ALWAYS show ALL items to EVERYONE
    let items = state.items.filter(item => item.status === type && item.visibleToAll !== false);
    
    // Apply search filter
    if (searchQuery) {
        items = items.filter(item => 
            item.name.toLowerCase().includes(searchQuery) ||
            item.description.toLowerCase().includes(searchQuery) ||
            item.location.toLowerCase().includes(searchQuery) ||
            item.category.toLowerCase().includes(searchQuery)
        );
    }
    
    // Clear container
    if (container) container.innerHTML = '';
    
    // Display items
    if (items.length === 0) {
        if (noItems) noItems.style.display = 'block';
    } else {
        if (noItems) noItems.style.display = 'none';
        items.forEach(item => {
            const itemCard = createItemCard(item);
            if (container) container.appendChild(itemCard);
        });
    }
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item.id;
    
    const badgeClass = item.status === 'lost' ? 'badge-lost' : 'badge-found';
    const badgeText = item.status === 'lost' ? 'LOST' : 'FOUND';
    
    // Show image or placeholder with message
    let imageHtml = '';
    if (item.image) {
        imageHtml = `<img src="${item.image}" class="item-image" alt="${item.name}" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\'no-image-message\'>No Image Available</div>';" loading="lazy">`;
    } else {
        imageHtml = `<div class="item-image empty">
            <i class="fas fa-image"></i>
            <p>No photo uploaded</p>
        </div>`;
    }
    
    // Get user profile image or icon
    const reporter = state.users.find(u => u.id === item.reporterId);
    let reporterAvatar = '<i class="fas fa-user"></i>';
    if (reporter && reporter.profileImage) {
        reporterAvatar = `<img src="${reporter.profileImage}" class="reporter-avatar-img" alt="${reporter.name}" loading="lazy">`;
    }
    
    card.innerHTML = `
        ${imageHtml}
        <div class="item-content">
            <div class="item-header">
                <h3 class="item-title">${item.name}</h3>
                <span class="item-badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="item-meta">
                <span><i class="far fa-calendar"></i> ${formatDate(item.date)}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${item.location}</span>
                <span><i class="fas fa-tag"></i> ${item.category}</span>
            </div>
            <p class="item-description">${item.description}</p>
            <div class="item-footer">
                <div class="reporter-info" data-user-id="${item.reporterId}" style="cursor: pointer;">
                    <div class="reporter-avatar">
                        ${reporterAvatar}
                    </div>
                    <span class="reporter-name">${item.reporterName} • ${item.grade}</span>
                </div>
                <button class="btn btn-outline btn-view" data-id="${item.id}">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `;
    
    // Add event listener for view button
    const viewBtn = card.querySelector('.btn-view');
    if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showItemDetail(item.id);
        });
    }
    
    // Add event listener for user profile click
    const reporterInfo = card.querySelector('.reporter-info');
    if (reporterInfo) {
        reporterInfo.addEventListener('click', (e) => {
            e.stopPropagation();
            viewUserProfile(item.reporterId);
        });
    }
    
    // Make card clickable
    card.addEventListener('click', () => {
        showItemDetail(item.id);
    });
    
    return card;
}

function showItemDetail(itemId) {
    const item = state.items.find(i => i.id === itemId);
    if (!item) return;
    
    // Get comments for this item
    const itemComments = state.comments.filter(comment => comment.itemId === itemId);
    
    // Get reporter user
    const reporter = state.users.find(u => u.id === item.reporterId);
    
    // Create modal content with X button
    const modalContent = `
        <div class="modal" id="itemDetailModal">
            <div class="modal-content" style="max-width: 800px; padding: 2rem; position: relative;">
                <button class="close-modal-btn" style="position: absolute; top: 15px; right: 15px; z-index: 1000;">&times;</button>
                <h2 style="display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem;">
                    <i class="fas ${item.status === 'lost' ? 'fa-search' : 'fa-hand-holding-heart'}"></i>
                    ${item.name}
                </h2>
                
                ${item.image ? 
                    `<img src="${item.image}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: var(--radius); margin-bottom: 1.5rem;" alt="${item.name}" loading="lazy">` : 
                    `<div style="background: var(--gray-light); padding: 3rem; border-radius: var(--radius); text-align: center; margin-bottom: 1.5rem;">
                        <i class="fas fa-image" style="font-size: 3rem; color: var(--gray);"></i>
                        <p style="color: var(--gray); margin-top: 1rem;">This user didn't upload a photo.</p>
                    </div>`
                }
                
                <div style="display: grid; gap: 1.5rem;">
                    <div>
                        <h3 style="margin-bottom: 0.5rem; color: var(--primary);">Description</h3>
                        <p style="color: var(--dark); line-height: 1.6;">${item.description}</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        <div>
                            <h4 style="margin-bottom: 0.3rem; color: var(--gray); font-size: 0.9rem;">Category</h4>
                            <p style="color: var(--dark);">${item.category}</p>
                        </div>
                        <div>
                            <h4 style="margin-bottom: 0.3rem; color: var(--gray); font-size: 0.9rem;">Date</h4>
                            <p style="color: var(--dark);">${formatDate(item.date)}</p>
                        </div>
                        <div>
                            <h4 style="margin-bottom: 0.3rem; color: var(--gray); font-size: 0.9rem;">Location</h4>
                            <p style="color: var(--dark);">${item.location}</p>
                        </div>
                        <div>
                            <h4 style="margin-bottom: 0.3rem; color: var(--gray); font-size: 0.9rem;">Status</h4>
                            <p style="color: var(--dark); font-weight: 500; text-transform: uppercase;">${item.status}</p>
                        </div>
                    </div>
                    
                    <div style="background: var(--gray-light); padding: 1rem; border-radius: var(--radius);">
                        <h4 style="margin-bottom: 0.5rem; color: var(--dark);">Reporter Information</h4>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
                            ${reporter && reporter.profileImage ? 
                                `<img src="${reporter.profileImage}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" loading="lazy">` :
                                `<i class="fas fa-user" style="font-size: 1.5rem; color: var(--primary);"></i>`
                            }
                            <div>
                                <p style="color: var(--dark); margin: 0; font-weight: 500;">${item.reporterName}</p>
                                <p style="color: var(--gray); margin: 0; font-size: 0.9rem;">${item.grade}</p>
                            </div>
                        </div>
                        <p style="color: var(--dark); margin: 0;"><strong>Email:</strong> ${item.reporterEmail}</p>
                    </div>
                    
                    <!-- Comments Section -->
                    <div class="comments-section">
                        <h3 style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; color: var(--primary);">
                            <i class="fas fa-comments"></i> Comments (${itemComments.length})
                        </h3>
                        
                        <div class="comments-list" id="commentsList-${item.id}" style="max-height: 300px; overflow-y: auto; margin-bottom: 1rem; padding-right: 10px;">
                            ${itemComments.length === 0 ? 
                                '<div style="text-align: center; padding: 2rem; color: var(--gray);">No comments yet. Be the first to comment!</div>' : 
                                itemComments.map(comment => {
                                    const commentUser = state.users.find(u => u.id === comment.userId);
                                    const commentTime = timeAgo(comment.createdAt);
                                    const isLiked = comment.likes && comment.likes.includes(state.currentUser?.id);
                                    const likeCount = comment.likes ? comment.likes.length : 0;
                                    const replyCount = comment.replies ? comment.replies.length : 0;
                                    
                                    return `
                                        <div class="comment" style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-light);">
                                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                    ${commentUser && commentUser.profileImage ? 
                                                        `<img src="${commentUser.profileImage}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;" loading="lazy">` :
                                                        `<i class="fas fa-user-circle" style="color: var(--primary);"></i>`
                                                    }
                                                    <div>
                                                        <strong style="color: var(--dark);">${commentUser ? commentUser.name : 'Unknown User'}</strong>
                                                        <span style="color: var(--gray); font-size: 0.8rem; margin-left: 10px;">${commentTime}</span>
                                                    </div>
                                                </div>
                                                ${(state.currentUser && state.currentUser.id === comment.userId) || (state.currentUser && state.currentUser.role === 'admin') ? 
                                                    `<button onclick="deleteComment(${comment.id}, ${item.id})" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 5px;">
                                                        <i class="fas fa-trash"></i>
                                                    </button>` : ''
                                                }
                                            </div>
                                            <p style="color: var(--dark); margin: 0; white-space: pre-wrap;">${comment.text}</p>
                                            <div style="display: flex; align-items: center; gap: 15px; margin-top: 0.5rem;">
                                                <button onclick="likeComment(${comment.id})" style="background: none; border: none; color: ${isLiked ? 'var(--primary)' : 'var(--gray)'}; cursor: pointer; display: flex; align-items: center; gap: 5px; padding: 5px;">
                                                    <i class="fas fa-thumbs-up"></i>
                                                    <span>${likeCount}</span>
                                                </button>
                                                ${state.currentUser ? `
                                                    <button onclick="replyToComment(${comment.id}, ${item.id}, '${commentUser ? commentUser.name : 'User'}')" style="background: none; border: none; color: var(--gray); cursor: pointer; padding: 5px;">
                                                        <i class="fas fa-reply"></i> Reply
                                                    </button>
                                                ` : ''}
                                                ${replyCount > 0 ? `<span style="color: var(--gray); font-size: 0.9rem;">${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}</span>` : ''}
                                            </div>
                                            <!-- Replies -->
                                            ${comment.replies && comment.replies.length > 0 ? `
                                                <div style="margin-top: 1rem; padding-left: 1.5rem; border-left: 2px solid var(--gray-light);">
                                                    ${comment.replies.map(reply => {
                                                        const replyUser = state.users.find(u => u.id === reply.userId);
                                                        const replyTime = timeAgo(reply.createdAt);
                                                        return `
                                                            <div style="margin-bottom: 0.75rem; padding: 0.75rem; background: rgba(0,0,0,0.02); border-radius: var(--radius);">
                                                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                                                                    <div style="display: flex; align-items: center; gap: 8px;">
                                                                        ${replyUser && replyUser.profileImage ? 
                                                                            `<img src="${replyUser.profileImage}" style="width: 25px; height: 25px; border-radius: 50%; object-fit: cover;" loading="lazy">` :
                                                                            `<i class="fas fa-user-circle" style="color: var(--primary); font-size: 0.9rem;"></i>`
                                                                        }
                                                                        <strong style="color: var(--dark); font-size: 0.9rem;">${replyUser ? replyUser.name : 'Unknown User'}</strong>
                                                                        <span style="color: var(--gray); font-size: 0.7rem;">${replyTime}</span>
                                                                    </div>
                                                                    ${(state.currentUser && state.currentUser.id === reply.userId) || (state.currentUser && state.currentUser.role === 'admin') ? 
                                                                        `<button onclick="deleteReply(${comment.id}, ${reply.id}, ${item.id})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 0.8rem; padding: 3px;">
                                                                            <i class="fas fa-trash"></i>
                                                                        </button>` : ''
                                                                    }
                                                                </div>
                                                                <p style="color: var(--dark); margin: 0; font-size: 0.9rem; white-space: pre-wrap;">${reply.text}</p>
                                                            </div>
                                                        `;
                                                    }).join('')}
                                                </div>
                                            ` : ''}
                                        </div>
                                    `;
                                }).join('')
                            }
                        </div>
                        
                        ${state.currentUser ? `
                            <div class="comment-form">
                                <textarea id="commentInput-${item.id}" placeholder="Add a comment..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--gray-light); border-radius: var(--radius); margin-bottom: 0.5rem; resize: vertical; font-family: inherit;"></textarea>
                                <button onclick="addComment(${item.id})" class="btn btn-primary" style="width: 100%;">
                                    <i class="fas fa-paper-plane"></i> Post Comment
                                </button>
                            </div>
                        ` : `
                            <div style="text-align: center; padding: 1rem; background: var(--gray-light); border-radius: var(--radius);">
                                <p style="color: var(--gray); margin: 0;">Please <a href="#" onclick="showModal('signin'); return false;" style="color: var(--primary);">sign in</a> to add comments</p>
                            </div>
                        `}
                    </div>
                    
                    <!-- Admin Likes (Visible to ALL) -->
                    ${item.adminLikes > 0 ? `
                        <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333; padding: 0.75rem; border-radius: var(--radius); display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-star" style="color: #333;"></i>
                            <div>
                                <strong>Admin Verified</strong>
                                <p style="margin: 0; font-size: 0.9rem;">This item has ${item.adminLikes} admin ${item.adminLikes === 1 ? 'verification' : 'verifications'}</p>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${(state.currentUser && state.currentUser.id === item.reporterId) || (state.currentUser && state.currentUser.role === 'admin') ? `
                        <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                            ${item.status === 'lost' ? `
                                <button class="btn btn-success" onclick="markItemAsFound(${item.id})">
                                    <i class="fas fa-check"></i> Mark as Found
                                </button>
                            ` : ''}
                            ${state.currentUser.role === 'admin' ? `
                                <button class="btn btn-warning" onclick="adminLikeItem(${item.id})">
                                    <i class="fas fa-star"></i> Admin Like
                                </button>
                            ` : ''}
                            <button class="btn btn-danger" onclick="deleteItem(${item.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Create and show modal
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalContent;
    document.body.appendChild(modalContainer);
    
    const modal = modalContainer.querySelector('#itemDetailModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Close button event
    const closeBtn = modal.querySelector('.close-modal-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                if (modalContainer.parentNode === document.body) {
                    document.body.removeChild(modalContainer);
                }
            }, 300);
        });
    }
    
    // Don't close on inside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                if (modalContainer.parentNode === document.body) {
                    document.body.removeChild(modalContainer);
                }
            }, 300);
        }
    });
}

function markItemAsFound(itemId) {
    const itemIndex = state.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) {
        showNotification('Item not found', 'error');
        return;
    }
    
    state.items[itemIndex].status = 'found';
    state.items[itemIndex].isFound = true;
    state.items[itemIndex].foundAt = new Date().toISOString();
    state.items[itemIndex].lastUpdated = new Date().toISOString();
    
    // Add to user's recovered items
    if (state.currentUser && !state.currentUser.recoveredItems.includes(itemId)) {
        state.currentUser.recoveredItems.push(itemId);
    }
    
    saveData();
    
    // Close modal
    const modal = document.querySelector('#itemDetailModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            const modalContainer = modal.parentElement;
            if (modalContainer && modalContainer.parentNode === document.body) {
                document.body.removeChild(modalContainer);
            }
        }, 300);
    }
    
    showNotification('Item marked as found!', 'success');
    displayItems('lost');
    displayItems('found');
    updateProfile();
}

function adminLikeItem(itemId) {
    if (!state.currentUser || state.currentUser.role !== 'admin') {
        showNotification('Only admin can add admin likes', 'error');
        return;
    }
    
    const itemIndex = state.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    if (!state.items[itemIndex].adminLikes) {
        state.items[itemIndex].adminLikes = 0;
    }
    
    state.items[itemIndex].adminLikes++;
    state.items[itemIndex].lastUpdated = new Date().toISOString();
    saveData();
    
    showNotification('Admin like added! Everyone can see this verification.', 'success');
    
    // Close and reopen modal to refresh
    const modal = document.querySelector('#itemDetailModal');
    if (modal) {
        const oldItemId = itemId;
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            const modalContainer = modal.parentElement;
            if (modalContainer && modalContainer.parentNode === document.body) {
                document.body.removeChild(modalContainer);
            }
            showItemDetail(oldItemId);
        }, 300);
    }
}

function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;
    
    const itemIndex = state.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    // Check permissions
    const item = state.items[itemIndex];
    if (state.currentUser.role !== 'admin' && state.currentUser.id !== item.reporterId) {
        showNotification('You can only delete your own items', 'error');
        return;
    }
    
    state.items.splice(itemIndex, 1);
    
    // Remove comments for this item
    state.comments = state.comments.filter(comment => comment.itemId !== itemId);
    
    // Remove from user's reported items
    if (state.currentUser) {
        state.currentUser.reportedItems = state.currentUser.reportedItems.filter(id => id !== itemId);
    }
    
    saveData();
    
    // Close modal
    const modal = document.querySelector('#itemDetailModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            const modalContainer = modal.parentElement;
            if (modalContainer && modalContainer.parentNode === document.body) {
                document.body.removeChild(modalContainer);
            }
        }, 300);
    }
    
    showNotification('Item deleted successfully', 'success');
    displayItems(state.currentPage);
    updateProfile();
}

// ===== COMMENTS SYSTEM (Facebook Style) =====
function addComment(itemId) {
    if (!state.currentUser) {
        showNotification('Please sign in to add comments', 'warning');
        showModal('signin');
        return;
    }
    
    const commentInput = document.getElementById(`commentInput-${itemId}`);
    if (!commentInput) return;
    
    const text = commentInput.value.trim();
    
    if (!text) {
        showNotification('Comment cannot be empty', 'error');
        return;
    }
    
    const newComment = {
        id: Date.now(),
        itemId: itemId,
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        text: text,
        likes: [],
        replies: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    
    state.comments.unshift(newComment);
    saveData();
    
    // Clear input
    commentInput.value = '';
    
    // Refresh comments list
    refreshComments(itemId);
    
    showNotification('Comment added successfully', 'success');
}

function refreshComments(itemId) {
    const commentsList = document.getElementById(`commentsList-${itemId}`);
    if (!commentsList) return;
    
    const itemComments = state.comments.filter(comment => comment.itemId === itemId);
    
    commentsList.innerHTML = itemComments.length === 0 ? 
        '<div style="text-align: center; padding: 2rem; color: var(--gray);">No comments yet. Be the first to comment!</div>' : 
        itemComments.map(comment => {
            const commentUser = state.users.find(u => u.id === comment.userId);
            const commentTime = timeAgo(comment.createdAt);
            const isLiked = comment.likes && comment.likes.includes(state.currentUser?.id);
            const likeCount = comment.likes ? comment.likes.length : 0;
            const replyCount = comment.replies ? comment.replies.length : 0;
            
            return `
                <div class="comment" style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-light);">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            ${commentUser && commentUser.profileImage ? 
                                `<img src="${commentUser.profileImage}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;" loading="lazy">` :
                                `<i class="fas fa-user-circle" style="color: var(--primary);"></i>`
                            }
                            <div>
                                <strong style="color: var(--dark);">${commentUser ? commentUser.name : 'Unknown User'}</strong>
                                <span style="color: var(--gray); font-size: 0.8rem; margin-left: 10px;">${commentTime}</span>
                            </div>
                        </div>
                        ${(state.currentUser && state.currentUser.id === comment.userId) || (state.currentUser && state.currentUser.role === 'admin') ? 
                            `<button onclick="deleteComment(${comment.id}, ${itemId})" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 5px;">
                                <i class="fas fa-trash"></i>
                            </button>` : ''
                        }
                    </div>
                    <p style="color: var(--dark); margin: 0; white-space: pre-wrap;">${comment.text}</p>
                    <div style="display: flex; align-items: center; gap: 15px; margin-top: 0.5rem;">
                        <button onclick="likeComment(${comment.id})" style="background: none; border: none; color: ${isLiked ? 'var(--primary)' : 'var(--gray)'}; cursor: pointer; display: flex; align-items: center; gap: 5px; padding: 5px;">
                            <i class="fas fa-thumbs-up"></i>
                            <span>${likeCount}</span>
                        </button>
                        ${state.currentUser ? `
                            <button onclick="replyToComment(${comment.id}, ${item.id}, '${commentUser ? commentUser.name : 'User'}')" style="background: none; border: none; color: var(--gray); cursor: pointer; padding: 5px;">
                                <i class="fas fa-reply"></i> Reply
                            </button>
                        ` : ''}
                        ${replyCount > 0 ? `<span style="color: var(--gray); font-size: 0.9rem;">${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}</span>` : ''}
                    </div>
                    <!-- Replies -->
                    ${comment.replies && comment.replies.length > 0 ? `
                        <div style="margin-top: 1rem; padding-left: 1.5rem; border-left: 2px solid var(--gray-light);">
                            ${comment.replies.map(reply => {
                                const replyUser = state.users.find(u => u.id === reply.userId);
                                const replyTime = timeAgo(reply.createdAt);
                                return `
                                    <div style="margin-bottom: 0.75rem; padding: 0.75rem; background: rgba(0,0,0,0.02); border-radius: var(--radius);">
                                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                                            <div style="display: flex; align-items: center; gap: 8px;">
                                                ${replyUser && replyUser.profileImage ? 
                                                    `<img src="${replyUser.profileImage}" style="width: 25px; height: 25px; border-radius: 50%; object-fit: cover;" loading="lazy">` :
                                                    `<i class="fas fa-user-circle" style="color: var(--primary); font-size: 0.9rem;"></i>`
                                                }
                                                <strong style="color: var(--dark); font-size: 0.9rem;">${replyUser ? replyUser.name : 'Unknown User'}</strong>
                                                <span style="color: var(--gray); font-size: 0.7rem;">${replyTime}</span>
                                            </div>
                                            ${(state.currentUser && state.currentUser.id === reply.userId) || (state.currentUser && state.currentUser.role === 'admin') ? 
                                                `<button onclick="deleteReply(${comment.id}, ${reply.id}, ${itemId})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 0.8rem; padding: 3px;">
                                                    <i class="fas fa-trash"></i>
                                                </button>` : ''
                                            }
                                        </div>
                                        <p style="color: var(--dark); margin: 0; font-size: 0.9rem; white-space: pre-wrap;">${reply.text}</p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
}

function likeComment(commentId) {
    if (!state.currentUser) {
        showNotification('Please sign in to like comments', 'warning');
        showModal('signin');
        return;
    }
    
    const commentIndex = state.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;
    
    if (!state.comments[commentIndex].likes) {
        state.comments[commentIndex].likes = [];
    }
    
    const comment = state.comments[commentIndex];
    const userIndex = comment.likes.indexOf(state.currentUser.id);
    
    if (userIndex === -1) {
        comment.likes.push(state.currentUser.id);
        showNotification('Liked comment', 'success');
    } else {
        comment.likes.splice(userIndex, 1);
        showNotification('Removed like', 'info');
    }
    
    saveData();
    
    // Find which item this comment belongs to
    const itemId = comment.itemId;
    refreshComments(itemId);
}

function replyToComment(commentId, itemId, userName) {
    if (!state.currentUser) {
        showNotification('Please sign in to reply', 'warning');
        showModal('signin');
        return;
    }
    
    const replyText = prompt(`Reply to ${userName}:`);
    if (!replyText || !replyText.trim()) return;
    
    const commentIndex = state.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;
    
    if (!state.comments[commentIndex].replies) {
        state.comments[commentIndex].replies = [];
    }
    
    const reply = {
        id: Date.now(),
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        text: replyText.trim(),
        createdAt: new Date().toISOString()
    };
    
    state.comments[commentIndex].replies.push(reply);
    saveData();
    
    // Refresh comments
    refreshComments(itemId);
    
    showNotification('Reply added successfully', 'success');
}

function deleteComment(commentId, itemId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    const commentIndex = state.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;
    
    // Check permissions
    if (state.currentUser.role !== 'admin' && state.comments[commentIndex].userId !== state.currentUser.id) {
        showNotification('You can only delete your own comments', 'error');
        return;
    }
    
    state.comments.splice(commentIndex, 1);
    saveData();
    
    refreshComments(itemId);
    showNotification('Comment deleted successfully', 'success');
}

function deleteReply(commentId, replyId, itemId) {
    if (!confirm('Are you sure you want to delete this reply?')) return;
    
    const commentIndex = state.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;
    
    const replyIndex = state.comments[commentIndex].replies.findIndex(r => r.id === replyId);
    if (replyIndex === -1) return;
    
    // Check permissions
    if (state.currentUser.role !== 'admin' && state.comments[commentIndex].replies[replyIndex].userId !== state.currentUser.id) {
        showNotification('You can only delete your own replies', 'error');
        return;
    }
    
    state.comments[commentIndex].replies.splice(replyIndex, 1);
    saveData();
    
    refreshComments(itemId);
    showNotification('Reply deleted successfully', 'success');
}

// ===== USER PROFILE VIEW =====
function viewUserProfile(userId) {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;
    
    elements.viewProfileName.textContent = user.name;
    elements.viewProfileEmail.textContent = user.email;
    elements.viewProfileGrade.textContent = user.grade;
    elements.viewProfileRole.textContent = user.role === 'admin' ? 'Administrator' : 'Student';
    
    // Set profile image
    if (user.profileImage) {
        elements.viewProfileAvatarImage.src = user.profileImage;
        elements.viewProfileAvatarImage.style.display = 'block';
        elements.viewProfileAvatarIcon.style.display = 'none';
    } else {
        elements.viewProfileAvatarImage.style.display = 'none';
        elements.viewProfileAvatarIcon.style.display = 'block';
    }
    
    // Calculate stats
    const reportedItems = state.items.filter(item => item.reporterId === user.id);
    const recoveredItems = reportedItems.filter(item => item.isFound);
    
    elements.viewReportedCount.textContent = reportedItems.length;
    elements.viewRecoveredCount.textContent = recoveredItems.length;
    
    showModal('userView');
}

// ===== PROFILE MANAGEMENT =====
function updateProfile() {
    if (!state.currentUser) return;
    
    elements.profileName.textContent = state.currentUser.name;
    elements.profileEmail.textContent = state.currentUser.email;
    elements.profileGrade.textContent = state.currentUser.grade;
    elements.profileRole.textContent = state.currentUser.role === 'admin' ? 'Administrator' : 'Student';
    
    // Calculate stats
    const reportedItems = state.items.filter(item => item.reporterId === state.currentUser.id);
    const recoveredItems = reportedItems.filter(item => item.isFound);
    
    elements.reportedCount.textContent = reportedItems.length;
    elements.recoveredCount.textContent = recoveredItems.length;
}

function handleProfileImageUpload() {
    const file = this.files[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image must be less than 5MB', 'error');
        return;
    }
    
    // Read and save image
    const reader = new FileReader();
    reader.onload = (e) => {
        state.currentUser.profileImage = e.target.result;
        saveData();
        
        // Update profile display
        elements.profileAvatarImage.src = e.target.result;
        elements.profileAvatarImage.style.display = 'block';
        elements.profileAvatarIcon.style.display = 'none';
        
        // Update navigation if needed
        checkAuth();
        
        showNotification('Profile picture updated successfully', 'success');
    };
    reader.readAsDataURL(file);
}

// ===== MESSAGING SYSTEM =====
function sendMessageToAdmin(messageData) {
    const admin = state.users.find(u => u.role === 'admin');
    if (!admin) return;
    
    const message = {
        id: Date.now(),
        fromId: messageData.fromId || null,
        fromName: messageData.fromName,
        fromEmail: messageData.fromEmail,
        toId: admin.id,
        toName: admin.name,
        subject: messageData.subject,
        message: messageData.message,
        type: messageData.type || 'general',
        read: false,
        createdAt: new Date().toISOString(),
        isActive: true
    };
    
    state.messages.unshift(message);
    
    // Increment admin's unread message count
    admin.unreadMessages = (admin.unreadMessages || 0) + 1;
    
    saveData();
    updateInboxCount();
}

function sendMessageToUser(userId, messageData) {
    const message = {
        id: Date.now(),
        fromId: state.currentUser.id,
        fromName: state.currentUser.name,
        fromEmail: state.currentUser.email,
        toId: userId,
        toName: messageData.toName,
        subject: messageData.subject,
        message: messageData.message,
        type: messageData.type || 'general',
        read: false,
        createdAt: new Date().toISOString(),
        isActive: true
    };
    
    state.messages.unshift(message);
    
    // Increment user's unread message count
    const user = state.users.find(u => u.id === userId);
    if (user) {
        user.unreadMessages = (user.unreadMessages || 0) + 1;
    }
    
    saveData();
    updateInboxCount();
}

function updateInboxCount() {
    if (!state.currentUser) return;
    
    const unreadCount = state.messages.filter(m => 
        m.toId === state.currentUser.id && !m.read && m.isActive !== false
    ).length;
    
    if (elements.inboxCount) {
        elements.inboxCount.textContent = unreadCount > 99 ? '99+' : unreadCount;
        
        if (unreadCount > 0) {
            elements.inboxCount.style.display = 'flex';
        } else {
            elements.inboxCount.style.display = 'none';
        }
    }
    
    // Update admin panel badge
    if (state.currentUser.role === 'admin' && elements.inboxBadge) {
        const adminUnread = state.messages.filter(m => 
            m.toId === state.currentUser.id && !m.read && m.isActive !== false
        ).length;
        elements.inboxBadge.textContent = adminUnread > 99 ? '99+' : adminUnread;
    }
}

function loadUserInbox() {
    if (!state.currentUser || !elements.userMessageList) return;
    
    const userMessages = state.messages.filter(m => 
        (m.toId === state.currentUser.id || m.fromId === state.currentUser.id) && m.isActive !== false
    );
    
    // Sort by date
    userMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Clear message list
    elements.userMessageList.innerHTML = '';
    
    if (userMessages.length === 0) {
        elements.userMessageList.innerHTML = `
            <div class="no-messages">
                <i class="fas fa-envelope-open"></i>
                <h3>No Messages</h3>
                <p>Your inbox is empty</p>
            </div>
        `;
        return;
    }
    
    userMessages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message-item ${!message.read && message.toId === state.currentUser.id ? 'unread' : ''}`;
        messageElement.dataset.id = message.id;
        
        const messagePreview = message.message.length > 60 ? 
            message.message.substring(0, 60) + '...' : message.message;
        
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-sender">${message.fromName}</div>
                <div class="message-time">${timeAgo(message.createdAt)}</div>
            </div>
            <div class="message-subject">${message.subject}</div>
            <div class="message-preview">${messagePreview}</div>
        `;
        
        messageElement.addEventListener('click', () => {
            viewUserMessage(message.id);
        });
        
        elements.userMessageList.appendChild(messageElement);
    });
}

function viewUserMessage(messageId) {
    const message = state.messages.find(m => m.id === messageId);
    if (!message || !elements.userMessageView) return;
    
    // Mark as read if user is the recipient
    if (message.toId === state.currentUser.id && !message.read) {
        message.read = true;
        saveData();
        updateInboxCount();
    }
    
    // Format message with line breaks
    const formattedMessage = message.message.replace(/\n/g, '<br>');
    
    elements.userMessageView.innerHTML = `
        <div class="message-detail">
            <div class="message-detail-header">
                <div class="message-detail-subject">${message.subject}</div>
                <div class="message-detail-time">${formatDateTime(message.createdAt)}</div>
            </div>
            <div class="message-detail-info">
                <div><strong>From:</strong> ${message.fromName} (${message.fromEmail})</div>
                <div><strong>To:</strong> ${message.toName}</div>
                <div><strong>Type:</strong> ${message.type}</div>
            </div>
            <div class="message-detail-content">
                ${formattedMessage}
            </div>
            ${message.fromId !== state.currentUser.id ? `
                <div class="message-reply">
                    <textarea id="replyMessage-${message.id}" placeholder="Type your reply..." rows="3" style="width: 100%; padding: 0.75rem; border: 1px solid var(--gray-light); border-radius: var(--radius); margin-bottom: 0.5rem; resize: vertical; font-family: inherit;"></textarea>
                    <button onclick="sendReply(${message.id})" class="btn btn-primary" style="width: 100%;">
                        <i class="fas fa-reply"></i> Send Reply
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

function sendReply(messageId) {
    const originalMessage = state.messages.find(m => m.id === messageId);
    if (!originalMessage) return;
    
    const replyInput = document.getElementById(`replyMessage-${messageId}`);
    if (!replyInput) return;
    
    const replyText = replyInput.value.trim();
    if (!replyText) {
        showNotification('Please enter a reply message', 'error');
        return;
    }
    
    // Remove "Re:" prefix if already present to avoid duplication
    let subject = originalMessage.subject;
    if (!subject.startsWith('Re: ')) {
        subject = `Re: ${subject}`;
    }
    
    const replyMessage = {
        id: Date.now(),
        fromId: state.currentUser.id,
        fromName: state.currentUser.name,
        fromEmail: state.currentUser.email,
        toId: originalMessage.fromId,
        toName: originalMessage.fromName,
        subject: subject,
        message: replyText,
        type: 'reply',
        read: false,
        createdAt: new Date().toISOString(),
        isActive: true
    };
    
    state.messages.unshift(replyMessage);
    
    // Increment recipient's unread message count
    const recipient = state.users.find(u => u.id === originalMessage.fromId);
    if (recipient) {
        recipient.unreadMessages = (recipient.unreadMessages || 0) + 1;
    }
    
    saveData();
    updateInboxCount();
    loadUserInbox();
    
    replyInput.value = '';
    showNotification('Reply sent successfully', 'success');
}

// ===== ADMIN PANEL =====
function loadAdminPanel() {
    if (!state.currentUser || state.currentUser.role !== 'admin') return;
    
    // Load inbox
    loadAdminInbox();
    
    // Load users
    loadAdminUsers();
    
    // Load password requests
    loadPasswordRequests();
    
    // Load items
    loadAdminItems();
}

function loadAdminInbox() {
    if (!elements.messageList) return;
    
    const adminMessages = state.messages.filter(m => m.toId === state.currentUser.id && m.isActive !== false);
    
    // Sort by date
    adminMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Clear message list
    elements.messageList.innerHTML = '';
    
    if (adminMessages.length === 0) {
        elements.messageList.innerHTML = `
            <div class="no-messages">
                <i class="fas fa-envelope-open"></i>
                <h3>No Messages</h3>
                <p>Admin inbox is empty</p>
            </div>
        `;
        return;
    }
    
    adminMessages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message-item ${!message.read ? 'unread' : ''}`;
        messageElement.dataset.id = message.id;
        
        const messagePreview = message.message.length > 60 ? 
            message.message.substring(0, 60) + '...' : message.message;
        
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-sender">${message.fromName}</div>
                <div class="message-time">${timeAgo(message.createdAt)}</div>
            </div>
            <div class="message-subject">${message.subject}</div>
            <div class="message-preview">${messagePreview}</div>
        `;
        
        messageElement.addEventListener('click', () => {
            viewAdminMessage(message.id);
        });
        
        elements.messageList.appendChild(messageElement);
    });
}

function viewAdminMessage(messageId) {
    const message = state.messages.find(m => m.id === messageId);
    if (!message || !elements.messageView) return;
    
    // Mark as read
    if (!message.read) {
        message.read = true;
        saveData();
        updateInboxCount();
    }
    
    // Format message with line breaks
    const formattedMessage = message.message.replace(/\n/g, '<br>');
    
    elements.messageView.innerHTML = `
        <div class="message-detail">
            <div class="message-detail-header">
                <div class="message-detail-subject">${message.subject}</div>
                <div class="message-detail-time">${formatDateTime(message.createdAt)}</div>
            </div>
            <div class="message-detail-info">
                <div><strong>From:</strong> ${message.fromName} (${message.fromEmail})</div>
                <div><strong>Type:</strong> ${message.type}</div>
            </div>
            <div class="message-detail-content">
                ${formattedMessage}
            </div>
            ${message.type === 'password_reset' ? `
                <div class="message-actions">
                    <button onclick="resetUserPassword('${message.fromEmail}')" class="btn btn-success">
                        <i class="fas fa-key"></i> Reset Password
                    </button>
                    <button onclick="markRequestComplete('${message.fromEmail}')" class="btn btn-outline">
                        <i class="fas fa-check"></i> Mark Complete
                    </button>
                </div>
            ` : `
                <div class="message-reply">
                    <textarea id="adminReply-${message.id}" placeholder="Type your reply..." rows="3" style="width: 100%; padding: 0.75rem; border: 1px solid var(--gray-light); border-radius: var(--radius); margin-bottom: 0.5rem; resize: vertical; font-family: inherit;"></textarea>
                    <button onclick="sendAdminReply(${message.id})" class="btn btn-primary" style="width: 100%;">
                        <i class="fas fa-reply"></i> Send Reply
                    </button>
                </div>
            `}
        </div>
    `;
}

function sendAdminReply(messageId) {
    const originalMessage = state.messages.find(m => m.id === messageId);
    if (!originalMessage) return;
    
    const replyInput = document.getElementById(`adminReply-${messageId}`);
    if (!replyInput) return;
    
    const replyText = replyInput.value.trim();
    if (!replyText) {
        showNotification('Please enter a reply message', 'error');
        return;
    }
    
    // Remove "Re:" prefix if already present to avoid duplication
    let subject = originalMessage.subject;
    if (!subject.startsWith('Re: ')) {
        subject = `Re: ${subject}`;
    }
    
    sendMessageToUser(originalMessage.fromId, {
        toName: originalMessage.fromName,
        subject: subject,
        message: replyText,
        type: 'reply'
    });
    
    replyInput.value = '';
    showNotification('Reply sent successfully', 'success');
    loadAdminInbox();
}

function resetUserPassword(email) {
    const user = state.users.find(u => u.email === email);
    if (!user) {
        showNotification('User not found', 'error');
        return;
    }
    
    const newPassword = generateRandomPassword(8);
    user.password = newPassword;
    user.lastUpdated = new Date().toISOString();
    
    // Send message to user with new password
    sendMessageToUser(user.id, {
        toName: user.name,
        subject: 'Password Reset Completed',
        message: `Your password has been reset by the administrator. Your new password is: ${newPassword}\n\nPlease change this password after logging in for security.`,
        type: 'password_reset'
    });
    
    // Mark password request as completed
    state.passwordRequests = state.passwordRequests.map(req => {
        if (req.userEmail === email) {
            req.status = 'completed';
            req.completedAt = new Date().toISOString();
        }
        return req;
    });
    
    saveData();
    loadPasswordRequests();
    showNotification(`Password reset for ${user.name}. New password sent to their inbox.`, 'success');
}

function markRequestComplete(email) {
    state.passwordRequests = state.passwordRequests.map(req => {
        if (req.userEmail === email) {
            req.status = 'completed';
            req.completedAt = new Date().toISOString();
        }
        return req;
    });
    
    saveData();
    loadPasswordRequests();
    showNotification('Request marked as complete', 'success');
}

function loadAdminUsers() {
    if (!elements.usersList) return;
    
    const users = state.users.filter(u => u.id !== state.currentUser.id); // Exclude current admin
    
    elements.usersList.innerHTML = '';
    
    if (users.length === 0) {
        elements.usersList.innerHTML = `
            <div class="no-users">
                <i class="fas fa-users"></i>
                <h3>No Other Users</h3>
                <p>Only admin user exists</p>
            </div>
        `;
        return;
    }
    
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'admin-user-item';
        userElement.dataset.id = user.id;
        
        const reportedItems = state.items.filter(item => item.reporterId === user.id).length;
        const recoveredItems = state.items.filter(item => item.reporterId === user.id && item.isFound).length;
        
        userElement.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">
                    ${user.profileImage ? 
                        `<img src="${user.profileImage}" alt="${user.name}" loading="lazy">` :
                        `<i class="fas fa-user"></i>`
                    }
                </div>
                <div class="user-details">
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">${user.email}</div>
                    <div class="user-grade">${user.grade} • ${user.role}</div>
                </div>
            </div>
            <div class="user-stats">
                <div class="user-stat">
                    <div class="stat-number">${reportedItems}</div>
                    <div class="stat-label">Items</div>
                </div>
                <div class="user-stat">
                    <div class="stat-number">${recoveredItems}</div>
                    <div class="stat-label">Recovered</div>
                </div>
            </div>
            <div class="user-actions">
                <button onclick="adminResetUserPassword(${user.id})" class="btn btn-sm btn-outline">
                    <i class="fas fa-key"></i> Reset Pass
                </button>
                <button onclick="adminSendMessage(${user.id})" class="btn btn-sm btn-primary">
                    <i class="fas fa-envelope"></i> Message
                </button>
            </div>
        `;
        
        elements.usersList.appendChild(userElement);
    });
}

function adminResetUserPassword(userId) {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;
    
    const newPassword = generateRandomPassword(8);
    user.password = newPassword;
    user.lastUpdated = new Date().toISOString();
    
    // Send message to user
    sendMessageToUser(userId, {
        toName: user.name,
        subject: 'Password Reset by Administrator',
        message: `Your password has been reset by the administrator. Your new password is: ${newPassword}\n\nPlease change this password after logging in for security.`,
        type: 'password_reset'
    });
    
    saveData();
    showNotification(`Password reset for ${user.name}. New password sent to their inbox.`, 'success');
}

function adminSendMessage(userId) {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;
    
    const subject = prompt('Enter message subject:');
    if (!subject) return;
    
    const message = prompt('Enter message:');
    if (!message) return;
    
    sendMessageToUser(userId, {
        toName: user.name,
        subject: subject,
        message: message,
        type: 'admin_message'
    });
    
    showNotification('Message sent successfully', 'success');
}

function loadPasswordRequests() {
    if (!elements.passwordRequests) return;
    
    const pendingRequests = state.passwordRequests.filter(req => req.status === 'pending');
    
    elements.passwordRequests.innerHTML = '';
    
    if (pendingRequests.length === 0) {
        elements.passwordRequests.innerHTML = `
            <div class="no-requests">
                <i class="fas fa-key"></i>
                <h3>No Pending Requests</h3>
                <p>All password reset requests have been handled</p>
            </div>
        `;
        return;
    }
    
    pendingRequests.forEach(request => {
        const requestElement = document.createElement('div');
        requestElement.className = 'password-request-item';
        
        requestElement.innerHTML = `
            <div class="request-header">
                <div class="request-user">${request.userName}</div>
                <div class="request-time">${timeAgo(request.createdAt)}</div>
            </div>
            <div class="request-email">${request.userEmail}</div>
            <div class="request-message">${request.message}</div>
            <div class="request-actions">
                <button onclick="resetUserPassword('${request.userEmail}')" class="btn btn-success">
                    <i class="fas fa-key"></i> Reset Password
                </button>
                <button onclick="markRequestComplete('${request.userEmail}')" class="btn btn-outline">
                    <i class="fas fa-check"></i> Mark Complete
                </button>
            </div>
        `;
        
        elements.passwordRequests.appendChild(requestElement);
    });
}

function loadAdminItems() {
    if (!elements.adminItemsList) return;
    
    // Load all items for admin
    const allItems = [...state.items];
    
    elements.adminItemsList.innerHTML = '';
    
    if (allItems.length === 0) {
        elements.adminItemsList.innerHTML = `
            <div class="no-items">
                <i class="fas fa-box"></i>
                <h3>No Items</h3>
                <p>No items have been reported yet</p>
            </div>
        `;
        return;
    }
    
    allItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'admin-item-item';
        itemElement.dataset.id = item.id;
        
        const reporter = state.users.find(u => u.id === item.reporterId);
        const adminLikes = item.adminLikes || 0;
        
        itemElement.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-meta">
                    <span class="item-status ${item.status}">${item.status.toUpperCase()}</span>
                    <span class="item-category">${item.category}</span>
                    <span class="item-date">${formatDate(item.date)}</span>
                </div>
                <div class="item-reporter">Reported by: ${reporter ? reporter.name : 'Unknown'} (${item.grade})</div>
            </div>
            <div class="item-stats">
                <div class="item-stat">
                    <i class="fas fa-star"></i>
                    <span>${adminLikes} Admin Likes</span>
                </div>
            </div>
            <div class="item-actions">
                <button onclick="adminDeleteItem(${item.id})" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i> Delete
                </button>
                <button onclick="showItemDetail(${item.id})" class="btn btn-sm btn-outline">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        `;
        
        elements.adminItemsList.appendChild(itemElement);
    });
}

function adminDeleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item as admin?')) return;
    
    const itemIndex = state.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    
    state.items.splice(itemIndex, 1);
    
    // Remove comments for this item
    state.comments = state.comments.filter(comment => comment.itemId !== itemId);
    
    saveData();
    loadAdminItems();
    displayItems('lost');
    displayItems('found');
    showNotification('Item deleted by admin', 'success');
}

function switchAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `${tabName}Tab`) {
            pane.classList.add('active');
        }
    });
}

// ===== CONTACT FORM =====
function handleContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const type = document.getElementById('contactType')?.value;
    const message = document.getElementById('contactMessage')?.value.trim();
    
    // Validation
    if (!name || !email || !type || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Send message to admin
    sendMessageToAdmin({
        fromId: state.currentUser ? state.currentUser.id : null,
        fromName: name,
        fromEmail: email,
        subject: `Contact: ${type}`,
        message: message,
        type: 'contact'
    });
    
    // Show success
    showNotification('Message sent successfully! We will respond within 24 hours.', 'success');
    
    // Reset form
    if (elements.forms.contact) elements.forms.contact.reset();
}

// ===== IMAGE UPLOAD =====
function handleItemImageUpload() {
    const file = this.files[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image must be less than 5MB', 'error');
        return;
    }
    
    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
        if (elements.previewImage) {
            elements.previewImage.src = e.target.result;
        }
        if (elements.imagePreview) {
            elements.imagePreview.style.display = 'block';
        }
        if (elements.uploadBox) {
            elements.uploadBox.style.display = 'none';
        }
    };
    reader.readAsDataURL(file);
}

function removeItemImage() {
    if (elements.previewImage) {
        elements.previewImage.src = '';
    }
    if (elements.imagePreview) {
        elements.imagePreview.style.display = 'none';
    }
    if (elements.uploadBox) {
        elements.uploadBox.style.display = 'flex';
    }
    if (elements.itemImage) {
        elements.itemImage.value = '';
    }
}

// ===== MODAL MANAGEMENT =====
function showModal(modalId) {
    closeAllModals();
    if (elements.modals[modalId]) {
        elements.modals[modalId].classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeAllModals() {
    Object.values(elements.modals).forEach(modal => {
        if (modal) modal.classList.remove('show');
    });
    document.body.style.overflow = 'auto';
    
    // Also close any dynamically created modals
    const dynamicModals = document.querySelectorAll('#itemDetailModal');
    dynamicModals.forEach(modal => {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentElement && modal.parentElement.parentNode === document.body) {
                document.body.removeChild(modal.parentElement);
            }
        }, 300);
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    if (!container) return;
    
    const id = Date.now();
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.id = `notification-${id}`;
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <div class="notification-content">
            <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="removeNotification('notification-${id}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(`notification-${id}`);
    }, 5000);
}

function removeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return 'Unknown date';
    }
}

function formatDateTime(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Unknown date/time';
    }
}

function timeAgo(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
        if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
        return formatDate(dateString);
    } catch (e) {
        return 'Unknown time';
    }
}

function generateRandomPassword(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function filterMyItems() {
    if (!state.currentUser) return;
    
    // Filter to show only user's items
    const myItems = state.items.filter(item => item.reporterId === state.currentUser.id);
    
    if (state.currentPage === 'lost') {
        if (elements.searchLostInput) {
            elements.searchLostInput.value = state.currentUser.name;
        }
        state.search.lost = state.currentUser.name;
    } else {
        if (elements.searchFoundInput) {
            elements.searchFoundInput.value = state.currentUser.name;
        }
        state.search.found = state.currentUser.name;
    }
    
    displayItems(state.currentPage);
}

// ===== GLOBAL FUNCTIONS =====
window.markItemAsFound = markItemAsFound;
window.deleteItem = deleteItem;
window.removeNotification = removeNotification;
window.addComment = addComment;
window.likeComment = likeComment;
window.replyToComment = replyToComment;
window.deleteComment = deleteComment;
window.deleteReply = deleteReply;
window.adminLikeItem = adminLikeItem;
window.resetUserPassword = resetUserPassword;
window.markRequestComplete = markRequestComplete;
window.adminResetUserPassword = adminResetUserPassword;
window.adminSendMessage = adminSendMessage;
window.adminDeleteItem = adminDeleteItem;
window.sendReply = sendReply;
window.sendAdminReply = sendAdminReply;
window.showModal = showModal;
window.closeAllModals = closeAllModals;
window.showPage = showPage;

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', init);