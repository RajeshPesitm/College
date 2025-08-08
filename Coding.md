Great — you're building a robust backend in **Django** to work with a **React frontend**. Although your description mentions SQLAlchemy (which is typically used with Flask), **I'll translate this into Django's ORM**, as Django doesn't use SQLAlchemy.

Here's what this answer will include:

---

### ✅ Project Structure

### ✅ Setup Instructions with `venv`, `.gitignore`, and `requirements.txt`

### ✅ Models

### ✅ Serializers

### ✅ Views (with appropriate API endpoints)

### ✅ URLs

### ✅ CORS Support

### ✅ DB Initialization

### ✅ GitHub Setup Instructions

---

## ✅ 1. **Project Setup**

Your directory will look like this (with existing `/frontend` untouched):

```
/your-project-root/
│
├── frontend/                      # your existing frontend
├── backend/                       # Django project
│   ├── manage.py
│   ├── backend/                  # Django project folder
│   └── dms/                      # Django app
├── venv/                         # virtual environment
├── requirements.txt
└── .gitignore
```

---

## ✅ 2. **Setup Instructions**

### 1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. Install Django and dependencies:

```bash
pip install django djangorestframework django-cors-headers
```

### 3. Freeze requirements:

```bash
pip freeze > requirements.txt
```

### 4. Create project and app:

```bash
django-admin startproject backend .
python manage.py startapp dms
```

---

## ✅ 3. **.gitignore**

Django does **not** auto-generate `.gitignore`. Create one manually at the project root:

```gitignore
# Python
__pycache__/
*.py[cod]
*.sqlite3

# Env
venv/
.env

# Django
/static/
media/

# IDE
.vscode/
*.log
```

---

## ✅ 4. **Django Settings**

### `backend/settings.py`:

Add these to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    ...
    'rest_framework',
    'corsheaders',
    'dms',
]
```

Add CORS middleware:

```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOW_ALL_ORIGINS = True  # or restrict to your frontend port
```

Use SQLite (default):

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / "db.sqlite3",
    }
}
```

---

## ✅ 5. **Models (`dms/models.py`)**

```python
from django.db import models

class Batch(models.Model):
    year = models.IntegerField()
    semester = models.IntegerField()

    def __str__(self):
        return f"{self.year} - Sem {self.semester}"

class Student(models.Model):
    name = models.CharField(max_length=100)
    usn = models.CharField(max_length=20, unique=True)
    batch = models.ForeignKey(Batch, related_name='students', on_delete=models.CASCADE)

class Faculty(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)

class Subject(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    batch = models.ForeignKey(Batch, related_name='subjects', on_delete=models.CASCADE)

class SubjectAllotment(models.Model):
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

class AttendanceRecord(models.Model):
    STATUS_CHOICES = (('Present', 'Present'), ('Absent', 'Absent'))

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
```

---

## ✅ 6. **Serializers (`dms/serializers.py`)**

```python
from rest_framework import serializers
from .models import *

class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class SubjectAllotmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubjectAllotment
        fields = '__all__'

class AttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = '__all__'
```

---

## ✅ 7. **Views (`dms/views.py`)**

```python
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *

# Batch
class BatchListCreateView(generics.ListCreateAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer

# Students
class StudentListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class AddStudentsToBatch(APIView):
    def post(self, request, batch_id):
        batch = Batch.objects.get(id=batch_id)
        data = request.data
        for item in data:
            Student.objects.create(batch=batch, **item)
        return Response({"message": "Students added."}, status=201)

class ClearStudentsFromBatch(APIView):
    def delete(self, request, batch_id):
        Student.objects.filter(batch_id=batch_id).delete()
        return Response({"message": "Students deleted."}, status=204)

# Faculty
class FacultyListCreateView(generics.ListCreateAPIView):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer

# Subjects
class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class AddSubjectsToBatch(APIView):
    def post(self, request, batch_id):
        batch = Batch.objects.get(id=batch_id)
        data = request.data
        for item in data:
            Subject.objects.create(batch=batch, **item)
        return Response({"message": "Subjects added."}, status=201)

class ClearSubjectsFromBatch(APIView):
    def delete(self, request, batch_id):
        Subject.objects.filter(batch_id=batch_id).delete()
        return Response({"message": "Subjects deleted."}, status=204)

# Allotments
class AllotmentListCreateView(generics.ListCreateAPIView):
    queryset = SubjectAllotment.objects.all()
    serializer_class = SubjectAllotmentSerializer

# Attendance
class SubmitAttendanceView(APIView):
    def post(self, request):
        serializer = AttendanceRecordSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Attendance saved."}, status=201)
        return Response(serializer.errors, status=400)
```

---

## ✅ 8. **URLs (`dms/urls.py`)**

```python
from django.urls import path
from . import views

urlpatterns = [
    path('batches/', views.BatchListCreateView.as_view()),
    path('students/', views.StudentListView.as_view()),
    path('batches/<int:batch_id>/add_students/', views.AddStudentsToBatch.as_view()),
    path('batches/<int:batch_id>/clear_students/', views.ClearStudentsFromBatch.as_view()),

    path('faculty/', views.FacultyListCreateView.as_view()),

    path('subjects/', views.SubjectListView.as_view()),
    path('batches/<int:batch_id>/add_subjects/', views.AddSubjectsToBatch.as_view()),
    path('batches/<int:batch_id>/clear_subjects/', views.ClearSubjectsFromBatch.as_view()),

    path('allotments/', views.AllotmentListCreateView.as_view()),
    path('attendance/', views.SubmitAttendanceView.as_view()),
]
```

### And in `backend/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('dms.urls')),
]
```

---

## ✅ 9. **DB Initialization**

Run the following:

```bash
python manage.py makemigrations
python manage.py migrate
```

To create admin:

```bash
python manage.py createsuperuser
# username pc password admin
```

---

## ✅ 10. **Final Notes & GitHub**

### 🧠 To Push to GitHub:

```bash
git init
git add .
git commit -m "Initial backend setup for DMS"
git remote add origin https://github.com/yourusername/repo-name.git
git push -u origin master
```

---

## ✅ `requirements.txt` (example)

```txt
Django>=4.0
djangorestframework>=3.14.0
django-cors-headers>=3.13.0
```

---

Would you like me to:

* Package this into a ZIP?
* Help with Dockerization?
* Provide frontend integration examples?

Let me know how far you want to take this.




# Work Done So far:
```
~/College/
├── backend/                  # Django project folder (settings.py, urls.py, etc.)
├── dms/                      # Django app folder
├── manage.py                 # Django project management script
├── requirements.txt
├── venv/                     # your virtual environment
├── README.md
├── department-management-system.zip
├── department-management-system
├── Coding.md
```


# Start Django
```bash
python manage.py runserver localhost:8000
```

# start React