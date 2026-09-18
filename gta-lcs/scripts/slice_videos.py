import os
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_VIDEO = os.path.join(BASE_DIR, "GTA Liberty City Stories Mobile - Hidden Packages [MbK2nhBoVL4].webm")
OUTPUT_DIR = os.path.join(BASE_DIR, "assets", "videos")
TIMESTAMPS_FILE = os.path.join(BASE_DIR, "packages_timestamps.json")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# The map screen lasts ~10 seconds before gameplay starts.
# Starting at start_sec + 7.5 gives exactly 2.5 seconds of the zoomed map
# with the flashing red pin, before smoothly cutting into 3D gameplay pickup.
LOCATION_LEAD_IN_SECONDS = 7.5

def slice_package(pkg):
    num = pkg["num"]
    start_sec = pkg["start_sec"] + LOCATION_LEAD_IN_SECONDS
    end_sec = pkg["end_sec"]
    out_file = os.path.join(OUTPUT_DIR, f"hp_{num}.mp4")

    duration = max(3.0, end_sec - start_sec)
    
    cmd = [
        "ffmpeg",
        "-y",
        "-ss", str(start_sec),
        "-i", INPUT_VIDEO,
        "-t", str(duration),
        "-c:v", "libx264",
        "-crf", "25",
        "-preset", "veryfast",
        "-vf", "scale=-2:540",
        "-c:a", "aac",
        "-b:a", "96k",
        "-movflags", "+faststart",
        out_file
    ]

    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if res.returncode == 0 and os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
            size_kb = os.path.getsize(out_file) / 1024
            return num, True, f"Created ({size_kb:.1f} KB, ~{duration:.1f}s)"
        else:
            return num, False, res.stderr.decode('utf-8', errors='ignore')[-300:]
    except Exception as e:
        return num, False, str(e)

def run():
    if not os.path.exists(INPUT_VIDEO):
        print(f"Error: Input video not found at {INPUT_VIDEO}")
        return

    with open(TIMESTAMPS_FILE, "r", encoding="utf-8") as f:
        packages = json.load(f)

    print(f"Slicing {len(packages)} packages with 2.5s location lead-in (4 workers)...")
    success_count = 0

    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(slice_package, pkg): pkg["num"] for pkg in packages}
        for future in as_completed(futures):
            num = futures[future]
            n, ok, msg = future.result()
            if ok:
                success_count += 1
                if success_count % 10 == 0 or success_count == len(packages):
                    print(f"Progress: {success_count}/{len(packages)} clips. (Pack #{n}: {msg})")
            else:
                print(f"FAILED Pack #{n}: {msg}")

    print(f"\nAll {success_count}/{len(packages)} trimmed video clips ready in {OUTPUT_DIR}!")

if __name__ == "__main__":
    run()
