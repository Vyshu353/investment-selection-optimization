# Algorithm Analysis

## Greedy Algorithm

The Greedy algorithm calculates the return-to-cost ratio for each investment,
sorts investments by this ratio, and selects the best ratio first.

**Time Complexity:** O(n log n)

**Space Complexity:** O(n)

**Advantage:** Fast and simple.

**Disadvantage:** Does not always guarantee the optimal 0/1 solution.

## Dynamic Programming

Dynamic Programming treats investment selection as a 0/1 Knapsack problem.
For every investment, it considers selecting or not selecting the investment.

**Time Complexity:** O(n x B)

**Space Complexity:** O(n x B)

where n is the number of investments and B is the budget.

**Advantage:** Guarantees the optimal 0/1 solution.

**Disadvantage:** Requires more time and memory.

## Comparison

| Feature | Greedy | Dynamic Programming |
|---|---|---|
| Strategy | Highest return/cost ratio | Best combination |
| Time | O(n log n) | O(n x B) |
| Space | O(n) | O(n x B) |
| Optimal | Not guaranteed | Yes |
| Speed | Faster | Slower |
