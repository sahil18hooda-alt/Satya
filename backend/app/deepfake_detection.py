import cv2
import torch
import torch.nn as nn
import numpy as np
from facenet_pytorch import MTCNN
from torchvision import models, transforms
from PIL import Image
import base64
import io
import ssl

# Bypass SSL verification for model downloads (common issue on Mac)
ssl._create_default_https_context = ssl._create_unverified_context

class DeepfakeDetector:
    def __init__(self, device='cpu'):
        self.device = torch.device('cuda' if torch.cuda.is_available() else device)
        print(f"DeepfakeDetector initializing on {self.device}...")

        # 1. The Cleaner: Face Extractor
        self.mtcnn = MTCNN(keep_all=False, select_largest=True, device=self.device)

        # 2. Stream A: Visual Artifacts (EfficientNet-B4)
        # Using pretrained weights for feature extraction foundation
        weights = models.EfficientNet_B4_Weights.IMAGENET1K_V1
        self.visual_model = models.efficientnet_b4(weights=weights)
        
        # Modify classifier for 2 classes (Real vs Fake)
        num_ftrs = self.visual_model.classifier[1].in_features
        self.visual_model.classifier[1] = nn.Linear(num_ftrs, 1) # Sigmoid output later
        self.visual_model = self.visual_model.to(self.device)
        self.visual_model.eval()

        # 3. Stream B: Audio-Visual Sync (SyncNet Placeholder)
        # In a full production system, we would load 'wav2lip' or 'syncnet' weights here.
        # For this prototype, we will simulate the sync check architecture.
        self.sync_model = self._build_sync_stream().to(self.device)
        self.sync_model.eval()

        self.transform = transforms.Compose([
            transforms.Resize((380, 380)), # EfficientNet-B4 input size
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    def _build_sync_stream(self):
        """Builds a lightweight placeholder for the SyncNet stream."""
        model = nn.Sequential(
            nn.Linear(1024, 512),
            nn.ReLU(),
            nn.Linear(512, 1),
            nn.Sigmoid()
        )
        return model

    def preprocess_video(self, video_path):
        """Extracts frames where faces are clearly visible."""
        cap = cv2.VideoCapture(video_path)
        frames = []
        frame_indices = []
        
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if frame_count == 0: return []

        # Strategy: Sample every 10th frame to save compute
        for i in range(0, frame_count, 10):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if not ret: break
            
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(rgb_frame)
            
            # Detect face
            # mtcnn returns boxes, probs. We just check if a face exists.
            boxes, _ = self.mtcnn.detect(pil_img)
            
            if boxes is not None:
                # Crop the first face
                box = boxes[0]
                face = pil_img.crop(box)
                frames.append(face)
            
            if len(frames) >= 5: # Limit to 5 frames for prototype speed
                break
        
        cap.release()
        return frames

    def generate_heatmap(self, tensor_img):
        """
        Simulates Grad-CAM heatmap generation.
        In a real scenario, this hooks into the last conv layer gradients.
        Here, we generate a synthetic heatmap based on high-frequency regions (mouth/eyes).
        """
        # Un-normalize for visualization
        img = tensor_img.cpu().squeeze().permute(1, 2, 0).numpy()
        img = (img * 0.229) + 0.485 # Approx un-norm
        img = np.clip(img, 0, 1)

        # Create a dummy heatmap mask (highlighting center - usually mouth/nose)
        h, w, _ = img.shape
        heatmap = np.zeros((h, w), dtype=np.float32)
        
        # Highlight lower center (mouth region)
        cv2.circle(heatmap, (w//2, h//2 + 20), 40, (1.0,), -1)
        heatmap = cv2.GaussianBlur(heatmap, (55, 55), 0)

        # Colorize
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        # Overlay
        img_uint8 = np.uint8(255 * img)
        img_bgr = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2BGR)
        overlay = cv2.addWeighted(img_bgr, 0.6, heatmap, 0.4, 0)
        
        # Convert to base64 for frontend
        _, buffer = cv2.imencode('.jpg', overlay)
        return base64.b64encode(buffer).decode('utf-8')

    def detect(self, video_path):
        """
        Main inference pipeline.
        Returns: { 'isFake': bool, 'confidence': float, 'heatmap': base64_str }
        """
        frames = self.preprocess_video(video_path)
        if not frames:
            return {"error": "No faces detected in video."}

        # Run Inference on gathered frames
        fake_scores = []
        heatmaps = []

        with torch.no_grad():
            for face in frames:
                # Preprocess
                input_tensor = self.transform(face).unsqueeze(0).to(self.device)
                
                # Stream A: Visual artifacts (Heuristic: Blur/Smoothness Mismatch)
                # AI faces are often "smoother" (low frequency) than the background.
                
                # 1. Calculate Face Sharpness (Laplacian Variance)
                face_cv = np.array(face) 
                face_cv = cv2.cvtColor(face_cv, cv2.COLOR_RGB2GRAY)
                face_var = cv2.Laplacian(face_cv, cv2.CV_64F).var()
                
                # 2. Heuristic Score
                # Normal sharp face ~ 300-500. Blurry/Smooth AI face < 100.
                # We map variance to a probability: Lower var -> Higher Fake Prob.
                
                # Sigmoid-ish mapping: 
                # If var < 150 (Smooth) -> High fake score.
                # If var > 300 (Sharp) -> Low fake score.
                
                heuristic_score = 1.0 / (1.0 + np.exp((face_var - 150) / 50))
                
                # Stream B: NN (Still random/untrained, so we reduce its weight)
                visual_logits = self.visual_model(input_tensor)
                visual_prob = torch.sigmoid(visual_logits).item()
                
                # Fusion: 80% Heuristic, 20% NN (Noise)
                score = (heuristic_score * 0.8) + (visual_prob * 0.2)
                fake_scores.append(score)
                
                # Generate heatmap for the first frame only
                if not heatmaps:
                    heatmaps.append(self.generate_heatmap(input_tensor))

        avg_score = sum(fake_scores) / len(fake_scores) if fake_scores else 0
        
        return {
            "isFake": bool(avg_score > 0.65), # Ensure native python bool
            "confidence": float(round(avg_score, 4)),
            "heatmap": heatmaps[0] if heatmaps else None,
            "processed_frames": len(frames)
        }
