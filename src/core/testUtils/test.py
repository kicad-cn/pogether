from django.test import TestCase, override_settings
from django.conf import settings
from core.models import Document, POEntry
from django.core.files import File
import polib
import pickle
import shutil
import tempfile
import codecs

# Create your tests here

MEDIA_ROOT = tempfile.mkdtemp()
samplePo = tempfile.NamedTemporaryFile()
with open("./core/testUtils/sample.po") as fp:
    samplePo.write(bytes(fp.read(), 'utf-8'))
    samplePo.seek(0)


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class testCore(TestCase):
    def setUp(self):
        FileObj = File(samplePo, name='Sample.po')
        docobj = Document(Name='Sample.po',
                          Content=samplePo.read(), PoFile=FileObj)
        docobj.save()
        PoFile: File = docobj.PoFile
        fileName = samplePo.name
        self.PoFile: polib.POFile = polib.pofile(fileName)
        for entry in self.PoFile:
            POEntry(Raw=pickle.dumps(entry),
            Doc=docobj,
            Translated = entry.translated()
            ).save()

    def testFileUpload(self):
        """
        测试文件是否上传到了指定位置
        """
        with open(settings.MEDIA_ROOT+'/po/Sample.po') as fp:
            self.assertEqual(fp.readable(), True)

    def testPoFileParse(self):
        """
        测试po文件解析
        """
        untranslated = POEntry.objects.filter(Translated=False).count()
        translated = POEntry.objects.filter(Translated=True).count()
        self.assertEqual(len(self.PoFile.translated_entries()),translated)
        self.assertEqual(len(self.PoFile.untranslated_entries()),untranslated)
        self.assertEqual(self.PoFile.percent_translated(),100-int(untranslated*100/translated))