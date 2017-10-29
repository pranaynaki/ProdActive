from flask import Flask, jsonify, render_template, request
import descriptions
import json
from mode import Mode
from task import Task, TaskBlock, TaskManager
from activity import Activity, ActivityManager
from flask_cors import CORS
 
app = Flask(__name__)
task_manager = TaskManager()
activity_manager = ActivityManager()
mode = Mode()
CORS(app)

@app.route('/selectMode', methods=['POST'])
def modeselect():
    mode.select_mode(request.json['mode'])
    return 'Mode select successful'

@app.route('/')
def hello_world():
    desc = descriptions.button_descriptions
    return render_template('index.html', description=desc[mode.get_selected()], button1text=desc["button1"], button2text=desc["button2"], button3text=desc["button3"], startingbutton=mode.get_selected())

@app.route('/add-task', methods=['POST'])
def add_task():
    task_manager.add_task(request.json['name'], int(request.json['duration']))
    return 'Add successful'

@app.route('/initialize')
def init_manager():
    task_manager = TaskManager()
    task_manager.add_task('sample', 60)
    return jsonify(task_manager.get_schedule())

@app.route('/schedule')
def schedule():
    return jsonify(task_manager.get_schedule())

@app.route('/website-change', methods=['POST'])
def add_website():
    if request.json['domain']:
        activity_manager.add(request.json['domain'])
    return request.json['domain']

@app.route('/log/<kind>')
def get_log(kind):
    if kind == "raw":
        return jsonify(activity_manager.getRawLog())
    else:
        return jsonify(activity_manager.getDedDupLog())

if __name__ == "__main__":
    app.run()
