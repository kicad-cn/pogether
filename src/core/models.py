from django.db import models

# Create your models here.


class Document(models.Model):
    Name = models.CharField(unique=True,max_length=128)
    PoFile = models.FileField(upload_to='po/')

    def __str__(self):
        return self.Name



class POEntry(models.Model):
    Raw = models.TextField()
    Doc = models.ForeignKey(Document, on_delete=models.CASCADE,related_name="po_entries")
    Translated = models.BooleanField()
    Msgid = models.TextField()
    Msgstr = models.TextField(blank=True)

    def __str__(self):
        brief = self.Msgid[0:20] if len(self.Msgid)>20 else self.Msgid
        return "%s:%s"%(self.Doc.Name,brief)
