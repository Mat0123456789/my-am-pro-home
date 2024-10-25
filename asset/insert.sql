-- สร้างข้อมูลในตาราง section
INSERT INTO section (section) VALUES
('01'),
('02');

-- สร้างข้อมูลในตาราง prefix
INSERT INTO prefix (prefix) VALUES
('นาย'),
('นางสาว'),
('นาง');

-- สร้างข้อมูลในตาราง curriculum
INSERT INTO curriculum (curr_name_th, curr_name_en, short_name_th, short_name_en) VALUES
('วิทยาการคอมพิวเตอร์', 'Computer Science', 'วค.', 'CS'),
('เทคโนโลยีสารสนเทศ', 'Information Technology', 'ทส.', 'IT');

-- สร้างข้อมูลในตาราง student ถ้าerror น่าจะลืมใส่ section
INSERT INTO student (prefix_id, first_name, last_name, date_of_birth, curriculum_id, previous_school, address, telephone, email, line_id) VALUES
(1, 'John', 'Doe', '2000-01-01', 1, 'ABC School', '123 Street, City', '0123456789', 'john.doe@example.com', 'john_doe'),
(2, 'Jane', 'Smith', '2001-02-02', 2, 'XYZ School', '456 Avenue, City', '0987654321', 'jane.smith@example.com', 'jane_smith'),
(1, 'Mark', 'Brown', '1999-03-03', 1, 'DEF School', '789 Road, City', '0112233445', 'mark.brown@example.com', 'mark_brown'),
(2, 'Emily', 'Davis', '2002-04-04', 2, 'GHI School', '321 Boulevard, City', '0223344556', 'emily.davis@example.com', 'emily_davis');

INSERT INTO teacher (username, password, first_name, last_name, status)
VALUES
('admin', 'admin', 'admin', 'admin', 'Y');
-----------------------------------------------อันนี้น่าจะใช้ได้ล่ะ----------------------------------------------------------------------------------------------
-- เพิ่มข้อมูลในตาราง prefix
INSERT INTO prefix (prefix) VALUES 
('นาย.'), 
('นางสาว.'), 
('นาง.');

-- เพิ่มข้อมูลในตาราง section
INSERT INTO section (section) VALUES 
('01'), 
('02'), 


-- เพิ่มข้อมูลในตาราง curriculum
INSERT INTO curriculum (curr_name_th, curr_name_en, short_name_th, short_name_en) VALUES 
('วิทยาการคอมพิวเตอร์', 'Computer Science', 'วค', 'CS'),
('เทคโนโลยีสารสนเทศ', 'Information Technology', 'ทส', 'IT');

-- เพิ่มข้อมูลในตาราง student
INSERT INTO student (prefix_id, first_name, last_name, date_of_birth, curriculum_id, previous_school, address, telephone, email, line_id, section_id) VALUES 
(1, 'สมชาย', 'ใจดี', '2002-01-15', 1, 'โรงเรียนต้นแบบ', '123/45 หมู่ 3 ถนนพระราม 2', '0812345678', 'somchai@example.com', 'somchai.line', 2), 
(2, 'นางสาวสวย', 'สวยงาม', '2002-02-20', 1, 'โรงเรียนทดสอบ', '456/78 หมู่ 4 ถนนพระราม 3', '0898765432', 'suwanna@example.com', 'suwanna.line', 2), 
(1, 'นายพิสิฐ', 'อัจฉริยะ', '2002-03-30', 2, 'โรงเรียนดีเด่น', '789/12 หมู่ 1 ถนนพระราม 4', '0876543210', 'pisit@example.com', 'pisit.line', 1), 
(2, 'นางสาวแจ่ม', 'เจริญ', '2002-04-25', 2, 'โรงเรียนระดับชาติ', '321/34 หมู่ 5 ถนนพระราม 5', '0965432109', 'jaime@example.com', 'jaime.line', 1);

-- เพิ่มข้อมูลในตาราง student_list
INSERT INTO student_list (section_id, student_id, active_date, status) VALUES 
(1, 1, '2024-01-01', 'n'), 
(2, 2, '2024-01-01', 'n'), 
(3, 3, '2024-01-01', 'n'), 
(4, 4, '2024-01-01', 'n');
INSERT INTO teacher (username, password, first_name, last_name, status)
VALUES
('admin', 'admin', 'admin', 'admin', 'Y');