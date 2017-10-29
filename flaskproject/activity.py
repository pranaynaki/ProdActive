from datetime import datetime, timedelta
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
        # self.dedupLog = []
        self.last_domain = None
        self.last_time = None
        # self.raw_durations = []
        self.durations = {}
    
    def add(self, name, duration = None):
        self.rawLog.append(Activity(name))
        # for activity in self.dedupLog:
        #     if activity.name == name:
        #         if activity.duration != None:
        #             activity.duration += duration
        #         return
        # self.dedupLog.append(Activity(name, duration))
        #self.raw_durations.append({"name": name, "duration": duration})
        if self.last_domain is None:
            self.last_domain = name
            self.last_time = datetime.now()
            self.durations[name] = timedelta() #defaults to 0
        else:
            if name not in self.durations:
                self.durations[name] = timedelta() #defaults to 0
            current_time = datetime.now()
            self.durations[self.last_domain] += current_time - self.last_time
            self.last_domain = name
            self.last_time = current_time

        
        

    def getRawLog(self):
        return [a.to_dict() for a in self.rawLog]

    def getDedDupLog(self):
        # return [a.to_dict() for a in self.dedupLog]
        return [{"name": name, "duration": self.durations[name].seconds} for name in self.durations.keys()]
        # for ind, name, duration in enumerate(self.durations):


