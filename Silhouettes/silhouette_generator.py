import cv2
import os
import shutil
import subprocess

input_folder = 'original_clips'
output_folder = 'silhouettes'

# Make sure output folder exists
os.makedirs(output_folder, exist_ok=True)

for filename in os.listdir(input_folder):
    if filename.endswith('.mp4'):
        video_path = os.path.join(input_folder, filename)
        name = os.path.splitext(filename)[0]
        temp_frame_folder = os.path.join(output_folder, f"{name}_frames")

        # Clear temp folder
        if os.path.exists(temp_frame_folder):
            shutil.rmtree(temp_frame_folder)
        os.makedirs(temp_frame_folder)

        print(f"🔄 Processing: {filename}")
        cap = cv2.VideoCapture(video_path)
        ret, _ = cap.read()
        if not ret:
            print(f"❌ Could not read video: {filename}")
            cap.release()
            continue

        frame_count = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray = cv2.GaussianBlur(gray, (5, 5), 0)
            silhouette = cv2.adaptiveThreshold(
                gray, 255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY_INV,
                11, 2
            )

            frame_path = os.path.join(temp_frame_folder, f"frame_{frame_count:04d}.png")
            cv2.imwrite(frame_path, silhouette)
            frame_count += 1

        cap.release()

        # 🧵 Stitch frames into .mp4 using FFmpeg
        output_mp4 = os.path.join(output_folder, f"{name}_web_ready.mp4")
        ffmpeg_cmd = [
            'ffmpeg',
            '-y',
            '-framerate', '30',
            '-i', os.path.join(temp_frame_folder, 'frame_%04d.png'),
            '-c:v', 'libx264',
            '-preset', 'slow',
            '-crf', '23',
            '-pix_fmt', 'yuv420p',
            output_mp4
        ]
        subprocess.run(ffmpeg_cmd)

        print(f"✅ Saved browser-ready video: {output_mp4}")

        # Optionally delete temp frames
        shutil.rmtree(temp_frame_folder)

print("🎉 All silhouette videos generated and re-encoded for frontend use.")