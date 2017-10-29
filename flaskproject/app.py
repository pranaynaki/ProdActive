from flask import Flask, jsonify, render_template, request, send_from_directory
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


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/selectMode', methods=['POST'])
def modeselect():
    mode.select_mode(request.json['mode'])
    return 'Mode select successful'

@app.route('/settings')
def settings():
    desc = descriptions.button_descriptions
    return render_template('settings.html', description=desc[mode.get_selected()], button1text=desc["button1"], button2text=desc["button2"], button3text=desc["button3"], startingbutton=mode.get_selected())

@app.route('/visualization')
def visualization():
    return render_template('visualization.html')

@app.route('/')
def tasks():
    tname = task_manager.current_task_name()
    tcolor = "green" if tname == "BREAK" else "red"
    return render_template('tasks.html', task_name=tname, task_color=tcolor, next_task=task_manager.get_next_task_string())

@app.route('/current-status')
def current_status():
    return task_manager.current_task_name()

@app.route('/next-task')
def next_task():
    return task_manager.get_next_task_string()

@app.route('/extension-details')
def extension_details():
    tname = task_manager.current_task_name()
    tcolor = "green" if tname == "BREAK" else "red"
    return jsonify({"name" : tname, "color" : tcolor})

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

def sitemode():
    if mode.block_sites:
        return 'block'
    if mode.warn_sites:
        return 'warn'
    return 'none'

@app.route('/blacklist')
def blacklist():
    blacklisted = ['facebook.com', 'twitter.com', 'youtube.com']
    current_break = task_manager.current_task_name() == "BREAK"
    if current_break:
        return jsonify({"domains" : blacklisted, "mode" : "none", "page_time" : 0})
    return jsonify({"domains" : blacklisted, "mode" : sitemode(), "page_time" : mode.max_page_time})

@app.route('/d3data')
def d3data():
    return jsonify(activity_manager.getD3Data())

if __name__ == "__main__":
    app.run()
