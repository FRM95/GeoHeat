from flask import Flask, render_template
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

@app.route("/")
def init():
    return render_template('index.html')
