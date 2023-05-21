from django.urls import path
from .views import index
urlpatterns = [
   
    path('', index),
    path('dashboard', index),
    path('signup', index),
    path('new-business', index),
    path('branch/<str:name>', index),
    path('branches', index),
    path('login/', index),
    
    path('income/',index),
    path('income-entry/',index),
    path('add-income/',index),
    path('employees',index),
    # path('expences/',index),
    path('expences-entry/',index),
    path('charts/',index),
    path('sms/',index),
    path('sms-manager',index),
  
] 