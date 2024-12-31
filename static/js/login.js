

    const userInput = document.getElementById('username');
    const passInput = document.getElementById('password');

    const icon = document.getElementById('eyeIcon');

    // Změna textu placeholderu při zaměření
    userInput.addEventListener('focus', () => {
        userInput.placeholder = "";
    });

    // Změna textu placeholderu při zaměření
    passInput.addEventListener('focus', () => {
        passInput.placeholder = "";
        icon.style.color = "#A7C7E7";
    });

    
    // Obnovení původního placeholderu při odchodu z pole
    userInput.addEventListener('blur', () => {
        userInput.placeholder = "Uživatelské jméno ";
    });

    // Obnovení původního placeholderu při odchodu z pole
    passInput.addEventListener('blur', () => {
        passInput.placeholder = "Heslo ";
        passInput.style.color = "#808080";
        icon.style.color = "gainsboro";
    });

        
    if (window.location.pathname === '/login') 
    {
        sessionStorage.clear();
        console.log("SessionStorage vymazána při načtení přihlašovací stránky.");
    }
       

    // const passwordField = document.getElementById("password");
    // const togglePasswordButton = document.getElementById("togglePassword");
    // const eyeIcon = document.getElementById("eyeIcon");

    // togglePasswordButton.addEventListener("click", () => {
    //     // Přepnutí typu mezi "password" a "text"
    //     if (passwordField.type === "password") {
    //         passwordField.type = "text";
    //         eyeIcon.classList.remove("fa-eye"); // Odstraní ikonu oka
    //         eyeIcon.classList.add("fa-eye-slash"); // Přidá ikonu přeškrtnutého oka
    //         /*eyeIcon.style.color = "red"; */  // Změní barvu ikony
    //         // eyeIcon.style.color = gainsboro;
    //     } else {
    //         passwordField.type = "password";
    //         eyeIcon.classList.remove("fa-eye-slash");
    //         eyeIcon.classList.add("fa-eye");
    //         /*eyeIcon.style.color = "#0096FF"; */ // Resetuje barvu ikony
    //         // eyeIcon.style.color = gainsboro;
    //     }
    // });
       