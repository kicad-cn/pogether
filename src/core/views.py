from django.shortcuts import render
from rest_framework.generics import ListAPIView,RetrieveUpdateDestroyAPIView
from core.ser import POEntrySerializers
from rest_framework.response import Response
from django.http.response import Http404
from django.shortcuts import get_object_or_404
from core.models import Document,POEntry
from rest_framework.pagination import LimitOffsetPagination



class customPagination(LimitOffsetPagination):
    default_limit=5
    max_limit=20
    limit_query_param='limit'
    offset_query_param = 'offset'





# Create your views here.

class ListPOEntries(ListAPIView):
    """
    列出当前的翻译记录
    """
    serializer_class = POEntrySerializers
    pagination_class = customPagination


    def get_queryset(self,*args,**kwargs):
        doc = self.kwargs.get('doc',None)
        #docobj = get_object_or_404(Document,Name__exact=doc)
        queryset =  POEntry.objects.filter(Doc__Name__exact=doc)
        return  queryset
    
        
        
        

class  TweakPOEntry(RetrieveUpdateDestroyAPIView):
    """
    对单条翻译记录的改与查
    """
    serializer_class =  POEntrySerializers
    
    def retrieve(self,*args,**kwargs):
        doc = kwargs['doc']
        pk = kwargs['pk']
        obj = get_object_or_404(POEntry,pk=pk)
        if obj.Doc.Name!=doc:
            return Response(data={'error':'Doc name do not match entry'},
                status=400)
        return Response(POEntrySerializers(obj).data)
        
        

    def partial_update(self,*args,**kwargs):
        doc = kwargs['doc']
        pk = kwargs['pk']
        obj = get_object_or_404(POEntry,pk=pk)
        if obj.Doc.Name!=doc:
            return Response(data={'error':'Doc name do not match entry'},
                status=400)
        ser = self.serializer_class(obj,data=self.request.data,partial=True)
        if ser.is_valid():
            ser.save()
            return Response(status=200)
        else:
            return Response(status=400)
    


    




    
    









