from django.urls import path
from . import views
from .views import stats_view # 👈 Import the stats_view function: see if you can remove this safley


urlpatterns = [
    path('batches/', views.BatchListCreateView.as_view()),
    path('students/', views.StudentListView.as_view()),
    path('batches/<int:batch_id>/add_students/', views.AddStudentsToBatch.as_view()),
    path('batches/<int:batch_id>/clear_students/', views.ClearStudentsFromBatch.as_view()),

    path('faculty/', views.FacultyListCreateView.as_view()),
    path('faculty/bulk_add/', views.AddFaculties.as_view(), name='bulk_add_faculty'),
    path('faculty/clear_all/', views.ClearFaculties.as_view(), name='clear_all_faculty'),

    path('subjects/', views.SubjectListView.as_view()),
    path('batches/<int:batch_id>/add_subjects/', views.AddSubjectsToBatch.as_view()),
    path('batches/<int:batch_id>/clear_subjects/', views.ClearSubjectsFromBatch.as_view()),

    path('allotments/', views.AllotmentListCreateView.as_view()),
    path('attendance/', views.SubmitAttendanceView.as_view()),
    path('stats/', stats_view),

]
