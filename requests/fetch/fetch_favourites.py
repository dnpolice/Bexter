import requests
import os
import sys
sys.path.append('../')
import user_auth

login_response = user_auth.signin()
url = 'http://localhost:5000/stories/favourites'
headers = {'Content-Type': 'application/json'}
response = requests.get(url, headers = headers, cookies=login_response.cookies)
data = response.json()

if response.status_code == 200:
    for i, story in enumerate(data):
        print("Title:",  story["title"])
        print("Author", story["author"])
        print("Description", story["description"])
        print("Key Learning Outcomes", story["keyLearningOutcomes"])
        print("Cover Photo:", story["coverPhoto"])
        print("")
else:
    print(data)