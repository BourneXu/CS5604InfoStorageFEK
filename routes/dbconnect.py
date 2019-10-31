import pymysql
from dynaconf import settings


def connection():
    # TODO: configure mysql connection

    host = "mysql-mysql.cs5604-fek-db.svc"
    password = "m8cAKqbPWG"
    user = "root"
    database = "CS5604"
    conn = pymysql.connect(host, user, password, database)
    c = conn.cursor()
    return c, conn
