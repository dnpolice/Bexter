import requests
import os
from requests_toolbelt.multipart.encoder import MultipartEncoder

cover_photo_path = os.path.dirname(__file__)+ '/coverphoto/coverphoto.png'
voice_recording_path = os.path.dirname(__file__) + '/voicerecording/voicerecording.mp3'
story_photo_path = os.path.dirname(__file__) + '/storyphotos'

fields = []

# Add Story Photos
for file_name in sorted(os.listdir(story_photo_path)):
    if file_name.endswith('.jpg') or file_name.endswith('.jpeg') or file_name.endswith('.png'):
        fields.append(('storyPhotos', (file_name, open(os.path.join(story_photo_path, file_name), 'rb'), 'image/png')))

# Add Story Photo Times
storyPhotoTimes = ["1", "2"]
for t in storyPhotoTimes:
    fields.append(('storyPhotoTimes', t))

# Add Key Transcript Of Keywords
transcriptOfKeywords = ["Dog", "Cat"]
transcriptOfKeywordTimes = ["1", "2"]
for i in range(len(transcriptOfKeywords)):
    w = transcriptOfKeywords[i]
    t = transcriptOfKeywordTimes[i]
    fields.append(('transcriptOfKeywords', w))
    fields.append(('transcriptOfKeywordTimes', t))

# Add Key Learning Outcomes
keyLearningOutcomes = ["Dog", "Cat"]
for w in keyLearningOutcomes:
    fields.append(('keyLearningOutcomes', w))

single_data_fields = [
    ('title', 'Story 1'),
    ('author', 'author'),
    ('description', 'Dog meets cat'),
    ('isVisible', "true"),
    ('coverPhoto', (os.path.basename(cover_photo_path), open(cover_photo_path, 'rb'), 'image/png')),
    ('voiceRecording', (os.path.basename(voice_recording_path), open(voice_recording_path, 'rb'), 'audio/mpeg'))
]

fields += single_data_fields

mp_encoder = MultipartEncoder(fields=fields, encoding='utf-8')

# Send requests
url = 'http://localhost:5000/stories/create'
headers = {'Content-type': mp_encoder.content_type}
response = requests.post(url, headers=headers, data=mp_encoder)

print(response.status_code)
print(response.json())
