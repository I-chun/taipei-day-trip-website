import json
import mysql.connector

# 連線db
db = mysql.connector.connect(
  host="localhost",
  user="root",
  password="root",
  database='website',
)
cursor = db.cursor()

# 取得json資料
with open("taipei-attractions.json", "r") as read_file:
    jsondata = json.load(read_file)

def getImgUrl( data ) :
    matches = ["jpg", "png"]
    my_list = []
    my_str = ''
    imgArray = data.split('http://')
    for img in imgArray :
        if any(x in img.lower() for x in matches):
            my_list.append( 'http://' + img )

    my_str = ",".join(my_list)
    return my_str

# Insert 資料庫
for json in jsondata["result"]["results"]:
    sql = "INSERT INTO taipeitrip \
    (name, category, description, address, transport, mrt, latitude, longitude, images) \
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (json["stitle"], json["CAT2"], json["xbody"], json["address"], json["info"], json["MRT"], json["latitude"], json["longitude"], getImgUrl(json["file"]))

    try:
        cursor.execute(sql, val)
        #提交修改
        db.commit()
    except mysql.connector.Error as err :
        #發生錯誤時停止執行SQL
        db.rollback()
        print(err)
        print("Error Code:", err.errno)
        print("SQLSTATE", err.sqlstate)
        print("Message", err.msg)

#關閉連線
db.close()

# test
# data = 'http://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D581/E158/F452/05c7487d-f1f5-48c3-ac20-a08f26c5e637.JPGhttp://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D137/E960/F790/36d41857-1f0d-41e6-8ed9-698e5c907dad.JPGhttp://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D694/E883/F926/30a71aa5-a6df-46db-9309-fd4590e18881.JPGhttp://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C1/D239/E403/F497/9d8ec1f9-a8a8-4094-9246-355bc31088de.JPGhttp://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C1/D955/E613/F87/1fadc21a-550a-4b98-bc16-bdab744c447a.JPGhttp://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D312/E440/F238/86c1ab8d-9bdd-4a72-843c-82518980f3af.JPGhttp://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C1/D856/E846/F252/90ad4193-3170-4db5-8621-5e60ba4774de.JPGhttp://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C2/D98/E479/F351/27ca2e4f-2668-428d-8d6a-60575018e399.JPG'
# print( getImgUrl( data ) )
