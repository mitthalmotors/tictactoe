
import sqlite3
import random
from flask import Flask, jsonify, send_from_directory

app = Flask(__name__)

DATABASE_NAME = 'words.db'

def get_db():
    conn = sqlite3.connect(DATABASE_NAME)
    return conn

def create_tables():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT NOT NULL UNIQUE
        )
    """)
    conn.commit()
    conn.close()

def seed_data():
    words_to_seed = [
        "python", "javascript", "flask", "developer", "computer",
        "programming", "database", "application", "software", "internet"
    ]
    conn = get_db()
    cursor = conn.cursor()
    cursor.executemany("INSERT OR IGNORE INTO words (word) VALUES (?)", [(w,) for w in words_to_seed])
    conn.commit()
    conn.close()

def scramble_word(word):
    word_len = len(word)
    scrambled_word = list(word)
    blanks = random.sample(range(word_len), k=max(1, word_len // 2))
    for index in blanks:
        scrambled_word[index] = '_'
    return "".join(scrambled_word)

@app.route('/api/word')
def get_word():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT word FROM words ORDER BY RANDOM() LIMIT 1")
    word_row = cursor.fetchone()
    conn.close()
    if word_row:
        word = word_row[0]
        scrambled = scramble_word(word)
        return jsonify({"word": word, "scrambled": scrambled})
    return jsonify({"error": "No words found"}), 404

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    create_tables()
    seed_data()
    app.run(host='0.0.0.0', port=3000, debug=True)
