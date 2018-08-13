from rest_framework.test import APITestCase, override_settings
import user.testutil.mocking as moc
from django.contrib.auth.models import User
from user.models import kicadUser
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
import base64
import random


class testUserAPI(APITestCase):
    @classmethod
    def  setUpClass(cls):
        for i,j,k in moc.MockUser:
            duser = User(username=i,password=j,email=k)
            duser.save()
            kuser = kicadUser(djangoUser = duser )
            kuser.save()

    @classmethod
    def tearDownClass(cls):
        pass
    
    def generateLoginPair(self):
        """随机生成登陆用的Cipher/username数据对"""
        username,password,_ = random.choice(moc.MockUser)
        response = self.client.get('/user/publickey',data= { "username":username, })
        publickey = response.data.get('publickey','')
        key = RSA.importKey(publickey)
        cipher = PKCS1_v1_5.new(key)
        encrypted = cipher.encrypt(bytes(password,'utf-8'))
        encrypted = base64.b64encode(encrypted)
        return username,encrypted
        

    def testPublickey(self):
        url = '/user/publickey'
        username,_,_ = moc.MockUser[0]
        payload ={
            "username":username,
        }
        response = self.client.get(url,data=payload)
        self.assertTrue('BEGIN PUBLIC KEY' in response.data.get('publickey',''))
    
    def testLogin_Logout_Session(self):
        username,encrypted = self.generateLoginPair()
        payload={
            "username":username,
            "cipher": encrypted.decode('utf-8')
        }
        url = '/user/login'
        response  = self.client.post(url,data = payload)
        self.assertTrue(response.data.get('login',None))
        self.assertEqual(self.client.get('/user/status').status_code,200)  #Test Session

        url = '/user/logout'
        response= self.client.post(url)
        self.assertEqual(response.data.get('success'),True)
        self.assertEqual(self.client.get('/user/status').status_code,403)  #Test Session

    def testSessionWithoutLogin(self):
        response =  self.client.get('/user/status')
        self.assertEqual(response.status_code,403)
    
    

    