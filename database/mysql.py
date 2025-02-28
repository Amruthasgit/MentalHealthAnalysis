import mysql.connector

def get_mysql_connection():
    """Establishes and returns a connection to MySQL."""
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Ammu@2906",
            database="studentsdata"
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None
