def dynamic_programming_selection(investments, budget):
    n = len(investments)

    dp = [[0] * (budget + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        investment = investments[i - 1]

        for b in range(budget + 1):
            dp[i][b] = dp[i - 1][b]

            if investment.cost <= b:
                dp[i][b] = max(
                    dp[i][b],
                    investment.expected_return
                    + dp[i - 1][b - investment.cost]
                )

    selected = []
    b = budget

    for i in range(n, 0, -1):
        if dp[i][b] != dp[i - 1][b]:
            investment = investments[i - 1]
            selected.append(investment)
            b -= investment.cost

    selected.reverse()

    total_cost = sum(x.cost for x in selected)
    total_return = sum(x.expected_return for x in selected)

    return selected, total_cost, total_return
