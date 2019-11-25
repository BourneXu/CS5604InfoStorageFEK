import pymysql
from routes.dbconnect import connection
from flask import (
    Flask,
    render_template,
    flash,
    request,
    url_for,
    redirect,
    session,
    flash,
    Blueprint,
)
from wtforms import Form, BooleanField, TextField, PasswordField, validators
from passlib.hash import sha256_crypt
import gc
import os
import sys
import time

user_blueprint = Blueprint("user", __name__, template_folder="templates")





@user_blueprint.route("/")
def homepage():
    return render_template("index.html", error=error)


class AdminCreateForm(Form):
    username = TextField("Username", [validators.Length(min=4, max=20)])
    email = TextField("Email Address", [validators.Length(min=6, max=50)])
    password = PasswordField(
        "New Password",
        [validators.Required(), validators.EqualTo("confirm", message="Passwords must match")],
    )
    confirm = PasswordField("Repeat Password")
    accept_tos = BooleanField(
        "I accept the Terms and Conditions (updated Nov 10, 2019)",
        [validators.Required()],
    )

@user_blueprint.route("/admin_create/" , methods=["GET", "POST"])
def admin_create():
    try:
        error = ""
        form = AdminCreateForm(request.form)
        usernameCurrent = request.form["username"]
        username = form.username.data


        print("Did the form validate?" + str(form.validate()));
        if request.method == "POST" and form.validate():
            print("Im here 1")

            email = form.email.data
            password = sha256_crypt.encrypt((str(form.password.data)))
            c, conn = connection()
            x = c.execute("SELECT * FROM users WHERE username = (%s)", (username))
            y = c.execute("SELECT * FROM users WHERE email = (%s)", (email))

            if int(x) > 0:
                print("Im here 2")
                error = "That username is already taken, please choose another."
                return render_template("admin_create.html", form=form, username=usernameCurrent, error=error)
            if int(y) > 0:
                print("Im here 3")
                error = "That email is already taken, please choose another."
                return render_template("admin_create.html", form=form, username=usernameCurrent, error=error)

            else:
                error = ""
                print("Im here 4")
                print("The current username is: "+ usernameCurrent)

                ts = time.localtime()
                rtime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                c.execute(
                    "INSERT INTO users (username, password, email, register_time) VALUES (%s, %s, %s, %s)",
                    ((username), (password), (email), (rtime)),
                )
                conn.commit()

                data3 = c.execute(
                    "SELECT * FROM users WHERE username = (%s)", (username)
                )
                data3 = c.fetchone()
                print("The current user is: " + data3[1])
                UserInfo = []
                UserInfo.append(data3[1]) #username
                UserInfo.append(data3[3]) #email
                UserInfo.append(data3[4]) #registration time
                UserInfo.append(data3[5]) #user_type/access level

                c.close()
                conn.close()
                gc.collect()

                return render_template("admin_users.html", form=form, username=username, userinfo = UserInfo, error = error)

        print("I'm here 5")
        return render_template("admin_create.html", form=form, username=username, error = error)

    except Exception as e:
        return str(e)



@user_blueprint.route("/delete_user/" , methods=["GET", "POST"])
def delete_user():
    if request.method == "POST":
        c, conn = connection()
        username = request.form["username"]

        data = c.execute(
            "Delete from users WHERE username = (%s)", (username)
        )

    conn.commit()
    c.close()
    conn.close()
    gc.collect()


    return redirect(url_for("user.admin"))

class ChangeEmailForm(Form):
    newemail = TextField("Email", [validators.Length(min=6, max=50), validators.EqualTo("newemail2")])
    newemail2 = TextField("Repeat Email", [validators.Length(min=6, max=50)])

@user_blueprint.route("/change_email/" , methods=["GET", "POST"])
def change_email():
    try:
        c, conn = connection()
        error = ""
        form = ChangeEmailForm(request.form)
        username = request.form["username"]
        newemail = request.form["newemail"]
        oldemail = request.form["oldemail"]
        UserInfo = []



        if not form.validate():
            print("I was here")
            error = "Email must be between 6 and 50 characters and must match each other"
            flash("Email must be between 6 and 50 characters and must match each other")
            data3 = c.execute(
                "SELECT * FROM users WHERE username = (%s)", (username)
            )

            data3 = c.fetchone()

            UserInfo.append(data3[1]) #username
            UserInfo.append(data3[3]) #email
            UserInfo.append(data3[4]) #registration time
            UserInfo.append(data3[5]) #user_type/access level
            return render_template("admin_users.html", form=form, error=error, username=username, userinfo = UserInfo)

        if request.method == "POST":

            x = c.execute("SELECT * FROM users WHERE email = (%s)", (newemail))

            if int(x) > 0:
                error = "That email is already taken, please choose another."
                flash("That email is already taken, please choose another.")
                data3 = c.execute(
                    "SELECT * FROM users WHERE username = (%s)", (username)
                )
                UserInfo = []
                data3 = c.fetchone()

                UserInfo.append(data3[1]) #username
                UserInfo.append(data3[3]) #email
                UserInfo.append(data3[4]) #registration time
                UserInfo.append(data3[5]) #user_type/access level
                return render_template("admin_users.html", form=form, error=error, username=username, userinfo = UserInfo)



        data = c.execute(
            "Update users set email = (%s) WHERE email = (%s)", (newemail, oldemail)
        )

        data2 = c.execute(
            "SELECT * FROM users WHERE username = (%s)", (username)
        )
        UserInfo = []
        data2 = c.fetchone()

        UserInfo.append(data2[1]) #username
        UserInfo.append(data2[3]) #email
        UserInfo.append(data2[4]) #registration time
        UserInfo.append(data2[5]) #user_type/access level



        conn.commit()
        c.close()
        conn.close()
        gc.collect()


        return render_template("admin_users.html", username=username, userinfo = UserInfo)

    except Exception as e:
        return str(e)


class ChangeUsernameForm(Form):
    newusername = TextField("Username", [validators.Length(min=4, max=20), validators.EqualTo("newusername2")])
    newusername2 = TextField("Repeat Username", [validators.Length(min=4, max=20)])




@user_blueprint.route("/change_username/" , methods=["GET", "POST"])
def change_username():
    try:
        c, conn = connection()
        error = ""
        form = ChangeUsernameForm(request.form)
        username = request.form["username"]
        newusername = request.form["newusername"]
        UserInfo = []

        if not form.validate():
            print("I was here")
            error = "Username must be between 5 and 20 characters and must match each other"
            flash("Username must be between 5 and 20 characters and must match each other")
            data3 = c.execute(
                "SELECT * FROM users WHERE username = (%s)", (username)
            )

            data3 = c.fetchone()

            UserInfo.append(data3[1]) #username
            UserInfo.append(data3[3]) #email
            UserInfo.append(data3[4]) #registration time
            UserInfo.append(data3[5]) #user_type/access level
            return render_template("admin_users.html", form=form, error=error, username=username, userinfo = UserInfo)


        if request.method == "POST":

            x = c.execute("SELECT * FROM users WHERE username = (%s)", (newusername))

            if int(x) > 0:
                error = "That username is already taken, please choose another."
                flash("That username is already taken, please choose another.")
                data3 = c.execute(
                    "SELECT * FROM users WHERE username = (%s)", (username)
                )

                data3 = c.fetchone()

                UserInfo.append(data3[1]) #username
                UserInfo.append(data3[3]) #email
                UserInfo.append(data3[4]) #registration time
                UserInfo.append(data3[5]) #user_type/access level
                return render_template("admin_users.html", form=form, error=error, username=username, userinfo = UserInfo)



            data = c.execute(
                "Update users set username = (%s) WHERE username = (%s)", (newusername,username)
            )

            data2 = c.execute(
                "SELECT * FROM users WHERE username = (%s)", (newusername)
            )
            UserInfo = []
            data2 = c.fetchone()

            UserInfo.append(data2[1]) #username
            UserInfo.append(data2[3]) #email
            UserInfo.append(data2[4]) #registration time
            UserInfo.append(data2[5]) #user_type/access level

            conn.commit()
            c.close()
            conn.close()
            gc.collect()

        return render_template("admin_users.html", username=newusername, userinfo = UserInfo)

    except Exception as e:
        return str(e)



@user_blueprint.route("/change_user_type/" , methods=["GET", "POST"])
def change_user_type():
    if request.method == "POST":
        UserInfo = []
        c, conn = connection()
        username = request.form["username"]
        data = c.execute(
            "Update users set user_type = (%s) WHERE username = (%s)", ("admin",username)
        )
        data2 = c.execute(
            "SELECT * FROM users WHERE username = (%s)", (username)
        )

        data2 = c.fetchone()

        UserInfo.append(data2[1]) #username
        UserInfo.append(data2[3]) #email
        UserInfo.append(data2[4]) #registration time
        UserInfo.append(data2[5]) #user_type/access level
    conn.commit()
    c.close()
    conn.close()
    gc.collect()


    return render_template("admin_users.html", username=username, userinfo = UserInfo)

    # return ('', 204)



@user_blueprint.route("/admin_users/" , methods=["GET", "POST"])
def admin_users():

    if request.method == "POST":
        UserInfo = []
        username = request.form["username"]
        c, conn = connection()
        data = c.execute(
            "SELECT * FROM users WHERE username = (%s)", (username)
        )

        data = c.fetchone()

        UserInfo.append(data[1]) #username
        UserInfo.append(data[3]) #email
        UserInfo.append(data[4]) #registration time
        UserInfo.append(data[5]) #user_type/access level


    return render_template("admin_users.html", username=username, userinfo = UserInfo)


@user_blueprint.route("/admin/")
def admin():
    Users = [];
    c, conn = connection();
    data = c.execute("SELECT * FROM users");


    c = pymysql.cursors.DictCursor(conn);

    query = "SELECT username FROM users";
    c.execute(query)
    rows = c.fetchall()
    for row in rows:
        for key, value in row.items():
            Users.append(value)



    return render_template("/admin.html", Users = Users, len = len(Users))


@user_blueprint.route("/qa/")
def qa():
    return render_template("QA.html")

@user_blueprint.route("/visual/")
def visual():
    return render_template("/visual.html")

@user_blueprint.route("/login/", methods=["GET", "POST"])
def login():
    return render_template("login.html")


@user_blueprint.route("/loginprocess/", methods=["GET", "POST"])
def loginprocess():
    error = ""
    try:
        c, conn = connection()
        if request.method == "POST":

            userInput = request.form["username"]
            data = c.execute(
                "SELECT * FROM users WHERE username = (%s) or email = (%s)", (userInput, userInput)
            )

            # print(data, file=sys.stderr)
            data = c.fetchone()
            pword = data[2]
            uname = data[1]
            utype = data[5]
            # uname = c.fetchone()[1];

            if sha256_crypt.verify(request.form["password"], pword):
                session["logged_in"] = True
                session["username"] = uname
                session['usertype'] = utype

                flash("You are now logged in")
                # return render_template("index.html", error=error)
                return redirect(url_for("index"))

            else:
                error = "Invalid credentials, try again."

        gc.collect()
        return redirect(url_for("login"), error=error)
        # return render_template("index.html", error=error)

    except Exception as e:
        # flash(e)
        error = "Invalid credentials, try again."
        return render_template("login.html", error=error)

    except Exception as e:
        # flash(e)
        error = "Invalid credentials, try again."
        return render_template("login.html", error=error)


@user_blueprint.route("/logout/")
def logout():
    session["logged_in"] = False
    flash("You are now logged out")
    return redirect(url_for("index"))


class RegistrationForm(Form):
    username = TextField("Username", [validators.Length(min=4, max=20)])
    email = TextField("Email Address", [validators.Length(min=6, max=50)])
    password = PasswordField(
        "New Password",
        [validators.Required(), validators.EqualTo("confirm", message="Error: Passwords must match")],
    )
    confirm = PasswordField("Repeat Password")
    accept_tos = BooleanField(
        "I accept the Terms and Conditions (updated Nov 10, 2019)",
        [validators.Required()],
    )




@user_blueprint.route("/register/", methods=["GET", "POST"])
def register_page():
    try:
        error = ""
        form = RegistrationForm(request.form)

        if request.method == "POST" and form.validate():
            username = form.username.data
            email = form.email.data
            password = sha256_crypt.encrypt((str(form.password.data)))
            c, conn = connection()
            x = c.execute("SELECT * FROM users WHERE username = (%s)", (username))
            y = c.execute("SELECT * FROM users WHERE email = (%s)", (email))

            if int(x) > 0:
                error = "That username is already taken, please choose another."
                flash("That username is already taken, please choose another.")
                return render_template("register.html", form=form, error=error)
            if int(y) > 0:
                error = "That email is already taken, please choose another."
                flash("That email is already taken, please choose another.")
                return render_template("register.html", form=form, error=error)

            else:
                ts = time.localtime()
                rtime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                c.execute(
                    "INSERT INTO users (username, password, email, register_time) VALUES (%s, %s, %s, %s)",
                    ((username), (password), (email), (rtime)),
                )
                conn.commit()
                c.close()
                conn.close()
                gc.collect()

                session["logged_in"] = True
                session["username"] = username
                session["usertype"] = "regular"

                return redirect(url_for("index"))

        return render_template("register.html", form=form, error = error)

    except Exception as e:
        return str(e)
