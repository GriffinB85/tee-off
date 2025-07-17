# scrape_profiles_spans.py

import re
import time
import json
import requests
from bs4 import BeautifulSoup

from extract_roster import fetch_roster_from_dehydrated

# Map on-page labels to your JSON keys
FIELD_MAP = {
    "Age":         "age",
    "Turned Pro":  "turnedPro",
    "College":     "education",
    "Career Wins": "careerWins",
    "Partners":    "partners",
}

def slugify(name: str) -> str:
    return re.sub(r"[^\w]+", "-", name.lower()).strip("-")

def make_profile_url(player: dict) -> str:
    pid  = player["id"]
    name = player.get("displayName") or f"{player.get('firstName','')} {player.get('lastName','')}"
    return f"https://www.pgatour.com/player/{pid}/{slugify(name)}"

def fetch_profile_info(url: str) -> dict:
    r = requests.get(url, headers={"User-Agent":"Mozilla/5.0"})
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")

    info = {}
    # Look for divs with exactly two span children
    for div in soup.find_all("div"):
        spans = [s for s in div.find_all("span", recursive=False)]
        if len(spans) != 2:
            continue
        label = spans[0].get_text(strip=True)
        val   = spans[1].get_text(strip=True)
        if label in FIELD_MAP:
            info[ FIELD_MAP[label] ] = val

    # Ensure all keys exist
    for key in FIELD_MAP.values():
        info.setdefault(key, None)

    return info

if __name__ == "__main__":
    roster = fetch_roster_from_dehydrated()
    print("DEBUG: roster size =", len(roster))
    print("DEBUG: sample item:", roster[0])

    active = [p for p in roster if p.get("isActive")]
    print("DEBUG: active count =", len(active))

    results = []
    for idx, player in enumerate(active, 1):
        url = make_profile_url(player)
        try:
            details = fetch_profile_info(url)
            bio = {
                "playerId":     player["id"],
                "displayName":  player.get("displayName"),
                "countryCode":  player.get("countryFlag",""),
                "profileUrl":   url,
                **details
            }
            results.append(bio)
            print(f"[{idx}/{len(active)}] ✓ {bio['displayName']}")
        except Exception as e:
            print(f"[{idx}/{len(active)}] ⚠ ERROR {player.get('displayName')}: {e}")
        time.sleep(0.2)

    print("DEBUG: scraped bios count =", len(results))
    with open("player_bios.json", "w") as f:
        json.dump(results, f, indent=2)
    print("Saved profiles to player_bios.json")
