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

user_blueprint = Blueprint("user", __name__, template_folder="templates")


@user_blueprint.route("/")
def homepage():
    return render_template("index.html", error=error)

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
            # uname = c.fetchone()[1];

            if sha256_crypt.verify(request.form["password"], pword):
                session["logged_in"] = True
                session["username"] = uname

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
        [validators.Required(), validators.EqualTo("confirm", message="Passwords must match")],
    )
    confirm = PasswordField("Repeat Password")
    accept_tos = BooleanField(
        "I accept the Terms of Service and Privacy Notice (updated Jan 22, 2015)",
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
                c.execute(
                    "INSERT INTO users (username, password, email, tracking) VALUES (%s, %s, %s, %s)",
                    ((username), (password), (email), "Fingers crossed"),
                )
                conn.commit()
                c.close()
                conn.close()
                gc.collect()

                session["logged_in"] = True
                session["username"] = username

                return redirect(url_for("index"))

        return render_template("register.html", form=form)

    except Exception as e:
        return str(e)
