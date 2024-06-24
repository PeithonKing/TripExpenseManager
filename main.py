from pprint import pprint
import pandas as pd

close_to_zero = 0.1

# expenses = pd.read_csv('expenses.csv')
expenses = pd.read_csv('example_expenses.csv')

# Data Preprocessing
for index, row in expenses.iterrows():
    if row['spent'] < 0 or any(x < 0 for x in row.iloc[3:]):
        raise ValueError(f"Error in row {index+1}: all amounts must be positive")
    if row['spent by'] not in row.index[2:]:
        raise ValueError(f"Error in row {index+1} ({row['expense name']}): 'spent by' does not match any column name")


for index, row in expenses.iterrows():
    spent = row['spent']
    spent_by = row['spent by']
    
    # Calculate the total ratio
    total_ratio = sum(row.iloc[3:])
    
    # Convert ratios to amounts
    for col in row.index[3:]:
        if col == spent_by: expenses.loc[index, col] = 0
        else: expenses.loc[index, col] = spent * (row[col] / total_ratio)
        
    # make the person who did the spending negative such that the sum of the row becomes 0
    expenses.loc[index, spent_by] = -sum(expenses.loc[index, row.index[3:]])


people_owed = {}
for col in expenses.columns[3:]:
    people_owed[col] = expenses[col].sum()

print("\n\n## Ratio Converted to Amount")

print(expenses)

assert sum(people_owed.values()) < close_to_zero, "The sum of the amounts owed is not close to 0"


# pprint(people_owed)

print("\n## Payment Summary")
for person, amount in people_owed.items():
    giveortake = f"take {-amount:.2f} rupees from" if amount < 0 else f"give {amount:.2f} rupees to"
    print(f"{person.title()} needs to {giveortake} the pool.")

payments = []

while True:
    # Find the largest negative number and the largest positive number
    max_negative = min(people_owed, key=people_owed.get)
    max_positive = max(people_owed, key=people_owed.get)

    # Calculate the minimum absolute value
    min_amount = min(abs(people_owed[max_negative]), abs(people_owed[max_positive]))

    # Break when the minimum amount goes below 0.1
    if min_amount < close_to_zero:
        break

    # Update the amounts and add the payment to the list
    people_owed[max_negative] += min_amount
    people_owed[max_positive] -= min_amount
    payments.append([max_positive, max_negative, min_amount])

# pprint(payments)

print("\n## Payments to be made")

print(f"All the necessary payments can be made with {len(payments)} transactions.")

for sender, reciever, amount in payments:
    print(f"- {sender.title()} sends {reciever.title()} {amount:.2f} rupees.")
