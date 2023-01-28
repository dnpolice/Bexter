import requests
import os
import json

url = 'http://localhost:5000/stories/all'
headers = {'Content-type': 'application/json'}

response = requests.get(url, headers=headers)
data = response.json()

for i, story in enumerate(data):
    print("Title:",  story["title"])
    print("Author:", story["author"])
    print("Description:", story["description"])
    print("Key Learning Outcomes:", story["keyLearningOutcomes"])

    cover_photo_path = os.path.dirname(__file__) + "/coverphoto/coverphoto"  + str(i) + ".png"
    cover_photo_data = bytes(story["coverPhoto"]["Body"]["data"])
    with open(cover_photo_path, 'wb') as img:
        img.write(cover_photo_data)