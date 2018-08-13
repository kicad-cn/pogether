from rest_framework import viewsets, permissions, generics,status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from user.models import kicadUser
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login,logout
from django.shortcuts import get_object_or_404
from django.views import View
from django.utils import timezone
import base64
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5

from base64 import b64decode, b64encode


import datetime

from user.ser import CreateUserSerializer, UserSerializer, LoginUserSerializer


class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print(dict(request.data))
        duser = serializer.save()
        kuser = kicadUser(djangoUser=duser)
        kuser.save()

        return Response({
            "username": duser.username,
            "keytime": kuser.keyModifyTime,
        })


class getPublicKey(APIView):
    def get(self, request, *args, **kwargs):
        username = request.query_params.get('username')
        duser = get_object_or_404(User, username__exact=username)
        kuser = duser.kicaduser

        def verifykey(pri, pub):
            if len(pri) == 0:
                return False
            privKeyObj = RSA.importKey(pri)
            pubKeyObj = RSA.importKey(pub)
            msg = bytes("placeholde", 'utf-8')
            emsg = pubKeyObj.encrypt(msg, 'x')[0]
            dmsg = privKeyObj.decrypt(emsg)
            return msg == dmsg

        if (timezone.now()-kuser.keyModifyTime).seconds > 1200 or \
                (not verifykey(kuser.secretkey, kuser.publickey)):
            kuser.keyModifyTime = timezone.now()
            key = RSA.generate(1024)
            kuser.secretkey = key.exportKey('PEM').decode('utf-8')
            kuser.publickey = key.publickey().exportKey('PEM').decode('utf-8')
            kuser.save()

        return Response({
            "username": kuser.djangoUser.username,
            "timedelta": (timezone.now()-kuser.keyModifyTime).seconds,
            "publickey": kuser.publickey,
        })

class LoginAPI(APIView):
    def decrypt(self, privatekey, cipher):
        """
        privatekey:  满足PEM格式的RSA私钥
        cipher: 使用PKCS1_b1_5算法通过公钥加密后再经过base64编码后的 **字符串**(注意不是二进制数据)
        """
        cipher = base64.b64decode(cipher)
        privKeyObj = RSA.importKey(privatekey)
        decrypter = PKCS1_v1_5.new(privKeyObj)
        return decrypter.decrypt(cipher, "ERROR").decode('utf-8')

    def post(self, request, *args, **kwargs):
        username = request.data.get('username', '')
        cipher = request.data.get('cipher', '')
        duser = get_object_or_404(User, username__exact=username)
        password = self.decrypt(duser.kicaduser.secretkey, cipher)
        veruser = UserSerializer(data={
            "username": username,
            "password": password
        })

        if veruser.is_valid() != None:
            login(request,duser)
            return Response({
                'login': True,
            })
        else:
            return Response({
                'login': False
            })
        
class LogoutAPI(APIView):
    def post(self, request, *args, **kwargs):
        if request.user.is_active:
            logout(request)
            return Response({'success':True})
        else:
            return Response({'success':False},status=status.HTTP_400_BAD_REQUEST)




class UserAPI(generics.RetrieveAPIView):
    authentication_classes=(SessionAuthentication,)
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
