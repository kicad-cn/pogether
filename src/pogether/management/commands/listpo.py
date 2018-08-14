from django.core.management.base import BaseCommand, CommandError
from pogether.models import Document, POEntry
from django.core.files import File
from django.db import transaction
import os
import logging
import polib
import pickle
import sys
import json
from prettytable import PrettyTable

class Command(BaseCommand):
    help = '向数据库内添加po文件'

    def add_arguments(self, parser):
        parser.add_argument('-s', '--search', type=str, help='声明一个文档名称', required=False)

    def listQuery(self,query):
        x=PrettyTable()
        x.field_names=['文档名','语言']
        for  doc in query:
            meta = json.loads(doc.metaInfo)
            x.add_row([doc.Name,
            meta.get('Language',''),
            ])
        return x

    def handle(self, *args, **opt):
        if opt.get('search') is None:
            query = Document.objects.all()
        else:
            query=Document.objects.filter(Name__contains='%s'%opt['search'] )
        print(self.listQuery(query))

        


        


        
