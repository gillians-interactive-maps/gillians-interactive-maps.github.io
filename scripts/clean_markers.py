import os
import json

data_file = os.path.join("data", "markers.json")
with open(data_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# Neutral palette
PALETTE = {
    "hidden_packages": "#e59400",
    "rampages": "#c0392b",
    "unique_stunt_jumps": "#4a709c",
    "car_races": "#2e7d32",
    "bike_races": "#16a085",
    "rc_races": "#7f8c8d",
    "checkpoint_challenges": "#d35400",
    "drive_by_challenges": "#8e44ad",
    "bumps_and_grinds": "#27ae60",
    "rc_triad_take_down": "#c0392b",
    "see_the_sight_before_your_flight": "#2980b9",
    "slash_tv": "#962d3e",
    "maria_latore": "#d4ac0d"
}

# Mission-only requirements (no generic island unlocks)
MISSION_UNLOCKS = {
    "slash_tv_lcs_stv_0": "Requires mission 'The Offer' & Overalls outfit",
    "car_races_lcs_car_races_0": "Requires mission 'Grease Sucho'",
    "bike_races_lcs_bike_races_0": "Requires mission 'Booby Prize'",
    "drive_by_challenges_lcs_dbc_angel_0": "Requires mission 'Love on the Rocks'",
    "maria_latore_lcs_ml_0": "Requires mission 'Snuff'"
}

for cat_id, cat_info in data["categories"].items():
    if cat_id in PALETTE:
        cat_info["color"] = PALETTE[cat_id]

for m in data["markers"]:
    cat = m["category"]
    m["color"] = PALETTE.get(cat, "#e59400")

    # Remove island unlock info
    if m["id"] in MISSION_UNLOCKS:
        m["unlock"] = MISSION_UNLOCKS[m["id"]]
    else:
        m["unlock"] = None

    # Remove package hardcoded milestone reward (now dynamically computed from collected count)
    if cat == "hidden_packages":
        m["reward"] = None

with open(data_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print(f"Cleaned {len(data['markers'])} markers in {data_file}.")
