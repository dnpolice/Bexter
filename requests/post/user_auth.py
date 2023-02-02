import requests

headers = {'Content-Type': 'application/json'}
def register():
  url = 'http://localhost:5000/users'
  body = {
    "name" : "somename",
    "email":"someemail@email.com", 
    "password": "somepassd", 
    "robotSerialNumber":33
  }

  response = requests.post(url, json=body, headers=headers)

  print('signup status: ',response.status_code)
  if response.status_code != 200:
    print(response.content)
  return response

def signin():
  register()
  url = 'http://localhost:5000/auth/login'
  headers = {'Content-Type': 'application/json'}
  body = {
    "email":"someemail@email.com", 
    "password": "somepassd"
  }
  response = requests.post(url, json=body, headers=headers)

  print('signin status: ', response.status_code)
  if response.status_code != 200:
    print(response.json())
  return response

signin()

