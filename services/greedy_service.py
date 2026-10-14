def greedy_selection(investments, budget):
    sorted_investments = sorted(
        investments,
        key=lambda x: x.ratio,
        reverse=True
    )

    selected = []
    total_cost = 0
    total_return = 0

    for investment in sorted_investments:
        if total_cost + investment.cost <= budget:
            selected.append(investment)
            total_cost += investment.cost
            total_return += investment.expected_return

    return selected, total_cost, total_return
