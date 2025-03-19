document.addEventListener("DOMContentLoaded", function () {
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    let editingIndex = -1;
    let sortAscending = true; // true = Sort A-Z, false = Sort Z-A

    // Save employees list to localStorage
    function saveEmployees() {
        localStorage.setItem("employees", JSON.stringify(employees));
    }

    // Format a date string to DD-MM-YYYY
    function formatDate(dateInput) {
        let date = new Date(dateInput);
        let day = String(date.getDate()).padStart(2, "0");
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    // Render Employee Table with Updated EmpID
    function renderTable() {
        let tableBody = document.getElementById("employeeTableBody");
        tableBody.innerHTML = "";

        employees.forEach((employee, index) => {
            let empId = String(index + 1).padStart(2, "0"); // Convert ID to 2-digit format (01, 02, 03...)
            let row = `
                <tr>
                    <td>${empId}</td>
                    <td>${employee.name}</td>
                    <td>${employee.position}</td>
                    <td>${formatDate(employee.hireDate)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm btn-action" data-index="${index}">Delete</button>
                        <button class="btn btn-success btn-sm btn-action" data-index="${index}">Edit</button>
                    </td>
                    <td>${formatDate(employee.historyDate)}</td>
                </tr>`;
            tableBody.innerHTML += row;
        });

        saveEmployees();
    }

    // Add or Update Employee
    function addOrUpdateEmployee() {
        let name = document.getElementById("name").value.trim();
        let position = document.getElementById("position").value.trim();
        let hireDate = document.getElementById("hireDate").value;

        if (!name || !position || !hireDate) {
            alert("⚠️ Please fill out all fields!");
            return;
        }

        if (employees.some((emp, i) => emp.name === name && i !== editingIndex)) {
            alert("⚠️ Employee with this name already exists!");
            return;
        }

        let currentDate = new Date();

        if (editingIndex === -1) {
            employees.push({
                name: name,
                position: position,
                hireDate: hireDate,
                historyDate: currentDate
            });
            alert("✅ Employee added successfully!");
        } else {
            employees[editingIndex].name = name;
            employees[editingIndex].position = position;
            employees[editingIndex].hireDate = hireDate;
            alert("✅ Employee updated successfully!");
            editingIndex = -1;
            document.getElementById("addEmployeeBtn").innerText = "Add Employee";
        }
        saveEmployees();
        renderTable();
        clearForm();
    }

    // Delete Employee
    function deleteEmployee(index) {
        if (confirm("❌ Are you sure you want to delete this employee?")) {
            employees.splice(index, 1);
            saveEmployees();
            renderTable();
        }
    }

    // Edit Employee
    function editEmployee(index) {
        let employee = employees[index];
        document.getElementById("name").value = employee.name;
        document.getElementById("position").value = employee.position;
        document.getElementById("hireDate").value = employee.hireDate;
        editingIndex = index;
        document.getElementById("addEmployeeBtn").innerText = "Update Employee";
    }

    // Clear Form
    function clearForm() {
        document.getElementById("name").value = "";
        document.getElementById("position").value = "";
        document.getElementById("hireDate").value = "";
        editingIndex = -1;
        document.getElementById("addEmployeeBtn").innerText = "Add Employee";
    }

    // Reset Employees
    function resetEmployees() {
        if (confirm("⚠️ This will delete all employees. Are you sure?")) {
            employees = [];
            saveEmployees();
            renderTable();
        }
    }

    // Sort Employees by Name (A-Z or Z-A) & Update EmpID Correctly
    function sortEmployees() {
        employees.sort((a, b) => {
            if (sortAscending) {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

        // Toggle Sorting Order & Update Button Text
        sortAscending = !sortAscending;
        document.getElementById("sortButton").innerText = sortAscending ? "Sort A-Z" : "Sort Z-A";

        renderTable(); // Ensure Employee IDs are updated correctly after sorting
    }

    // Toggle Table Visibility
    function toggleTable() {
        let tableContainer = document.getElementById("tableContainer");
        let toggleBtn = document.getElementById("toggleTableBtn");

        if (tableContainer.style.display === "none") {
            tableContainer.style.display = "block";
            toggleBtn.innerText = "Hide Table";
        } else {
            tableContainer.style.display = "none";
            toggleBtn.innerText = "Show Table";
        }
    }

    // Attach Event Listeners
    document.getElementById("addEmployeeBtn").addEventListener("click", addOrUpdateEmployee);
    document.getElementById("resetBtn").addEventListener("click", resetEmployees);
    document.getElementById("sortButton").addEventListener("click", sortEmployees);
    document.getElementById("toggleTableBtn").addEventListener("click", toggleTable);

    // Handle Delete & Edit Button Clicks
    document.getElementById("employeeTableBody").addEventListener("click", function (event) {
        let target = event.target;
        if (target.matches("button.btn-danger")) {
            let index = target.getAttribute("data-index");
            deleteEmployee(Number(index));
        } else if (target.matches("button.btn-success")) {
            let index = target.getAttribute("data-index");
            editEmployee(Number(index));
        }
    });

    renderTable(); // Initial Table Load
});
