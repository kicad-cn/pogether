from rest_framework.test import APITestCase, override_settings
import core.testUtils.mocking as moc


class testCoreAPI(APITestCase):
    @classmethod
    @override_settings(MEDIA_ROOT=moc.MEDIA_ROOT)
    def setUpClass(cls):
        moc.setUpDatebase()

    @classmethod
    def tearDownClass(cls):
        pass

    def testRetrive(self):
        """
        测试正常单条取回
        """
        url = '/api/entry/cvpcb/5'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.data

    def testRetriveMatchError(self):
        """
        测试文件名和翻译记录不匹配的情况
        """
        url = '/api/entry/asdvpcb/5'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)
        data = response.data
        self.assertEqual(data['error'], 'Doc name do not match entry')

    def testRetrivePkError(self):
        """
        测试pk不存在或错误的情况
        """
        url = '/api/entry/cvpcb/91283091'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        url = '/api/entry/cvpcb/foo'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def testUpdate(self):
        """
        测试更新操作
        """
        url = '/api/entry/cvpcb/5'
        response = self.client.get(url)
        payload = {
            'id': response.data['id'],
            'Translated': False,
            'Msgid': response.data['Msgid'],
            'Msgstr': 'PatchedStr',
        }
        response = self.client.patch(url, data=payload)
        self.assertEqual(response.status_code, 200)
        response = self.client.get(url)
        self.assertEqual(response.data.get('Msgstr'), 'PatchedStr')

    def testList(self):
        url = '/api/listentry/cvpcb'
        response = self.client.get(url)
        self.assertEqual(273,response.data['count'])

        
        
