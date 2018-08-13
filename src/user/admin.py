from django.contrib import admin
from django.contrib.auth.models  import User
from user.models import kicadUser

# Register your models here.

admin.register(User)
admin.site.register(kicadUser)