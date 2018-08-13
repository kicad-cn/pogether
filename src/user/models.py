from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class kicadUser(models.Model):
    djangoUser = models.OneToOneField(User,on_delete=models.CASCADE)
    secretkey =  models.TextField(blank=True)
    publickey =  models.TextField(blank=True)
    keyModifyTime = models.DateTimeField(auto_now=True)
