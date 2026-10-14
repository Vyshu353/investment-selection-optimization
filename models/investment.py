class Investment:
    def __init__(self, name, cost, expected_return):
        self.name = name
        self.cost = cost
        self.expected_return = expected_return

    @property
    def ratio(self):
        return self.expected_return / self.cost if self.cost else 0