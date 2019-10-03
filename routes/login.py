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

login_blueprint = Blueprint("login", __name__, template_folder="templates")


@login_blueprint.route("/homepage")
def homepage():
    return render_template("index.html")


@login_blueprint.route("/login", methods=["GET", "POST"])
def login_page():
    error = ""
    try:
        c, conn = connection()
        if request.method == "POST":

            userInput = request.form["username"]
            data = c.execute(
                "SELECT * FROM users WHERE username = (%s) or email = (%s)", (userInput, userInput)
            )
            # print(data, file=sys.stderr)
            data = c.fetchone()[2]

            if sha256_crypt.verify(request.form["password"], data):
                session["logged_in"] = True
                session["username"] = request.form["username"]

                flash("You are now logged in")
                return render_template("home.html", error=error)

            else:
                error = "Invalid credentials, try again."

        gc.collect()

        return render_template("login.html", error=error)

    except Exception as e:
        # flash(e)
        error = "Invalid credentials, try again."
        return render_template("login.html", error=error)

    except Exception as e:
        # flash(e)
        error = "Invalid credentials, try again."
        return render_template("login.html", error=error)


@login_blueprint.route("/logout")
def logout():
    session["logged_in"] = False
    return redirect(url_for("/homepage"))


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


@login_blueprint.route("/register/", methods=["GET", "POST"])
def register_page():
    try:
        form = RegistrationForm(request.form)

        if request.method == "POST" and form.validate():
            username = form.username.data
            email = form.email.data
            password = sha256_crypt.encrypt((str(form.password.data)))
            c, conn = connection()
            x = c.execute("SELECT * FROM users WHERE username = (%s)", (username))

            if int(x) > 0:
                flash("That username is already taken, please choose another")
                return render_template("register.html", form=form)

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

                return render_template("index.html")

        return render_template("register.html", form=form)

    except Exception as e:
        return str(e)

