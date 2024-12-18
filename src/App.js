import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeTable from "./components/EmployeeTable";
import './App.css';

function App() {
  const navigate = useNavigate(); 

  const handleCreateNewClick = () => {
    navigate("/employee-form"); 
  };

  return (
    <div className="App">
      <div className="main">
        <div className="side_bar">
          
        </div>
        <div className="main_box">
          <div className="database_box">
            <EmployeeTable/>
          </div>
          <div className="button_box">
            <button onClick={handleCreateNewClick}>Create New</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/employee-form" element={<EmployeeForm />} />
      </Routes>
    </Router>
  );
}

export default AppWithRouter;
