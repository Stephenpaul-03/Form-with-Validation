CREATE DATABASE employee_db

ALTER DATABASE employee_db OWNER TO postgres;

\connect employee_db


CREATE TABLE public.employees (
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    dob date NOT NULL,
    age integer NOT NULL,
    gender character varying(10) NOT NULL,
    employee_id character varying(20) NOT NULL,
    department character varying(50) NOT NULL,
    other_department character varying(50),
    date_of_joining date NOT NULL,
    role character varying(50) NOT NULL,
    CONSTRAINT employees_age_check CHECK ((age >= 18))
);