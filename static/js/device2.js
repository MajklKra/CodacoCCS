

    var acc = document.getElementsByClassName("accordion");
    var i;
    
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        } 
        });
    }

    // Funkce pro otevření a zavření akordeonů
    function toggleAccordion(event) {
        var panel = event.target.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
            event.target.classList.remove('active');

        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
            event.target.classList.add('active');

        }
    }

    // Připojte posluchače události k všem akordeonům
    var accordions = document.querySelectorAll('.accordion');
    accordions.forEach(function (accordion) {
        accordion.addEventListener('click', toggleAccordion);
    });

   
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
            sessionStorage.setItem('accordionState', JSON.stringify(states)); // Uložení do localStorage
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
  
              
    function formatDateTimeGMT(rawDate) {
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

    let selectedDevice = null;

    function saveDevice() {
        // Uložení vybraného zařízení
        selectedDevice = document.getElementById('equ').value;
        console.log("Vybrané zařízení: " + selectedDevice);
        return selectedDevice;
    }

    function loadData() {

            let selectedDevice = saveDevice();
            // saveDevice() 

            console.log('loadData - vybrane zarizeni: ' + selectedDevice)

            // Získání aktuálního času
            const currentTime = new Date();

            console.log("Device2: aktuální čas: " + currentTime)

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

            // axios.get('/get_data').then(function (response) {
            // const data = response.data;  // Získání dat z odpovědi

            console.log('Hodnota promenne selectedDevice: je ' + selectedDevice)

            axios.get('/get_data', {
            params: {
                // sd: 'SRV1'  // SVR1 je řetězec
                sd: selectedDevice
            }
            }).then(function (response) {
                const data = response.data;  // Získání dat z odpovědi
            

            // Vyprázdníme tabulku
            const tableBody = document.querySelector('#t1 tbody');
            tableBody.innerHTML = '';

            // Pro každý objekt v datech vytvoříme nový řádek v tabulce
            data.forEach((item, index) => {
                console.log('Pořadí: ' + (index + 1));

                // Vytvoříme nový řádek pro tabulku
                const row = document.createElement('tr');

                // Získáme klíče (názvy vlastností) a hodnoty objektu
                const keys = Object.keys(item); // Klíče (např. ['id', 'name', 'age', 'runtime', 'director', 'genre'])
                const values = Object.values(item); // Hodnoty (např. [1, 'John', 30, 120, 'Spielberg', 'Drama'])

                let rozdil2 = 0; // Inicializace rozdílu mimo forEach

                // Pro každý klíč a hodnotu vytvoříme buňku v tabulce
                keys.forEach((key, i) => {
                    const cell = document.createElement('td');
                    cell.textContent = `${values[i]}`; // Zobrazí hodnotu

                    if (i === 3)
                    {
                        // cell.textContent = formatDateTimeIntl(values[i])
                        cell.textContent = formatDateTimeGMT(values[i])

                        const currentTime = new Date()

                        const dbTime = new Date(values[i])   

                        // Získáme časový posun v minutách
                        const timezoneOffset = dbTime.getTimezoneOffset();  // Vrátí posun v minutách, pozitivní hodnoty = východ, negativní = západ

                        // Odečteme tento posun v milisekundách
                        const correctedDate = new Date(dbTime.getTime() + timezoneOffset * 60000);

                        console.log('TEST: currentTime:' + currentTime)
                        console.log('TEST: dbTime:' + dbTime)

                        console.log('TEST: correctedDate:' + correctedDate)

                        rozdil = currentTime.getTime() - correctedDate.getTime()
                        rozdil2 = rozdil/1000

                        console.log("TEST: Rozdil je: " + rozdil + "[ms]")
                        console.log("TEST: Rozdil je: " + rozdil2 + "[s]")

                    }

                    // Pokud je to 6. sloupec, změňme text
                    if (i === 4) { // Index 5 je 6. sloupec

                        const seconds = values[i];

                        const days = Math.floor(seconds / 86400.002); // Dny
                        const hours = Math.floor((seconds / 86400.002 % 1) * 24); // Hodiny
                        const minutes = Math.floor((((seconds / 86400.002 % 1) * 24) % 1) * 60); // Minuty

                        cell.textContent = days + 'd ' + hours + 'h ' + minutes + 'm ' ;  // Zde nastavíte požadovanou hodnotu pro 6. sloupec
            
                    }

                    // Obarvíme řádek, pokud je rozdil2 větší než 5
                    if (rozdil2 > 10) {
                        row.style.backgroundColor = '#FFFDD0';
                    }

                    row.appendChild(cell);  // Přidáme buňku do řádku
                });

                
                // Přidáme řádek do těla tabulky
                tableBody.appendChild(row);
            });
        })

        .catch(function (error) {
            console.log('Chyba při načítání dat:', error);
        });
    }

    // Načítání dat každou sekundu
    setInterval(loadData, 1000); // 3000ms = 3 sekundy

    // První načtení dat při načtení stránky
    loadData();

    
    // Událost pro změnu výběru v select boxu
    document.getElementById('equ').addEventListener('change', function() 
    {
        loadData();  // Načíst data při změně výběru
    });

    // Inicializace při načtení stránky (první načtení dat)
    window.addEventListener('load', function() 
    {
        loadData();
    });


   