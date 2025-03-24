import json
import os
from flask import Blueprint, request, jsonify, g


DATA_FILE = 'database/data.json'

def read_data():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as file:
            json.dump({}, file)

    # If the file exists but is empty, write an empty dictionary
    if os.path.getsize(DATA_FILE) == 0:
        with open(DATA_FILE, 'w') as file:
            json.dump({}, file)

    # Read the data from the file
    with open(DATA_FILE, 'r') as file:
        return json.load(file)

def write_data(data):
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)
        
def get_user_by_email(email):
    data = read_data()
    
    for i in data:
        if i == email:
            return data[i]
    
    return False

def create_new_user(new_user):
    data = read_data()
    print(data)
    try:
        data[new_user["email"]] = {
            "account" : new_user
        }
        
        write_data(data)
        return True
    except Exception as er:
        raise Exception("Failed creating the user")

def create_new_expense(email, data):
    user = get_user_by_email(email)
    
    if user:
        if "expense" not in user:
            user["expense"] = []
        
        id = len(user['expense'])
        data["id"] = id
        
        user['expense'].append(data)
        
        # Save the updated data
        data = read_data()
        data[email] = user
        
        write_data(data)
        return jsonify({"message": "Successfully, added the Expense !"}), 200
    return jsonify({"message": "Failed to added the Expense incorrect user!"}), 400
    
def fetch_expenses(email):
    
    user = get_user_by_email(email)
    if user:
        if "expense" not in user:
            return jsonify({"data": []}), 200
        
        
        # Save the updated data
        data = read_data()
        
        for i in data:
            if i == email:
                print(data[i])
                return jsonify({"data" : data[i]["expense"]}), 200
    
    return jsonify({"data": []}), 200
        
def edit_expense(email, update_expense):
    user = get_user_by_email(email)
    if user:
        data = user['expense']
        
        for update in update_expense:
            for i, expense in enumerate(data):
                if expense['id'] == update['id']:
                    data[i].update(update)
        
        # Save the updated data
        data = read_data()
        data[email] = user
        
        write_data(data)
        
        return jsonify({"message": "Successfully updated the expenses!"}), 200
    
    return jsonify({"message": "User not found!"}), 404


def delete_expense(email, expense_ids):
    user = get_user_by_email(email)
    if user:
        data = user.get("expense", [])

        user["expense"] = [expense for expense in data if expense["id"] not in expense_ids]

        # Reassign IDs starting from 0
        for idx, expense in enumerate(user["expense"]):
            expense["id"] = idx
            
        # Save the updated data
        all_data = read_data()
        all_data[email] = user
        write_data(all_data)

        return jsonify({"message": "Successfully deleted the expenses!"}), 200
    
    return jsonify({"message": "User not found!"}), 404


def update_budget(email, budget):
    user = get_user_by_email(email)
    if not user:
        return jsonify({"message": "User not found!"}), 404

    user["account"]["budget"] = budget
    all_data = read_data()
    all_data[email] = user
    write_data(all_data)

    return jsonify({"message": "Budget set successfully!", "budget": budget}), 200