from django.conf import settings
from django.db import models
from django.contrib import admin
# Create your models here.
class Business(models.Model):
    manager = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    tax_pct = models.IntegerField(default=5)
    # name = models.CharField(max_length=255)



class Branch(models.Model):
    business = models.ForeignKey(Business, on_delete= models.CASCADE)
    name = models.CharField(max_length=255)
    branch_place = models.CharField(max_length=255)
    
    
    def __str__(self) -> str:
        return self.name
    class Meta:
        ordering = ('id',)


class Employee(models.Model):
    business = models.ForeignKey(Business, on_delete= models.CASCADE)
    branch = models.ForeignKey(Branch,on_delete=models.CASCADE,related_name='employees')
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    salary = models.IntegerField()
    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'

    @admin.display(ordering='user__first_name')
    def first_name(self):
        return self.user.first_name

    @admin.display(ordering='user__last_name')
    def last_name(self):
        return self.user.last_name

    class Meta:
        ordering = ['user__first_name', 'user__last_name']
        permissions = [
            ('view_history','Can view history')
        ]
    

class Profit(models.Model):
    branch = models.ForeignKey(Branch,on_delete=models.CASCADE,related_name='incomes')
    employee = models.ForeignKey(Employee,on_delete=models.CASCADE)
    date_enterd = models.DateTimeField(auto_now_add=True)
    # date_enterd = models.DateTimeField()
    amount = models.FloatField() 
    
    class Meta:
        ordering = ('-date_enterd',)
class Expence(models.Model):
    branch = models.ForeignKey(Branch,on_delete=models.CASCADE,related_name='draws')
    employee = models.ForeignKey(Employee,on_delete=models.CASCADE)
    date_enterd = models.DateTimeField(auto_now_add=True)
    amount = models.FloatField() 
    class Meta:
        ordering = ('-date_enterd',) 

class Messages(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="sender")
    reciver = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='reciver')
    time_created = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    read_status = models.BooleanField(default=False)

    class Meta:
        ordering = ('-time_created',)

