from datetime import datetime, timedelta
import json

class TaskManager:
    def __init__(self):
        self.tasks = []
        self.next_break = None
        self.break_duration = timedelta(minutes=5)
        self.break_gap = timedelta(minutes=60)

    def add_task(self, name, duration, deadline=None):
        current_time = datetime.now()
        current_time = current_time.replace(second=0, microsecond=0)
        current_time += timedelta(minutes=1)
        start_time = self.next_available_time(current_time)
        if self.next_break is None:
            self.next_break = start_time + timedelta(minutes=self.break_gap)
        self.next_break = self.tasks.append(Task(name, timedelta(minutes=duration), start_time, self.next_break, self.break_duration, self.break_gap))

    def next_available_time(self, current_time):
        if not self.tasks:
            return current_time
        last_end = self.tasks[-1].end
        return current_time if last_end < current_time else last_end
   
    def get_schedule(self):
        return [t.to_dict() for t in self.tasks]

class TaskBlock:
    def __init__(self, start, end, is_break=False):
        self.start = start
        self.end = end
        self.is_break = is_break

    def to_dict(self):
        return {"start" : self.start, "end" : self.end, "break" : self.is_break}

class Task:
    def __init__(self, name, duration, start, next_break, break_duration, break_gap):
        self.blocks = []
        self.name = name
        self.duration = duration
        if duration < next_break - start:
            self.blocks.append(TaskBlock(start, start + duration))
        else:
            self.blocks.append(TaskBlock(start, next_break))
            self.blocks.append(TaskBlock(next_break, break_duration))
            duration -= (next_break - start)
            start = next_break + break_duration
            next_break = start + break_gap
        
        while duration >= break_gap:     
            self.blocks.append(TaskBlock(start, next_break))
            self.blocks.append(TaskBlock(next_break, break_duration))
            duration -= (next_break - start)
            start = next_break + break_duration
            next_break = start + break_gap
        
        self.blocks.append(TaskBlock(start, start + duration))
        self.end = self.blocks[-1].end
        return next_break

    def add_block(self, start, end):
        self.blocks.append(TaskBlock(start, end))

    def to_dict(self):
        blocks_dict = [b.to_dict() for b in self.blocks]
        return {"name" : self.name, "blocks" : blocks_dict}
