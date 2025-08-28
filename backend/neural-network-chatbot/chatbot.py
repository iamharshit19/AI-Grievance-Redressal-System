
import random
import json
import numpy as np
import pickle

from flask import Flask, request, jsonify
from flask_cors import CORS

import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model

nltk.download('punkt')
nltk.download('wordnet')

app = Flask(__name__)
CORS(app) 

lemmatizer = WordNetLemmatizer()
intents = json.loads(open('intents.json').read())

words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))
model = load_model('chatbot_model.h5')

def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]], 'probability': str(r[1])})
    return return_list

def get_response(intents_list, intents_json):
    if not intents_list:
        return "I'm not sure I understand. Could you please rephrase your issue?"
    tag = intents_list[0]['intent']
    for i in intents_json['intents']:
        if i['tags'] == tag:
            return random.choice(i['responses'])
    return "Sorry, I couldn't find a suitable response."

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    intents_list = predict_class(message)
    reply = get_response(intents_list, intents)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
