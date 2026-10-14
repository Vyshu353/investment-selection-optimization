# Performance Results

## Dataset

| Investment | Cost | Expected Return |
|---|---:|---:|
| Gold | ₹20,000 | ₹26,000 |
| Bitcoin | ₹30,000 | ₹45,000 |
| Apple Stock | ₹25,000 | ₹34,000 |
| Government Bonds | ₹15,000 | ₹18,000 |
| Fixed Deposit | ₹10,000 | ₹12,000 |
| Real Estate | ₹50,000 | ₹65,000 |

Budget: ₹100,000

The values are fictional and are only for academic demonstration.

Run:

```bash
python performance_test.py
```

The program measures total cost, total return, and average execution time.


## Verified Benchmark

| Algorithm | Total Cost | Total Return | Average Time |
|---|---:|---:|---:|
| Greedy | 100 | 135 | 0.001267 ms |
| Dynamic Programming | 100 | 136 | 0.063937 ms |

Return Difference (DP - Greedy): **1**
