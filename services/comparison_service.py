from services.greedy_service import greedy_selection
from services.dp_service import dynamic_programming_selection


def compare_algorithms(investments, budget):
    return {
        "greedy": greedy_selection(investments, budget),
        "dynamic_programming": dynamic_programming_selection(
            investments, budget
        )
    }
