const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");
const { throwError } = require("rxjs");
let connection = mysql.createConnection({
    host: "localhost", 
    database: "workplace",
    password: "",
    user: "root",
})

connection.connect()


const employerPrompt = [

    {
        type: "list",
        name: "start",
        message: "What would you like to do?",
        choices: ["View All Employees",
                  "View All Employees By Department",
                  "View All Employees By Manager",
                  "Add Employee",
                  "Remove Employee",
                 ]
    }

]

const addEmployee = [

    {
        type: "input",
        name: "employeeFirst",
        message: "What is this employee's first name?",
        validate: async (input) => {
            if (input == ""){
                return "Please enter a first name"
            }
            return true;
        }
    },

    {
        type: "input",
        name: "employeeLast",
        message: "What is this employee's last name?",
        validate: async (input) => {
            if (input == ""){
                return "Please enter a last name"
            }
            return true;
        }
    },

    {
        type: "input",
        name: "employeeID",
        message: "What is this employee's ID?",
        validate: async (input) => {
            if (isNaN(input)){
                return "Please enter a valid number"
            }
            return true;
        }
    },

    {
        type: "list",
        name: "employeeRole",
        message: "What is this employee's role?",
        choices: ["Sales Lead",
                  "Salesperson",
                  "Lead Engineer",
                  "Software Engineer",
                  "Account Manager",
                  "Accountant",
                  "Legal Team Lead"
                 ]
    },

    {
        type: "list",
        name: "employeeManager",
        message: "Who is this employee's manager?",
        choices: ["Bill Gates",
                  "Elmer Hernandez",
                  "Elon Musk",
                  "Mark Zuckerberg",
                 ]
    },


]

const deleteEmployee = [
    {
        type: "input",
        name: "employeeDelete",
        message: "What is the first name of the employee you'd like to delete?",
    }
]

const managerPrompt = [

    {
        type: "list",
        name: "managerName",
        message: "Which manager would you like to sort by?",
        choices: ["Bill Gates",
                  "Elmer Hernandez",
                  "Elon Musk",
                  "Mark Zuckerberg",
                 ]
    }

]

const departmentPrompt = [

    {
        type: "list",
        name: "departmentName",
        message: "Which manager would you like to sort by?",
        choices: ["Engineering",
                  "Finance",
                  "Legal",
                  "Sales",
                 ]
    }

]


function viewEmployee(){
    connection.query("SELECT * FROM workplace.employees", function(error, result){
        if(error){
            throw error 
        }
        console.table(result);
        connection.end();
    })
}

function createEmployee(){
    inquirer.prompt(addEmployee).then(employeeInfo => {
        connection.query(`INSERT INTO employees (FirstName, LastName, ID, Role, Manager) VALUES ('${employeeInfo.employeeFirst}', '${employeeInfo.employeeLast}', '${employeeInfo.employeeID}', '${employeeInfo.employeeRole}', '${employeeInfo.employeeManager}')`, function(error, result){
            if(error){
                throw error 
            }
            connection.end();
        })


    })
}


function deletePerson(){
    inquirer.prompt(deleteEmployee).then(deleteInfo => {
        connection.query(`DELETE FROM workplace.employees WHERE (FirstName = '${deleteInfo.employeeDelete}')`, function(error, result){
            if(error){
                throw error 
            }
            connection.end();
        })


    })
}

function viewManager(){
    inquirer.prompt(managerPrompt).then(managerInfo => {
        connection.query(`SELECT department.ID, employees.FirstName, employees.LastName, department.Manager FROM department INNER JOIN employees ON department.Manager=employees.Manager WHERE department.Manager="${managerInfo.managerName}"`, function(error, result){
            if(error){
                throw error 
            }

            console.table(result);
            connection.end();
        })


    })
}

function viewDepartment(){
    inquirer.prompt(departmentPrompt).then(departmentInfo => {
        connection.query(`SELECT department.ID, employees.FirstName, employees.LastName, department.Name FROM department INNER JOIN employees ON department.Roles=employees.Role WHERE department.Name="${departmentInfo.departmentName}"`, function(error, result){
            if(error){
                throw error 
            }

            console.table(result);
            connection.end();
        })


    })
}




async function init(){
    try{
        inquirer.prompt(employerPrompt).then(employeeAdder => {
            if(employeeAdder.start == "View All Employees"){
                viewEmployee();
            }

            else if(employeeAdder.start == "Add Employee"){
                createEmployee();
            }

            else if(employeeAdder.start == "Remove Employee"){
                deletePerson();
            }

            else if(employeeAdder.start == "View All Employees By Manager"){
                viewManager();
            }
            return true;


        })
       }
    catch(error){
        console.log(error);
    }
}

init();
