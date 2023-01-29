import requests

url = 'http://localhost:5000/stories/all'
headers = {'Content-type': 'application/json'}

response = requests.get(url, headers=headers)
data = response.json()

for i, story in enumerate(data):
    print("Title:",  story["title"])
    print("Author:", story["author"])
    print("Description:", story["description"])
    print("Key Learning Outcomes:", story["keyLearningOutcomes"])
    print("Cover Photo:", story["coverPhoto"])
    print("")