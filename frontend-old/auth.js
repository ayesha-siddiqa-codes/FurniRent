document.addEventListener("DOMContentLoaded", function () {

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    const navbar = document.querySelector(".navbar nav");

    if (!navbar) {
        return;
    }

    // Find Login and Register links
    const loginLink = navbar.querySelector('a[href="login.html"]');
    const registerLink = navbar.querySelector('a[href="register.html"]');

    if (token) {

        // Remove Login/Register
        if (loginLink) {
            loginLink.remove();
        }

        if (registerLink) {
            registerLink.remove();
        }

        // Add My Rentals
        const rentalsLink = document.createElement("a");

        rentalsLink.href = "rentals.html";
        rentalsLink.textContent = "My Rentals";

        navbar.appendChild(rentalsLink);


        // Add Logout
        const logoutLink = document.createElement("a");

        logoutLink.href = "#";
        logoutLink.textContent = "Logout";

        logoutLink.addEventListener("click", function (event) {

            event.preventDefault();

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "index.html";

        });

        navbar.appendChild(logoutLink);


        // Check if logged-in user is admin
        if (userData) {

            try {

                const user = JSON.parse(userData);

                if (user.role === "admin") {

                    const adminLink =
                        document.createElement("a");

                    adminLink.href = "admin.html";
                    adminLink.textContent =
                        "Admin Dashboard";

                    navbar.appendChild(adminLink);
                }

            } catch (error) {

                console.error(
                    "Could not read user information:",
                    error
                );

            }

        }

    }

});