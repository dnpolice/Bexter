import requests
import os

url = 'http://localhost:5000/stories/mobile/23'
response = requests.get(url)

data = response.json()

print("Title:",  data["title"])
print("Author", data["author"])
print("Description", data["description"])
print("Key Learning Outcomes", data["keyLearningOutcomes"])

cover_photo_path = os.path.dirname(__file__) + "/coverphoto/coverphoto.png"
cover_photo_data = bytes(data["coverPhoto"]["Body"]["data"])
with open(cover_photo_path, 'wb') as img:
    img.write(cover_photo_data)