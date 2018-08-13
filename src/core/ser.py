from rest_framework import serializers
from core.models import POEntry, Document


class POEntrySerializers(serializers.ModelSerializer):
    class Meta:
        model = POEntry
        fields = ('id', 'Translated', 'Msgid', 'Msgstr')


class DocMetaSerializers(serializers.Serializer):
    TotalEntries = serializers.IntegerField()
    UntranslatedEntries = serializers.IntegerField()


class DOcsSerializers(serializers.ModelSerializer):
    """
    TODO:新加入的extra field没有写测试
    """
    TotalEntries = serializers.SerializerMethodField()
    UntranslatedEntries = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = ('id', 'Name', 'TotalEntries', 'UntranslatedEntries')

    def get_TotalEntries(self, obj):
        return obj.po_entries.all().count()

    def get_UntranslatedEntries(self, obj):
        return obj.po_entries.all().filter(Translated=False).count()
