
from django.urls import path,include
from . import views
from rest_framework import routers
router = routers.DefaultRouter()
router.register(r'employee', views.EmployeViewSet) 
# router.register(r'create-branch', views.CreateBranchViewSet.as_view()) 
urlpatterns = [
    path("new-user",views.UserCreationsView.as_view()),
    path("business",views.BusinessView.as_view()),
    path("user-type",views.UserTypeView.as_view()),
    path("users-list",views.UsersView.as_view()),
    path("user-status-edit",views.UserStatusView.as_view()),   
    path('branch',views.BranchView.as_view()),  
    # path('create-branch',views.CreateBranchViewSet.as_view()), 
    path("employees",views.EmployeesViewSet.as_view()),  
    path("profits/",views.ProfitsView.as_view()),  
    path("expences/",views.ExpencesView.as_view()),  
    path("bsuiness-insight",views.IncomeDetails.as_view()),  
    path("month-profits",views.MonthProfits.as_view()),  
    path("message",views.Message.as_view()),  
    path("auto/",views.Automated.as_view()),  
    path("pass/",views.PasswordResetView.as_view()),  
    path("report/<str:branch>",views.ReportView.as_view()),  
    
]  
urlpatterns += router.urls    