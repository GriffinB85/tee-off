import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

HEADERS = {"User-Agent": "Mozilla/5.0"}
PLAYER_DIRECTORY_URL = "https://www.pgatour.com/players"
BASE_URL = "https://www.pgatour.com"


