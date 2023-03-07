"""VA API server"""

from __future__ import annotations

from fastapi import FastAPI

from models import SetArea, SetLuminaire, GetArea, WebHook

import requests

from requests.auth import HTTPBasicAuth
import json
import os

app = FastAPI(
    title='VA API server',
    description="This is a custom API server for 'Okay William' Voice assistant.\n\nThis invokes the Signify Interact control APIs to change the state of Signify Luminaires."
)

GLOBAL_TOKEN = ""

nameIDMap = {}

luminaire_mapping = {}


def publishIntent(CurrentState, InstanceId, NextState):
    print(CurrentState, InstanceId, NextState)
    if NextState == "allOn":
        intentJson = {
            "intent":"ChangeLightState",
            "state":"on",
            "area": InstanceId,
            }
        print("allOn")
        r = requests.put('http://node-red:1880/webhook', json.dumps(intentJson))
        
    elif NextState == "allOff":
        intentJson = {
        "intent":"ChangeLightState",
        "state":"off",
        "area": InstanceId,
        }
        print("allOff")
        r = requests.put('http://node-red:1880/webhook', json.dumps(intentJson))
        
    elif NextState == "ceilingOn":
        intentJson = {
        "intent":"ChangeLightState",
        "state":"on",
        "area": InstanceId,
        "name": "ceiling"
        }
        print("ceilingOn")
        r = requests.put('http://node-red:1880/webhook', json.dumps(intentJson))
    elif NextState == "wallOn":
        intentJson = {
        "intent":"ChangeLightState",
        "state":"on",
        "area": InstanceId,
        "name": "wall"
        }
        print("wallOn")
        r = requests.put('http://node-red:1880/webhook', json.dumps(intentJson))
        


def getWithBearer(endpoint):
    headers = {"Authorization": "Bearer " + GLOBAL_TOKEN}
    URL = endpoint
    r = requests.get(url = URL,headers = headers)

    data = r.json()
    if(r.status_code == 401):
        if "fault" in data.keys():
            if  (data["fault"]["faultstring"] == "Invalid access token"):
                return "Auth failed"
    return data

def putWithBearer(endpoint):
    headers = {"Authorization": "Bearer " + GLOBAL_TOKEN}
    URL = endpoint
    r = requests.put(url = URL,headers = headers)
    return r

def generateNameIDMap(locations):
    for row in locations["Area_List"]:
        nameIDMap[row["name"]] = row["areaID"]

def setLuminaireState(areaName, luminaireNameMapping, state):
    if not areaName in nameIDMap:
        return("Area name is invalid")
    areaID = nameIDMap[areaName]
    if luminaireNameMapping in luminaire_mapping[str(areaID)].keys(): 
        luminaireName = luminaire_mapping[str(areaID)][luminaireNameMapping]
        luminaire = getWithBearer(f"{config['em_config']['EM_SERVER_URL']}/interact/api/officeWiredOnPremise/control/testbed/getLuminaireLevelsForAreaEx/{areaID}")
        if luminaire == "Auth failed":
            return "Auth failed"
        level = "100" if state == "on" else "0"

        lumIds = []
        for lum in luminaire["luminairelevels"]:
            if lum["name"] == luminaireName:
                lumIds.append(lum["luminaireID"])

        for lid in lumIds:
            putWithBearer(f"{config['em_config']['EM_SERVER_URL']}/interact/api/officeWiredOnPremise/control/testbed/applyLuminaireLevel/{areaID}/{lid}/" + level)
        return("successful")
    else:
        return("Luminaire name is invalid")

def toggleLuminaireState(areaName, luminaireNameMapping):
    if not areaName in nameIDMap:
        return("Area name is invalid")
    areaID = nameIDMap[areaName]
    if luminaireNameMapping in luminaire_mapping[str(areaID)].keys(): 
        luminaireName = luminaire_mapping[str(areaID)][luminaireNameMapping]
        luminaire = getWithBearer(f"{config['em_config']['EM_SERVER_URL']}/interact/api/officeWiredOnPremise/control/testbed/getLuminaireLevelsForAreaEx/{areaID}")
        if luminaire == "Auth failed":
            return "Auth failed"
        lumToggleCmds = []

        for lum in luminaire["luminairelevels"]:
            toggledVal = "100" if (lum["luminaireLevel"] == 0) else "0"
            if lum["name"] == luminaireName:
                lumToggleCmds.append({"lumID": lum["luminaireID"], "toggledVal": toggledVal})

        for lidToggleCmd in lumToggleCmds:
            lumId = lidToggleCmd["lumID"]
            toggVal = lidToggleCmd["toggledVal"]
            putWithBearer(f"{config['em_config']['EM_SERVER_URL']}/interact/api/officeWiredOnPremise/control/testbed/applyLuminaireLevel/{areaID}/{lumId}/" + toggVal)
        
        return("successful")
    else:
        return("Luminaire name is invalid")

def setAreaState(areaName, state):
    if not areaName in nameIDMap:
        return("Area name is invalid")
    areaID = nameIDMap[areaName]
    level = "100" if state == "on" else "0"
    putWithBearer(f"{config['em_config']['EM_SERVER_URL']}/interact/api/officeWiredOnPremise/control/testbed/applyAreaLevel/{areaID}/" + level)
    return("successful")

def getAreaState(areaName):
    if not areaName in nameIDMap:
        return("Area name is invalid")
    areaID = nameIDMap[areaName]
    res = getWithBearer(f"{config['em_config']['EM_SERVER_URL']}/interact/api/officeWiredOnPremise/control/testbed/getLuminaireLevelsForAreaEx/{areaID}")
    return(res)

def getAreaStateID(areaID):
    res = getWithBearer(f"{config['em_config']['EM_SERVER_URL']}/interact/api/officeWiredOnPremise/control/testbed/getLuminaireLevelsForAreaEx/{areaID}")
    return(res)

def generateLuminaireMapping():
    f = open ('mapping.json', "r")
    luminaire_mapping = json.loads(f.read())
    f.close()
    return luminaire_mapping

def get_env():
    """Get env varibles."""
    data = { "app": { 
            'app_key': os.getenv("APP_KEY", default="lNdI4NT0Vz72kzi66fk0cCA5TGubLGVB"),
            'app_secret': os.getenv("APP_SECRET", default="RqOlvi260JPx4Q9e"),
            'service': os.getenv("SERVICE", default="officeWiredOnPremise"),
        },
        "em_config" : { 
            'SYSTEM_SERVICE_ID': os.getenv("SYSTEM_SERVICE_ID", default="testbed\\testbed"),
            'SYSTEM_SERVICE_SECRET': os.getenv("SYSTEM_SERVICE_SECRET", default="Testbed123"),
            'EM_SERVER_URL': os.getenv("EM_SERVER_URL", default="https://sandbox.api.interact-lighting.com"),
        }
    }
    return data

def updateFrontend():
    res = get_state()
    requests.post('http://localhost:8080/api/updateFrontend', json = res["status"])

@app.put('/initEMLighting', response_model=None)
def put_init_e_m_lighting() -> None:
    """
    Initialize the VA API server
    """
    global config
    config = get_env()
    
    URL = f"{config['em_config']['EM_SERVER_URL']}/oauth/accesstoken"

    config["em_config"]["EM_SERVER_URL"]
    r = requests.post(url = URL,auth=HTTPBasicAuth(config["em_config"]["SYSTEM_SERVICE_ID"], config["em_config"]["SYSTEM_SERVICE_SECRET"]), headers = {'Content-Type' : 'application/x-www-form-urlencoded'}, data = config["app"])
    
    # extracting data in json format
    data = r.json()
    global GLOBAL_TOKEN
    global nameIDMap
    global luminaire_mapping
    GLOBAL_TOKEN = data["token"]
    location_data = getWithBearer(f"{config['em_config']['EM_SERVER_URL']}/interact/api/officeWiredOnPremise/control/testbed/getAllLocations")
    if location_data == "Auth failed":
        return (
            {
                "return_code": 400,
                "message": "Auth failed. Reinitilize to generate new auth token"
            }
        )
    generateNameIDMap(location_data)
    luminaire_mapping = generateLuminaireMapping()

@app.put('/getAreaState', response_model=None)
def get_area_state(body: GetArea) -> None:
    global luminaire_mapping
    status = getAreaState(body.areaName)
    area_id = status["areaId"]
    luminaire_state={} 
    luminaire_state[body.areaName.replace(" ", "")]={}
    for i in range (len(status["luminairelevels"])):
        for key in luminaire_mapping[str(area_id)]:
            if luminaire_mapping[str(area_id)][key] == status["luminairelevels"][i]["name"]:
                if status["luminairelevels"][i]["luminaireLevel"] == 0:
                    luminaire_state[body.areaName.replace(" ", "")][key] = "off"
                    
    if (status == "Area name is invalid"):
        return(
            {
                "return_code": 400,
                "message": "invalid area name"
            }
        )
    else:
        return(
            {
                "return_code": 200,
                "areaName": body.areaName.replace(" ", ""),
                "status": luminaire_state
            }
        )


@app.get('/getState', response_model=None)
def get_state() -> None:
    global luminaire_mapping
    global nameIDMap
    areaname_list = list(nameIDMap.keys())
    areaid_list = list(nameIDMap.values())
    luminaire_state={} 
    for key in luminaire_mapping:
        status = getAreaStateID(str(key))
        if (status == "Area name is invalid"):
            return(
                {
                    "return_code": 400,
                    "message": "invalid area name"
                }
            )
        areaName=areaname_list[areaid_list.index(int(key))]
        area_id = status["areaId"]
        luminaire_state[areaName.replace(" ", "")]={}
        for i in range (len(status["luminairelevels"])):
            for key in luminaire_mapping[str(area_id)]:
                if luminaire_mapping[str(area_id)][key] == status["luminairelevels"][i]["name"]:
                    if status["luminairelevels"][i]["luminaireLevel"] == 0:
                        luminaire_state[areaName.replace(" ", "")][key] = "off"
    return(
        {
            "return_code": 200,
            "areaName": "all",
            "status": luminaire_state
        }
    )

@app.get('/test', response_model=None)
def test() -> None:
    global luminaire_mapping
    global nameIDMap
    return(
        {
            "return_code": 200,
            "obj1": nameIDMap,
            "obj2": luminaire_mapping
        }
    )

@app.put('/setAreaState', response_model=None)
def put_set_area_state(body: SetLuminaire) -> None:
    """
    Change state of a specific Luminaire
    """
    status = setAreaState(body.areaName, body.state)
    if (status == "Area name is invalid"):
        return(
            {
                "return_code": 400,
                "message": "invalid area name"
            }
        )
    elif (status == "successful"):
        updateFrontend()
        return(
            {
                "return_code": 200,
                "areaName": body.areaName.replace(" ", ""),
                "luminaireName": "all",
                "state": body.state
            }
        )

@app.put('/setLuminaireState', response_model=None)
def put_set_luminaire_state(body: SetLuminaire) -> None:
    """
    Change state of a specific Luminaire
    """
    status = setLuminaireState(body.areaName, body.luminaireName, body.state)
    if (status == "Area name is invalid"):
        return(
            {
                "return_code": 400,
                "message": "invalid area name"
            }
        )
    elif (status == "Luminaire name is invalid"):
        return(
            {
                "return_code": 400,
                "message": "invalid luminaire name"
            }
        )
    elif (status == "Auth failed"):
        return(
            {
                "return_code": 400,
                "message": "Auth failed. Reinitilize to generate new auth token"
            }
        )
    elif (status == "successful"):
        updateFrontend()
        return(
            {
                "return_code": 200,
                "areaName": body.areaName.replace(" ", ""),
                "luminaireName": body.luminaireName.capitalize(),
                "state": body.state
            }
        )

@app.put('/toggleLuminaireState', response_model=None)
def put_toggle_luminaire_state(body: SetLuminaire) -> None:
    """
    Change state of a specific Luminaire
    """
    status = toggleLuminaireState(body.areaName, body.luminaireName)
    if (status == "Area name is invalid"):
        return(
            {
                "return_code": 400,
                "message": "invalid area name"
            }
        )
    elif (status == "Luminaire name is invalid"):
        return(
            {
                "return_code": 400,
                "message": "invalid luminaire name"
            }
        )
    elif (status == "Auth failed"):
        return(
            {
                "return_code": 400,
                "message": "Auth failed. Reinitilize to generate new auth token"
            }
        )
    elif (status == "successful"):
        updateFrontend()
        return(
            {
                "return_code": 200,
                "areaName": body.areaName.replace(" ", ""),
                "luminaireName": body.luminaireName.capitalize(),
            }
        )

@app.post('/webhook', response_model=None)
def webhook(body: WebHook) -> None:

    publishIntent(body.CurrentState, body.InstanceId, body.NextState)