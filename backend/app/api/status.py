from flask import Blueprint, jsonify
status = Blueprint('status', __name__)



@status.route("/api/status")
def stats():
    # Return a JSON response
    return jsonify({"status": "success", "message": "Welcome to the site, feel free to add expenses and track them!"}), 200
