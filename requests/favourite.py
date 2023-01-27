import requests

url = 'http://localhost:5000/stories/favourite'
headers = {'Content-Type': 'application/json', 'x-auth-token': '8'}
body = {
    'storyId': '1'
}

response = requests.post(url, json=body, headers=headers)

print(response.status_code)
print(response.json())