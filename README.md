The **Expense Tracker** is a comprehensive web application that helps users track their expenses, categorize transactions, and visualize their spending patterns effectively.

Lets begin the setup by cloning the repository.
## Clone the Repository
```bash
git clone https://github.com/SwaroopKhot/ExpenseTracker.git
cd <project-directory>
```

### Backend Setup:
Let step-up the backend first

#### Step 1: Navigate to the Backend Folder
```bash
cd backend
```

#### Step 2: Create a Python Virtual Environment:
For Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

For macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install Dependencies:
Once the venv is setup, you can install the packages using the cmd below:
```bash
pip install -r requirements.txt
```

#### Step 4: Run the Flask Server:
```bash
python app.py
```

The backend will typically run at: http://127.0.0.1:5000.


Now, we shall begin setting-up the frontend.
### Frontend Setup
#### Step 1: Navigate to the Frontend Folder
```bash
cd frontend
```

#### Step 2: Install Node Modules
```bash
npm install
```

#### Step 3: Start the React Application
```bash
npm start
```

Done, once the setup if completed you can see the frontend at: http://127.0.0.1:3000






