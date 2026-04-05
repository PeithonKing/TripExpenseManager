# Trip Expense Manager (Python Version)

This folder contains the Python implementation for CSV-based expense settlement.

## Files

- `main.py`: Python script that calculates balances and minimizes settlement payments
- `example_expenses.csv`: Sample expense input file

## How to Use

### 1. Prepare the CSV file

Create a properly formatted CSV file and place it in this directory.

By default, the script currently reads `example_expenses.csv`. You can update `main.py` to read your own file (for example, `expenses.csv`) if needed.

Example CSV format (also provided in `example_expenses.csv`):

| expense name | spent | spent by | Alice | Bob | Charlie | David | Eve |
|---:| ---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Trip to Park | 50 | Bob | 1 | 1 | 1 | 1 | 0 |
| Lunch at Cafe | 75 | Alice | 0.5 | 0.5 | 1 | 1 | 0 |
| Movie Night | 120 | Charlie | 1 | 1 | 1 | 1 | 0 |
| Dinner at Home | 200 | David | 10 | 10 | 50 | 60 | 70 |
| Snacks at Work | 30 | Eve | 2 | 1 | 2 | 1 | 2 |

Rules:

- First 3 columns are mandatory: `expense name`, `spent`, `spent by`
- `spent by` must match one of the participant columns
- Participant columns can contain ratios (e.g., `1`, `2`, `0.5`) or direct amounts

### 2. Install dependencies

```bash
pip install pandas
```

### 3. Run

From this directory:

```bash
python main.py
```

## Settlement Algorithm

The script uses a greedy minimization approach:

1. Compute net amount owed for each person
2. Repeatedly match the largest debtor with the largest creditor
3. Settle the minimum possible amount between them
4. Continue until balances are near zero

This reduces the number of transactions needed to settle all dues.
