# Start Django
```bash
git clone <repo-url>
cd <repo>
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
# only once: first time when you build app in your laptop
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver localhost:8000
```

# Django admin
```
username: pc , password: admin also try admin123 etc
```

# start React


### **Prompt AI**

**create a complete and robust backend for a university's Department Management System using Python with the Django framework and a SQLite database. The frontend of this application is built with React and communicates with the backend via a RESTful API.**

**Here are the detailed requirements for the backend:**

**1. Database Models:**

First, define the following SQLAlchemy models to represent the application's data structures. Ensure that the relationships between the models are correctly implemented.

*   **Batch**:
    *   `id` (Integer, Primary Key)
    *   `year` (Integer, Not Nullable)
    *   `semester` (Integer, Not Nullable)

*   **Student**:
    *   `id` (Integer, Primary Key)
    *   `name` (String, Not Nullable)
    *   `usn` (String, Unique, Not Nullable)
    *   `batch_id` (Integer, Foreign Key to `batches.id`)
    *   `batch` (Relationship to `Batch`)

*   **Faculty**:
    *   `id` (String, Primary Key)
    *   `name` (String, Not Nullable)

*   **Subject**:
    *   `id` (String, Primary Key)
    *   `name` (String, Not Nullable)
    *   `batch_id` (Integer, Foreign Key to `batches.id`)
    *   `batch` (Relationship to `Batch`)

*   **SubjectAllotment**:
    *   `id` (Integer, Primary Key)
    *   `faculty_id` (String, Foreign Key to `faculty.id`)
    *   `subject_id` (String, Foreign Key to `subjects.id`)
    *   `faculty` (Relationship to `Faculty`)
    *   `subject` (Relationship to `Subject`)

*   **AttendanceRecord**:
    *   `id` (Integer, Primary Key)
    *   `student_id` (Integer, Foreign Key to `students.id`)
    *   `subject_id` (String, Foreign Key to `subjects.id`)
    *   `date` (Date, Not Nullable)
    *   `status` (String, 'Present' or 'Absent', Not Nullable)
    *   `student` (Relationship to `Student`)
    *   `subject` (Relationship to `Subject`)

**2. API Endpoints:**

Next, create the following API endpoints to handle all the necessary CRUD (Create, Read, Update, Delete) operations. Make sure to include robust error handling and to return appropriate JSON responses with correct status codes.

*   **Batches:**
    *   `GET /api/batches/`: Retrieve a list of all batches.
    *   `POST /api/batches/`: Create a new batch. Expects `year` and `semester` in the request body.

*   **Students:**
    *   `GET /api/students/`: Retrieve a list of all students.
    *   `POST /api/batches/<int:batch_id>/add_students/`: Add a list of new students to a specific batch. Expects a list of student objects, each with `name` and `usn`.
    *   `DELETE /api/batches/<int:batch_id>/clear_students/`: Delete all students from a specific batch.

*   **Faculty:**
    *   `GET /api/faculty/`: Retrieve a list of all faculty members.
    *   `POST /api/faculty/`: Add a new faculty member. Expects `id` and `name` in the request body.

*   **Subjects:**
    *   `GET /api/subjects/`: Retrieve a list of all subjects.
    *   `POST /api/batches/<int:batch_id>/add_subjects/`: Add a list of new subjects to a specific batch. Expects a list of subject objects, each with `id` and `name`.
    *   `DELETE /api/batches/<int:batch_id>/clear_subjects/`: Delete all subjects from a specific batch.

*   **Allotments:**
    *   `GET /api/allotments/`: Retrieve a list of all subject allotments.
    *   `POST /api/allotments/`: Create a new subject allotment. Expects `faculty_id` and `subject_id` in the request body.

*   **Attendance:**
    *   `POST /api/attendance/`: Submit a list of attendance records for a particular subject on a specific date. Expects a list of records, each containing `student_id`, `subject_id`, `date`, and `status`.

**3. Additional Requirements:**

*   **CORS (Cross-Origin Resource Sharing):** Enable CORS to allow requests from the React frontend, which will be running on a different port.
*   **Database Initialization:** Include a script or a command to initialize the SQLite database and create all the necessary tables based on the defined models.
*   **Dependencies:** Please provide a `requirements.txt` file that lists all the necessary Python packages (e.g., Django, Django-SQLAlchemy, Django-CORS).

By following these instructions, you will create a fully functional backend that seamlessly integrates with the provided React frontend, enabling all the features of the Department Management System.