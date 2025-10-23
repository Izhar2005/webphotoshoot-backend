from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app, origins=["*"])  # Izinin semua buat test

@app.route('/submit-booking', methods=['POST', 'OPTIONS'])  # Cuma POST & OPTIONS
def submit_booking():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    data = request.json
    name = data['name']
    email = data['email']
    message = data['message']

    conn = sqlite3.connect('photoshoot.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO bookings (name, email, message) VALUES (?, ?, ?)", (name, email, message))
    conn.commit()
    conn.close()

    return jsonify({'status': 'success', 'message': 'Booking disimpan!'})

# Gak ada route root (/) biar GET / gak tampil halaman
if __name__ == '__main__':
    app.run(debug=True, port=5000)