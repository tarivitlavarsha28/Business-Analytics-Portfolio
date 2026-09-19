const passwordForm = document.getElementById("passwordForm");
const websiteInput = document.getElementById("website");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const passwordList = document.getElementById("passwordList");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");
const togglePassword = document.getElementById("togglePassword");

const generatePasswordBtn =
    document.getElementById("generatePassword");

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");


// Load saved passwords
let passwords =
    JSON.parse(localStorage.getItem("passwords")) || [];


// Display passwords
function displayPasswords(list = passwords) {

    passwordList.innerHTML = "";

    if (list.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    list.forEach((item, index) => {

        const passwordItem = document.createElement("div");

        passwordItem.className = "password-item";

        passwordItem.innerHTML = `
            <h3>🌐 ${escapeHTML(item.website)}</h3>

            <p>
                <strong>Username:</strong>
                ${escapeHTML(item.username)}
            </p>

            <p>
                <strong>Password:</strong>
                <span id="password-${index}">••••••••</span>
            </p>

            <div class="password-actions">

                <button
                    onclick="toggleSavedPassword(${index})"
                >
                    👁️ Show
                </button>

                <button
                    class="copy-btn"
                    onclick="copyPassword(${index})"
                >
                    📋 Copy
                </button>

                <button
                    class="delete-btn"
                    onclick="deletePassword(${index})"
                >
                    🗑️ Delete
                </button>

            </div>
        `;

        passwordList.appendChild(passwordItem);
    });
}


// Add password
passwordForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const website = websiteInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!website || !username || !password) {
        alert("Please fill all fields.");
        return;
    }

    const newPassword = {
        website: website,
        username: username,
        password: password
    };

    passwords.push(newPassword);

    savePasswords();

    passwordForm.reset();

    strengthBar.style.width = "0%";
    strengthText.textContent = "Password strength";

    displayPasswords();

    alert("Password saved successfully!");
});


// Save to LocalStorage
function savePasswords() {

    localStorage.setItem(
        "passwords",
        JSON.stringify(passwords)
    );
}


// Delete password
function deletePassword(index) {

    const confirmation =
        confirm("Are you sure you want to delete this password?");

    if (!confirmation) {
        return;
    }

    passwords.splice(index, 1);

    savePasswords();

    displayPasswords();
}


// Show/hide saved password
function toggleSavedPassword(index) {

    const passwordElement =
        document.getElementById(`password-${index}`);

    if (passwordElement.textContent === "••••••••") {

        passwordElement.textContent =
            passwords[index].password;

    } else {

        passwordElement.textContent =
            "••••••••";
    }
}


// Copy password
async function copyPassword(index) {

    try {

        await navigator.clipboard.writeText(
            passwords[index].password
        );

        alert("Password copied!");

    } catch (error) {

        alert("Unable to copy password.");
    }
}


// Show/hide password while adding
togglePassword.addEventListener("click", function() {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁️";
    }
});


// Generate strong password
generatePasswordBtn.addEventListener(
    "click",
    function() {

        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "abcdefghijklmnopqrstuvwxyz" +
            "0123456789" +
            "!@#$%^&*()_+";

        let generatedPassword = "";

        for (let i = 0; i < 16; i++) {

            const randomIndex =
                Math.floor(
                    Math.random() * characters.length
                );

            generatedPassword +=
                characters[randomIndex];
        }

        passwordInput.value = generatedPassword;

        checkPasswordStrength(generatedPassword);
    }
);


// Password strength checker
passwordInput.addEventListener(
    "input",
    function() {

        checkPasswordStrength(
            passwordInput.value
        );
    }
);


function checkPasswordStrength(password) {

    let score = 0;

    if (password.length >= 8) {
        score++;
    }

    if (password.length >= 12) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[a-z]/.test(password)) {
        score++;
    }

    if (/[0-9]/.test(password)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }


    if (password.length === 0) {

        strengthBar.style.width = "0%";
        strengthText.textContent =
            "Password strength";

    } else if (score <= 2) {

        strengthBar.style.width = "30%";
        strengthText.textContent =
            "Weak password";

    } else if (score <= 4) {

        strengthBar.style.width = "65%";
        strengthText.textContent =
            "Medium password";

    } else {

        strengthBar.style.width = "100%";
        strengthText.textContent =
            "Strong password";
    }
}


// Search passwords
searchInput.addEventListener(
    "input",
    function() {

        const searchTerm =
            searchInput.value.toLowerCase();

        const filteredPasswords =
            passwords.filter(item =>
                item.website
                    .toLowerCase()
                    .includes(searchTerm) ||

                item.username
                    .toLowerCase()
                    .includes(searchTerm)
            );

        displayPasswords(filteredPasswords);
    }
);


// Prevent HTML injection in displayed values
function escapeHTML(value) {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// Initial display
displayPasswords();
