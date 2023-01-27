import requests
import os

url = 'http://localhost:5000/stories/favourites'
headers = {'Content-Type': 'application/json', 'x-auth-token': '5'}
response = requests.get(url, headers = headers)

data = response.json()

for i, story in enumerate(data):
    print(story.keys())
    print("Title:",  story["title"])
    print("Author", story["author"])
    print("Description", story["description"])
    print("Key Learning Outcomes", story["keyLearningOutcomes"])

    cover_photo_path = os.path.dirname(__file__) + "/coverphoto/coverphoto"  +str(i) + ".png"
    cover_photo_data = bytes(story["coverPhoto"]["Body"]["data"])
    with open(cover_photo_path, 'wb') as img:
        img.write(cover_photo_data)