const form = document.getElementById('signupForm');
const successMsg = document.getElementById('successMessage');

// Field references
const fields = {
    name: { el: document.getElementById('name'), err: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), err: document.getElementById('emailError') },
    pass: { el: document.getElementById('password'), err: document.getElementById('passError') }
};

// 1. BLUR HIGHLIGHTING
fields.name.el.addEventListener('blur', () => {
    if (fields.name.el.value.trim().length < 3) {
        showError('name', 'Name is too short.');
    } else {
        clearError('name');
    }
});

fields.email.el.addEventListener('blur', () => {
    if (!fields.email.el.value.includes('@')) {
        showError('email', 'Invalid email format.');
    } else {
        clearError('email');
    }
});

fields.pass.el.addEventListener('blur', () => {
    if (fields.pass.el.value.length < 6) {
        showError('pass', 'Password needs 6+ chars.');
    } else {
        clearError('pass');
    }
});

// Helper Functions
function showError(fieldKey, message) {
    fields[fieldKey].el.classList.add('input-error');
    fields[fieldKey].err.innerText = message;
}

function clearError(fieldKey) {
    fields[fieldKey].el.classList.remove('input-error');
    fields[fieldKey].err.innerText = "";
}

// 2. SUCCESS ON SUBMISSION (No Refresh)
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop page refresh

    // Check if any field is empty or has error class
    let hasError = false;
    Object.keys(fields).forEach(key => {
        if (fields[key].el.value === "" || fields[key].el.classList.contains('input-error')) {
            showError(key, "Required field.");
            hasError = true;
        }
    });

    if (!hasError) {
        form.classList.add('hidden');
        successMsg.classList.remove('hidden');
    }
});