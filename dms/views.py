# from django.shortcuts import render

# Create your views here.
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.decorators import api_view
import csv
from io import StringIO


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

# dms/views.py

class AddFaculties(APIView):
    def post(self, request):
        # Get the data from the request (it could be a CSV or JSON, depending on how you want to handle it)
        data = request.data  # Expecting JSON body containing multiple faculty items
        
        faculties = []
        for item in data:
            name = item.get('name')
            id = item.get('id')
            
            if name and id:
                faculties.append(Faculty(id=id, name=name))
        
        # Bulk create all faculties in one query
        Faculty.objects.bulk_create(faculties)

        return Response({"message": f"{len(faculties)} faculties added successfully."}, status=status.HTTP_201_CREATED)

class ClearFaculties(APIView):
    def delete(self, request):
        Faculty.objects.all().delete()  # This will delete all faculties, similar to the student deletion approach.
        return Response({"message": "All faculties have been deleted."}, status=status.HTTP_204_NO_CONTENT)

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

@api_view(['GET'])
def stats_view(request):
    data = {
        'students': Student.objects.count(),
        'faculty': Faculty.objects.count(),
        'subjects': Subject.objects.count(),
        'batches': Batch.objects.count(),
    }
    return Response(data)
