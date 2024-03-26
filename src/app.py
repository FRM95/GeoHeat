from flask import Flask, request, render_template
from modules.nasa_firms import firmsAPI

app = Flask(__name__)
api = firmsAPI()


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/active-fires/home', methods=['GET'])
def mainPage():
    coordinates = {'fire1' : [40.416775, -3.703790],
                    'fire2' : [48.864716, 2.349014], 
                    'fire3' : [40.730610, -73.935242]
                    } 
    
    return render_template('index.html', data = 'example data')

@app.route('/active-fires/getLocation', methods=['POST'])
def getLocation():
    request_data = request.get_json()
    location_data = request_data.get('location')
    # if location_data is not available return not available
    # elif wrong location name return error
    # else return coordinate points
    nasa_data = api.getCountryFire(location_data)
    return {"coordinates":nasa_data}