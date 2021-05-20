from flask import *
from api.routes import api

app=Flask(
    __name__,
    static_folder="static",
    static_url_path="/static"
) # 建立 Application 物件

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

app.secret_key = b'\x0b\xba\xbe\xa0\xf7\x1c\x18\xbb\x0b|H\xae\xe1,\xed\x9b'

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

app.register_blueprint(api)

app.run(host='0.0.0.0',port=3000)