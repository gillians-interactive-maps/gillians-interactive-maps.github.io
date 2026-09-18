import subprocess
import os

# Check frames around pack 1 (0:45) and pack 2 (1:04) and pack 3 (1:39)
# Extract frames every 1 second from 45 to 55
os.makedirs("scratch/frames_p1", exist_ok=True)
for s in range(45, 56):
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(s),
        "-i", "GTA Liberty City Stories Mobile - Hidden Packages [MbK2nhBoVL4].webm",
        "-vframes", "1",
        "-vf", "scale=320:-2",
        f"scratch/frames_p1/f_{s}.jpg"
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("Extracted frames for p1")
