import sqlite3

# Bikin file DB 'photoshoot.db'
conn = sqlite3.connect('photoshoot.db')
cursor = conn.cursor()

# Buat table
cursor.execute('''
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# Simpen perubahan
conn.commit()
conn.close()
print("DB siap! Buka 'photoshoot.db' pake DB Browser.")