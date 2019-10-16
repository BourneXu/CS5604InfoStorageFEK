from functools import wraps
from flask import request, redirect, url_for, session, flash


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("logged_in", None):
            return redirect(url_for("user.login", next=request.endpoint))
        return f(*args, **kwargs)

    return decorated_function
