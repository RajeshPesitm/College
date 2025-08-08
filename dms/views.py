# from django.shortcuts import render

# Create your views here.
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
