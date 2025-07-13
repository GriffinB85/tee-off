import cv2

# Load one frame from your video
video_path = 'proc_clips/Poston_trimmed.mp4'
cap = cv2.VideoCapture(video_path)
ret, frame = cap.read()
cap.release()

if not ret:
    print("❌ Could not read frame")
    exit()

gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

def update_gui(val=0):
    # Read slider values
    alpha = cv2.getTrackbarPos('Contrast (α)', 'Tuner') / 10.0
    beta = cv2.getTrackbarPos('Brightness (β)', 'Tuner')
    thresh_val = cv2.getTrackbarPos('Threshold', 'Tuner')

    # Apply contrast and brightness
    enhanced = cv2.convertScaleAbs(gray, alpha=alpha, beta=beta)

    # Adaptive or fixed threshold (switchable if you want later)
    _, silhouette = cv2.threshold(enhanced, thresh_val, 255, cv2.THRESH_BINARY)

    # Show result
    cv2.imshow('Tuner', silhouette)

# Create window
cv2.namedWindow('Tuner', cv2.WINDOW_NORMAL)
cv2.resizeWindow('Tuner', 640, 360)

cv2.createTrackbar('Contrast (α)', 'Tuner', 15, 30, update_gui)   # 1.5 default
cv2.createTrackbar('Brightness (β)', 'Tuner', 20, 100, update_gui)
cv2.createTrackbar('Threshold', 'Tuner', 100, 255, update_gui)

# Initial display
update_gui()

print("🎛️ Adjust sliders until you're happy. Press ESC to exit.")
while True:
    if cv2.waitKey(1) == 27:  # ESC to quit
        break

cv2.destroyAllWindows()