import pymysql

# Open database connection


def connection():
    conn = pymysql.connect("localhost","root","password","database" )

    c = conn.cursor()

    return c, conn
