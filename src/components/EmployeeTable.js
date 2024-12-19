import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EmployeeTable.css";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://form-with-validation-server.onrender.com/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees. Please try again later.");
    }
  };

  const handleUpdate = (employee) => {
    navigate("/employee-form", { state: { employee } }); 
  };

  const handleDelete = async (employeeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://form-with-validation-server.onrender.com/api/employees/${employeeId}`);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee. Please try again.");
      }
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Role</th>
            <th>Date of Joining</th>
            <th>Actions</th> 
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.employee_id}>
              <td>{employee.employee_id}</td>
              <td>{employee.name}</td>
              <td>{employee.age}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
              <td>{employee.department === "Others" ? employee.other_department : employee.department}</td>
              <td>{employee.role}</td>
              <td>{employee.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString("en-US") : "N/A"}</td>
              <td>
                <button onClick={() => handleUpdate(employee)}>Update</button>
                <button onClick={() => handleDelete(employee.employee_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;