from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import sqlite3

app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5500", "http://localhost:5500"])  # Izinin khusus port Live Server lo

@app.route('/submit-booking', methods=['POST', 'OPTIONS'])  # Tambah OPTIONS buat preflight
def submit_booking():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200  # Handle preflight sukses

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)