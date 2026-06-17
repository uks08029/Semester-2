# EXP-12 CRUD Operations using Spring Boot REST API

## Features
- Add Employee
- Get All Employees
- Get Employee By ID
- Update Employee
- Delete Employee

## Technologies Used
- Java
- Spring Boot
- Spring Data JPA
- MySQL
- REST API

## Project Structure
- Controller Layer
- Service Layer
- Repository Layer
- Entity Layer

## API Endpoints

### Add Employee
POST /employees

### Get All Employees
GET /employees

### Get Employee By ID
GET /employees/{id}

### Update Employee
PUT /employees/{id}

### Delete Employee
DELETE /employees/{id}

## How to Run

### Step 1
Create MySQL Database:
employee_db

### Step 2
Update username and password in application.properties

### Step 3
Run the project:
mvn spring-boot:run

### Step 4
Test APIs using Postman
