import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import random
from nltk import NaiveBayesClassifier
from nltk.classify import accuracy
from flask import Flask, request, jsonify
from flask_cors import CORS

training_data = [
    ("There is severe water logging in my area and children can't go to school", "High"),
    ("Garbage has not been collected for two days", "Medium"),
    ("Street lights are not working in the evening", "Medium"),
    ("Please fix the potholes on the road", "Low"),
    ("My electricity has been gone for 24 hours", "High"),
    ("The park is dirty", "Low"),
    ("Sewage is overflowing in our street", "High"),
    ("The community hall fan is not working", "Low"),
    ("Garbage has not been collected in our street for over a week. The area smells and is attracting stray animals.", "High"),
    ("The street lights on our road have been out for 10 days, causing safety concerns for pedestrians at night.", "Medium"),
    ("Open manhole in our locality poses a danger to residents and needs urgent fixing.", "High"),
    ("Water supply is inconsistent for the past two weeks in our area.", "Medium"),
    ("There are frequent power cuts in our area without any prior notice.", "Low"),
    ("Street lights not working in my area.", "Medium"),
    ("Garbage not collected for 3 days.", "High"),
    ("Water supply is irregular in mornings.", "Medium"),
    ("Sewage water overflowing on the road.", "High"),
    ("Potholes on the main road causing traffic.", "Medium"),
    ("No public toilets in the locality.", "Low"),
    ("Illegal construction near my residence.", "High"),
    ("Broken manhole posing danger.", "High"),
    ("Street vendors blocking pedestrian path.", "Medium"),
    ("Drainage cleaning not done before monsoon.", "High"),
    ("Tree branches touching electric wires.", "Medium"),
    ("Broken traffic signal at busy junction.", "High"),
    ("Public park lights are off in evening.", "Low"),
    ("Road divider missing reflectors.", "Medium"),
    ("Mosquito breeding due to stagnant water.", "Medium"),
    ("Unauthorized posters and banners on walls.", "Low"),
    ("Water leakage from main supply line.", "High"),
    ("Overhead wires hanging dangerously.", "High"),
    ("Public library remains closed during working hours.", "Low"),
    ("Noisy generator running late night in residential area.", "Medium")
]


nltk.download('punkt')
nltk.download('wordnet')

app = Flask(__name__)
CORS(app)  

nltk.download('punkt')
nltk.download('stopwords')

stop_words = set(stopwords.words("english"))

def extract_features(text):
    words = word_tokenize(text.lower())
    filtered_words = [w for w in words if w.isalpha() and w not in stop_words]
    return {word: True for word in filtered_words}

# Apply feature extraction
featuresets = [(extract_features(text), label) for (text, label) in training_data]
random.shuffle(featuresets)

train_set = featuresets

classifier = NaiveBayesClassifier.train(train_set)
print("Training complete.")
classifier.show_most_informative_features()
def classify_priority(grievance_text):
    features = extract_features(grievance_text)
    return classifier.classify(features)
@app.route('/classify-priority', methods=['POST'])
def classify():
    data = request.get_json()
    text = data.get("text") or data.get("message")
    print("recieved Data")
    print(f"Classifying text: {text}")
    priority = classify_priority(text)
    print(f"Predicted priority: {priority}")
    return jsonify({"priority": priority})

if __name__ == "__main__":
    app.run(port=5002, debug=True)