from flask import Flask, request, render_template, redirect, url_for, flash, session
from modules.class_api_firms import Firms
from datetime import datetime
import secrets
import pickle


app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
api = Firms()

@app.route("/")
def init():
    return render_template('login.html')

@app.route("/login", methods = ['GET','POST'])
def login():
    if request.method == 'POST':
        input_key = request.form.get('nasa-FIRMS-value')
        if input_key in session:
            return redirect(url_for('home'))
        verified_key = api.checkKey(input_key)
        if isinstance(verified_key, dict):
            verified_key['connection'] = datetime.now()
            session[input_key] = verified_key
            print(session)
            return redirect(url_for('home'))
        else:
            flash(verified_key)
            return redirect(url_for('login'))
    else:
        return render_template('login.html')

@app.route('/home', methods=['GET'])
def home():
    # active_fires = api.getAreaFire('World')
    with open("./world_active_fires.pkl", 'rb') as fp:
        active_fires = pickle.load(fp)

    # available_countries = api.getCountriesBox()
    with open("./available_countries.pkl", 'rb') as fp1:
        available_countries = pickle.load(fp1)

    with open("./available_subRegions.pkl", 'rb') as fp2:
        available_subRegions = pickle.load(fp2)

    return render_template('index.html', data = active_fires, areas = available_subRegions, countries = available_countries)
