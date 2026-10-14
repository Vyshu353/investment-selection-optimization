from models.investment import Investment
from concurrency.parallel_runner import run_parallel

# Sample investment data.
# Values are fictional and only for academic demonstration.
investments = [
    Investment("Gold", 20000, 26000),
    Investment("Bitcoin", 30000, 45000),
    Investment("Apple Stock", 25000, 34000),
    Investment("Government Bonds", 15000, 18000),
    Investment("Fixed Deposit", 10000, 12000),
    Investment("Real Estate", 50000, 65000),
]

budget = 100000


def display_result(title, result):
    selected, total_cost, total_return = result

    print("\n" + title)
    print("-" * len(title))

    for investment in selected:
        print(
            f"{investment.name} | "
            f"Cost: ₹{investment.cost:,} | "
            f"Expected Return: ₹{investment.expected_return:,}"
        )

    print(f"Total Cost   : ₹{total_cost:,}")
    print(f"Total Return : ₹{total_return:,}")


print("==============================================")
print("       INVESTMENT SELECTION OPTIMIZATION")
print("==============================================")
print(f"Available Budget: ₹{budget:,}")

print("\nAvailable Investments")
print("----------------------")

for investment in investments:
    print(
        f"{investment.name:20} "
        f"Cost: ₹{investment.cost:,}  "
        f"Expected Return: ₹{investment.expected_return:,}"
    )

results = run_parallel(investments, budget)

display_result("GREEDY ALGORITHM RESULT", results["greedy"])
display_result(
    "DYNAMIC PROGRAMMING RESULT",
    results["dynamic_programming"]
)

greedy_return = results["greedy"][2]
dp_return = results["dynamic_programming"][2]

print("\n==============================================")
print("                 COMPARISON")
print("==============================================")
print(f"Greedy Return : ₹{greedy_return:,}")
print(f"DP Return     : ₹{dp_return:,}")
print(f"Difference    : ₹{dp_return - greedy_return:,}")

if dp_return > greedy_return:
    print("\nDynamic Programming gives the higher return.")
elif dp_return == greedy_return:
    print("\nBoth algorithms give the same return.")
else:
    print("\nGreedy gives the higher return.")

print("\nNote: Values are fictional and used only for the project.")
