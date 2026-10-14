from concurrent.futures import ThreadPoolExecutor


def greedy(investments, budget):
    sorted_investments = sorted(
        investments,
        key=lambda x: x.expected_return / x.cost,
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


def dynamic_programming(investments, budget):
    n = len(investments)

    dp = [[0] * (budget + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        cost = investments[i - 1].cost
        value = investments[i - 1].expected_return

        for b in range(budget + 1):
            dp[i][b] = dp[i - 1][b]

            if cost <= b:
                dp[i][b] = max(
                    dp[i][b],
                    dp[i - 1][b - cost] + value
                )

    selected = []
    b = budget
    total_cost = 0

    for i in range(n, 0, -1):
        if dp[i][b] != dp[i - 1][b]:
            investment = investments[i - 1]
            selected.append(investment)
            total_cost += investment.cost
            b -= investment.cost

    selected.reverse()

    total_return = dp[n][budget]

    return selected, total_cost, total_return


def run_parallel(investments, budget):
    with ThreadPoolExecutor(max_workers=2) as executor:
        greedy_future = executor.submit(greedy, investments, budget)
        dp_future = executor.submit(
            dynamic_programming,
            investments,
            budget
        )

        return {
            "greedy": greedy_future.result(),
            "dynamic_programming": dp_future.result()
        }
