let employees = [];
let selectedEmployeeId = null;
let selectedEmployee = {};

async function fetchData() {
  const response = await fetch("data.json");
  const data = await response.json();
  employees = data;
  selectedEmployeeId = employees[0]?.id || null;
  selectedEmployee = employees[0] || {};
  renderEmployees();
  renderSingleEmployee();
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username === "admin" && password === "1234") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
    fetchData();
  } else {
    alert("Invalid credentials! Use admin / 1234");
  }
}

const employeeList = document.querySelector(".employees__names--list");
const employeeInfo = document.querySelector(".employees__single--info");
const addEmployeeModal = document.getElementById("addEmployeeModal");
const addEmployeeForm = document.getElementById("addEmployeeForm");
const dobInput = document.querySelector(".addEmployee_create--dob");

if (dobInput) {
  dobInput.max = `${new Date().getFullYear() - 18}-${new Date().toISOString().slice(5, 10)}`;
}

employeeList?.addEventListener("click", (e) => {
  if (e.target.tagName === "SPAN" && selectedEmployeeId != e.target.id) {
    selectedEmployeeId = parseInt(e.target.id);
    renderEmployees();
    renderSingleEmployee();
  }

  if (e.target.tagName === "I") {
    employees = employees.filter(emp => emp.id != e.target.parentNode.id);
    selectedEmployeeId = employees[0]?.id || null;
    selectedEmployee = employees[0] || {};
    renderEmployees();
    renderSingleEmployee();
  }
});

function showAddEmployeeForm() {
  addEmployeeModal.style.display = "flex";
}

addEmployeeModal.addEventListener("click", (e) => {
  if (e.target.className === "addEmployee") {
    addEmployeeModal.style.display = "none";
  }
});

addEmployeeForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(addEmployeeForm);
  const values = [...formData.entries()];
  let empData = {};
  values.forEach((val) => {
    empData[val[0]] = val[1];
  });
  empData.id = employees[employees.length - 1]?.id + 1 || 1;
  empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
  empData.imageUrl = empData.imageUrl || "https://via.placeholder.com/100";
  employees.push(empData);
  addEmployeeForm.reset();
  addEmployeeModal.style.display = "none";
  renderEmployees();
});

function renderEmployees() {
  employeeList.innerHTML = "";
  employees.forEach((emp) => {
    const employee = document.createElement("span");
    employee.classList.add("employees__names--item");
    if (parseInt(selectedEmployeeId) === emp.id) {
      employee.classList.add("selected");
      selectedEmployee = emp;
    }
    employee.setAttribute("id", emp.id);
    employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">&#10060;</i>`;
    employeeList.append(employee);
  });
}

function renderSingleEmployee() {
  if (selectedEmployeeId === null) {
    employeeInfo.innerHTML = "";
    return;
  }

  employeeInfo.innerHTML = `
    <img src="${selectedEmployee.imageUrl}" class="employee-image"/>
    <h4>${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})</h4>
    <p>${selectedEmployee.address}</p>
    <p>${selectedEmployee.email}</p>
    <p>Mobile - ${selectedEmployee.contactNumber}</p>
    <p>DOB - ${selectedEmployee.dob}</p>
  `;
}
