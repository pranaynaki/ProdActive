import json

class Activity():
    def __init__(self, name, duration = None ):
        self.name = name
        self.duration = duration

    def length(self):
        return self.duration

    def to_dict(self):
        return {"name": self.name, "duration": self.duration}

class ActivityManager():

    def __init__(self):
        self.rawLog = []
        self.dedupLog = []
    
    def add(self, name, duration = None):
        self.rawLog.append(Activity(name))
        for activity in self.dedupLog:
            if activity.name == name:
                if activity.duration != None:
                    activity.duration += duration
                return
        self.dedupLog.append(Activity(name, duration))

    def getRawLog(self):
        return [a.to_dict() for a in self.rawLog]

    def getDedDupLog(self):
        return [a.to_dict() for a in self.dedupLog]
        

