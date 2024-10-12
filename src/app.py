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
            if mongodb.existsUser(input_key):
                return redirect(url_for('home', key = input_key)) 
            else:
                # TODO: add message -> can not logging, unable to user (mongodb problem)
                flash('Unable to check user') 
                return redirect(url_for('login'))
        else:
            key_object = api.checkKey(input_key)
            if isinstance(key_object, dict):
                if not mongodb.existsUser(input_key):
                    user_info = key_object.copy()
                    user_info["created"] = datetime.now()
                    user_info["auto"] = True
                    if not mongodb.setNewUser(input_key, user_info):
                        # TODO: add message -> If user couldnt be created (mongodb problem)
                        flash('Unable to add user') 
                        return redirect(url_for('login'))
                key_object["conected"] = datetime.now()
                session[input_key] = key_object
                return redirect(url_for('home', key = input_key))
            else:
                # TODO: add message -> something wrong happened NASA FIRMS key (nasa problem)
                flash('Something wrong with NASA happened')
                return redirect(url_for('login'))
    else:
        with open('./data/mock_data.json', 'r') as f:
            mock_data = json.load(f)
        return render_template('login.html', data = mock_data)
    
    
@app.route('/home/user/<key>', methods=['GET'])
def home(key):
    if key in session:
        db_user_data = mongodb.getUserData(key)
        if db_user_data != None:
            db_firms_data = mongodb.getFirmsData()
            if db_firms_data:
                return render_template('index.html', 
                        user_data = db_user_data,
                        firms_data = db_firms_data)
            else:
                # TODO: add message -> can not logging, unable to get user data (mongodb problem)
                flash('Unable to get firms info') 
                return redirect(url_for('login'))
        else:
            # TODO: add message -> can not logging, unable to get user data (mongodb problem)
            flash('Unable to get user info') 
            return redirect(url_for('login'))
    else:
        # TODO: add message -> need to login first
        flash('You need to login first') 
        return redirect(url_for('login'))


# @app.route("/updateUserData/<key>/", methods = ['PUT'])
# def updateUserData(key):
#     if request.method == "PUT":
#         if key in session:
#             try:
#                 query_string = request.args
#                 dataToUpdate = request.json
#             except:
#                 return "unable to read data"
#             else:
#                 updateData = mongodb.updateUserData(key, query_string, dataToUpdate)
#                 return updateData
#         else:
#             # TODO: add message -> need to login first
#             flash('You need to login first') 
#             return redirect(url_for('login'))


# @app.route("/addUserData/<key>/", methods = ['POST'])
# def addUserData(key):
#     if request.method == "POST":
#         if key in session:
#             try:
#                 query_string = request.args
#                 dataToUpdate = request.json
#             except:
#                 return "unable to read data"
#             else:
#                 updateData = mongodb.updateUserData(key, query_string, dataToUpdate)
#                 return updateData
#         else:
#             # TODO: add message -> need to login first
#             flash('You need to login first') 
#             return redirect(url_for('login'))


@app.route("/getFirmsData/<key>/", methods = ['GET'])     
def getFirmsData(key):
    if request.method == 'GET':
        if key in session:
            try:
                query_parameters = request.args
            except:
                return "unable to read data"
            else:
                validated_data = api.isvalidRequest(query_parameters)
                if isinstance(validated_data, str):
                    return {'error': f'Unable to request new data, {validated_data}'}
                else:
                    api_result = api.getFires(key, **validated_data)
                    if isinstance(api_result, str):
                        return {'error': f'Unable to request new data, {api_result}'}
                    else:
                        return api_result
        else:
            # TODO: add message -> need to login first
            flash('You need to login first') 
            return redirect(url_for('login'))
