#!/usr/bin/python3
import polib
import argparse
import logging
import pickle

logging.basicConfig(level=logging.DEBUG)

parser = argparse.ArgumentParser(description="将PO文件导入数据库")
parser.add_argument('-i', '--file', type=str, help='声明要添加的po文件', required=True)

parser.add_argument('-r', '--django-root', type=str,
                    help='django根目录', required=True, dest='root')

parser.add_argument('-u', '--update', action='store_true',
                    help='是否执行更新操作', dest='isUpdate')

parser.add_argument('--poName',  type=str,
                    help='手动设定po文档名称', dest='poName')


args = parser.parse_args()

import sys
import os
import django
sys.path.append(args.root)  # here store is root folder(means parent).
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pogether.settings")
django.setup()

from core.models import Document, POEntry
from django.core.files import File
from django.db import transaction



if args.poName == None:
    BaseName = os.path.splitext(os.path.basename(args.file))[0]
else:
    BaseName = args.poName





PoFile: polib.POFile = polib.pofile(args.file)

if __name__ == "__main__":
    sameNameDocNumber = Document.objects.filter(Name__exact=BaseName).count()
    docObj = None
    if sameNameDocNumber > 0:
        docObj = Document.objects.get(Name__exact=BaseName)
        if not args.isUpdate:
            logging.warning("PO文件已存在，跳过添加")
            sys.exit(0)

    FileObj = File(open(args.file, 'r'), name=BaseName)

    if docObj == None:  # This is a new doc
        docObj = Document()

    docObj.Name = BaseName
    docObj.PoFile = FileObj
    docObj.save() # Update or Insert 

    if args.isUpdate: 
        queryset = POEntry.objects.filter(Doc__Name__exact=docObj.Name)
        logging.info("cleaning the old entry (total:%d)"%(len(queryset)))
        queryset.delete()

    total = len(PoFile)
    idx = 0

    with transaction.atomic():
        for entry in PoFile:
            idx += 1
            logging.debug("loading po entry(%d/%d)" % (idx, total))
            POEntry(Raw=pickle.dumps(entry),
                    Doc=docObj,
                    Translated=entry.translated(),
                    Msgid=entry.msgid,
                    Msgstr=entry.msgstr
                    ).save()
