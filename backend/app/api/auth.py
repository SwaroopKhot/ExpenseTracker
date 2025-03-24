from flask import Blueprint, request, jsonify, g
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.security import check_password_hash
from app.service.database import get_user_by_email, create_new_user

auth_bp = Blueprint('auth', __name__)


# Register route
@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    hashed_password = generate_password_hash(password)
    
    
    user = get_user_by_email(email)
    if user:
        return jsonify({"message" : "Email already exist, please login or use new Email !"}), 401
    
    # new user
    try:
        payload ={
            "username" : username,
            "email" : email,
            "password" : hashed_password
        }
        new_user = create_new_user(payload)
        if new_user:
            return jsonify({"username" : username, "email" : email}), 200
        
    except Exception as er:
        print("Create Account: ", er)
        return jsonify({"message": f"Error creating the user: {er}"}), 201

@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json
    
    email = data.get('email')
    password = data.get('password')
    
    user = get_user_by_email(email)
    if user:
        user = user["account"]
        if check_password_hash(user["password"], password):
            print("Login Successfull: ", email)
            return jsonify({"username" : user["username"], "email" : email}), 200
        else:
            return jsonify({"message": "Invalid Password !"}), 401
    else:
        return jsonify({"message": "User doesn't exist, create account instead !"}), 404
            
            
