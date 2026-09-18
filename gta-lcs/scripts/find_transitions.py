import subprocess
import json
import os

with open("packages_timestamps.json", "r", encoding="utf-8") as f:
    packages = json.load(f)

# For packages 1, 2, 3, 4, 5, 10, 20, let's analyze the first 12 seconds after start_sec
# Check when gameplay starts.
# Gameplay has different characteristics (darker, 3D, HUD, etc.)
# Let's extract frames at start_sec + 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 for packs 1..5

results = []
for p in packages[:6]:
    num = p["num"]
    start = p["start_sec"]
    end = p["end_sec"]
    print(f"\nAnalyzing Pack #{num} (start={start}, end={end}, total_len={end-start})")
    
    os.makedirs(f"scratch/test_p{num}", exist_ok=True)
    frame_info = []
    for dt in range(0, min(14, end - start)):
        t = start + dt
        out_jpg = f"scratch/test_p{num}/f_{dt}.jpg"
        cmd = ["ffmpeg", "-y", "-ss", str(t), "-i", "GTA Liberty City Stories Mobile - Hidden Packages [MbK2nhBoVL4].webm", "-vframes", "1", "-vf", "scale=160:-2", out_jpg]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        sz = os.path.getsize(out_jpg) if os.path.exists(out_jpg) else 0
        frame_info.append((dt, t, sz))
    
    for dt, t, sz in frame_info:
        print(f"  dt={dt}s (t={t}s): size={sz}")
