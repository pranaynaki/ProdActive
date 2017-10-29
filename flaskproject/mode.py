class Mode:
    def __init__(self):
        self.max_page_time = 20
        self.select_mode("button2")
        self.selected = "button2"
    
    def get_selected(self):
        return self.selected    

    def select_mode(self, button):
        self.selected = button
        if button == "button1":
            self.max_page_time = 20
            self.break_time = 15
            self.block_sites = False
            self.warn_sites = False
            self.break_interval = 60
        elif button == "button2":
            self.max_page_time = 20
            self.break_time = 5
            self.block_sites = False
            self.warn_sites = True
            self.break_interval = 60
        else:
            self.max_page_time = 10
            self.break_time = 1
            self.block_sites = True
            self.warn_sites = False
            self.break_interval = 60

