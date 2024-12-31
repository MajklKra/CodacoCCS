
    document.addEventListener("DOMContentLoaded", function() 
    {
        
        var acc = document.getElementsByClassName("accordion");
        var i;

        // Funkce pro ukládání stavu akordeonů
        function saveAccordionState() {
            var states = [];
            for (i = 0; i < acc.length; i++) {
                var panel = acc[i].nextElementSibling;
                states.push(panel.style.maxHeight ? 'open' : 'closed');
            }
            sessionStorage.setItem('accordionState', JSON.stringify(states)); // Uložení do sessionStorage
            console.log('Stav akordeonů uložen:', states); // Ladicí výstup
        }

        // Funkce pro obnovení stavu akordeonů při načtení stránky
        function loadAccordionState() {
            var savedState = JSON.parse(sessionStorage.getItem('accordionState'));
            if (savedState) {
                console.log('Načítám stav akordeonů:', savedState); // Ladicí výstup
                for (i = 0; i < acc.length; i++) {
                    var panel = acc[i].nextElementSibling;
                    if (savedState[i] === 'open') {
                        panel.style.maxHeight = panel.scrollHeight + "px"; // Otevření panelu
                        acc[i].classList.add("active"); // Nastavení aktivního stavu
                    } else {
                        panel.style.maxHeight = null; // Zavření panelu
                        acc[i].classList.remove("active"); // Odstranění aktivního stavu
                    }
                }
            } else {
                console.log('Žádný uložený stav akordeonů nenalezen.'); // Ladicí výstup
            }
        }

        // Přidání event listeneru pro každý akordeon
        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }

                saveAccordionState(); // Uložení stavu po každé změně
            });
        }

        // Načtení stavu akordeonů při načtení stránky
        loadAccordionState();
    });

                   
    function formatDateTimeGMT(rawDate) 
    {
        // Vytvoření objektu Date z řetězce v GMT (UTC)
        const date = new Date(rawDate);

        if (isNaN(date)) {
            console.error("Chyba: Neplatné datum", rawDate);
            return "Neplatné datum";
        }

        // Získání jednotlivých částí data a času v UTC (bez přepočtu na lokální čas)
        const day = String(date.getUTCDate()).padStart(2, '0');  // Den
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');  // Měsíc (getUTCMonth() vrací index, takže přičítáme 1)
        const year = date.getUTCFullYear();  // Rok
        const hours = String(date.getUTCHours()).padStart(2, '0');  // Hodiny
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');  // Minuty
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');  // Sekundy

        // Sestavení formátovaného řetězce (bez mezer)
        //return `${day}.${month}.${year} ${hours}:${minutes}:${seconds} GMT`;
        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }

    function loadData() {

            // Získání aktuálního času
            const currentTime = new Date();

            // Pole pro názvy měsíců a dnů v týdnu v češtině
            const daysOfWeek = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
            const months = ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"];

            // Získání jednotlivých částí data
            const dayOfWeek = daysOfWeek[currentTime.getDay()]; // Den v týdnu
            const day = currentTime.getDate(); // Den v měsíci
            const month = months[currentTime.getMonth()]; // Měsíc
            const year = currentTime.getFullYear(); // Rok
            const hours = String(currentTime.getHours()).padStart(2, '0'); // Hodiny
            const minutes = String(currentTime.getMinutes()).padStart(2, '0'); // Minuty

            // Sestavení výsledného formátu
            const formattedDate = `${dayOfWeek} ${day}. ${month} ${year} ${hours}:${minutes}`;

            // Zobrazení na stránce nebo v konzoli
            console.log(formattedDate);

            // // Pokud chcete zobrazit na stránce, můžete použít:
            // document.getElementById('time-display').innerText = formattedDate;

            document.getElementById('span1').innerHTML = '<b>'+ formattedDate + '</b>';
    }


    // Načítání dat každou sekundu
    setInterval(loadData, 1000); // 3000ms = 3 sekundy

    // První načtení dat při načtení stránky
    loadData();

 
