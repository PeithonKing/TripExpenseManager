# Trip Expense Manager

Trip Expense Manager is an open-source tool to split group trip expenses and generate a minimized set of settlement payments.

You can use the web app directly in the browser (no backend), or use the Python implementation in [`python_version/`](./python_version/).

## Live Demo

- [https://peithonking.github.io/TripExpenseManager/](https://peithonking.github.io/TripExpenseManager/)

## Features

- Add trip participants dynamically
- Add unlimited expense rows
- Set per-person shares using either:
  - Ratio-style weights (for proportional splits)
  - Direct amounts (as long as totals are consistent)
- Choose the payer (`spent by`) per expense
- Compute:
  - Payment summary per person
  - Minimized settlement transaction list
  - Individual total spent view
- Auto-save entered data in browser `localStorage`
- Reset saved data with one click

## How It Works

For each expense row:

1. Read the total expense amount and participant share values.
2. Normalize share values against their row total.
3. Convert shares into payable amounts.
4. Build net balances for all participants.
5. Use a greedy settlement strategy by repeatedly matching the largest debtor and largest creditor until balances are near zero.

This gives a small and practical set of transactions to settle the trip.

## Python Version

The CSV-based Python implementation is in [`python_version/`](./python_version/).

- Python docs: [`python_version/README.md`](./python_version/README.md)

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create a feature branch
3. Make changes with clear commits
4. Open a pull request with context and test notes

## License

This project is licensed under the MIT License. See [`LICENSE`](./LICENSE).
