from app import create_app
from flask import request

app = create_app()



@app.after_request
def after_request(response):
    """
    This function runs after each request, before sending the response.
    Add custom headers here (e.g., CORS headers, response time tracking).
    Add security headers here.
    """
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    
    # Add Content Security Policy (CSP) headers if necessary
    response.headers['Content-Security-Policy'] = "default-src 'self';"
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'

    return response


if __name__ == "__main__":
    app.run(debug=True)

