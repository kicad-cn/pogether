from django.urls import path
from core.views import TweakPOEntry,ListPOEntries

urlpatterns = [
    path('entry/<str:doc>/<int:pk>', TweakPOEntry.as_view()),
    path('listentry/<str:doc>',ListPOEntries.as_view())
]