CREATE DATABASE employee_db

ALTER DATABASE employee_db OWNER TO postgres;

\connect employee_db

CREATE TABLE employees (
  employee_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(255) UNIQUE NOT NULL,
  department VARCHAR(50) NOT NULL,
  other_department VARCHAR(50),
  date_of_joining DATE NOT NULL,
  role VARCHAR(50) NOT NULL,
  dob DATE NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(10) NOT NULL
);
