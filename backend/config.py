from datetime import timedelta
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = 'AAA_BBB_CCC_DDD'  # Replace with a strong key
    DEBUG = True