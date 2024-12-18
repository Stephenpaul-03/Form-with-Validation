const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const Joi = require("joi");
const app = express();

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "2004",
  database: "employee_db",
  port: 5432,
  ssl: false,  
});

app.use(cors());
app.use(bodyParser.json());

const employeeSchema = Joi.object({
  firstName: Joi.string().required(),
  middleName: Joi.string().allow(""),
  lastName: Joi.string().required(),
  employeeId: Joi.string().max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\d+$/).required(),
  department: Joi.string().required(),
  OtherDepartment: Joi.string().allow(""),
  dateOfJoining: Joi.date().max("now").required(),
  role: Joi.string().required(),
  dob: Joi.date().required(),
  age: Joi.number().integer().min(18).required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
});

app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

app.post("/api/employees", async (req, res) => {
  const { error } = employeeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const {
    firstName,
    middleName,
    lastName,
    dob,
    age,
    gender,
    email,
    phone,
    employeeId,
    department,
    OtherDepartment,
    dateOfJoining,
    role,
  } = req.body;

  const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");

  try {
    const queryCheck = `
      SELECT 1 FROM employees WHERE employee_id = $1 OR email = $2
    `;
    const result = await pool.query(queryCheck, [employeeId, email]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Employee ID, Email and/or Mobile number already exists." });
    }

    const queryInsert = `
      INSERT INTO employees 
      (employee_id, name, email, phone, department, other_department, date_of_joining, role, dob, age, gender)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    await pool.query(queryInsert, [
      employeeId,
      fullName,
      email,
      phone,
      department,
      department === "Others" ? OtherDepartment : null,
      dateOfJoining,
      role,
      dob,
      age,
      gender,
    ]);

    res.status(201).json({ message: "Employee added successfully." });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
