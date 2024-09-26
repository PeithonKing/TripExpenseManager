# Trip Expense Manager

**UPDATE:** Besides the python script, I have now added a web app for the same purpose. You can directly access it [here](https://peithonking.github.io/TripExpenseManager/) without any setup.

Managing trip expenses can be a daunting task, especially when multiple people are involved. Keeping track of who spent what and how much each person owes or is owed can lead to confusion and disputes. The Trip Expense Manager is designed to simplify this process by providing an easy-to-use solution for calculating and minimizing settlement payments.

Given a properly formatted CSV file containing expense details, the Trip Expense Manager script calculates the total amount each person owes or is owed. It then applies a settlement payment minimization algorithm to reduce the number of payments required to settle all expenses. This results in a convenient and efficient way to manage trip expenses, eliminating the need for multiple transactions and ensuring that everyone gets paid back what they are owed.

With the Trip Expense Manager, you can easily:

* Track expenses incurred during a trip
* Calculate the total amount each person owes or is owed
* Minimize settlement payments, reducing the number of transactions required

By using this script, you can simplify trip expense management, save time, and avoid potential disputes.

## How to Use

To use the Trip Expense Manager, first you need to create a CSV file containing the expense details.

### Formatting the CSV file

You first have to put a properly formatted CSV file in the root directory of the repo and name it `expenses.csv`. Here is an example of the format for the CSV file, the same table is provided in a file named [`example_expenses.csv`](./example_expenses.csv) in the repository:

| expense name | spent | spent by | Alice | Bob | Charlie | David | Eve |
|---:| ---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Trip to Park | 50 | Bob | 1 | 1 | 1 | 1 | 0 |
| Lunch at Cafe | 75 | Alice | 0.5 | 0.5 | 1 | 1 | 0 |
| Movie Night | 120 | Charlie | 1 | 1 | 1 | 1 | 0 |
| Dinner at Home | 200 | David | 10 | 10 | 50 | 60 | 70 |
| Snacks at Work | 30 | Eve | 2 | 1 | 2 | 1 | 2 |

* The first 3 columns in the CSV file are mandatory and should be named as `expense name`, `spent`, and `spent by`.
* The `expense name` column contains the name of the expense, the `spent` column contains the total amount spent on that expense, and the `spent by` column contains the name of the person who paid for the expense.
* The remaining columns contain the names of the people involved in the trip. **The names in the `spent by` column should match one of these names.**
* The values below the names in the column represent the proportion of the expense that each person should pay. For example, in the `Trip to Park` expense row, Bob spent 50, and all the people were involved except Eve didn't join. So the 50 ruppes spent by Bob is to be shared by Alice, Bob, Charlie and David equally and each should pay 50/4 = 12.5 each. On the other hand, in the `Dinner at Home` expense row, we decided to directly put exactly how much each person should pay instead of the ratios. This is also allowed. In the expense `Lunch at Cafe`, Eve didn't join, Charlie and David had full lunch, Alice and Bob shared a lunch. So the ratio is 0.5 for Alice and Bob, 1 for Charlie and David and 0 for Eve.

### Running the script

1. After cloning the repository, navigate to the root directory of the repo.
2. Make sure you have Python and pandas library installed on your system. Using virtual environment is recommended.
3. Make sure you have the `expenses.csv` file in the root directory with the proper format as described above.
4. Run the script using the following command:

    ```bash
    python main.py
    ```

5. The script will read the `expenses.csv` file, calculate the total amount each person owes or is owed, and apply the settlement payment minimization algorithm.


## Algorithm used for minimizing settlement payments


The Trip Expense Manager uses a simple and greedy yet effective algorithm to minimize the number of settlement payments. The algorithm works as follows:

1. First, it calculates the total amount each person owes or is owed, resulting in a dictionary with positive values representing debts and negative values representing lendings.
2. Then, it enters a loop that continues until all values in the dictionary reach zero.
3. In each iteration, the algorithm identifies the individuals with the largest debt and the largest lending.
4. It then settles the payment between these two individuals, subtracting the lending amount from the debt amount.
5. This process is repeated until all debts and lendings are fully settled, resulting in a minimal number of transactions required to settle all expenses.

By using this algorithm, the Trip Expense Manager ensures that the settlement payments are minimized, simplifying the process and reducing the number of transactions needed to settle all expenses.
