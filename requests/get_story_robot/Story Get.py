import requests
import os

url = 'http://localhost:5000/stories/robot/23'
response = requests.get(url)

data = response.json()

coverPhoto = data["coverPhoto"]
voiceRecording = data["voiceRecording"]
storyPhotos = data["storyPhotos"]
storyPhotoTimes = data["storyPhotoTimes"]
transcriptOfKeywords = data["transcriptOfKeywords"]
transcriptOfKeywordTimes = data["transcriptOfKeywordTimes"]

print(storyPhotoTimes)
print(transcriptOfKeywords)
print(transcriptOfKeywordTimes)

cover_photo_path = os.path.dirname(__file__) + "/coverphoto/coverphoto.png"
voice_recording_path = os.path.dirname(__file__) + "/voicerecording/voicerecording.mp3"
story_photo_dir = os.path.dirname(__file__) + "/storyphotos/"

cover_photo_data = bytes(coverPhoto["Body"]["data"])
with open(cover_photo_path, 'wb') as img:
    img.write(cover_photo_data)

voice_recording_data = bytes(voiceRecording["Body"]["data"])
with open(voice_recording_path, 'wb') as img:
    img.write(voice_recording_data)

for i in range(len(storyPhotos)):
    storyPhoto = storyPhotos[i]
    story_photo_data = bytes(storyPhoto["Body"]["data"])
    fileNum = str(i+1) if i+1 >= 10 else "0" + str(i+1)
    story_photo_path = story_photo_dir + fileNum + ".png"
    with open(story_photo_path, 'wb') as img:
        img.write(story_photo_data)