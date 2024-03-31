from flask import Flask, request, render_template, redirect, url_for, flash, session
from modules.nasa_firms import firmsAPI
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
api = firmsAPI()

@app.route("/")
def init():
    return render_template('login.html')

@app.route("/login", methods = ['GET','POST'])
def login():
    if request.method == 'POST':
        input_key = request.form.get('nasa-FIRMS-value')
        verified_key = api.checkAPIKey(input_key)
        if isinstance(verified_key, dict):
            session['username'] = input_key
            return redirect(url_for('home'))
        else:
            flash(verified_key)
            return redirect(url_for('login'))
    else:
        return render_template('login.html')

@app.route('/home', methods=['GET'])
def home():
    coordinates = {'fire1' : [40.416775, -3.703790],
                    'fire2' : [48.864716, 2.349014], 
                    'fire3' : [40.730610, -73.935242]
                    } 
    return render_template('index.html')