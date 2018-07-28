from rest_framework import serializers 
from core.models import POEntry,Document

class POEntrySerializers(serializers.ModelSerializer):
    class Meta:
        model =  POEntry
        fields=('id','Translated','Msgid','Msgstr')
    
class DocMetaSerializers(serializers.Serializer):
    TotalEntries= serializers.IntegerField()
    UntranslatedEntries = serializers.IntegerField()
    
    
    

    

    

    