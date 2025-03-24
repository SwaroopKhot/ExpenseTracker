from flask import Flask, jsonify
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")
    
    # Enable CORS and allow specific URLs
    CORS(app, resources={
            r"/*": {"origins": ["http://localhost:3000", "*"]}
        }
    )
    
    # Register Blueprints
    from app.api.status import status
    from app.api.auth import auth_bp
    from app.api.expense import expense_db
    
    for blueprint in [status, auth_bp, expense_db]:
        app.register_blueprint(blueprint)
        
        
        
    # ---------------- Logging Errors -----------------------
    # A global error handler for 404 Not Found
    @app.errorhandler(404)
    def handle_404_error(e):
        print("ERROR: ", e)
        return jsonify({"status": "error", "message": f"{e}"}), 404

    # A global error handler for 500 Internal Server Error
    @app.errorhandler(500)
    def handle_500_error(e):
        print("ERROR: ", e)
        return jsonify({"status": "error", "message": f"Internal Server Error <{e}>"}), 500

    # A global error handler for any unhandled exceptions
    @app.errorhandler(Exception)
    def handle_exception(e):
        print("ERROR: ", e)
        return jsonify({"status": "error", "message": f"Error Occured: {e}"}), 500
    
    return app

    
    