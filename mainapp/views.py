from django.contrib.auth import get_user_model
from django.shortcuts import render,get_object_or_404
from .forms import UserCreationForm
from django.contrib.auth.forms import PasswordResetForm
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.mixins import CreateModelMixin,RetrieveModelMixin,UpdateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from .serializers import UserCreationSerializer,EmployeeSerializer,BranchSerializer,ProfitSerializer,ExpenceSerializer,UsersSerializer,BusinessSerializer,MessagesSerializer
from .models import Employee,Branch,Profit,Expence,Business,Messages


from rest_framework.decorators import action
from django.conf import settings
import datetime
from datetime import date, timedelta
from django.utils import timezone
from core.models import User

## pdf generator lib
from django.http import FileResponse
import io
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import letter
import re
# User creations View
class UserCreationsView(APIView):
    def post(self,request):# in post 
        form = UserCreationForm(request.data)   
        if form.is_valid(): 
            form.save()
            user =request.data['username']
            user = User.objects.get(username=user) 
            user.is_staff = True
            user.save()
            Business(manager=user).save()
            return Response(form.data,status=status.HTTP_201_CREATED)
        
        # check if user alrady there
        if User.objects.filter(username=request.data['username']):
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        # check if email in correct format
        if len(re.findall(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',request.data['email'])) < 1:
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        # other erros
        return Response(status=status.HTTP_400_BAD_REQUEST)
            



# Business View get business details and create a new business
class BusinessView(APIView):
    # get business deatils
    def get(self,requset):
        queryset = Business.objects.all()
        serializer = BusinessSerializer(queryset,many=True)  
        return Response(serializer.data,status=status.HTTP_200_OK)
    # create new business
    def post(self,request):
        name = request.data["name"]
        manager = request.data["manager"]
        ManagerObject = User.objects.get(username=manager)
        business = Business(manager=ManagerObject,name=name)
        business.save()
        return Response(BusinessSerializer(business).data,status=status.HTTP_201_CREATED)
    # return Response(status=status.HTTP_400_BAD_REQUEST)
        
# check user type if he is a staff or not 
class UserTypeView(APIView):
    # permission_classes = [IsAdminUser,IsAuthenticated]
    def get(self,request):
        # print(request.user)
        if request.user.is_staff: 
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST) 

# get all users 
class UsersView(APIView):
    def get(self,request):
        queryset = User.objects.all()
        serializer = UsersSerializer(queryset,many=True)
        return Response(serializer.data)

# User status view (activate and deactivate)
class UserStatusView(APIView):
    def post(self,request):
        user = User.objects.get(username=request.data['username'])
        if user.is_staff:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

        if user:
            if user.is_active:
                user.is_active = False
                user.save()
            else:
                user.is_active = True
                user.save()
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_200_OK)

# >>>>>>>>>>>>>>>>>>>> Emplyee view for geting one emplyee details for one 
class EmployeViewSet(CreateModelMixin,RetrieveModelMixin,UpdateModelMixin,GenericViewSet):
    queryset = Employee.objects.all()
    serializer_class= EmployeeSerializer
    # permission_classes = [IsAuthenticated]

    @action(detail=False,methods=['GET','PUT'])
    def me(self,request):
        (employee,created) = Employee.objects.get_or_create(user_id=request.user.id)
        if request.method == "GET":
            serializer= EmployeeSerializer(employee)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer= EmployeeSerializer(employee,data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

# >>>>>>>>>>>>>>>>>>>> Emplyee view for all emplyee
class EmployeesViewSet(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        manager = User.objects.get(username=request.user)
        business = Business.objects.get(manager=manager)
        queryset = Employee.objects.filter(business=business).exclude(user=request.user)
        serializer = EmployeeSerializer(queryset,many=True)
        for emp in serializer.data:
            user = User.objects.get(username=emp['user'])
            emp['status'] = "Active" if user.is_active else "Inactive"
        return Response(serializer.data) 
    
    def post(self,request):
        form = UserCreationForm(request.data)
        if form.is_valid():
            form.save()
            user =request.data['username']
            user = User.objects.get(username=request.user) 
            business = Business.objects.get(manager=user)
            branch = request.data["branch"]
            salary = request.data["salary"]
            user = request.data["username"]
            # business = request.data['business']
            BranchObject = Branch.objects.get(id=branch)
            UserObject = User.objects.filter(username=user)
            businessObj = Business.objects.get(id=business.id)
            employee = Employee(user=UserObject[0],branch=BranchObject,salary=salary,business=businessObj)
            queryset = Employee.objects.filter(user=UserObject[0],branch=BranchObject.id)
            if not queryset.exists():
                employee.save()
                return Response(status=status.HTTP_200_OK)
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        if User.objects.filter(username=request.data['username']):
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        if len(re.findall(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',request.data['email'])) < 1:
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        if len(User.objects.filter(email=request.data['email'])) > 0:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
               
        return Response(status=status.HTTP_400_BAD_REQUEST)
        
        # return Response(status=status.HTTP_400_BAD_REQUEST)



class BranchView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = User.objects.get(username=request.user)
        if not user.is_staff:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        business = Business.objects.get(manager=user)
        branches = Branch.objects.filter(business=business)
        branches = BranchSerializer(branches,many=True)
        data = {}
        current_month = timezone.now().month
        current_year = timezone.now().year
        for branch_num in range(len(branches.data)):

            #get month profits
            profits = Profit.objects.filter(branch=branches.data[branch_num]['id'],date_enterd__month=current_month)
            profit_serializer = ProfitSerializer(profits,many=True)
            month_branch_profit = 0
            for profit in profit_serializer.data:
                month_branch_profit += profit['amount']
            branches.data[branch_num]['month_profits'] = round(month_branch_profit,3)

            # get month expences
            expences = Expence.objects.filter(branch=branches.data[branch_num]['id'],date_enterd__month=current_month)
            expences_serializer = ExpenceSerializer(expences,many=True)
            month_branch_expences= 0
            for expence in expences_serializer.data:
                month_branch_expences += expence['amount']
            branches.data[branch_num]['month_expences'] = round(month_branch_expences,3)
            
            # get last month profits
            today = timezone.now()
            last_month = today - timedelta(days=30)
            last_month_number = last_month.month
            profits = Profit.objects.filter(branch=branches.data[branch_num]['id'],date_enterd__month=last_month_number)
            profit_serializer = ProfitSerializer(profits,many=True)
            last_month_branch_profit = 0
            for profit in profit_serializer.data:
                last_month_branch_profit += profit['amount']

            # get last month expences
            expences = Expence.objects.filter(branch=branches.data[branch_num]['id'],date_enterd__month=last_month_number)
            expences_serializer = ExpenceSerializer(expences,many=True)
            last_month_branch_expencess= 0
            for expence in expences_serializer.data:
                last_month_branch_expencess += expence['amount']
            # branches.data[branch_num]['last_month_branch_expencess'] = round(month_branch_expences,3)

            branches.data[branch_num]['last_month_profits'] = round((last_month_branch_profit-last_month_branch_expencess),3)
            # calcutale taxes
            tax_pct = business.tax_pct
            pure_less_expence = (month_branch_profit - month_branch_expences)
            tax =pure_less_expence *(tax_pct/100)
            branches.data[branch_num]['pure_profits'] = round((pure_less_expence - tax),3)


            # get year profits 
            year_profits = Profit.objects.filter(branch=branches.data[branch_num]['id'],date_enterd__year=current_year)
            year_profits = ProfitSerializer(year_profits,many=True)
            yearly_profits = 0
            for profit in year_profits.data:
                yearly_profits+=profit['amount']
            branches.data[branch_num]['year_profits'] = yearly_profits

            # add to a dictonary to return the get request
            data[branch_num+1] = branches.data[branch_num]
        return Response(data,status=status.HTTP_200_OK)
    
    def post(self,request):
            name = request.data['name']        
            place = request.data['place']        
            manager = request.user    
            manager = User.objects.get(username=manager)
            business = Business.objects.get(manager=manager)
            if Branch.objects.filter(name=name,business=business):
                return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
            
            branch = Branch(business=business,name=name,branch_place=place)
            branch.save()
            return Response(BranchSerializer(branch).data,status=status.HTTP_200_OK)
        # return Response(serializer.data,status=status.HTTP_400_BAD_REQUEST) 


class ProfitsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        business = get_object_or_404(Business,manager=request.user)
        branches = Branch.objects.filter(business=business)
        profits = Profit.objects.filter(branch__in=branches)
        return Response(ProfitSerializer(profits,many=True).data,status=status.HTTP_200_OK) 
        # return Response({business},status=status.HTTP_404_NOT_FOUND) 
        
        # profit = Profit.objects.filter(branch)
    def post(self,request):
        amount = request.data["amount"]
        UserObject = User.objects.get(username=request.user) 
        employee = Employee.objects.get(user=UserObject.id)
        branch = Branch.objects.get(id=employee.branch.id)
        profit = Profit(branch=branch,employee=employee,amount=amount)
        profit.save()
        return Response(ProfitSerializer(profit).data,status=status.HTTP_201_CREATED)
    
        
class ExpencesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        business = get_object_or_404(Business,manager=request.user) 
        branches = Branch.objects.filter(business=business)
        expence = Expence.objects.filter(branch__in=branches)
        return Response(ExpenceSerializer(expence,many=True).data,status=status.HTTP_200_OK) 
        # return Response({business},status=status.HTTP_404_NOT_FOUND) 
    def post(self,request):
        amount = request.data["amount"]
        UserObject = User.objects.get(username=request.user) 
        employee = Employee.objects.get(user=UserObject)
        branch = Branch.objects.get(id=employee.branch.id)
        expence = Expence(branch=branch,employee=employee,amount=amount)
        expence.save()
        return Response(ExpenceSerializer(expence).data,status=status.HTTP_201_CREATED)
    

# clac profits and expenses  for admin dahsboard business-insgit
class IncomeDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):

        # get user form request header
        user = User.objects.get(username=request.user)
        business = get_object_or_404(Business,manager=user)

        # cheack if there is a business linked to this user
        if not business:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        # get besiness Obj and all branches linked this business
        businesObj = Business.objects.get(manager = user)
        branches = Branch.objects.filter(business=business)
        branches_serializer = BranchSerializer(branches,many=True)

        # Get month profits
        current_month = timezone.now().month
        profits  = Profit.objects.filter(branch__in=branches,date_enterd__month=current_month)
        serializer = ProfitSerializer(profits,many=True)
        total_of_month = 0
        # highest_on_the_month_amount = 0 
        for prof in serializer.data:
            total_of_month += prof['amount']
                   
        # Get yearly income
        current_year = timezone.now().year
        profits  = Profit.objects.filter(branch__in=branches,date_enterd__year=current_year)
        serializer = ProfitSerializer(profits,many=True)
        total_of_year = 0        
        for prof in serializer.data: 
            total_of_year += prof['amount']

        data = {"total_of_month":total_of_month,"total_of_year":total_of_year}

     
        
        # get the highest income branches
        top_month_branch_amount = 0
        branch_of_the_year_amount = 0
        for branch in branches_serializer.data: 
            # get the highest income branches of the Month
            profits = Profit.objects.filter(branch=branch['id'],date_enterd__month=current_month)
            profits = ProfitSerializer(profits,many=True) 
            profits_yearly = Profit.objects.filter(branch=branch['id'],date_enterd__year=current_year)
            profits_yearly = ProfitSerializer(profits_yearly,many=True) 
            branch_total = 0
            for prof in profits.data:
                branch_total += prof['amount']
            if branch_total > top_month_branch_amount:
                top_month_branch_amount = branch_total
                data['top_of_the_month'] = branch
                data['top_of_the_month']['amount'] = branch_total 


            # get the highest income branches of the Year
            branch_total_year = 0
            for prof in profits_yearly.data:
                branch_total_year += prof['amount']
            if branch_total_year > branch_of_the_year_amount:
                branch_of_the_year_amount = branch_total_year
                data['top_of_the_year'] = branch
                data['top_of_the_year']['amount'] = branch_total 
            

        # calclute tax:
        tax_pct = businesObj.tax_pct
        data['tax_pct'] = tax_pct
        month_tax_amount = data["total_of_month"] * (tax_pct/100)
        data['total_of_month_tax'] = month_tax_amount

        month_tax_amount = data["total_of_year"] * (tax_pct/100)
        data['total_of_year_tax'] = month_tax_amount


        # get recent 5 income recored :
        recnet_profit = Profit.objects.filter(branch__in=branches)
        recnet_profit = ProfitSerializer(recnet_profit,many=True)
     
        if len(recnet_profit.data) > 5:
            data["recent_income"] = recnet_profit.data
        else:
            data["recent_income"] = recnet_profit.data





        # get month epences
        month_expence = Expence.objects.filter(branch__in=branches,date_enterd__month=current_month)
        month_expence = ExpenceSerializer(month_expence,many=True)
        month_expence_total = 0
        for expence in month_expence.data:
            month_expence_total += expence['amount']

        data["month_expences"] = month_expence_total 

        year_expence = Expence.objects.filter(branch__in=branches,date_enterd__year=current_year)
        year_expence = ExpenceSerializer(year_expence,many=True)
        year_expence_total = 0
        for expence in year_expence.data:
            year_expence_total += expence['amount']

        data["year_expences"] = year_expence_total 
 


        data['pure_month_profit'] = (data['total_of_month'] - data['month_expences']) - data['total_of_month_tax']
        data['pure_year_profit'] = (data['total_of_year'] - data["year_expences"]) - data["total_of_year_tax"]


        return Response(data,status=status.HTTP_200_OK)
               

# 
class MonthProfits(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        user = User.objects.get(username=request.user)
        business = get_object_or_404(Business,manager=user)
        if not business:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        # businesObj = Business.objects.get(manager = user)
        branches = Branch.objects.filter(business=business)
        # branches_serializer = BranchSerializer(branches,many=True)

        date = request.data["date"]
        year = date[:4]
        month = date[6:]
        profits  = Profit.objects.filter(branch__in=branches,date_enterd__month=month,date_enterd__year=year)
        a = []
        for prof in profits:
            a.append(prof.date_enterd.day)
        serializer = ProfitSerializer(profits,many=True)
        count = 0
        for prof in serializer.data:
            prof['date_enterd'] = a[count]
            count+=1
           
        if len(serializer.data)>0:
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
        
        








class Message(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = User.objects.get(username=request.user)
        messages = Messages.objects.filter(reciver=user)
        messages_serializer = MessagesSerializer(messages,many=True)
        msg = messages_serializer.data
        for i in messages:
            i.read_status = True
            i.save()
        print()
        return Response(msg,status=status.HTTP_200_OK)
    


    def post(self,request):
        sender = User.objects.get(username=request.user)
        # sender = sender_user
        reciver = request.data['reciver']
        content = request.data['content']
        # reciver = User.objects.get(username=reciver)
        reciver = get_object_or_404(User,username=reciver)
        # for i in range(1000):
        #     print(reciver)
        if reciver:
            msg = Messages(reciver=reciver,sender=sender,content=content)
            msg.save()
            return Response(MessagesSerializer(msg).data,status=status.HTTP_201_CREATED)  
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)  
            



class PasswordResetView(APIView):
    def post(self,request):
        form = PasswordResetForm(data=request.data)
        if form.is_valid():
            form.save(request=request)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)




class ReportView(APIView):
    
    def get(slef,request,branch):

        current_month = timezone.now().month
        current_year = timezone.now().year

      
        branchObj = Branch.objects.get(name=branch)
        profit = Profit.objects.filter(branch=branchObj,date_enterd__month=current_month)
        expense = Expence.objects.filter(branch=branchObj,date_enterd__month=current_month)
        employee = Employee.objects.filter(branch=branchObj)
        total_employee_salary = 0
        total_month_profits = 0
        total_month_expense = 0
        for prof in profit:
            total_month_profits+= prof.amount
        for expe in expense:
            total_month_expense+= expe.amount
        for emp in employee:
            total_employee_salary+= emp.salary
        total_month_expense += total_employee_salary
        pure_month_prfoits = total_month_profits - total_month_expense
        tax_pct = 5
        tax_amount = (pure_month_prfoits * (tax_pct/100))
        if tax_amount >0:
            pure_month_prfoits_after_tax = pure_month_prfoits - tax_amount
        else:
            pure_month_prfoits_after_tax = pure_month_prfoits 
            tax_amount = 0

        if pure_month_prfoits < total_month_expense:
            pure_month_prfoits=pure_month_prfoits_after_tax= 0
        buf = io.BytesIO()
  
        ### create canvas ###
        pdf = canvas.Canvas(buf, pagesize=letter, bottomup=0)
        
        ### create text object ###
        textob = pdf.beginText()
        textob.setTextOrigin(inch, inch)
        textob.setFont("Helvetica", 14)
 
       
        textob.textLine(f"Branch: {branch}".center(100," "))
        for i in range(10):
            textob.textLine(" ")
        textob.textLine(f"Total month profits                       : {round(total_month_profits,3)} OMR")
        textob.textLine(f"Total month expenses                  : {total_month_expense} OMR")
        textob.textLine(f"pure month profits before taxes   : {pure_month_prfoits} OMR")
        textob.textLine(f"tax amount                                   : {tax_amount} OMR")
        textob.textLine(f"tax precentage                             : {tax_pct}%")
        textob.textLine(f"pure month profits after taxes       : {pure_month_prfoits_after_tax}")

        ### writing data & finishing up ### 
        pdf.drawText(textob)
        # c.showPage()
        pdf.save() 
        buf.seek(0)
        
        return FileResponse(buf, as_attachment=True, filename=f"{branch}_report.pdf")




class Automated(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = User.objects.get(username=request.user)
        business = get_object_or_404(Business,manager=user)
        
        # username = "emp_100"
        # salary= 600
        # # form = UserCreationForm({
        # #     'username': username,
        # #     'email':f"{username}@gmail.com",
        # #     "password1":"Oman5005",
        # #     "password2":"Oman5005",
        # # })
        # # form.save()
        # user = User.objects.get(username=username)
        # branch = Branch.objects.get(id=1)
        # employe = Employee(business=business,user=user,branch=branch,salary=salary)
        # employe.save()
       
        # import random 
        # user = User.objects.get(username="emp_100")
        # emp = Employee.objects.get(user=user)
        # for i in range(31):
        #     day = i+1 
        #     date = f"2023-03-{day}T13:12:48.100758Z"
        #     amount = random.randrange(100,8050)   
        #     Profit(employee =emp,branch=emp.branch,date_enterd=date,amount=amount).save()
        
       
        return Response("done")
