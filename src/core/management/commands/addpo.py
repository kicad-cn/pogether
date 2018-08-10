from django.core.management.base import BaseCommand, CommandError
from core.models import Document, POEntry
from django.core.files import File
from django.db import transaction
import os
import json
import logging
import polib
import pickle
import sys

class Command(BaseCommand):
    help = '向数据库内添加po文件'

    def add_arguments(self, parser):
        parser.add_argument('-i', '--file', type=str, help='声明要添加的po文件', required=True)
        parser.add_argument('-u', '--update', action='store_true',
                                help='是否执行更新操作', dest='isUpdate')
        parser.add_argument('--poName',  type=str,
                        help='手动设定po文档名称', dest='poName')#default None

    def handle(self, *args, **opt):
        if opt['verbosity']==0:
            logging.basicConfig(level=logging.CRITICAL)
        elif  opt['verbosity']==1:
            logging.basicConfig(level=logging.ERROR)
        elif  opt['verbosity']==2:
            logging.basicConfig(level=logging.INFO)
        elif  opt['verbosity']==3:
            logging.basicConfig(level=logging.DEBUG)
        if opt['poName'] == None:
            BaseName = os.path.splitext(os.path.basename(opt['file']))[0]
        else:
            BaseName = opt['poName']
        PoFile = polib.pofile(opt['file'])
        docObj = None
        if Document.objects.filter(Name__exact=BaseName).count() > 0: # Check whether this doc has been inserted or not
            docObj = Document.objects.get(Name__exact=BaseName)
            if not opt['isUpdate']:
                logging.critical("PO文件已存在，跳过添加")
                sys.exit(0)
            
        FileObj = File(open(opt['file'], 'r'), name=BaseName)
        if docObj == None: # Construct a new doc obj
            docObj = Document()

        docObj.Name = BaseName
        docObj.metaInfo = json.dumps(PoFile.metadata)
        docObj.PoFile = FileObj
        docObj.save() # Update or Insert 

        if opt['isUpdate']:
            queryset = POEntry.objects.filter(Doc__Name__exact=docObj.Name)
            logging.info("删除原有条目(total:%d)"%(len(queryset)))
            queryset.delete()

        total = len(PoFile)
        idx = 0
        with transaction.atomic():
            for entry in PoFile:
                idx += 1
                logging.debug("添加翻译条目(%d/%d)" % (idx, total))
                POEntry(Raw=pickle.dumps(entry),
                        Doc=docObj,
                        Translated=entry.translated(),
                        Msgid=entry.msgid,
                        Msgstr=entry.msgstr
                        ).save()


