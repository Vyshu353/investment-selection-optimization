import time

from models.investment import Investment
from services.greedy_service import greedy_selection
from services.dp_service import dynamic_programming_selection


investments = [
    Investment("Gold", 20, 26),
    Investment("Bitcoin", 30, 45),
    Investment("Apple Stock", 25, 34),
    Investment("Government Bonds", 15, 18),
    Investment("Fixed Deposit", 10, 12),
    Investment("Real Estate", 50, 65),
]

budget = 100
runs = 100


def benchmark(function):
    start = time.perf_counter()

    for _ in range(runs):
        result = function(investments, budget)

    elapsed = time.perf_counter() - start
    return result, (elapsed / runs) * 1000


greedy_result, greedy_time = benchmark(greedy_selection)
dp_result, dp_time = benchmark(dynamic_programming_selection)

print("==========================================")
print("         INVESTMENT PERFORMANCE")
print("==========================================")
print("Budget used for benchmark: 100")
print("Benchmark runs:", runs)

print("\nGreedy Algorithm")
print("----------------")
print("Total Cost:", greedy_result[1])
print("Total Return:", greedy_result[2])
print(f"Average Time: {greedy_time:.6f} ms")

print("\nDynamic Programming")
print("-------------------")
print("Total Cost:", dp_result[1])
print("Total Return:", dp_result[2])
print(f"Average Time: {dp_time:.6f} ms")

print("\nComparison")
print("----------")
print("Return Difference:", dp_result[2] - greedy_result[2])

if greedy_time < dp_time:
    print("Greedy is faster.")
else:
    print("Dynamic Programming is faster.")

if dp_result[2] > greedy_result[2]:
    print("Dynamic Programming gives the higher return.")
elif dp_result[2] == greedy_result[2]:
    print("Both algorithms give the same return.")
else:
    print("Greedy gives the higher return.")
