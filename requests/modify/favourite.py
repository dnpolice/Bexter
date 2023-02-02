import requests
import sys
sys.path.append('../')
import userAuth

login_response = userAuth.signin()
url = 'http://localhost:5000/stories/favourite'
headers = {'Content-Type': 'application/json'}
body = {
    'storyId': '1'
}

response = requests.post(url, json=body, headers=headers, cookies=login_response.cookies)
print('_____________________')
print(response.status_code)
print(response.json())