from flask import *
from flask import Blueprint
from db import cursor

api = Blueprint( 'api', __name__, url_prefix='/api' )

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
