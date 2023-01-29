import requests
import os
import json

url = 'http://localhost:5000/stories/search'
headers = {'Content-type': 'application/json', 'charset': 'utf-8'}
keyLearningOutcomes = ["Dog", "Cat"]
data = json.dumps({"keyLearningOutcomes": keyLearningOutcomes})

response = requests.post(url, headers=headers, data=data)
data = response.json()

for i, story in enumerate(data):
    print("Title:",  story["title"])
    print("Author:", story["author"])
    print("Description:", story["description"])
    print("Key Learning Outcomes:", story["keyLearningOutcomes"])
    print("Cover Photo:", story["coverPhoto"])
    print("")