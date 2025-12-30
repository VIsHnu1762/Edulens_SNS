/**
 * EduLens - Image Uploader
 * Handles image upload, preview, camera capture, and backend communication
 */

class ImageUploader {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.uploadedFile = null;
        this.resultData = null;
        this.stream = null;
        this.canvas = null;
        this.ctx = null;
    }

    initElements() {
        // File upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.previewArea = document.getElementById('previewArea');
        this.resultCard = document.getElementById('resultCard');
        this.imageInput = document.getElementById('imageInput');
        this.selectBtn = document.getElementById('selectBtn');
        this.changeImageBtn = document.getElementById('changeImageBtn');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.view3DBtn = document.getElementById('view3DBtn');
        this.imagePreview = document.getElementById('imagePreview');
        this.predictedSubject = document.getElementById('predictedSubject');
        this.confidenceFill = document.getElementById('confidenceFill');
        this.confidenceValue = document.getElementById('confidenceValue');
        this.uploadSpinner = document.getElementById('uploadSpinner');
        
        // Camera elements
        this.cameraPlaceholder = document.getElementById('cameraPlaceholder');
        this.cameraView = document.getElementById('cameraView');
        this.cameraPreview = document.getElementById('cameraPreview');
        this.startCameraBtn = document.getElementById('startCameraBtn');
        this.stopCameraBtn = document.getElementById('stopCameraBtn');
        this.captureBtn = document.getElementById('captureBtn');
        this.retakeBtn = document.getElementById('retakeBtn');
        this.useCameraPhotoBtn = document.getElementById('useCameraPhotoBtn');
        this.cameraVideo = document.getElementById('cameraVideo');
        this.cameraCanvas = document.getElementById('cameraCanvas');
        this.cameraSpinner = document.getElementById('cameraSpinner');
    }

    initEventListeners() {
        // File upload listeners
        this.selectBtn.addEventListener('click', () => this.imageInput.click());
        this.uploadArea.addEventListener('click', (e) => {
            if (e.target === this.uploadArea || e.target.closest('.upload-area')) {
                this.imageInput.click();
            }
        });
        
        this.imageInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        this.changeImageBtn.addEventListener('click', () => this.resetUpload());
        this.uploadBtn.addEventListener('click', () => this.uploadImage());
        this.view3DBtn.addEventListener('click', () => this.open3DViewer());
        
        // Camera listeners
        this.startCameraBtn.addEventListener('click', () => this.startCamera());
        this.stopCameraBtn.addEventListener('click', () => this.stopCamera());
        this.captureBtn.addEventListener('click', () => this.capturePhoto());
        this.retakeBtn.addEventListener('click', () => this.retakePhoto());
        this.useCameraPhotoBtn.addEventListener('click', () => this.uploadCameraPhoto());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    processFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        this.uploadedFile = file;
        this.showPreview(file);
    }

    showPreview(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            this.imagePreview.src = e.target.result;
            this.uploadArea.classList.add('hidden');
            this.previewArea.classList.remove('hidden');
            this.resultCard.classList.add('hidden');
        };
        
        reader.readAsDataURL(file);
    }

    resetUpload() {
        this.uploadedFile = null;
        this.resultData = null;
        this.imageInput.value = '';
        this.uploadArea.classList.remove('hidden');
        this.previewArea.classList.add('hidden');
        this.resultCard.classList.add('hidden');
    }

    async uploadImage() {
        if (!this.uploadedFile) {
            alert('Please select an image first');
            return;
        }

        // Show loading state
        this.uploadBtn.disabled = true;
        this.uploadSpinner.classList.remove('hidden');
        document.querySelector('.btn-text').textContent = 'Analyzing...';

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('image', this.uploadedFile);

            // Upload to backend
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.UPLOAD_IMAGE, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();
            this.resultData = data;
            this.showResult(data);

        } catch (error) {
            console.error('Upload error:', error);
            
            // Demo mode fallback
            if (API_CONFIG.DEMO_MODE) {
                console.log('Using demo mode for image classification');
                this.resultData = this.getDemoClassificationResult();
                this.showResult(this.resultData);
            } else {
                alert('Failed to upload image. Please try again.');
                
                // Reset loading state
                this.uploadBtn.disabled = false;
                this.uploadSpinner.classList.add('hidden');
                document.querySelector('.btn-text').textContent = 'Analyze & Generate 3D';
            }
        }
    }

    getDemoClassificationResult() {
        // Demo classification results based on common educational subjects
        const demoResults = [
            { predicted_subject: 'heart', confidence: 94, model_path: '/static/models/heart.glb' },
            { predicted_subject: 'cell', confidence: 89, model_path: '/static/models/cell.glb' },
            { predicted_subject: 'dna', confidence: 92, model_path: '/static/models/dna.glb' },
            { predicted_subject: 'atom', confidence: 87, model_path: '/static/models/atom.glb' },
            { predicted_subject: 'brain', confidence: 91, model_path: '/static/models/brain.glb' },
            { predicted_subject: 'lung', confidence: 88, model_path: '/static/models/lung.glb' }
        ];
        
        // Return random demo result
        const randomIndex = Math.floor(Math.random() * demoResults.length);
        return demoResults[randomIndex];
    }

    showResult(data) {
        // Hide loading state
        this.uploadBtn.disabled = false;
        this.uploadSpinner.classList.add('hidden');
        document.querySelector('.btn-text').textContent = 'Analyze & Generate 3D';

        // Show result
        this.predictedSubject.textContent = data.predicted_subject || 'Unknown';
        
        // Set confidence (default to 95% if not provided)
        const confidence = data.confidence || 95;
        this.confidenceFill.style.width = `${confidence}%`;
        this.confidenceValue.textContent = `${confidence}%`;
        
        // Store model path for 3D viewer
        this.modelPath = data.model_path || `/static/models/${data.predicted_subject}.glb`;
        
        // Show result card
        this.resultCard.classList.remove('hidden');
        
        // Scroll to result
        this.resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Log activity to backend (optional)
        this.logActivity('image_upload', data.predicted_subject);
    }

    open3DViewer() {
        if (this.modelPath) {
            // Store data in sessionStorage for viewer page
            sessionStorage.setItem('modelData', JSON.stringify({
                path: this.modelPath,
                subject: this.resultData.predicted_subject,
                confidence: this.resultData.confidence
            }));
            
            // Navigate to viewer
            window.location.href = 'viewer.html';
        } else {
            alert('Model path not available');
        }
    }

    async logActivity(type, subject) {
        try {
            await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ACTIVITY_LOG, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    activity_type: type,
                    subject: subject,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('Failed to log activity:', error);
            if (API_CONFIG.DEMO_MODE) {
                console.log(`Demo mode: Logged activity - ${type} for ${subject}`);
            }
        }
    }

    // ========================================
    // Camera Methods
    // ========================================

    async startCamera() {
        try {
            // Request camera access
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });

            // Set video source
            this.cameraVideo.srcObject = this.stream;
            
            // Show camera view
            this.cameraPlaceholder.classList.add('hidden');
            this.cameraView.classList.remove('hidden');
            
            console.log('Camera started successfully');
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please make sure you have granted camera permissions.');
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.cameraVideo.srcObject = null;
        this.cameraView.classList.add('hidden');
        this.cameraPlaceholder.classList.remove('hidden');
        this.cameraPreview.classList.add('hidden');
    }

    capturePhoto() {
        // Initialize canvas if not already done
        if (!this.canvas) {
            this.canvas = this.cameraCanvas;
            this.ctx = this.canvas.getContext('2d');
        }

        // Set canvas dimensions to match video
        const video = this.cameraVideo;
        this.canvas.width = video.videoWidth;
        this.canvas.height = video.videoHeight;

        // Draw current video frame to canvas
        this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);

        // Stop camera stream
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        // Show preview
        this.cameraView.classList.add('hidden');
        this.cameraPreview.classList.remove('hidden');
        this.resultCard.classList.add('hidden');

        console.log('Photo captured');
    }

    retakePhoto() {
        this.cameraPreview.classList.add('hidden');
        this.startCamera(); // Restart camera
    }

    async uploadCameraPhoto() {
        // Show loading state
        this.useCameraPhotoBtn.disabled = true;
        this.cameraSpinner.classList.remove('hidden');
        this.useCameraPhotoBtn.querySelector('.btn-text').textContent = 'Analyzing...';

        try {
            // Convert canvas to blob
            const blob = await new Promise(resolve => {
                this.canvas.toBlob(resolve, 'image/jpeg', 0.95);
            });

            // Create file from blob
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            this.uploadedFile = file;

            // Create FormData
            const formData = new FormData();
            formData.append('image', file);

            // Upload to backend
            const response = await fetch('/upload-image', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();
            this.resultData = data;
            this.showResult(data);

        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            // Reset loading state
            this.useCameraPhotoBtn.disabled = false;
            this.cameraSpinner.classList.add('hidden');
            this.useCameraPhotoBtn.querySelector('.btn-text').textContent = 'Analyze & Generate 3D';
        }
    }
}

// Initialize uploader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ImageUploader();
});
