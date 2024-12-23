import mysql.connector
from flask import Flask, render_template, redirect, url_for, request, flash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
from flask import abort
from functools import wraps
import secrets
from datetime import timedelta
from flask import session
from datetime import datetime
from babel.dates import format_datetime
from flask import jsonify

import uuid


# pocet = 0

# Slouží k udržování informace o přihlášených uživatelích
active_sessions = {}

app = Flask(__name__)

app.secret_key = secrets.token_hex(16)

# Cookie
app.config['SESSION_COOKIE_SECURE'] = True  # Pouze přes HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Nepřístupné přes JavaScript

bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=5)  # Maximální doba nečinnosti

# Databáze uživatelů (pro jednoduchost hardcoded, použijte databázi pro produkci)
users = {
    "admin": {"password": bcrypt.generate_password_hash("adminpass").decode('utf-8'), "role": "admin"},
    "user": {"password": bcrypt.generate_password_hash("userpass").decode('utf-8'), "role": "user"},
    "footballer": {"password": bcrypt.generate_password_hash("fpass").decode('utf-8'), "role": "footballer"},
    "Michal": {"password": bcrypt.generate_password_hash("Ostrava").decode('utf-8'), "role": "author"},
}

# Konfigurace připojení k MySQL databázi
db_config = {
    'host': '172.30.0.10',         # Název nebo IP adresa serveru
    'user': 'CODACOUSER',          # Uživatelské jméno MySQL
    'password': 'trasq774JUMP',    # Heslo k databázi
    'database': 'CodacoG2',        # Název databáze
    'port': 3306                   # Port (standardně 3306)
}

# Kontrola nečinnosti
@app.before_request
def check_inactivity():
    if current_user.is_authenticated:
        last_activity = session.get('last_activity')

        if last_activity:
            # Převedení na datetime
            last_activity = datetime.fromisoformat(last_activity)

            # Pokud je uživatel neaktivní déle než povolený čas
            if datetime.now() - last_activity > app.config['PERMANENT_SESSION_LIFETIME']:
                logout_user()  # Odhlášení uživatele
                return redirect(url_for('login'))

        # Aktualizace poslední aktivity
        session['last_activity'] = datetime.now().isoformat()


# Třída User
class User(UserMixin):
    def __init__(self, username, role):
        self.id = username
        self.role = role

# Načítání uživatele
@login_manager.user_loader
def load_user(username):
    user = users.get(username)
    if user:
        return User(username, user["role"])
    return None


def role_required(*roles):
    def decorator(func):
        @wraps(func)
        @login_required
        def wrapper(*args, **kwargs):
            if current_user.role not in roles:
                abort(403)  # Forbidden
            return func(*args, **kwargs)
        return wrapper
    return decorator

@app.route("/")
def index():    
    #return redirect(url_for('login'))
    return render_template("index.html")
    #return "Domovská stránka. <a href='/login'>Přihlásit se</a>"

@app.route("/form")

def form():
    return render_template("login.html")

@app.route('/logout')
@login_required
def logout():

    global pocet

    logout_user()

    session_id = session.get('session_id')
    if session_id in active_sessions:
        del active_sessions[session_id]  # Odstranit uživatele z aktivních sessions

    pocet = 0

    session.clear()
    flash("Odhlášení úspěšné!", "success")
    return redirect(url_for('login'))

    # session_id = session.get('session_id')
    # if session_id in active_sessions:
    #     del active_sessions[session_id]  # Odstranit uživatele z aktivních sessions
    # session.clear()  # Vymazání všech session údajů
    # # return redirect(url_for('login'))
    # message = "Vsichni uzivatele byli odhlaseni !!!"

   
@app.route("/login", methods=["POST", "GET"])
def login():

    global active_sessions 
    global pocet

    if request.method == "POST":
        username = request.form.get("username")   # jméno z formuláře
        password = request.form.get("password")   # heslo z formuláře

        user = users.get(username)                # jméno ze seznamu

        if user and bcrypt.check_password_hash(user['password'], password):   # ověření, zda existuje user v seznamu a zda se zadané heslo rovná heslu z databáze 
                
                # pocet = pocet + 1
                
                # Pokud je uživatel již přihlášen z jiného prohlížeče, zamezte přihlášení
                if session.get('session_id') in active_sessions:
                    message = "Jiný uživatel používá stejný prohlížeč !"
                    # return "User is already logged in from this browser."
                    return render_template('result.html', x = message)

                # user_value = session.get("6af2a6f6-5113-4c25-9f0f-eb16837ebd9d", None)

                _user = None
                valuefound = None
                for key, value in active_sessions.items():
                    _user = value
                    break

                # if pocet ==2:
                #     print(f"Pocet je {pocet}")

                # Zamezte přihlášení, pokud je jiný uživatel již přihlášen
                # if 'current_user' in session and session['current_user'] == username:
                if _user == username:
                    message = "Stejný uživatel je již přihlášen !"
                    # return "Another user is already logged in. Please log out first."
                    return render_template('result.html', x = message)
                
                # if username  in active_sessions:

                # if username in active_sessions:
                #     # Získání session_id uloženého pro daného uživatele
                #     existing_session_id = active_sessions[username]
    
                #     # Pokud se uživatel pokouší přihlásit z jiné relace (jiný prohlížeč)
                #     current_session_id = session.get('session_id')
                #     if current_session_id is None:
                #         # Pokud session_id ještě neexistuje, vygenerujeme nové
                #         session['session_id'] = str(uuid.uuid4())
                #         current_session_id = session['session_id']
    
                #     if existing_session_id != current_session_id:
                #         message = "Tento uživatel je již přihlášen z jiného zařízení!"
                #         return render_template('result.html', x=message)
                    
                #     else:
                #         # Pokud uživatel není v `active_sessions`, uložíme nový session_id
                #         session['session_id'] = str(uuid.uuid4())
                #         active_sessions[username] = session['session_id']


                # Uložení session ID do relace pro sledování aktivního uživatele
                session['session_id'] = str(uuid.uuid4())  # Vytvoření unikátního ID
                session['current_user'] = username
                active_sessions[session['session_id']] = username
                # return redirect(url_for('home'))

                # session['user'] = user
                login_user(User(username, user["role"]))

                session['last_activity'] = datetime.now().isoformat()  # Inicializace aktivity

                flash("Přihlášení úspěšné!", "success")
                return redirect(url_for('device'))
        else:
            flash("Nesprávné uživatelské jméno nebo heslo !!!", "error")

    return render_template('login.html')


@app.route("/device")
@role_required('admin','user')
def device():
    try:
        # # Připojení k MySQL databázi
        # conn = mysql.connector.connect(**db_config)
        # cursor = conn.cursor()

        # # Provedení SQL dotazu
        # query = "SELECT MacAddressStr,IPAddressStr, LastActivity, RunTime, VersionString FROM HwIpDevicesAddrMem;"

        # query2 = """
        #          SELECT DeviceTypeShortCut, MacAddressStr, IPAddressStr, LastActivity, RunTime, VersionString
        #          FROM   HwIpDevicesAddrMem
        #          JOIN   HwIpDevicesTypes ON HwIpDevicesTypes.DeviceTypeID = HwIpDevicesAddrMem.DeviceTypeID;
        #          """
        
        # query3 = """
        #          SELECT *
        #          FROM   HwIpDevicesTypes;
        #          """

        # cursor.execute(query2)
        # results = cursor.fetchall()

        # # Zavření kurzoru a připojení
        # cursor.close()
        # conn.close()

        current_time = datetime.now()
        formatted_time = format_datetime(current_time, "EEEE d. MMMM yyyy", locale="cs")
        formatted_time = formatted_time[0].upper() + formatted_time[1:]

        # Předání dat do šablony
        return render_template("device.html", user=current_user, current_time=current_time, formatted_time=formatted_time)

    except mysql.connector.Error as err:
        # Zpracování chyby připojení
        return f"Chyba připojení k databázi: {err}"
    

@app.route("/device2", methods=['GET'])
@role_required('admin','user')
def device2():

    sd = ""
    sd = request.args.get('device', '')

    # print(sd)

    # global selected_device 
    # selected_device = request.args.get('device', '')  # Získání parametru 'device' z URLg
    # flash(selected_device)

    query = """
            SELECT DeviceTypeShortCut, MacAddressStr, IPAddressStr, LastActivity, RunTime, VersionString
            FROM   HwIpDevicesAddrMem
            JOIN   HwIpDevicesTypes ON HwIpDevicesTypes.DeviceTypeID = HwIpDevicesAddrMem.DeviceTypeID;
            """

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()

    # Zavoláme funkci get_data_from_db s parametrem selected_device
    results2 = get_data_from_db(sd)

    # Aktuální čas
    current_time = datetime.now()
    formatted_time = format_datetime(current_time, "EEEE d. MMMM yyyy", locale="cs")
    formatted_time = formatted_time[0].upper() + formatted_time[1:]

    # Předání dat do šablony
    return render_template(
        "device2.html",
        devices=results,
        user=current_user,
        current_time=current_time,
        formatted_time=formatted_time,
        query=results2,
        # selected_device = selected_device
        selected_device = sd
    )

 
def get_data_from_db(sd):

    # global selected_device

    # if selected_device == "":
    if sd == "":
        s = """
            SELECT DeviceTypeShortCut, MacAddressStr, IPAddressStr, LastActivity, RunTime, VersionString 
            FROM HwIpDevicesAddrMem 
            JOIN HwIpDevicesTypes ON HwIpDevicesTypes.DeviceTypeID = HwIpDevicesAddrMem.DeviceTypeID;
        """
    else:
        # s = f"""
        #     SELECT DeviceTypeShortCut, MacAddressStr, IPAddressStr, LastActivity, RunTime, VersionString 
        #     FROM HwIpDevicesAddrMem 
        #     JOIN HwIpDevicesTypes ON HwIpDevicesTypes.DeviceTypeID = HwIpDevicesAddrMem.DeviceTypeID
        #     WHERE DeviceTypeShortCut = '{selected_device}';
        # """

        s = f"""
            SELECT DeviceTypeShortCut, MacAddressStr, IPAddressStr, LastActivity, RunTime, VersionString 
            FROM HwIpDevicesAddrMem 
            JOIN HwIpDevicesTypes ON HwIpDevicesTypes.DeviceTypeID = HwIpDevicesAddrMem.DeviceTypeID
            WHERE DeviceTypeShortCut = '{sd}';
        """

    # Připojení k databázi
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute(s)
    data = cursor.fetchall()
    conn.close()
    return data

@app.route('/get_data', methods=['GET'])
def get_data():

    sd = request.args.get('sd') 

    print(f"hodnota sd ve funkci get_data {sd}")

    data = get_data_from_db(sd)

    return jsonify(data)

    
@app.route('/test')
@role_required('admin','user')
def test():
    try:
        # Připojení k MySQL databázi
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        query2 = """
                 SELECT DeviceTypeShortCut, HwIpDevicesTypes.DeviceTypeID, MacAddressStr, IPAddressStr, LastActivity, RunTime, VersionString
                 FROM   HwIpDevicesAddrMem
                 JOIN   HwIpDevicesTypes ON HwIpDevicesTypes.DeviceTypeID = HwIpDevicesAddrMem.DeviceTypeID;
                 """
        
        cursor.execute(query2)
        results = cursor.fetchall()

        # Zavření kurzoru a připojení
        cursor.close()
        conn.close()

        return render_template("test.html", devices=results)
    
    except mysql.connector.Error as err:
        # Zpracování chyby připojení
        return f"Chyba připojení k databázi: {err}"
    
# Spuštění Flask serveru
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)