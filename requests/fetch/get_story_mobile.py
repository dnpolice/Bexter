import requests
import os

url = 'http://18.188.11.133:5000/stories/mobile/2'
response = requests.get(url)

data = response.json()

print("Title:",  data["title"])
print("Author:", data["author"])
print("Description:", data["description"])
print("Key Learning Outcomes:", data["keyLearningOutcomes"])
print("Cover Photo:", data["coverPhoto"])