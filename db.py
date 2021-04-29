import mysql.connector

# 建立 db連線
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="root",
  database="website"
)

cursor = mydb.cursor(buffered=True)