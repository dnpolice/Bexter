import requests

url = 'http://localhost:5000/stories/favourite'
headers = {'Content-Type': 'application/json', 'x-auth-token': '5'}
body = {
    'storyId': '2'
}

response = requests.post(url, json=body, headers=headers)

print(response.status_code)
print(response.json())