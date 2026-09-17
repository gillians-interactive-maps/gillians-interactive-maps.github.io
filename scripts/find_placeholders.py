import os
import hashlib
import json

PLACEHOLDER_HASH = '8577b99e83d7350b3f2e4a09c7db6a8f'
IMG_DIR = os.path.join("assets", "images")
DATA_FILE = os.path.join("data", "markers.json")

# Find all placeholder files
placeholders = set()
for f in os.listdir(IMG_DIR):
    p = os.path.join(IMG_DIR, f)
    with open(p, 'rb') as fp:
        if hashlib.md5(fp.read()).hexdigest() == PLACEHOLDER_HASH:
            placeholders.add(f"assets/images/{f}")

print(f"Total placeholder images found: {len(placeholders)}")
for ph in sorted(placeholders):
    print(" ", ph)

# Now update markers.json: if marker["image"] in placeholders, set marker["image"] = None
with open(DATA_FILE, "r", encoding="utf-8") as fp:
    data = json.load(fp)

removed_count = 0
for m in data["markers"]:
    if m.get("image") in placeholders:
        m["image"] = None
        removed_count += 1

with open(DATA_FILE, "w", encoding="utf-8") as fp:
    json.dump(data, fp, indent=2)

print(f"Updated markers.json: set image to null for {removed_count} markers.")

# Optionally remove the placeholder files from disk
for ph in placeholders:
    if os.path.exists(ph):
        os.remove(ph)
print(f"Removed {len(placeholders)} placeholder files from disk.")
