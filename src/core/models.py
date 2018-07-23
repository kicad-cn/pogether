from django.db import models

# Create your models here.




class Document(models.Model):
    Name = models.CharField(max_length=128)
    Content = models.TextField()
    PoFile = models.FileField(upload_to='po/')
    
    


class POEntry(models.Model):
    Raw = models.TextField()
    Doc = models.ForeignKey(Document, on_delete=models.CASCADE)
    Translated = models.BooleanField()
