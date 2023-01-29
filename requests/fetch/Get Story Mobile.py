import requests
import os

url = 'http://localhost:5000/stories/mobile/34'
response = requests.get(url)

data = response.json()

print("Title:",  data["title"])
print("Author:", data["author"])
print("Description:", data["description"])
print("Key Learning Outcomes:", data["keyLearningOutcomes"])
print("Cover Photo:", data["coverPhoto"])