from django.test import TestCase, override_settings
from django.conf import settings
from core.models import Document, POEntry
from django.core.files import File
import polib
import pickle
import shutil
import tempfile
import codecs
import random

# Create your tests here

MEDIA_ROOT = tempfile.mkdtemp()
samplePo = tempfile.NamedTemporaryFile()
with open("./core/testUtils/sample.po") as fp:
    samplePo.write(bytes(fp.read(), 'utf-8'))
    samplePo.seek(0)

print("m:",MEDIA_ROOT)

class testCore(TestCase):
    @classmethod
    @override_settings(MEDIA_ROOT=MEDIA_ROOT)
    def setUpClass(cls):
        FileObj = File(samplePo, name='Sample.po')
        docobj = Document(Name='Sample.po',
                          PoFile=FileObj)
        docobj.save()
        PoFile: File = docobj.PoFile
        fileName = samplePo.name
        cls.PoFile: polib.POFile = polib.pofile(fileName)
        for entry in cls.PoFile:
            POEntry(Raw=pickle.dumps(entry),
                    Doc=docobj,
                    Translated=entry.translated(),
                    Msgid=entry.msgid,
                    Msgstr=entry.msgstr
                    ).save()
    
    @classmethod
    def tearDownClass(cls):
        pass

    @override_settings(MEDIA_ROOT=MEDIA_ROOT)
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
        self.assertEqual(len(self.PoFile.translated_entries()), translated)
        self.assertEqual(len(self.PoFile.untranslated_entries()), untranslated)
        self.assertEqual(self.PoFile.percent_translated(),
                         100-int(untranslated*100/translated))

    def testMsg(self):
        """
        测试原文本的读取
        """
        index = random.randint(0, 100)
        randomMsgid = self.PoFile[index].msgid
        self.assertEqual(
            len(POEntry.objects.filter(Msgid__exact=randomMsgid)), 1)
    

    
