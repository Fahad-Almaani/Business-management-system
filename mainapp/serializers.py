from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer,UserCreateSerializer as BaseUserCreateSerializer

from .models import Employee,Branch,Profit,Expence,Business,Messages
from core.models import User

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields= "__all__"


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','first_name','last_name','email']

class UserCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username",'first_name',"last_name","email","password"]

class UserCreationSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id','username','email','password','first_name','last_name']
        

class EmployeeSerializer(serializers.ModelSerializer):
    # user_id = serializers.IntegerField(read_only=True) 
    user = serializers.CharField(source='user.username')
    branch = serializers.CharField(source="branch.name")
    class Meta:
        model = Employee
        fields = "__all__"

class BranchSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Branch 
        fields = "__all__"

class ProfitSerializer(serializers.ModelSerializer):
    branch = serializers.CharField(source='branch.name')
    employee = serializers.CharField(source='employee.user.first_name')
    class Meta:
        model= Profit
        fields = "__all__"

class ExpenceSerializer(serializers.ModelSerializer):
    branch = serializers.CharField(source='branch.name')
    employee = serializers.CharField(source='employee.user.first_name')
    class Meta:
        model = Expence
        fields = "__all__"        

class MessagesSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source='sender.username')
    class Meta:
        model = Messages
        fields = "__all__"



