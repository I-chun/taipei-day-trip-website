from flask import *
from flask import Blueprint
import mysql.connector

# 建立 db連線
mydb = mysql.connector.connect(
  host="localhost",
  user="",
  password="",
  database="website",
)

cursor = mydb.cursor(buffered=True)

api = Blueprint( 'api', __name__, url_prefix='/api' )

# 根據景點編號取得景點資料
@api.route("/attraction/<attractionid>")
def getAttraction(attractionid):

    try:
        # 設定 Sql Statement
        select_query = "SELECT * FROM taipeitrip WHERE id = %s ;"
        cursor.execute(select_query, (attractionid,))

        # 有無資料
        if cursor.rowcount > 0 : 
            result = cursor.fetchone()

            # 設定data資料
            json_var = {
                "data": {
                    "id": result[0] ,
                    "name": result[1] ,
                    "category": result[2] ,
                    "description": result[3] ,
                    "address": result[4] ,
                    "transport": result[5] ,
                    "mrt": result[6] ,
                    "latitude": float(result[7]) ,
                    "longitude": float(result[8]) ,
                    "images": result[9].split(',')
                }
			}
            return jsonify(json_var), 200

        else :  
            json_var = {
                "error": True,
                "message": "景點編號不正確"
            }
            return jsonify(json_var), 400

    except mysql.connector.Error as err :
        print("Error Code:", err.errno)
        print("Message", err.msg)

        json_var = {
            "error": True,
            "message": "伺服器內部錯誤"
        }
        return jsonify(json_var), 500

# 取得景點資料列表
@api.route("/attractions")
def getAttractions():

    numOfData = 0
    nextPage = 0

    # check 有無page及keyword query
    if "page" in request.args:
        page = request.args.get('page')
        numOfData = int(page) * 12
        
    if "keyword" in request.args:
        keyword = request.args.get('keyword')
    else:
        keyword = None
    
    try:
        # 設定 Sql Statement
        if keyword:  
            select_query = '''
                SELECT * FROM
                ( SELECT t.*, (@row_number:=@row_number + 1) AS num
                FROM taipeitrip t
                JOIN ( SELECT @row_number :=0 ) r 
                WHERE name LIKE %s ) temp
                WHERE num > %s LIMIT 13; '''
            cursor.execute(select_query, ('%' + keyword + '%', numOfData, ), )
        else:
            select_query = "SELECT * FROM taipeitrip WHERE id > %s LIMIT 13;"
            cursor.execute(select_query, (numOfData,))

        # 有無資料
        if cursor.rowcount > 0 :
            results = cursor.fetchall()

            # 設定nextPage
            if cursor.rowcount > 12:
                nextPage = int(numOfData / 12 + 1)
            else: 
                nextPage = None

            # 設定data[]資料
            i = 0
            data = []
            for row in results:
                if i < 12 :
                    datatemp = { 'id': int(row[0]) ,
                        "name": row[1] ,
                        "category": row[2] ,
                        "description": row[3] ,
                        "address": row[4] ,
                        "transport": row[5] ,
                        "mrt": row[6] ,
                        "latitude": float(row[7]) ,
                        "longitude": float(row[8]) ,
                        "images": row[9].split(',')
                    }
                    data.append(datatemp)

                i = i + 1


            json_var = {
                "nextPage": nextPage,
                "data": data
			}

            return jsonify(json_var), 200

        else:
            json_var = {
                "nextPage": None,
                "data": []
            }

            return jsonify(json_var), 400

    except mysql.connector.Error as err :
        print("Error Code:", err.errno)
        print("Message", err.msg)

        json_var = {
            "error": True,
            "message": "伺服器內部錯誤"
        }

        return jsonify(json_var), 500

# 取得當前登入的使用者資訊
@api.route("/user", methods=["GET"])
def getUser(): 

    email = ""
    if session.get('email'):
        email = session['email']
    else:
        json_var = {"data": None}
        return jsonify(json_var), 400

    # check username是否重複
    select_query = "SELECT * FROM user WHERE email = %s ;"
    cursor.execute(select_query, (email,))

    if cursor.rowcount > 0 :
        result = cursor.fetchone()
        json_var = {
                    "data": {
                        "id": result[0] ,
                        "name": result[1] ,
                        "email": result[2] 
                    }
        }
        return jsonify(json_var), 200
    else :  
        json_var = {"data": None}
        return jsonify(json_var), 400

# 註冊一個新的使用者
@api.route("/user", methods=["POST"])
def signup(): 

    data = request.get_json()

    if data["name"] == "" or data["email"] == "" or data['password'] == "":
        json_var = {
              "error": True,
              "message": "請輸入完整註冊資料"
        }
        return jsonify(json_var), 400

    name = data["name"]
    email = data["email"]
    password = data['password']

    # check username是否重複
    select_query = "SELECT * FROM user WHERE email = %s ;"
    cursor.execute(select_query, (email,))

    if cursor.rowcount <= 0 :
    #     # 設定 session
        session['loginStatus'] = 'y'
        session['email'] = email
        # 註冊
        try :
            insert_query= "INSERT INTO user (name, email, password) VALUES (%s, %s, %s) ;"
            val = (name, email, password)
            cursor.execute(insert_query, val)   
            mydb.commit()

            json_var = {"ok": True}
            return jsonify(json_var), 200

        except mysql.connector.Error as err :
            print(err)
            print("Error Code:", err.errno)
            print("SQLSTATE", err.sqlstate)
            print("Message", err.msg)

            json_var = {
              "error": True,
              "message": "伺服器內部錯誤"
            }
            return jsonify(json_var), 500
    else :
            json_var = {
              "error": True,
              "message": "這個Email已重複註冊"
            }
            return jsonify(json_var), 400

# 登入使用者帳戶
@api.route("/user", methods=["PATCH"])
def signin(): 

    data = request.get_json()

    if data["email"] == "" or data['password'] == "":
        json_var = {
              "error": True,
              "message": "請輸入完整註冊資料"
        }
        return jsonify(json_var), 400

    email = data["email"]
    password = data['password']

    # check 有沒有這組帳密
    select_query = "SELECT * FROM user WHERE email = %s AND password = %s ;"
    val = (email, password)
    cursor.execute(select_query, val)

    if cursor.rowcount > 0 :
        result = cursor.fetchone()
        # 設定 session
        session['loginStatus'] = 'y'
        session['email'] = result[2]

        json_var = {"ok": True}
        return jsonify(json_var), 200
    else :
        json_var = {
              "error": True,
              "message": "帳號或密碼輸入錯誤"
        }
        return jsonify(json_var), 400

# 登出使用者帳戶
@api.route("/user", methods=["DELETE"])
def signout(): 
    session['loginStatus'] = 'n'
    session['email'] = False
    session['booking'] = False

    json_var = {"ok": True}
    return jsonify(json_var), 200

# 取得尚未確認下單的預定行程
@api.route("/booking", methods=["GET"])
def getBooking(): 

    if session['loginStatus'] == 'y':
        if session.get('booking'):
            json_var = session['booking']
            return jsonify(json_var), 200
        else:
            json_var = {"data": None}
            return jsonify(json_var), 200
    else:
        json_var = { 
            "error": True,
            "message": "未登入系統，拒絕存取"
        }
        return jsonify(json_var), 403

# 建立新的預定行程
@api.route("/booking", methods=["POST"])
def setBooking(): 

    if session['loginStatus'] == 'y':
        data = request.get_json()

        if data["attractionId"] == "" or data['date'] == "" or data['time'] == "" or data['price'] == "":
            json_var = {
                "error": True,
                "message": "建立失敗，輸入不正確或其他原因"
            }
            return jsonify(json_var), 400


        try:
            # 設定 Sql Statement
            select_query = "SELECT * FROM taipeitrip WHERE id = %s ;"
            cursor.execute(select_query, (data["attractionId"],))

            # 有無資料
            if cursor.rowcount > 0 : 
                result = cursor.fetchone()
                session['booking'] = {
                    "data" : {    
                        "attraction": {
                            "id": result[0],
                            "name": result[1],
                            "address": result[4],
                            "image": result[9].split(',')[0]
                        },
                        "date": data['date'],
                        "time": data['time'],
                        "price": data['price']
                    }
                }

                print( session['booking'] )
                # 設定data資料
                json_var = {"ok": True}
                return jsonify(json_var), 200

            else :  
                json_var = {
                    "error": True,
                    "message": "建立失敗，輸入不正確或其他原因"
                }
                return jsonify(json_var), 400

        except mysql.connector.Error as err :
            print("Error Code:", err.errno)
            print("Message", err.msg)

            json_var = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(json_var), 500
    else:
        json_var = { 
            "error": True,
            "message": "未登入系統，拒絕存取"
        }
        return jsonify(json_var), 403

# 刪除目前的預定行程
@api.route("/booking", methods=["DELETE"])
def deleteBooking(): 
    if session.get('booking'):
        session['booking'] = False
        json_var = {"ok": True}
        return jsonify(json_var), 200
    else:
        json_var = { 
            "error": True,
            "message": "未登入系統，拒絕存取"
        }
        return jsonify(json_var), 403