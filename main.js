// Generate current date
const currentDateElement = document.getElementById("current-date");
const currentDate = new Date().toLocaleDateString();
currentDateElement.textContent = currentDate;

function calculatePrice(row) {
    const rate = parseFloat(row.querySelector(".rate").value);
    const weight = parseFloat(row.querySelector(".weight").value);
    const itemType = row.querySelector(".item-type-select").value;

    let makingChargePercentage;
    if (itemType === "gold") {
        makingChargePercentage = 0.15;
    } else if (itemType === "silver") {
        makingChargePercentage = 0.05;
    }

    const makingCharge = weight * rate * makingChargePercentage;
    const price = weight * rate + makingCharge;
    const cgst = price * 0;
    const sgst = cgst;
    const netPrice = price + sgst + cgst;

    row.querySelector(".making-charge").value = makingCharge.toFixed(2);
    row.querySelector(".net-price").value = netPrice.toFixed(2);

    // Calculate and display the total net sale, CGST, and SGST
    const rows = document.querySelectorAll("tbody#table-body tr");
    let totalNetSale = 0;
    let totalCGST = 0;
    let totalSGST = 0;

    rows.forEach((row) => {
        const rowNetPrice = parseFloat(row.querySelector(".net-price").value);
        totalNetSale += rowNetPrice;
    });

    totalCGST = totalNetSale * 0.015;
    totalSGST = totalCGST;
    const totalNetSaleElement = document.getElementById("total-net-sale");
    totalNetSaleElement.textContent = totalNetSale.toFixed(2);

    const totalCGSTElement = document.getElementById("total-cgst");
    totalCGSTElement.textContent = totalCGST.toFixed(2);

    const totalSGSTElement = document.getElementById("total-sgst");
    totalSGSTElement.textContent = totalSGST.toFixed(2);
}

function addRow() {
    const tableBody = document.getElementById("table-body");
    const lastRow = tableBody.lastElementChild;

    const newRow = lastRow.cloneNode(true);
    const serialNumber = parseInt(lastRow.querySelector("td").textContent) + 1;

    newRow.querySelector("td").textContent = serialNumber;
    newRow.querySelectorAll("input").forEach((input) => {
        input.value = "";
        input.readOnly = false;
    });

    const deleteButton = newRow.querySelector(".delete-row-button");
    deleteButton.addEventListener("click", function () {
        deleteRow(this);
    });

    tableBody.appendChild(newRow);
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    const tableBody = document.getElementById("table-body");
    tableBody.removeChild(row);
    calculatePrice(row); // Recalculate total when a row is deleted
}

function printTable() {
    const actionButtons = document.querySelector(".action-buttons");
    const printButton = document.querySelector(".print");
    actionButtons.style.display = "none";

    printButton.style.visibility = "hidden"; // Hide the button without affecting the layout

    const deleteButtons = document.querySelectorAll(".delete-row-button");
    deleteButtons.forEach((button) => {
        button.textContent = "Approved";
        button.style.backgroundColor = "green";
    });

    setTimeout(function () {
        actionButtons.style.display = "block";
        printButton.style.visibility = "visible"; // Restore button visibility

        deleteButtons.forEach((button) => {
            button.textContent = "Delete";
            button.style.backgroundColor = "red";
        });
    }, 3000);

    window.print();
}



function updateMakingCharge(selectElement) {
    const row = selectElement.closest("tr");
    calculatePrice(row);
}

document.addEventListener("input", function (event) {
    if (event.target.classList.contains("rate") || event.target.classList.contains("weight")) {
        const row = event.target.closest("tr");
        calculatePrice(row);
    }
});