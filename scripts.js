// Global Variables
let people = getData('people') || [];
let expenseData = getData('expenses') || [];

console.log(people);
console.log(expenseData);


// Function to save data
function saveData(name, data) {
    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(name, serializedData);
        return true; // Indicates successful save
    } catch (error) {
        console.error('Error saving data:', error);
        return false; // Indicates failed save
    }
}

// Function to retrieve data
function getData(name) {
    try {
        const serializedData = localStorage.getItem(name);
        if (serializedData === null) {
            return null; // Indicates no data found
        }
        return JSON.parse(serializedData);
    } catch (error) {
        console.error('Error retrieving data:', error);
        return null; // Indicates failed retrieval
    }
}


// Function to add a new row
function addRow(rowData = null) {
    const tableBody = document.getElementById('expenseBody');
    const existingRows = tableBody.children.length;

    // Create a new row element
    const newRow = document.createElement('tr');

    // Start the row with the Expense Name and Amount Spent columns
    let expenseNameValue, amountSpentValue, spentByValue, contributions;
    if (rowData) {
        expenseNameValue = rowData.expenseName || '';
        amountSpentValue = rowData.amountSpent || '';
        spentByValue = rowData.spentBy || '';
        contributions = rowData.contributions || new Array(people.length).fill(1);
    } else {
        expenseNameValue = '';
        amountSpentValue = '';
        spentByValue = '';
        contributions = new Array(people.length).fill(1);
    }

    // if length of contributions not equal to people length, fill with 0 or truncate
    if (contributions.length < people.length) {
        contributions = contributions.concat(new Array(people.length - contributions.length).fill(0));
    } else if (contributions.length > people.length) {
        contributions = contributions.slice(0, people.length);
    }

    // console.log(people, expenseNameValue, amountSpentValue, spentByValue, contributions);

    newRow.innerHTML = `
        <td><input type="text" value="${expenseNameValue}" placeholder="Expense Name"></td>
        <td><input type="number" value="${amountSpentValue}" placeholder="Amount Spent"></td>
        <td>
            <select>
                <option value="">Select Person</option>
                ${people.map((person, index) => {
        const selected = rowData && person === spentByValue ? 'selected' : '';
        return `<option value="${person}" ${selected}>${person}</option>`;
    }).join('')}
            </select>
        </td>
    `;

    // Add a column for each person for their contribution
    // let contributions;
    // if (rowData) {
    //     contributions = rowData.contributions || [];
    // } else {
    //     contributions = new Array(people.length).fill('');
    // }

    people.forEach((person, index) => {
        const newCell = document.createElement('td');
        newCell.innerHTML = `<input type="number" value="${contributions[index]}">`;
        newRow.appendChild(newCell);
    });

    // Add a delete button at the end of the row if there are more than 5 rows
    if (existingRows >= 1) {
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        // add class="btn btn-danger"  to delete button
        deleteButton.classList.add("btn", "btn-danger", "rowdelete");
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function () {
            tableBody.removeChild(newRow);  // Removes the current row
        };
        deleteCell.appendChild(deleteButton);
        newRow.appendChild(deleteCell);
    }

    tableBody.appendChild(newRow);
}


function addPerson(personName) {
    // Add a column for this person in the header row
    const headerRow = document.querySelector('#expenseTable thead tr');
    const newHeader = document.createElement('th');
    newHeader.textContent = personName;

    // Add the new header at the end (since there's no delete button in the header)
    headerRow.appendChild(newHeader);

    const rows = document.querySelectorAll('#expenseTable tbody tr');
    rows.forEach(row => {
        const newCell = document.createElement('td');
        newCell.innerHTML = '<input type="number" value="1">';

        // Check if the row has a delete button
        const deleteButtonCell = row.querySelector('button') ? row.lastElementChild : null;

        if (deleteButtonCell) {
            // Insert the new cell before the delete button cell
            row.insertBefore(newCell, deleteButtonCell);
        } else {
            // Otherwise, just append the new cell at the end
            row.appendChild(newCell);
        }

        // Update the dropdown for "Spent By" with the new person
        const select = row.querySelector('select');
        select.innerHTML += `<option value="${personName}">${personName}</option>`;
    });
}

// Function to gather and log data
function gatherData() {
    const rows = document.querySelectorAll('#expenseBody tr');
    expenseData = [];

    rows.forEach(row => {
        const expenseName = row.querySelector('td:nth-child(1) input').value;
        const amountSpent = parseFloat(row.querySelector('td:nth-child(2) input').value);
        const spentBy = row.querySelector('td:nth-child(3) select').value;

        const contributions = [];
        row.querySelectorAll('td:nth-child(n+4) input').forEach(input => {
            contributions.push(parseFloat(input.value) || 0);
        });

        expenseData.push({
            expenseName,
            amountSpent,
            spentBy,
            contributions
        });
    });

    console.log(expenseData);

    // expenseData.forEach(element => {
    //     console.log(element.expenseName, element.contributions);
    // });

    settleExpenses(expenseData, people);

}



function settleExpenses(expenses, people) {

    const CLOSE_TO_ZERO = 0.001;

    saveData("expenses", expenses);
    saveData("people", people);

    // Data Preprocessing
    expenses.forEach(row => {
        if (row.amountSpent < 0 || row.contributions.some(x => x < 0)) {
            message = `Error: any amount or ratio must not be negative`;
            alert(message);
            throw new Error(message);
        }
        if (!people.includes(row.spentBy)) {
            message = `Error: atleast one of the 'spent by' rows have not been selected`;
            alert(message);
            throw new Error(message);
        }

        const spent = row.amountSpent;
        const spentBy = row.spentBy;

        // Calculate the total ratio
        const totalRatio = row.contributions.reduce((a, b) => a + b, 0);

        // Convert ratios to amounts
        row.contributions = row.contributions.map((ratio, i) => {
            if (people[i] === spentBy) return 0;
            return spent * (ratio / totalRatio);
        });

        // make the person who did the spending negative such that the sum of the row becomes 0
        neg = row.contributions.reduce((a, b) => a + b, 0);
        row.contributions[people.indexOf(spentBy)] = -neg;

    });

    // ratio to amounts
    let people_owed = {};
    for (let person of people) {
        people_owed[person] = expenses.reduce((acc, row) => acc + row.contributions[people.indexOf(person)], 0);
    }

    let costs = Object.assign({}, people_owed);
    if (Object.values(people_owed).reduce((a, b) => a + b, 0) > CLOSE_TO_ZERO) {
        message = `The sum of the amounts owed is not close to 0`;
        alert(message);
        throw new Error(message);
    }

    
    
    
    
    
    const payment_sumary = document.getElementById('payment_sumary');
    payment_sumary.innerHTML = '';
    // payment_sumary.style.display = 'block';
    payment_sumary.innerHTML = '<h2>Payment Summary</h2>';

    const ul = document.createElement('ul');
    for (let person in people_owed) {
        let amount = people_owed[person];
        let giveOrTake = amount < 0 ? `take ${-amount} rupees from` : `give ${amount} rupees to`;
        const li = document.createElement('li');
        li.textContent = `${person} needs to ${giveOrTake} the pool.`;
        ul.appendChild(li);
    }
    payment_sumary.appendChild(ul);

    let payments = [];
    while (true) {
        let max_negative = Object.keys(people_owed).reduce((a, b) => people_owed[a] < people_owed[b] ? a : b);
        let max_positive = Object.keys(people_owed).reduce((a, b) => people_owed[a] > people_owed[b] ? a : b);
        let min_amount = Math.min(Math.abs(people_owed[max_negative]), Math.abs(people_owed[max_positive]));

        if (min_amount < CLOSE_TO_ZERO) {
            break;
        }

        people_owed[max_negative] += min_amount;
        people_owed[max_positive] -= min_amount;
        payments.push([max_positive, max_negative, min_amount]);
    }
    const output_field = document.getElementById('payments');
    output_field.innerHTML = '';
    output_field.style.display = 'block';
    output_field.innerHTML += '<h2>Payments to be made</h2>';
    output_field.innerHTML += `<p>All the necessary payments can be made with ${payments.length} transactions.</p>`;
    const ul1 = document.createElement('ul');
    payments.forEach(payment => {
        const li1 = document.createElement('li');
        li1.textContent = `${payment[0]} sends ${payment[1]} ${payment[2]} rupees.`;
        ul1.appendChild(li1);
    });
    output_field.appendChild(ul1);


    const individual_costs = document.getElementById('individual_costs');
    individual_costs.innerHTML = '';
    individual_costs.style.display = 'block';
    expenses.forEach(element => {
        costs[element.spentBy] += element.amountSpent;
    });
    const h2 = document.createElement('h2');
    h2.textContent = 'Individual Costs';
    individual_costs.appendChild(h2);
    const ul2 = document.createElement('ul');
    for (let person in costs) {
        const li2 = document.createElement('li');
        li2.textContent = `${person} spent a total of ${costs[person]} rupees in this trip.`;
        ul2.appendChild(li2);
    }
    individual_costs.appendChild(ul2);
}



// Event Listeners
document.getElementById('addRow').addEventListener('click', addRow);
document.getElementById('addPerson').addEventListener('click', () => {
    const personName = prompt("Enter the person's name:");
    if (personName) {
        people.push(personName);
        addPerson(personName);
    }
})
document.getElementById('done').addEventListener('click', gatherData);



// populate table with data if saved
people.forEach(person => {
    addPerson(person)
});

expenseData.forEach(rowData => addRow(rowData));

