import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
import { Tooltip } from 'react-tooltip';
import './EmployeeForm.css';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    employeeId: "",
    department: "",
    OtherDepartment: "",
    dateOfJoining: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const employeeSchema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[A-Za-z]+$/)
      .min(4)
      .required()
      .label("First Name")
      .messages({
        "string.min": "First Name should be at least 4 characters long.",
        "string.pattern.base": "First Name should only contain alphabets.",
        "any.required": "First Name is required."
      }),
    middleName: Joi.string()
      .pattern(/^[A-Za-z]*$/)
      .allow("")
      .label("Middle Name")
      .messages({
        "string.pattern.base": "Middle Name should only contain alphabets."
      }),
    lastName: Joi.string()
      .pattern(/^[A-Za-z ]+$/)
      .min(4)
      .required()
      .label("Last Name")
      .messages({
        "string.min": "Last Name should be at least 4 characters long.",
        "string.pattern.base": "Last Name should only contain alphabets.",
        "any.required": "Last Name is required."
      }),
    phone: Joi.string()
      .pattern(/^[+#\d\s]+$/)
      .min(7)
      .required()
      .label("Phone")
      .messages({
        "string.min": "Phone number should be at least 7 digits long.",
        "string.pattern.base": "Phone number should only contain digits.",
        "any.required": "Phone number is required."
      }),
    dob: Joi.date()
      .required()
      .less(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000))
      .greater(new Date(Date.now() - 80 * 365 * 24 * 60 * 60 * 1000))
      .label("Date of Birth")
      .messages({
        "date.less": "Date of Birth must make the employee at least 18 years old.",
        "date.greater": "Date of Birth must make the employee not older than 80 years.",
        "any.required": "Date of Birth is required."
      }),
    age: Joi.number()
      .integer()
      .min(18)
      .max(80)
      .required()
      .label("Age")
      .messages({
        "number.min": "Age must be at least 18.",
        "number.max": "Age must not exceed 80.",
        "any.required": "Age is required."
      }),
    employeeId: Joi.string()
      .pattern(/^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}-[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/)
      .required()
      .label("Employee ID")
      .messages({
        "string.pattern.base": "Employee ID must be in the format xxx-xxx-xxx-xxx and only contain alphabets, digits, and dashes.",
        "any.required": "Employee ID is required."
      }),
    department: Joi.string()
      .required()
      .label("Department"),
    OtherDepartment: Joi.string()
      .allow("")
      .label("Other Department"),
    dateOfJoining: Joi.date()
      .required()
      .less(new Date())
      .greater(new Date(Date.now() - 80 * 365 * 24 * 60 * 60 * 1000))
      .label("Date of Joining")
      .messages({
        "date.less": "Date of Joining cannot be in the future.",
        "date.greater": "Date of Joining must not be older than 80 years.",
        "any.required": "Date of Joining is required."
      }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    role: Joi.string()
      .required()
      .label("Role"),
    gender: Joi.string()
      .valid("Male", "Female", "Other")
      .required()
      .label("Gender")
  });

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateField = (name, value) => {
    const fieldSchema = employeeSchema.extract(name);
    const { error } = fieldSchema.validate(value);
    return { error: error ? error.message : null, isValid: !error };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "dob") {
      const calculatedAge = calculateAge(value);
      setFormData((prev) => ({ ...prev, age: calculatedAge >= 0 ? calculatedAge : "" }));
    }
    const validationResult = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: validationResult.error }));
  };

const getValidationClass = (fieldName) => {
    if (!formData[fieldName]) return "";
    if ((fieldName === "dob" || fieldName === "age") && (errors.dob || errors.age)) {
      return errors.dob || errors.age ? "invalid" : "valid";
    }
    return errors[fieldName] ? "invalid" : "valid";
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = employeeSchema.validate(formData, { abortEarly: false });
    if (error) {
      const errorMessages = {};
      error.details.forEach((err) => {
        errorMessages[err.context.key] = err.message;
      });
      setErrors(errorMessages);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/employees", formData);
      alert("Employee added successfully!");
      const userAction = window.confirm("Do you want to add another employee?");
      if (userAction) {
        handleReset();
      } else {
        navigate("/");
      }
    } catch (error) {
      alert("Error adding employee: " + error.response.data.message);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields?")) {
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        employeeId: "",
        department: "",
        OtherDepartment: "",
        dateOfJoining: "",
        role: "",
      });
      setErrors({});
    }
  };

  

  return (
    <div>
      <button onClick={() => navigate("/")} className="Back_Button">
        Back
      </button>
      <div className="body">
        <form onSubmit={handleSubmit}>
          <div className="Personal_Details">
            <div className="Name_Box">
              <div
                className={`Validation_Box ${getValidationClass("firstName")}`}
                data-tooltip-id="firstNameTooltip"
                data-tooltip-content={errors.firstName || ""}
              >

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  placeholder="First Name"
                  onChange={handleInputChange}
                  autoComplete="off"
                />

              </div>
              
              <Tooltip id="firstNameTooltip" />
              
              <div
                className={`Validation_Box ${getValidationClass("middleName")}`}
                data-tooltip-id="middleNameTooltip"
                data-tooltip-content={errors.middleName || ""}
              >
              
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  placeholder="Middle Name"
                  onChange={handleInputChange}
                  autoComplete="off"
                />

              </div>
              
              <Tooltip id="middleNameTooltip" />

              <div
                className={`Validation_Box ${getValidationClass("lastName")}`}
                data-tooltip-id="lastNameTooltip"
                data-tooltip-content={errors.lastName || ""}
              >

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  placeholder="Last Name"
                  onChange={handleInputChange}
                  autoComplete="off"
                />

              </div>
              
              <Tooltip id="lastNameTooltip" />

            </div>
            <div className="Contact_Box">
              <div
                className={`Validation_Box ${getValidationClass("email")}`}
                data-tooltip-id="emailTooltip"
                data-tooltip-content={errors.email || ""}
              >

                <input
                  type="email"
                  name="email"
                  className="email"
                  value={formData.email}
                  placeholder="Email"
                  onChange={handleInputChange}
                  autoComplete="off"
                />

              </div>
              
              <Tooltip id="emailTooltip" />

              <div
                className={`Validation_Box ${getValidationClass("phone")}`}
                data-tooltip-id="phoneTooltip"
                data-tooltip-content={errors.phone || ""}
              >

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  placeholder="Phone Number"
                  onChange={handleInputChange}
                  autoComplete="off"
                />

              </div>
              
              <Tooltip id="phoneTooltip" />

            </div>
            <div className="Others_Box">
              <div
                className={`Validation_Box ${getValidationClass("dob")}`}
                data-tooltip-id="dobTooltip"
                data-tooltip-content={errors.dob || ""}
              >
                <div className="Label_Box"><label>Date of Birth : </label></div>
                <input
                  type="date"
                  name="dob"
                  className="dob"
                  value={formData.dob}
                  placeholder="Date of Birth"
                  onChange={handleInputChange}
                />

              </div>
              
              <Tooltip id="dobTooltip" />

              <div
                className={`Validation_Box ${getValidationClass("age")}`}
                data-tooltip-id="ageTooltip"
                data-tooltip-content={errors.age || ""}
              >

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  placeholder="Age"
                  onChange={handleInputChange}
                  disabled
                />

              </div>
              
              <Tooltip id="ageTooltip" />

              <div
                className={`Validation_Box ${getValidationClass("gender")}`}
                data-tooltip-id="genderTooltip"
                data-tooltip-content={errors.gender || ""}
              >

                <select name="gender" value={formData.gender} onChange={handleInputChange} className="gender">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

              </div>

              <Tooltip id="genderTooltip" />

            </div>
          </div>
          <div className="Employee_Details">
            <div className="Employee_Box_1">
              <div
                className={`Validation_Box ${getValidationClass("employeeId")}`}
                data-tooltip-id="employeeIdTooltip"
                data-tooltip-content={errors.employeeId || ""}
              >

                <input
                  type="text"
                  name="employeeId"
                  className="empid"
                  value={formData.employeeId}
                  placeholder="Employee ID"
                  onChange={handleInputChange}
                  autoComplete="off"
                />

              </div>

              <Tooltip id="employeeIdTooltip" />

              <div
                className={`Validation_Box ${getValidationClass("dateOfJoining")}`}
                data-tooltip-id="dateOfJoiningTooltip"
                data-tooltip-content={errors.dateOfJoining || ""}
              >

                <div className="Label_Box"><label>Date of Joining :</label></div>
                <input
                  type="date"
                  name="dateOfJoining"
                  className="doj"
                  value={formData.dateOfJoining}
                  placeholder="Date of Joining"
                  onChange={handleInputChange}
                />

              </div>

              <Tooltip id="dateOfJoiningTooltip" />

            </div>
            <div className="Employee_Box_2">
              <div
                className={`Validation_Box ${getValidationClass("department")}`}
                data-tooltip-id="departmentTooltip"
                data-tooltip-content={errors.department || ""}
              >

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="depart"
                >
                  <option value="">Select Department</option>
                  <option value="HR">HR</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Other">Others</option>
                </select>

              </div>

              <Tooltip id="departmentTooltip" />

              {formData.department === "Other" && (
                <div
                  className={`Validation_Box ${getValidationClass("OtherDepartment")}`}
                  data-tooltip-id="OtherDepartmentTooltip"
                  data-tooltip-content={errors.OtherDepartment || ""}
                >

                  <input
                    type="text"
                    name="OtherDepartment"
                    value={formData.OtherDepartment}
                    placeholder="Specify Department"
                    onChange={handleInputChange}
                    autoComplete="off"
                  />

                </div>
              )}

              <Tooltip id="OtherDepartmentTooltip" />

              <div
                className={`Validation_Box ${getValidationClass("role")}`}
                data-tooltip-id="roleTooltip"
                data-tooltip-content={errors.role || ""}
              >

                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  placeholder="Role"
                  onChange={handleInputChange}
                  autoComplete="off"
                />

              </div>

              <Tooltip id="roleTooltip" />

            </div>
          </div>
          <div className="Buttons">
            <button type="button" onClick={handleReset} className="Reset_Button">
              Reset
            </button>
            <button type="submit" className="Submit_Button">
              Submit
            </button>
          </div>
        </form>
      </div >
    </div >
  );
};

export default EmployeeForm;
