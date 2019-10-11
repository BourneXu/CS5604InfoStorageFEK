import pymysql

# Open database connection


def connection():
    # TODO: configure mysql connection

    host = "mysql.cs5604-fek-db.svc"
    password = "3S4ecsEhMB"
    user = "root"
    database = "CS5604"
    conn = pymysql.connect(host, user, password, database)

    c = conn.cursor()
    return c, conn
