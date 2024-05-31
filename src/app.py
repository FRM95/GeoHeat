from flask import Flask, request, render_template, redirect, url_for, flash, session
from modules.class_api_firms import Firms
from datetime import datetime
import secrets
import pickle
import json


app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
api = Firms()

@app.route("/")
def init():
    with open('../data/mock_data.json', 'r') as f:
        mock_data = json.load(f)
    return render_template('login.html', data = mock_data)

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
        with open('../data/mock_data.json', 'r') as f:
            mock_data = json.load(f)
        return render_template('login.html', data = mock_data)

@app.route('/home', methods=['GET'])
def home():
    
    with open('../data/fires_aux_data.pkl', 'rb') as fp:
        active_fires = pickle.load(fp)

    with open("../data/countries_data.json", 'r') as fp1:
        available_countries = json.load(fp1)

    with open("../data/regions_data.json", 'r') as fp2:
        available_subRegions = json.load(fp2)

    return render_template('index.html', data = active_fires,  countries = available_countries, areas = available_subRegions)
