from flask import Blueprint, request, jsonify
from app.service.database import get_user_by_email, create_new_expense, fetch_expenses, edit_expense, \
        delete_expense, update_budget

expense_db = Blueprint('expense', __name__)

@expense_db.route("/api/add/expense", methods=["POST"])
def add_expense():
    data = request.json
    
    email = data.get('email')
    amount = data.get('amount')
    title = data.get('title')
    category = data.get('category')
    date = data.get('date')
    payment = data.get('payment')
    
    if not email:
        return jsonify({"message": "Incorrect data to add the expense"}), 400
    
    payload = {
        "amount" : amount,
        "title" : title,
        "category" : category,
        "date" : date,
        "payment" : payment  
    }
    
    return create_new_expense(email, payload)   
    

@expense_db.route("/api/get/expense", methods=["POST"])
def get_expense():
    data = request.json
    
    email = data.get('email')
    
    return fetch_expenses(email)
    
    

@expense_db.route("/api/edit/expense", methods=["POST"])
def editExpense():
    data = request.get_json()
    
    email = data.get('email')
    update_expense = data.get("update_expense")
    
    return edit_expense(email, update_expense)


@expense_db.route("/api/delete/expense", methods=["DELETE"])
def deleteExpense():
    data = request.get_json()
    
    email = data.get('email')
    expense_id = data.get('id')  # Get the expense ID to delete
    
    if not email or expense_id is None:
        return jsonify({"message": "Email and Expense ID are required!"}), 400
    
    return delete_expense(email, expense_id)


@expense_db.route("/api/get-budget", methods=["POST"])
def get_budget():
    data = request.get_json()
    email = data.get('email')
    
    user = get_user_by_email(email)
    if user:
        account = user.get("account", {})
        budget = account.get("budget", 0)
        return jsonify({"budget": budget}), 200
    return jsonify({"message": "User not found!"}), 404


@expense_db.route("/api/set-budget", methods=["POST"])
def set_budget():
    data = request.get_json()
    email = data.get('email')
    budget = data.get('budget')

    if not email or budget is None:
        return jsonify({"message": "Email and Budget are required!"}), 400
    
    return update_budget(email, budget)
