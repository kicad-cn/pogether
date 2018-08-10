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

class command(BaseCommand):
    help = '向数据库内添加po文件'

    def add_arguments(self, parser):
        parser.add_argument('-i', '--file', type=str, help='声明要添加的po文件', required=true)
        parser.add_argument('-u', '--update', action='store_true',
                                help='是否执行更新操作', dest='isupdate')
        parser.add_argument('--poname',  type=str,
                        help='手动设定po文档名称', dest='poname')#default none

    def handle(self, *args, **opt):
        if opt['verbosity']==0:
            logging.basicconfig(level=logging.critical)
        elif  opt['verbosity']==1:
            logging.basicconfig(level=logging.error)
        elif  opt['verbosity']==2:
            logging.basicconfig(level=logging.info)
        elif  opt['verbosity']==3:
            logging.basicconfig(level=logging.debug)
        if opt['poname'] == none:
            basename = os.path.splitext(os.path.basename(opt['file']))[0]
        else:
            basename = opt['poname']
        pofile = polib.pofile(opt['file'])
        docobj = none
        if document.objects.filter(name__exact=basename).count() > 0: # check whether this doc has been inserted or not
            docobj = document.objects.get(name__exact=basename)
            if not opt['isupdate']:
                logging.warning("po文件已存在，跳过添加")
                sys.exit(0)
            
        fileobj = file(open(opt['file'], 'r'), name=basename)
        if docobj == none: # construct a new doc obj
            docobj = document()

        docobj.name = basename
        docobj.pofile = fileobj
        docobj.metaInfo = json.dumps(pofile.metadata)
        docobj.save() # update or insert 

        if opt['isupdate']:
            queryset = poentry.objects.filter(doc__name__exact=docobj.name)
            logging.info("删除原有条目(total:%d)"%(len(queryset)))
            queryset.delete()

        total = len(pofile)
        idx = 0
        with transaction.atomic():
            for entry in pofile:
                idx += 1
                logging.debug("添加翻译条目(%d/%d)" % (idx, total))
                poentry(raw=pickle.dumps(entry),
                        doc=docobj,
                        translated=entry.translated(),
                        msgid=entry.msgid,
                        msgstr=entry.msgstr
                        ).save()


