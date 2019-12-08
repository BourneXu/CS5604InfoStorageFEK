from __future__ import absolute_import
import unittest
from routes import dbconnect
import gc
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import app
from routes import login

class LoginTests(unittest.TestCase):
    '''
        Test login system (valid/invalid register, login, logout)
    '''
    ############################
    #### setup and teardown ####
    ############################

    # executed prior to each test
    def setUp(self):
        # c, conn = dbconnect.connection() # TODO: make database name a parameter
        # c = conn.cursor()
        # c.execute("TRUNCATE TABLE users")
        # conn.commit()
        # c.close()
        # conn.close()
        # gc.collect()

        app.app.testing = True
        self.app = app.app.test_client()

    # executed after each test
    def tearDown(self):
        pass

    ########################
    #### helper methods ####
    ########################
    def register(self, username, email, password, confirm):
        return self.app.post(
            '/register',
            data=dict(username=username, email=email, password=password, confirm=confirm),
            follow_redirects=True
        )

    def login(self, email, password):
        return self.app.post(
            '/loginprocess',
            data=dict(email=email, password=password),
            follow_redirects=True
        )

    def logout(self):
        return self.app.get(
            '/logout',
            follow_redirects=True
        )

    ###############
    #### tests ####
    ###############
    def test_valid_user_registration(self):
        response = self.register('test1', 'test1@gmail.com', 'test1', 'test1')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Thanks for registering!', response.data)

    def test_invalid_user_registration_taken_username(self):
        response = self.register('test1', 'test1@gmail.com', 'test1', 'test1')
        self.assertIn(b'Field must be equal to password.', response.data)


if __name__ == "__main__":
    unittest.main()