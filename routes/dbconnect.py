import pymysql
from dynaconf import settings


def connection():
    conn = pymysql.connect(
        settings.MYSQL.host,
        settings.MYSQL.user,
        settings.MYSQL.password,
        settings.MYSQL.database
    )
    c = conn.cursor()
    return c, conn
