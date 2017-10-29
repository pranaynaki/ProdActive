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
            self.next_break = start_time + self.break_gap
        added_task = Task(name, timedelta(minutes=duration))
        self.next_break = added_task.set_up_blocks(start_time, self.next_break, self.break_duration, self.break_gap)
        self.tasks.append(added_task)

    def current_task_name(self):
        current_time = datetime.now()
        for t in self.tasks:
            if t.start <= current_time and t.end >= current_time:
                return t.current_name(current_time)
        return "BREAK"
    
    def get_next_task_string(self):
        current_time = datetime.now()
        blocks = []
        for t in self.tasks:
            for b in t.blocks:
                if b.start > current_time:
                    task_name = 'Task "' + t.name + '"'
                    if b.is_break:
                        task_name = 'BREAK'
                    minutes = (b.start-current_time).seconds // 60 + 1
                    minute_string = " minute" if minutes == 1 else " minutes"
                    return task_name + ' begins in ' + str(minutes) + minute_string
        return "no tasks left :)"

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
    def __init__(self, name, duration):
        self.blocks = []
        self.name = name
        self.duration = duration

    def current_name(self, current_time):
        for b in self.blocks:
            if b.end >= current_time:
                return "BREAK" if b.is_break else self.name
        return self.name

    def set_up_blocks(self, start, next_break, break_duration, break_gap):
        duration = self.duration
        '''
        if duration < next_break - start:
            self.blocks.append(TaskBlock(start, start + duration))
            duration = 0
        else:
            self.blocks.append(TaskBlock(start, next_break))
            self.blocks.append(TaskBlock(next_break, break_duration))
            duration -= (next_break - start)
            start = next_break + break_duration
            next_break = start + break_gap
        '''
        while duration >= break_gap:     
            self.blocks.append(TaskBlock(start, next_break))
            self.blocks.append(TaskBlock(next_break, next_break + break_duration, True))
            duration -= (next_break - start)
            start = next_break + break_duration
            next_break = start + break_gap
        
        self.blocks.append(TaskBlock(start, start + duration))
        self.end = self.blocks[-1].end
        self.start = self.blocks[0].start
        return next_break

    def add_block(self, start, end):
        self.blocks.append(TaskBlock(start, end))

    def to_dict(self):
        blocks_dict = [b.to_dict() for b in self.blocks]
        return {"name" : self.name, "blocks" : blocks_dict}
