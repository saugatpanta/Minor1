AOS.init();

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userAuthSection = document.getElementById('userAuthSection');
    const adminAuthSection = document.getElementById('adminAuthSection');
    const loginBtn = document.querySelector('.navbar .btn-outline');
    const adminBtn = document.querySelector('.navbar .btn-primary');
    const closeBtns = document.querySelectorAll('.close-btn');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const authSwitchLinks = document.querySelectorAll('.auth-switch a');
    const mainContent = document.querySelector('body > :not(.auth-section)');
    const statusMessage = document.getElementById('statusMessage');
    const signupRole = document.getElementById('signupRole');
    const employeeCodeContainer = document.getElementById('employeeCodeContainer');
    const userLoginForm = document.getElementById('userLoginForm');
    const userSignupForm = document.getElementById('userSignupForm');
    const adminLoginForm = document.getElementById('adminLoginForm');

    // Initialize local storage if empty
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('admin')) {
        localStorage.setItem('admin', JSON.stringify({
            email: "admin@gmail.com",
            password: "admin123"
        }));
    }

    // Show user login section
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        userAuthSection.classList.add('show');
        document.body.style.overflow = 'hidden';
        mainContent.style.filter = 'blur(2px)';
    });

    // Show admin login section
    adminBtn.addEventListener('click', function(e) {
        e.preventDefault();
        adminAuthSection.classList.add('show');
        document.body.style.overflow = 'hidden';
        mainContent.style.filter = 'blur(2px)';
    });

    // Close auth sections
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            userAuthSection.classList.remove('show');
            adminAuthSection.classList.remove('show');
            document.body.style.overflow = '';
            mainContent.style.filter = '';
        });
    });

    // Switch between login and signup tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabName}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Switch forms using links
    authSwitchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            
            authTabs.forEach(t => t.classList.remove('active'));
            document.querySelector(`.auth-tab[data-tab="${tabName}"]`).classList.add('active');
            
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabName}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    signupRole.addEventListener('change', function() {
        if (this.value === 'employee') {
            employeeCodeContainer.style.display = 'block';
            document.getElementById('employeeCode').required = true;
        } else {
            employeeCodeContainer.style.display = 'none';
            document.getElementById('employeeCode').required = false;
        }
    });

    userAuthSection.addEventListener('click', function(e) {
        if (e.target === this) {
            userAuthSection.classList.remove('show');
            document.body.style.overflow = '';
            mainContent.style.filter = '';
        }
    });

    adminAuthSection.addEventListener('click', function(e) {
        if (e.target === this) {
            adminAuthSection.classList.remove('show');
            document.body.style.overflow = '';
            mainContent.style.filter = '';
        }
    });

    // User Login Handler
    userLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const role = document.getElementById('loginRole').value;
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!role) {
            showStatusMessage('Please select a role', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.email === email && u.password === password && u.role === role);
        
        if (user) {
            showStatusMessage('Login successful!', 'success');

            sessionStorage.setItem('currentUser', JSON.stringify(user));
        
            setTimeout(() => {
                if (role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else if (role === 'employee') {
                    window.location.href = 'employee-dashboard.html';
                } else {
                    window.location.href = 'client-dashboard.html';
                }
            }, 1500);
        } else {
            showStatusMessage('Invalid credentials or role!', 'error');
        }
    });

    // User Signup
    userSignupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const role = document.getElementById('signupRole').value;
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('signupPhone').value;
        const address = document.getElementById('signupAddress').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const employeeCode = document.getElementById('employeeCode').value;
        
        // Validation
        if (!role) {
            showStatusMessage('Please select a role', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showStatusMessage('Passwords do not match!', 'error');
            return;
        }
        
        if (role === 'employee') {
            if (employeeCode !== 'PASHUPATI123') {
                showStatusMessage('Invalid employee code! Only authorized employees can sign up.', 'error');
                return;
            }
            
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
            if (currentUser && currentUser.role === 'client') {
                showStatusMessage('You are not an employee. Please sign up using client role.', 'error');
                return;
            }
        }
        
        const users = JSON.parse(localStorage.getItem('users'));
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            showStatusMessage('Email already registered!', 'error');
            return;
        }
        
        const newUser = {
            role,
            name,
            email,
            phone,
            address,
            password,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        showStatusMessage('Registration successful! Please login.', 'success');

        authTabs.forEach(t => t.classList.remove('active'));
        document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
        authForms.forEach(f => f.classList.remove('active'));
        document.getElementById('loginForm').classList.add('active');
        
        userSignupForm.reset();
        employeeCodeContainer.style.display = 'none';
    });

    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
    
        const email = document.getElementById('adminEmail').value.trim().toLowerCase();
        const password = document.getElementById('adminPassword').value;
    
        console.log('Login attempt:', { email, password });

        const adminData = localStorage.getItem('admin');
        console.log('Stored admin data:', adminData);
    
        if (!adminData) {
            showStatusMessage('Admin account not configured', 'error');
            return;
        }

        try {
            const admin = JSON.parse(adminData);
            console.log('Parsed admin:', admin);

            if (email === admin.email.toLowerCase() && password === admin.password) {
                showStatusMessage('Admin login successful!', 'success');
                
                sessionStorage.setItem('isAdmin', 'true');
                sessionStorage.setItem('adminEmail', admin.email);
            
                adminLoginForm.reset();
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1500);
            } else {
                console.log('Comparison failed:', {
                    inputEmail: email, 
                    storedEmail: admin.email.toLowerCase(),
                    inputPass: password, 
                    storedPass: admin.password
                });
                showStatusMessage('Invalid admin credentials', 'error');
            }
        } catch (error) {
            console.error('Error parsing admin data:', error);
            showStatusMessage('Login system error', 'error');
        }
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            userAuthSection.classList.remove('show');
            adminAuthSection.classList.remove('show');
            document.body.style.overflow = '';
            mainContent.style.filter = '';
        });
    });

    function showStatusMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message show';
        if (type === 'error') {
            statusMessage.classList.add('error');
        } else {
            statusMessage.classList.remove('error');
        }
        
        setTimeout(() => {
            statusMessage.classList.remove('show');
        }, 3000);
    }

    function updateAuthUI() {
        const currentUser = sessionStorage.getItem('currentUser');
        const isAdmin = sessionStorage.getItem('isAdmin');
        
        if (currentUser) {
            const user = JSON.parse(currentUser);

            loginBtn.textContent = `Hi, ${user.name.split(' ')[0]}`;
            loginBtn.classList.add('logged-in');
            loginBtn.onclick = function() {

                sessionStorage.removeItem('currentUser');
                loginBtn.textContent = 'Login';
                loginBtn.classList.remove('logged-in');
                loginBtn.onclick = function(e) {
                    e.preventDefault();
                    userAuthSection.classList.add('show');
                    document.body.style.overflow = 'hidden';
                    mainContent.style.filter = 'blur(2px)';
                };
                showStatusMessage('Logged out successfully', 'success');
            };
        } else {
            loginBtn.textContent = 'Login';
            loginBtn.classList.remove('logged-in');
        }
        
        if (isAdmin) {
            adminBtn.textContent = 'Admin Dashboard';
            adminBtn.classList.add('logged-in');
            adminBtn.onclick = function() {
                sessionStorage.removeItem('isAdmin');
                adminBtn.textContent = 'Admin';
                adminBtn.classList.remove('logged-in');
                adminBtn.onclick = function(e) {
                    e.preventDefault();
                    adminAuthSection.classList.add('show');
                    document.body.style.overflow = 'hidden';
                    mainContent.style.filter = 'blur(2px)';
                };
                showStatusMessage('Admin logged out', 'success');
            };
        } else {
            adminBtn.textContent = 'Admin';
            adminBtn.classList.remove('logged-in');
        }
    }

    updateAuthUI();

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        });

        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        }
    }
});

    function checkAuthStatus() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
        const isAdmin = sessionStorage.getItem('isAdmin');

        if (currentUser || isAdmin) {
            const role = isAdmin ? 'admin' : currentUser.role;
            switch(role) {
                case 'admin':
                    window.location.href = 'admin-dashboard.html';
                    break;
                case 'employee':
                    window.location.href = 'employee-dashboard.html';
                    break;
                case 'client':
                    window.location.href = 'client-dashboard.html';
                    break;
            }
        }
    }   

checkAuthStatus();