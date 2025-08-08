# Create your models here.
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
