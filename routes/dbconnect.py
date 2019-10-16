import pymysql

# Open database connection


def connection():

    conn = pymysql.connect("localhost","root","CSD@mysql-1872","CS5604" )

    c = conn.cursor()
    return c, conn
