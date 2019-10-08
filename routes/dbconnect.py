import pymysql

# Open database connection


def connection():
    conn = pymysql.connect("localhost", "root", "password", "CS5604")
    c = conn.cursor()
    return c, conn
