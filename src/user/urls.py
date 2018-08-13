from django.urls import path, include
import user.api as api

urlpatterns = [
    path('register', api.RegistrationAPI.as_view()),
    path('login', api.LoginAPI.as_view()),
    path("logout", api.LogoutAPI.as_view()),
    path("status", api.UserAPI.as_view()),
    path("publickey", api.getPublicKey.as_view()),
]
