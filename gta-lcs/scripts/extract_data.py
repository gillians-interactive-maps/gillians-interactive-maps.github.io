import os
import json
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_IMG_DIR = os.path.join(BASE_DIR, "assets", "images")
DATA_DIR = os.path.join(BASE_DIR, "data")

def coords_to_latlng(x, y):
    ux = 4096.0 * (x + 2000.0) / 4000.0
    uy = 4096.0 * (2000.0 - y) / 4000.0
    lat = -uy / 32.0
    lng = ux / 32.0
    return round(lat, 5), round(lng, 5)

def get_island(x):
    if x > 400:
        return "Portland"
    elif x > -600:
        return "Staunton Island"
    else:
        return "Shoreside Vale"

def run():
    hp_file = os.path.join(BASE_DIR, "map-markers_mapTag_lcs_lc_groups_hidden_packages.json")
    with open(hp_file, "r", encoding="utf-8") as f:
        hp_raw = json.load(f)["markers"]

    side_file = os.path.join(BASE_DIR, "all_side_activities_markers.json")
    with open(side_file, "r", encoding="utf-8") as f:
        side_raw = json.load(f)

    ts_file = os.path.join(DATA_DIR, "packages_timestamps.json")
    if not os.path.exists(ts_file):
        ts_file = os.path.join(BASE_DIR, "packages_timestamps.json")
    with open(ts_file, "r", encoding="utf-8") as f:
        ts_data = json.load(f)

    ts_map = {p["num"]: p for p in ts_data}

    # Neutral, classic GTA colors
    categories = {
        "hidden_packages": {"name": "Hidden Packages", "color": "#e59400", "icon": "package", "desc": "100 rotating golden packages hidden across Liberty City."},
        "rampages": {"name": "Rampages", "color": "#c0392b", "icon": "skull", "desc": "20 kill-frenzy rampage skull pickups against rival gangs."},
        "unique_stunt_jumps": {"name": "Unique Stunt Jumps", "color": "#4a709c", "icon": "jump", "desc": "26 cinematic vehicular stunt jumps."},
        "car_races": {"name": "Car Races", "color": "#2e7d32", "icon": "car", "desc": "Street races initiated via public payphones."},
        "bike_races": {"name": "Bike Races", "color": "#16a085", "icon": "bike", "desc": "Motorcycle & scooter street racing challenges."},
        "rc_races": {"name": "RC Races", "color": "#7f8c8d", "icon": "rc", "desc": "Remote-controlled miniature car races in TOYZ vans."},
        "checkpoint_challenges": {"name": "Checkpoint Challenges", "color": "#d35400", "icon": "flag", "desc": "Time-trial checkpoint collection courses."},
        "drive_by_challenges": {"name": "Drive-by Challenges", "color": "#8e44ad", "icon": "target", "desc": "Vehicle drive-by gun challenges on bikes."},
        "bumps_and_grinds": {"name": "Bumps & Grinds", "color": "#27ae60", "icon": "crosshair", "desc": "10-course dirt bike motocross time-trials in Harwood."},
        "rc_triad_take_down": {"name": "RC Triad Take-down", "color": "#c0392b", "icon": "bomb", "desc": "Eliminate 20 Triads using self-destructing RC Bandits."},
        "see_the_sight_before_your_flight": {"name": "See the Sight Before Your Flight", "color": "#2980b9", "icon": "camera", "desc": "12-level tourist landmark photography tour."},
        "slash_tv": {"name": "Slash TV", "color": "#962d3e", "icon": "tv", "desc": "Chainsaw survival challenge in the cargo freighter hull."},
        "maria_latore": {"name": "Maria La Tore", "color": "#d4ac0d", "icon": "user", "desc": "Maria's apartment storyline and racing side missions."}
    }

    all_markers = []

    # Process 100 Hidden Packages
    # (No island unlock text - packages are available on their respective islands)
    # (Rewards are calculated dynamically based on player count in the app)
    for idx, m in enumerate(hp_raw):
        pkg_num = idx + 1
        meta = ts_map.get(pkg_num, {})
        loc_name = meta.get("name", "")
        start_sec = meta.get("start_sec", 0) + 7.5
        end_sec = meta.get("end_sec", 0)
        time_str = meta.get("time_str", "")

        lat, lng = coords_to_latlng(m["x"], m["y"])
        island = get_island(m["x"])

        img_file = f"assets/images/lcs_hp_{idx}.webp"
        if not os.path.exists(os.path.join(BASE_DIR, img_file)):
            img_file = None

        marker_obj = {
            "id": f"hp_{pkg_num}",
            "category": "hidden_packages",
            "number": pkg_num,
            "title": f"Hidden Package #{pkg_num}",
            "location": loc_name,
            "island": island,
            "unlock": None,  # No generic island unlock note
            "objective": f"Locate package #{pkg_num} in {loc_name}.",
            "x": m["x"],
            "y": m["y"],
            "lat": lat,
            "lng": lng,
            "image": img_file,
            "video": f"assets/videos/hp_{pkg_num}.mp4",
            "video_start": start_sec,
            "video_end": end_sec,
            "video_timestamp": time_str,
            "color": "#e59400",
            "countable": True
        }
        all_markers.append(marker_obj)

    # Process Side Activities & Challenges
    for group_id, items in side_raw.items():
        if group_id not in categories:
            continue
        cat_info = categories[group_id]

        for s_idx, m in enumerate(items):
            m_id = m.get("id", f"{group_id}_{s_idx}")
            lat, lng = coords_to_latlng(m["x"], m["y"])
            island = get_island(m["x"])
            item_num = s_idx + 1
            title = m.get("title") or cat_info["name"]

            # Only include unlock if it is a specific MISSION requirement (not an island unlock)
            unlock = None
            objective = cat_info["desc"]
            reward = "Cash reward & 100% completion stat"

            # Specific missions
            if "cc_scrap" in m_id:
                title = "Scrapyard Challenge"
                objective = "Ride the Sanchez at the junkyard. Collect coronas across obstacles within 2 minutes."
                reward = "Cash ($4 x score) & 100% stat"
            elif "cc_track" in m_id:
                title = "Harwood Dirt Track Time Trial"
                objective = "Complete timed motocross laps on the Sanchez at Harwood dirt track."
                reward = "Cash reward & 100% stat"
            elif "cc_gogo" in m_id:
                title = "Go-Go Faggio Checkpoints"
                objective = "Ride the Faggio through 25 checkpoints before the countdown expires."
                reward = "$1,000 cash & 100% stat"

            elif "dbc_freeway" in m_id:
                title = "9mm Mayhem"
                objective = "Mount the Freeway behind Woody's Topless Bar. Fire 9mm pistol to destroy targets."
                reward = "$1,500 cash & 100% stat"
            elif "dbc_faggio" in m_id:
                title = "Scooter Shooter"
                objective = "Hop on the Faggio in Chinatown. Destroy target vehicles using an SMG."
                reward = "$1,500 cash & 100% stat"
            elif "dbc_angel" in m_id:
                title = "AWOL Angel"
                unlock = "Requires mission 'Love on the Rocks'"
                objective = "Ride the Angel in Wichita Gardens with infinite M60 ammo to eliminate rogue soldiers."
                reward = "$1,500 cash & 100% stat"

            elif "car_races" in group_id:
                if s_idx == 0:
                    title = "Low Rider Rumble (Payphone)"
                    unlock = "Requires mission 'Grease Sucho'"
                    objective = "Answer the Trenton payphone. Win the street race in a low-rider."
                elif s_idx == 1:
                    title = "Deimos Dash & Torrington T.T. (Payphone)"
                    objective = "Answer the Torrington payphone. Win street races across Staunton Island."
                else:
                    title = "Wi-Cheetah Run & Gangsta GP (Payphone)"
                    objective = "Answer the Pike Creek payphone. Win sports car races in Shoreside Vale."
                reward = "$1,500 cash per race & 100% stat"

            elif "bike_races" in group_id:
                if s_idx == 0:
                    title = "Red-Light Rush (Sanchez)"
                    unlock = "Requires mission 'Booby Prize'"
                    objective = "Outside Mr. Wong's Laundrette. Win the motorbike race on a Sanchez."
                elif s_idx == 1:
                    title = "Torrington T.T. (PCJ-600)"
                    objective = "Motorbike time-trial through Torrington financial streets."
                else:
                    title = "Wichita Wheelie (Shoreside Bike Race)"
                    objective = "Motorbike race through the twists of Shoreside Vale."
                reward = "$1,500 cash & 100% stat"

            elif "rc_races" in group_id:
                if s_idx == 0:
                    title = "Thrashing RC Buggies"
                    objective = "Enter the TOYZ van in Hepburn Heights. Win the miniature RC buggy race."
                elif s_idx == 1:
                    title = "Ragin' RC Buggies"
                    objective = "Enter the TOYZ van in Belleville Park. Win the RC circuit race."
                else:
                    title = "Chasin' RC Buggies"
                    objective = "Enter the TOYZ van in Wichita Gardens. Win the RC buggy race."
                reward = "$1,000 cash per race & 100% stat"

            elif "slash_tv" in group_id:
                title = "Slash TV (Chainsaw Survival)"
                unlock = "Requires mission 'The Offer' & Overalls outfit"
                objective = "In the Portland freighter cargo hold. Survive aggressive chainsaw maniacs."
                reward = "Cox Mascot Outfit & $1,500+ cash"
            elif "bumps_and_grinds" in group_id:
                title = "Bumps & Grinds"
                objective = "Harwood Dirt Track. Complete all 10 motocross obstacle courses."
                reward = "Permanent Manana & Sanchez spawns at track"
            elif "rc_triad_take_down" in group_id:
                title = "RC Triad Take-Down"
                objective = "TOYZ van in Chinatown. Detonate RC Bandits to eliminate 20 Triads."
                reward = "$1,000 cash & 100% stat"
            elif "see_the_sight_before_your_flight" in group_id:
                title = "See the Sight Before Your Flight"
                objective = "Francis Intl Airport kiosk. Drive tourists to 12 landmark photos."
                reward = "Bulletproof Landstalker at Airport"
            elif "maria_latore" in group_id:
                title = "Maria La Tore's Apartment"
                unlock = "Requires mission 'Snuff'"
                objective = "Maria's story missions: Shop til You Strop, Taken for a Ride, Booby Prize, Biker Heat."
                reward = "Story progress & race unlocks"

            elif "rampages" in group_id:
                title = f"Rampage #{item_num}"
                objective = f"Pick up the skull icon. Eliminate rival gang members within 2 minutes."
                reward = f"${50 * item_num} cash & 100% stat"
            elif "unique_stunt_jumps" in group_id:
                title = f"Unique Stunt Jump #{item_num}"
                objective = f"Hit the ramp with high speed and land cleanly in the designated zone."
                reward = "$250 cash & 100% stat"

            img_file = f"assets/images/lcs_{group_id}_{s_idx}.webp"
            if not os.path.exists(os.path.join(BASE_DIR, img_file)):
                img_file = None

            marker_obj = {
                "id": m_id,
                "category": group_id,
                "number": item_num,
                "title": title,
                "location": island,
                "island": island,
                "unlock": unlock,  # None if no special mission requirement
                "objective": objective,
                "reward": reward,
                "x": m["x"],
                "y": m["y"],
                "lat": lat,
                "lng": lng,
                "image": img_file,
                "video": None,
                "color": cat_info["color"],
                "countable": True
            }
            all_markers.append(marker_obj)

    # Update counts
    for cat_id in categories:
        count = sum(1 for m in all_markers if m["category"] == cat_id)
        categories[cat_id]["count"] = count

    output_data = {
        "categories": categories,
        "islands": ["Portland", "Staunton Island", "Shoreside Vale"],
        "markers": all_markers
    }

    out_file = os.path.join(DATA_DIR, "markers.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2)

    print(f"Generated clean {out_file} with {len(all_markers)} markers.")

if __name__ == "__main__":
    run()
