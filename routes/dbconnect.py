import pymysql

# Open database connection


def connection():
    # TODO: configure mysql connection

    host = "2001.0468.0c80.6102.0001.7015.41fc.29f6.ip6.name"
    password = "3S4ecsEhMB"
    user = "root"
    database = "CS5604"
    conn = pymysql.connect(host, user, password, database)

    c = conn.cursor()
    return c, conn
