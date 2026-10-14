import unittest

from models.investment import Investment
from services.greedy_service import greedy_selection
from services.dp_service import dynamic_programming_selection
from services.comparison_service import compare_algorithms
from concurrency.parallel_runner import run_parallel


class TestInvestmentAlgorithms(unittest.TestCase):

    def setUp(self):
        self.investments = [
            Investment("Gold", 20, 26),
            Investment("Bitcoin", 30, 45),
            Investment("Apple Stock", 25, 34),
            Investment("Government Bonds", 15, 18),
            Investment("Fixed Deposit", 10, 12),
            Investment("Real Estate", 50, 65),
        ]
        self.budget = 100

    def test_greedy_valid(self):
        selected, cost, result = greedy_selection(
            self.investments, self.budget
        )
        self.assertLessEqual(cost, self.budget)
        self.assertEqual(
            result,
            sum(x.expected_return for x in selected)
        )

    def test_dynamic_programming_valid(self):
        selected, cost, result = dynamic_programming_selection(
            self.investments, self.budget
        )
        self.assertLessEqual(cost, self.budget)
        self.assertEqual(
            result,
            sum(x.expected_return for x in selected)
        )

    def test_dp_at_least_greedy(self):
        greedy = greedy_selection(self.investments, self.budget)
        dp = dynamic_programming_selection(self.investments, self.budget)
        self.assertGreaterEqual(dp[2], greedy[2])

    def test_comparison(self):
        result = compare_algorithms(self.investments, self.budget)
        self.assertIn("greedy", result)
        self.assertIn("dynamic_programming", result)

    def test_concurrency(self):
        result = run_parallel(self.investments, self.budget)
        self.assertEqual(
            result["greedy"][2],
            greedy_selection(self.investments, self.budget)[2]
        )
        self.assertEqual(
            result["dynamic_programming"][2],
            dynamic_programming_selection(
                self.investments, self.budget
            )[2]
        )


if __name__ == "__main__":
    unittest.main()
