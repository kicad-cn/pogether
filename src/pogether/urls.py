from django.urls import path
from pogether.views import TweakPOEntry,ListPOEntries,DocMeta,ListDocs

urlpatterns = [
    path('entry/<str:doc>/<int:pk>', TweakPOEntry.as_view()),
    path('listentry/<str:doc>',ListPOEntries.as_view()),
    path('listdocs/',ListDocs.as_view()),
    path('docMeta/<str:doc>',DocMeta)
]