from flask import Flask, request, render_template, redirect, url_for, flash, session
from modules.class_api_firms import Firms
from modules.class_mongodb_geoheat import GeoHeatDB
from datetime import datetime
import secrets
import json
import logging

logging.basicConfig(level=logging.DEBUG)
logger  = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

api = Firms()
mongodb = GeoHeatDB()

@app.route("/")
def init():
    return redirect(url_for('login'))

@app.route("/login", methods = ['GET','POST'])
def login():
    if request.method == 'POST':
        input_key = request.form.get('nasa-FIRMS-value')
        if input_key in session:
            if mongodb.userExists(input_key):
                return redirect(url_for('home', key = input_key)) 
            else:
                # TODO: add message -> can not logging, unable to user (mongodb problem)
                flash('Unable to check user') 
                return redirect(url_for('login'))
        else:
            key_object = api.checkKey(input_key)
            if isinstance(key_object, dict):
                key_object['connection'] = datetime.now()
                session[input_key] = key_object
                if mongodb.userExists(input_key) == False:
                    if mongodb.addUser({"firms_key" : input_key}) == False:
                        # TODO: add message -> If user couldnt be created (mongodb problem)
                        flash('Unable to add user') 
                        return redirect(url_for('login'))
                return redirect(url_for('home', key = input_key))
            else:
                flash('Something wrong with NASA happened') # TODO: add message -> something wrong happened NASA FIRMS key (nasa problem)
                return redirect(url_for('login'))
    else:
        with open('./data/mock_data.json', 'r') as f:
            mock_data = json.load(f)
        return render_template('login.html', data = mock_data)
    
    
@app.route('/home/<key>', methods=['GET'])
def home(key):
    if key in session:
        user_data = mongodb.getUserData(key)
        if user_data != None:
            countries_data, firms_data, areas_data = mongodb.getRequestData()
            return render_template('index.html', 
                    user_fires = {key: []}, 
                    user_data = user_data, 
                    countries_data = countries_data,
                    firms_data = firms_data,
                    areas_data = areas_data)
        else:
            # TODO: add message -> can not logging, unable to get user data (mongodb problem)
            flash('Unable to get user info') 
            return redirect(url_for('login'))
    else:
        # TODO: add message -> need to login first
        flash('You need to login first') 
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
        return 'soon'
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
        
