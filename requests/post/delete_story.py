import requests
import json

url = "http://localhost:5000/stories/delete"
body = {
    "storyId": "45"
}
headers = {'Content-type': 'application/json'}
response = requests.post(url, json=body, headers=headers)

print(print(response.status_code))
print(response.json())