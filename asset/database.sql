CREATE database db;

CREATE TABLE section (
  id SERIAL PRIMARY KEY,
  section VARCHAR(3) NULL
);

CREATE TABLE prefix (
  id SERIAL PRIMARY KEY,
  prefix VARCHAR(6) NULL
);

CREATE TABLE curriculum (
  id SERIAL PRIMARY KEY,
  curr_name_th VARCHAR(70) NULL,
  curr_name_en VARCHAR(70) NULL,
  short_name_th VARCHAR(30) NULL,
  short_name_en VARCHAR(30) NULL
);

CREATE TABLE student (
  id SERIAL PRIMARY KEY,
  prefix_id INT NOT NULL,
  first_name VARCHAR(60) NULL,
  last_name VARCHAR(60) NULL,
  date_of_birth DATE NULL,
  curriculum_id INT NOT NULL,
  previous_school VARCHAR(80) NULL,
  address TEXT NULL,
  telephone VARCHAR(10) NULL,
  email VARCHAR(50) NULL,
  line_id VARCHAR(20) NULL,
  status VARCHAR(1) DEFAULT 'N' NOT NULL,
    section_id INT NOT NULL,
  FOREIGN KEY (prefix_id) REFERENCES prefix(id),
  FOREIGN KEY (curriculum_id) REFERENCES curriculum(id),
    FOREIGN KEY (section_id) REFERENCES section(id)
);

CREATE TABLE student_list (
  id SERIAL PRIMARY KEY,
  section_id INT NOT NULL,
  student_id INT NOT NULL,
  active_date DATE NOT NULL,
  status VARCHAR(1) DEFAULT 'N' NOT NULL,
  FOREIGN KEY (section_id) REFERENCES section(id),
  FOREIGN KEY (student_id) REFERENCES student(id)
);

create table teacher (
id serial primary key,
username varchar(50) not null,
password varchar(50) not null,
first_name varchar(50) null,
last_name varchar(50) null,
status varchar(1) default 'N' not null
);


//ลบข้อมูล เพื่อเวลาลบจะได้หายทีเดียว
ALTER TABLE student_list
DROP CONSTRAINT student_list_student_id_fkey;

ALTER TABLE student_list
ADD CONSTRAINT student_list_student_id_fkey
FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE;

npm install passport passport-local express-session bcrypt

INSERT INTO teacher (username, password, first_name, last_name, status)
VALUES
('admin', 'admin', 'admin', 'admin', 'Y');
