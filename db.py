import mysql.connector

# 建立 db連線
mydb = mysql.connector.connect(
  host="localhost",
  user="",
  password="",
  database="website"
)

cursor = mydb.cursor(buffered=True)