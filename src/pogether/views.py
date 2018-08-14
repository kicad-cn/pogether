from django.shortcuts import render
from rest_framework.generics import ListAPIView,RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from django.http.response import Http404
from django.shortcuts import get_object_or_404
from pogether.models import Document,POEntry
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
from rest_framework import status
from pogether.ser import POEntrySerializers,DocMetaSerializers,DOcsSerializers

class customPagination(PageNumberPagination):
    page_size = 5 
    page_size_query_param = 'page_size'
    max_page_size = 1000





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
        queryset =  POEntry.objects.filter(Doc__Name__exact=doc).order_by('id')
        if self.request.query_params.get('untranslated','')=="true":
            queryset = queryset.filter(Translated=False)
        return  queryset
    
class  TweakPOEntry(RetrieveUpdateDestroyAPIView):
    """
    对单条翻译记录的改与查
    """
    serializer_class =  POEntrySerializers
    
    def get_queryset(self,*args,**kwargs):
        pk = kwargs['pk']
        obj = get_object_or_404(POEntry,pk=pk)
        return obj
    
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
    
@api_view(['Get'])
def DocMeta(request,*args,**kwargs):
    docName = kwargs.get('doc',None)
    docObj = get_object_or_404(Document,Name__exact=docName)
    queryset =  docObj.po_entries.all()
    req = {
        'TotalEntries': queryset.count(),
        'UntranslatedEntries': queryset.filter(Translated=False).count()
    }
    ser = DocMetaSerializers(data=req)
    if ser.is_valid():
        return Response(data=ser.data)
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ListDocs(ListAPIView):
    serializer_class = DOcsSerializers
    queryset = Document.objects.all()





    









