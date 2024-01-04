const express = require('express');
const router = express.Router();
const Student = require('./../schema/student'); // Assuming you have a 'student' schema defined

router.use(express.json());

router.post('/add', async (req, res) => {
  const { name, regNo, semester, department, contactNo, email } = req.body;

  try {
    // Check if a student with the same registration number already exists
    const existingStudent = await Student.findOne({ regNo });

    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this Registration No already exists' });
    }

    const newStudent = new Student({
      name,
      regNo,
      semester,
      department,
      contactNo,
      email
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Add a new GET endpoint to fetch all students
router.get('/getall', async (req, res) => {
  try {
    const students = await Student.find({}, '-_id'); // Exclude the _id field

    if (students.length === 0) {
      return res.status(404).json({ error: 'No students found' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/update/:regNo', async (req, res) => {
  const { regNo } = req.params;
  const updatedData = req.body;

  try {
    // Find the student by their registration number
    const student = await Student.findOne({ regNo });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update the student's information
    for (const key in updatedData) {
      if (Object.hasOwnProperty.call(updatedData, key)) {
        student[key] = updatedData[key];
      }
    }

    // Save the updated student information
    await student.save();

    res.status(200).json({ message: 'Student information updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//api to student on the basis of regno
router.get('/get/:regNo', async (req, res) => {
  const { regNo } = req.params;

  try {
    const student = await Student.findOne({ regNo }, '-_id'); // Exclude the _id field

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/remove/:regNo', async (req, res) => {
  const { regNo } = req.params;

  try {
    const student = await Student.findOne({ regNo });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Delete the student from the database
    await Student.deleteOne({ regNo });

    res.status(204).send(); // 204 No Content indicates a successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const results = await Student.find({
      $or: [
        { name: { $regex: new RegExp(query, 'i') } },
        { regNo: { $regex: new RegExp(query, 'i') } },
      ],
    });

    if (results.length === 0) {
      return res.status(404).json({ error: 'No matching students found' });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// an get api to return the total number of students
router.get('/count', async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
