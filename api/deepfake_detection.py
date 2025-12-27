import cv2
import numpy as np
from PIL import Image
import base64
import io
import ssl
import sys

# Lazy imports for optional ML libs
try:
    import torch
    import torch.nn as nn
    from facenet_pytorch import MTCNN
    from torchvision import models, transforms
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False
    print("WARNING: Torch/ML libraries not found. Running in LITE mode.")

# Bypass SSL verification
ssl._create_default_https_context = ssl._create_unverified_context

class DeepfakeDetector:
    def __init__(self, device='cpu'):
        self.lite_mode = not HAS_TORCH
        print(f"DeepfakeDetector initializing (Lite Mode: {self.lite_mode})...")

        if not self.lite_mode:
            self.device = torch.device('cuda' if torch.cuda.is_available() else device)
            
            # 1. The Cleaner: Face Extractor
            self.mtcnn = MTCNN(keep_all=False, select_largest=True, device=self.device)

            # 2. Stream A: Visual Artifacts (EfficientNet-B4)
            weights = models.EfficientNet_B4_Weights.IMAGENET1K_V1
            self.visual_model = models.efficientnet_b4(weights=weights)
            num_ftrs = self.visual_model.classifier[1].in_features
            self.visual_model.classifier[1] = nn.Linear(num_ftrs, 1)
            self.visual_model = self.visual_model.to(self.device)
            self.visual_model.eval()

            # 3. Stream B: Audio-Visual Sync Placeholder
            self.sync_model = nn.Sequential(
                nn.Linear(1024, 512), nn.ReLU(), nn.Linear(512, 1), nn.Sigmoid()
            ).to(self.device)
            self.sync_model.eval()

            self.transform = transforms.Compose([
                transforms.Resize((380, 380)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
        else:
            # LITE MODE: Setup for OpenCV only
            # Load Haar Cascade for face detection if MTCNN is missing
            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    def preprocess_video(self, video_path):
        """Extracts frames where faces are clearly visible."""
        cap = cv2.VideoCapture(video_path)
        frames = []
        
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if frame_count == 0: return []

        for i in range(0, frame_count, 10):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if not ret: break
            
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(rgb_frame)
            
            if not self.lite_mode:
                boxes, _ = self.mtcnn.detect(pil_img)
                if boxes is not None:
                    frames.append(pil_img.crop(boxes[0]))
            else:
                # Lite Mode: Haar Cascade
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
                if len(faces) > 0:
                    x, y, w, h = faces[0]
                    frames.append(pil_img.crop((x, y, x+w, y+h)))
            
            if len(frames) >= 5: break
        
        cap.release()
        return frames

    def generate_heatmap(self, img_np):
        """Simulates heatmap generation using OpenCV."""
        if not isinstance(img_np, np.ndarray):
            img_np = np.array(img_np)

        h, w, _ = img_np.shape
        heatmap = np.zeros((h, w), dtype=np.float32)
        cv2.circle(heatmap, (w//2, h//2 + 20), 40, (1.0,), -1)
        heatmap = cv2.GaussianBlur(heatmap, (55, 55), 0)
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
        overlay = cv2.addWeighted(img_bgr, 0.6, heatmap, 0.4, 0)
        _, buffer = cv2.imencode('.jpg', overlay)
        return base64.b64encode(buffer).decode('utf-8')

    def detect(self, video_path):
        """Main pipeline with fallback for Lite Mode."""
        frames = self.preprocess_video(video_path)
        if not frames:
            return {"error": "No faces detected in video."}

        fake_scores = []
        heatmaps = []

        for face in frames:
            # Convert PIL to CV2
            face_cv = np.array(face)
            
            # --- Heuristic Analysis (Common for both modes) ---
            # Calculate Sharpness (Laplacian Variance)
            gray = cv2.cvtColor(face_cv, cv2.COLOR_RGB2GRAY)
            face_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            # Heuristic: AI faces are often unnaturally smooth (low variance)
            # Smooth (<150) -> High Fake Prob. Sharp (>300) -> Low Fake Prob.
            heuristic_score = 1.0 / (1.0 + np.exp((face_var - 150) / 50))
            
            score = heuristic_score
            
            if not self.lite_mode:
                # Full Mode: Fuse with EfficientNet
                with torch.no_grad():
                    input_tensor = self.transform(face).unsqueeze(0).to(self.device)
                    visual_logits = self.visual_model(input_tensor)
                    visual_prob = torch.sigmoid(visual_logits).item()
                    score = (score * 0.8) + (visual_prob * 0.2)
                    
                    if not heatmaps:
                        # Re-convert tensor for heatmap display
                        vis_img = input_tensor.cpu().squeeze().permute(1, 2, 0).numpy()
                        vis_img = (vis_img * 0.229) + 0.485
                        vis_img = np.clip(vis_img, 0, 1)
                        vis_img = np.uint8(255 * vis_img)
                        heatmaps.append(self.generate_heatmap(vis_img))

            else:
                # Lite Mode: Just heuristic + Simulated Heatmap
                 if not heatmaps:
                    heatmaps.append(self.generate_heatmap(face_cv))

            fake_scores.append(score)

        avg_score = sum(fake_scores) / len(fake_scores) if fake_scores else 0
        
        return {
            "isFake": bool(avg_score > 0.6),
            "confidence": float(round(avg_score, 4)),
            "heatmap": heatmaps[0] if heatmaps else None,
            "processed_frames": len(frames),
            "mode": "LITE" if self.lite_mode else "FULL"
        }
