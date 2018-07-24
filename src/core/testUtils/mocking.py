from core.models import Document,POEntry
import core.models as cm
import polib
import pickle
import tempfile
from django.core.files import File

MEDIA_ROOT = tempfile.mkdtemp()

def setUpDatebase():
    Document = cm.Document
    if Document.objects.all().count() == 0:
        samplePo = tempfile.NamedTemporaryFile()
        with open("./core/testUtils/sample.po") as fp:
            samplePo.write(bytes(fp.read(), 'utf-8'))
            samplePo.seek(0)
        FileObj = File(samplePo, name='cvpcb')
        docobj = Document(Name='cvpcb',
                            PoFile=FileObj)
        docobj.save()
        PoFile: File = docobj.PoFile
        fileName = samplePo.name
        PoFile: polib.POFile = polib.pofile(fileName)
        for entry in PoFile:
            POEntry(Raw=pickle.dumps(entry),
                    Doc=docobj,
                    Translated=entry.translated(),
                    Msgid=entry.msgid,
                    Msgstr=entry.msgstr
                    ).save()
        return PoFile
    else :
        Document  = Document.objects.all()[0]
        return polib.pofile(Document.PoFile.file.name)

        
        

    
