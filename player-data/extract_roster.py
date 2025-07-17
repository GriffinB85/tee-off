# extract_roster.py

import requests
import json
from bs4 import BeautifulSoup

PLAYERS_URL = "https://www.pgatour.com/players"

def fetch_roster_from_dehydrated():
    r = requests.get(PLAYERS_URL, headers={"User-Agent":"Mozilla/5.0"})
    r.raise_for_status()

    soup = BeautifulSoup(r.text, "html.parser")
    nd = soup.find("script", id="__NEXT_DATA__")
    if not nd:
        raise RuntimeError("Could not find __NEXT_DATA__ on /players")

    data = json.loads(nd.string)
    queries = data["props"]["pageProps"]["dehydratedState"]["queries"]

    for q in queries:
        key = q.get("queryKey")
        if isinstance(key, list) and key[0] == "playerDirectory":
            state = q["state"]["data"]    # { tourCode, players: [ ... ] }
            return state["players"]       # list of dicts

    raise RuntimeError("playerDirectory not found in dehydratedState")

if __name__ == "__main__":
    roster = fetch_roster_from_dehydrated()
    print(f"Pulled {len(roster)} players")
    print("Sample entry:\n", json.dumps(roster[0], indent=2))