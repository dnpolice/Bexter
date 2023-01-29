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
    print("Cover Photo:", story["coverPhoto"])
    print("")