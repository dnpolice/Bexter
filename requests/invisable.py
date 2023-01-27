import requests

url = 'http://localhost:5000/stories/invisible'

headers = { 'Content-Type': 'application/json' }
body = {
    'storyId': 1
}

response = requests.post(url, json=body, headers=headers)

print(response.status_code)
print(response.json())