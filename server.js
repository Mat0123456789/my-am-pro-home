const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session'); // นำเข้า express-session
const pool = require('./model/db'); // นำเข้า pool จาก db.js
const path = require('path'); // เพิ่มบรรทัดนี้

const app = express();
app.use(bodyParser.json());

app.use(session({ //สร้าง session
  secret: 'your_secret_key', // ใช้สำหรับเข้ารหัส session
  resave: false, // ไม่ต้องบันทึก session ใหม่ทุกครั้ง
  saveUninitialized: true, // ต้องบันทึก session ใหม่ทุกครั้ง
  cookie: { maxAge: 900000 } // อายุของ session ใน ms (15 นาที)
}));



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// กำหนดให้ใช้ EJS เป็น template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));


// กำหนดการใช้ body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// middleware/auth.js
const checkSession = (req, res, next) => {
  if (req.session.teacher) {
      next(); // หากมีการล็อกอินให้ดำเนินการต่อ
  } else {
      res.redirect('/login?alert=Please log in first.'); // ถ้าไม่มีให้ไปยังหน้า login
  }
};

module.exports = checkSession;




// Route: แสดงหน้าแรกพร้อมรายการโพสต์
app.get('/',checkSession, async (req, res) => {
  const query = `
      SELECT 
        s.id,
        p.prefix AS prefix_name,
        s.first_name,
        s.last_name,
        s.date_of_birth,
        c.curr_name_th AS curriculum_name,
        s.previous_school,
        s.address,
        s.telephone,
        s.email,
        s.line_id,
        s.status,
        s.section_id
      FROM student s
      JOIN prefix p ON s.prefix_id = p.id
      JOIN curriculum c ON s.curriculum_id = c.id
      ORDER BY s.curriculum_id ASC, s.section_id ASC, s.id ASC;  -- เรียงลำดับข้อมูล
  `;
  const students = await pool.query(query); // ดึงข้อมูลนักเรียนจากฐานข้อมูล
  res.render('index', { students: students.rows }); // ส่งตัวแปร students ไปยังหน้า index.ejs
});

// Route: แสดงฟอร์มเพิ่มนักเรียนใหม่
app.get('/add-student',checkSession, (req, res) => {
  res.render('add-student');
});

// Route: จัดการข้อมูลที่ส่งจากฟอร์มเพื่อเพิ่มนักเรียน
app.post('/add-student',checkSession, async (req, res) => {
    try {
      const { prefix_id, first_name, last_name, date_of_birth, curriculum_id, previous_school, address, telephone, email, line_id, status, section_id} = req.body;
  
      // เพิ่มข้อมูลนักเรียนใหม่เข้าไปในฐานข้อมูล
      await pool.query(
        'INSERT INTO student (prefix_id, first_name, last_name, date_of_birth, curriculum_id, previous_school, address, telephone, email, line_id, status, section_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        [prefix_id, first_name, last_name, date_of_birth, curriculum_id, previous_school, address, telephone, email, line_id, status, section_id] // เพิ่ม status
      );         
  
      // หลังจากเพิ่มเสร็จ ให้ redirect ไปที่หน้าแสดงรายชื่อนักเรียน
      res.redirect('/add-student?alert=add stodent succes');
    } catch (err) {
      console.error('Error adding student', err);
      res.status(500).send('Error occurred while adding student');
    }
  });


// เส้นทางหลักเพื่อแสดงฟอร์มเช็คชื่อ
app.get('/attendance',checkSession, async (req, res) => {
  const sectionId = 1; // แทนที่ด้วยวิธีการดึง sectionId ที่คุณต้องการ
  try {
      const result = await pool.query('SELECT id, first_name, last_name FROM student WHERE section_id = 1');
      res.render('attendance', { students: result.rows, sectionId: sectionId, alert: req.query.alert });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
  }
});

app.post('/attendance',checkSession, async (req, res) => {
  const attendanceData = req.body; // ข้อมูลที่ส่งมาจากฟอร์ม
  const sectionId = req.body.section_id; // รับ section_id จาก request body

  try {
      // บันทึกข้อมูลลงฐานข้อมูล
      for (let studentId in attendanceData) {
          const status = attendanceData[studentId]; // ค่าที่ได้รับจากฟอร์ม
          
          // เช็คว่ามีสถานะไหมและเช็คสถานะที่อนุญาต
          if (!status || !['P', 'A', 'L', 'T'].includes(status)) {
              continue; // ถ้าไม่มีสถานะให้ข้ามการบันทึก
          }

          const query = 'INSERT INTO student_list (section_id, student_id, status, active_date) VALUES ($1, $2, $3, NOW())';
          await pool.query(query, [sectionId, studentId, status]); // ส่ง sectionId, studentId, และ status
      }

      // Redirect กลับไปที่หน้าเช็คชื่อพร้อม query parameter สำหรับ alert
      res.redirect('/attendance?alert=Attendance recorded successfully!');
  } catch (err) {
      console.error(err);
      res.status(500).send('Error saving attendance data');
  }
});

// เส้นทางหลักเพื่อแสดงฟอร์มเช็คชื่อ
app.get('/attendance2',checkSession, async (req, res) => {
  const sectionId = 1; // แทนที่ด้วยวิธีการดึง sectionId ที่คุณต้องการ
  try {
      const result = await pool.query('SELECT id, first_name, last_name FROM student WHERE section_id = 2');
      res.render('attendance2', { students: result.rows, sectionId: sectionId, alert: req.query.alert });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
  }
});
app.post('/attendance2',checkSession, async (req, res) => {
  const attendanceData = req.body; // ข้อมูลที่ส่งมาจากฟอร์ม
  const sectionId = req.body.section_id; // รับ section_id จาก request body

  try {
      // บันทึกข้อมูลลงฐานข้อมูล
      for (let studentId in attendanceData) {
          const status = attendanceData[studentId]; // ค่าที่ได้รับจากฟอร์ม
          
          // เช็คว่ามีสถานะไหมและเช็คสถานะที่อนุญาต
          if (!status || !['P', 'A', 'L', 'T'].includes(status)) {
              continue; // ถ้าไม่มีสถานะให้ข้ามการบันทึก
          }

          const query = 'INSERT INTO student_list (section_id, student_id, status, active_date) VALUES ($1, $2, $3, NOW())';
          await pool.query(query, [sectionId, studentId, status]); // ส่ง sectionId, studentId, และ status
      }

      // Redirect กลับไปที่หน้าเช็คชื่อพร้อม query parameter สำหรับ alert
      res.redirect('/attendance2?alert=Attendance recorded successfully!');
  } catch (err) {
      console.error(err);
      res.status(500).send('Error saving attendance data');
  }
});

// เส้นทางเพื่อแสดงหน้าแก้ไขข้อมูลนักเรียน
app.get('/edit-student/:id',checkSession, async (req, res) => {
  const studentId = req.params.id;
  try {
      const result = await pool.query('SELECT * FROM student WHERE id = $1', [studentId]);
      const student = result.rows[0];
      res.render('edit-student', { student });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching student data');
  }
});

app.post('/update-student/:id',checkSession, async (req, res) => {
  const studentId = req.params.id;
  const { prefix_id, first_name, last_name, date_of_birth, curriculum_id, previous_school, address, telephone, email, line_id, status, section_id } = req.body;

  try {
      const query = `
          UPDATE student 
          SET prefix_id = $1, first_name = $2, last_name = $3, date_of_birth = $4, curriculum_id = $5, 
              previous_school = $6, address = $7, telephone = $8, email = $9, line_id = $10, 
              status = $11, section_id = $12 
          WHERE id = $13
      `;
      await pool.query(query, [prefix_id, first_name, last_name, date_of_birth, curriculum_id, previous_school, address, telephone, email, line_id, status, section_id, studentId]);
      
      res.redirect('/?alert=Student information updated successfully!'); // เปลี่ยนเส้นทางไปยังหน้ารายชื่อหลังจากอัปเดต
  } catch (err) {
      console.error(err);
      res.status(500).send('Error updating student data');
  }
});


// เส้นทางสำหรับลบข้อมูลนักเรียน
app.get('/delete-student/:id',checkSession, async (req, res) => {
  const studentId = req.params.id;

  try {
      const query = 'DELETE FROM student WHERE id = $1'; // คำสั่ง SQL สำหรับลบข้อมูล
      await pool.query(query, [studentId]); // ดำเนินการคำสั่ง SQL
      
      res.redirect('/?alert=Student deleted successfully!'); // เปลี่ยนเส้นทางไปยังหน้ารายชื่อนักเรียนพร้อมข้อความแจ้งเตือน
  } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting student data');
  }
});


// Route: หน้า login
app.get('/login', (req, res) => {
  res.render('login', { alert: req.query.alert });
});

// Route: จัดการการ login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM teacher WHERE username = $1 AND password = $2';
    const result = await pool.query(query, [username, password]);

    if (result.rows.length > 0) {
      req.session.teacher = result.rows[0];
      return res.redirect('/?alert=Login successful!');
    } else {
      return res.redirect('/login?alert=Invalid username or password');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error in server');
  }
});



// Route: ออกจากระบบ (Logout)
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).send('Error logging out');
      }
      res.redirect('/login'); // เปลี่ยนเส้นทางไปหน้า login
  });
});


// เส้นทางเพื่อค้นหาประวัติการเข้าเรียนของนักเรียน
app.get('/search-history',checkSession, async (req, res) => {
  const studentId = req.query.studentId; // รับ studentId จาก query parameters

  try {
      const result = await pool.query(
          `SELECT s.first_name, s.last_name, sl.section_id, sl.status, sl.active_date 
          FROM student_list sl 
          JOIN student s ON sl.student_id = s.id 
          WHERE sl.student_id = $1 
          ORDER BY sl.active_date DESC`,
          [studentId]
      );

      // Render หน้า EJS พร้อมข้อมูลที่ค้นหา
      res.render('history', { attendanceRecords: result.rows, studentId });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching attendance history');
  }
});
app.get('/search-historyStd', async (req, res) => {
  const studentId = req.query.studentId; // รับ studentId จาก query parameters

  try {
      const result = await pool.query(
          `SELECT s.first_name, s.last_name, sl.section_id, sl.status, sl.active_date 
          FROM student_list sl 
          JOIN student s ON sl.student_id = s.id 
          WHERE sl.student_id = $1 
          ORDER BY sl.active_date DESC`,
          [studentId]
      );

      // Render หน้า EJS พร้อมข้อมูลที่ค้นหา
      res.render('historyStd', { attendanceRecords: result.rows, studentId });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching attendance history');
  }
});













  

// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
