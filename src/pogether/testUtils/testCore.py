from django.test import TestCase, override_settings
from django.conf import settings
from pogether.models import Document, POEntry
import polib
import pickle
import shutil
import tempfile
import codecs
import random
import pogether.testUtils.mocking as moc

# Create your tests here


class testCore(TestCase):
    @classmethod
    @override_settings(MEDIA_ROOT=moc.MEDIA_ROOT)
    def setUpClass(cls):
        cls.PoFile = moc.setUpDatebase()
    
    @classmethod
    def tearDownClass(cls):
        pass

    @override_settings(MEDIA_ROOT=moc.MEDIA_ROOT)
    def testFileUpload(self):
        """
        测试文件是否上传到了指定位置
        """
        with open(settings.MEDIA_ROOT+'/po/cvpcb') as fp:
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

    

    
