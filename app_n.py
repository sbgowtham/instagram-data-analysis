from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Database connection
def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',  # Replace with your database host
            user='root',       # Replace with your MySQL username
            password='root',  # Replace with your MySQL password
            database='notifications_db'  # Replace with your database name
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Endpoint to store notification
@app.route('/store-notification', methods=['POST'])
def store_notification():
    data = request.json
    title = data.get('title')
    body = data.get('body')
    notification_type = data.get('type')  # Default to foreground
    source = data.get('source', 'Instagram')  # Default to Instagram

    if not title or not body:
        return jsonify({"error": "Title and body are required"}), 400

    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO notifications (title, body, type, source)
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE received_at = CURRENT_TIMESTAMP
        """
        cursor.execute(query, (title, body, notification_type, source))
        connection.commit()
        return jsonify({"message": "Notification stored successfully"}), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
