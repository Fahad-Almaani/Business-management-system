from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm as DjUserCreationForm 

User = get_user_model()

class UserCreationForm(DjUserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2','first_name',"last_name")
 