from flask import Flask, request, render_template, redirect, url_for, flash, session
from modules.class_api_firms import Firms
from datetime import datetime
from pymongo import MongoClient
from os import getenv
import secrets
import json
import logging

logging.basicConfig(level=logging.DEBUG)
logger  = logging.getLogger(__name__)
app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
api = Firms()

# def mongoDB():
   
#     client = MongoClient(
#             host = getenv('HOST'),
#             port = 27017, 
#             username = getenv('MONGO_INITDB_ROOT_USERNAME'), 
#             password = getenv('MONGO_INITDB_ROOT_PASSWORD'),
#             authSource = getenv('AUTHENTICATION_DB'))
    
#     db = client[getenv('MONGO_INITDB_DATABASE')]

#     return db

@app.route("/")
def init():
    return redirect(url_for('login'))

@app.route("/login", methods = ['GET','POST'])
def login():
   
    if request.method == 'POST':
        input_key = request.form.get('nasa-FIRMS-value')
        if input_key in session:
            return redirect(url_for('home', key = input_key))
        
        else:
            verified_key = api.checkKey(input_key)
            if isinstance(verified_key, dict):
                verified_key['connection'] = datetime.now()
                session[input_key] = verified_key
                return redirect(url_for('home', key = input_key))
            else:
                flash(verified_key)
                return redirect(url_for('login'))

    else:
        with open('./data/mock_data.json', 'r') as f:
            mock_data = json.load(f)
        return render_template('login.html', data = mock_data)
    
@app.route('/home/<key>', methods=['GET'])
def home(key):

    if key in session:

        # If user key exists, Try to get active fires from mongodb
        active_fires = {key: []}
        with open("./data/request_data.json", 'r') as fp1:
            available_request_data = json.load(fp1)
        
        # db = mongoDB()
        # logger.info(list(db.request_data.find({})))

        return render_template('index.html', user_data = active_fires, user_key = key, options_data = available_request_data)
    
    else:
        return redirect(url_for('login'))

@app.route("/updateData", methods = ['POST','PUT'])
def updateData():
    if request.method == 'POST':
        request_data = request.json
        request_key = request_data.get('key')
        if request_key in session:
            validated_data = api.isvalidRequest(request_data)
            if isinstance(validated_data, str):
                return {'error': f'Unable to request new data, {validated_data}'}
            else:
                api_result = api.getFires(request_key, **validated_data)
                if isinstance(api_result, str):
                    return {'error': f'Unable to request new data, {api_result}'}
                else:
                    try:
                        json_result = json.dumps(api_result)
                    except Exception as e:
                        return {'error': f'Unable to parse JSON new data, {e}'}
                    else:
                        return json_result
        else:
            return {'error': f'Unable to request new data, invalid MAP_KEY {request_key}'}
    
    elif request.method == 'PUT':
        request_data = request.json
        request_key = [*request_data][0]
        if request_key in session:
            try:
                newData = json.dumps(request.json)
                with open("./data/fires_data.json", "w") as newFile:
                    newFile.write(newData)
            except Exception as e:
                return f'Unable to update data, {e}'
            else:
                return f'Data was successfully updated'
        else:
            return f'Unable to update data, invalid MAP_KEY {request_key}'
        
