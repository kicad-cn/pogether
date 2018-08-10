from django.core.management.base import basecommand, commanderror
from core.models import document, poentry
from django.core.files import file
from django.db import transaction
import os
import logging
import polib
import pickle
import sys

class command(basecommand):
    help = '向数据库内添加po文件'

    def add_arguments(self, parser):
        pass
        # parser.add_argument('-i', '--file', type=str, help='声明要添加的po文件', required=true)
        # parser.add_argument('-u', '--update', action='store_true',
        #                         help='是否执行更新操作', dest='isupdate')
        # parser.add_argument('--poname',  type=str,
        #                 help='手动设定po文档名称', dest='poname')#default none
    def switch_verbosity(self,opt):
        if opt['verbosity']==0:
            logging.basicconfig(level=logging.critical)
        elif  opt['verbosity']==1:
            logging.basicconfig(level=logging.error)
        elif  opt['verbosity']==2:
            logging.basicconfig(level=logging.info)
        elif  opt['verbosity']==3:
            logging.basicconfig(level=logging.debug)


    def handle(self, *args, **opt):
        self.switch_verbosity(opt)
        if opt['poname'] == none:
            basename = os.path.splitext(os.path.basename(opt['file']))[0]
        else:
            basename = opt['poname']


        
            
        



            


