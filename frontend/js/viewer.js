/**
 * EduLens - 3D Viewer
 * Three.js based interactive 3D model viewer
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Viewer3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedObject = null;
        this.animationSpeed = 1.0;
        this.isPlaying = false;
        
        this.init();
    }

    init() {
        this.loadModelData();
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initLights();
        this.initControls();
        this.initHelpers();
        this.initEventListeners();
        this.loadModel();
        this.animate();
    }

    loadModelData() {
        const modelData = sessionStorage.getItem('modelData');
        if (modelData) {
            this.modelData = JSON.parse(modelData);
            document.getElementById('modelTitle').textContent = 
                this.modelData.subject || 'Loading...';
        } else {
            // Default model for testing
            this.modelData = {
                path: '/static/models/heart.glb',
                subject: 'Heart',
                confidence: 95
            };
        }
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 50, 200);
    }

    initCamera() {
        const canvas = document.getElementById('canvas3D');
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 10);
        this.camera.lookAt(0, 0, 0);
    }

    initRenderer() {
        this.canvas = document.getElementById('canvas3D');
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    initLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.1;
        mainLight.shadow.camera.far = 50;
        this.scene.add(mainLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // Hemisphere light for more natural lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
        this.scene.add(hemiLight);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI;
        this.controls.enablePan = true;
        this.controls.panSpeed = 0.8;
        this.controls.rotateSpeed = 0.8;
        this.controls.zoomSpeed = 1.2;
        
        // Touch support
        this.controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };
    }

    initHelpers() {
        // Grid helper
        this.gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        this.gridHelper.visible = true;
        this.scene.add(this.gridHelper);

        // Axes helper
        this.axesHelper = new THREE.AxesHelper(5);
        this.axesHelper.visible = false;
        this.scene.add(this.axesHelper);
    }

    initEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mouse/touch interaction
        this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Control buttons
        document.getElementById('homeBtn').addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
        
        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        document.getElementById('resetCameraBtn').addEventListener('click', () => {
            this.resetCamera();
        });
        
        document.getElementById('topViewBtn').addEventListener('click', () => {
            this.setTopView();
        });
        
        document.getElementById('sideViewBtn').addEventListener('click', () => {
            this.setSideView();
        });
        
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.toggleAnimation();
        });
        
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.setAnimationSpeed(parseFloat(e.target.value));
        });
        
        document.getElementById('wireframeToggle').addEventListener('change', (e) => {
            this.toggleWireframe(e.target.checked);
        });
        
        document.getElementById('gridToggle').addEventListener('change', (e) => {
            this.gridHelper.visible = e.target.checked;
        });
        
        document.getElementById('axesToggle').addEventListener('change', (e) => {
            this.axesHelper.visible = e.target.checked;
        });
        
        document.getElementById('toggleControlBtn').addEventListener('click', () => {
            document.getElementById('controlPanel').classList.toggle('hidden');
        });
        
        document.getElementById('closeControlBtn').addEventListener('click', () => {
            document.getElementById('controlPanel').classList.add('hidden');
        });
        
        document.getElementById('screenshotBtn').addEventListener('click', () => {
            this.takeScreenshot();
        });
        
        document.getElementById('helpBtn').addEventListener('click', () => {
            document.getElementById('helpModal').classList.remove('hidden');
        });
        
        document.getElementById('closeHelpBtn').addEventListener('click', () => {
            document.getElementById('helpModal').classList.add('hidden');
        });
        
        document.getElementById('closeInfoBtn').addEventListener('click', () => {
            document.getElementById('infoPanel').classList.add('hidden');
        });
        
        // Close modal on background click
        document.getElementById('helpModal').addEventListener('click', (e) => {
            if (e.target.id === 'helpModal') {
                document.getElementById('helpModal').classList.add('hidden');
            }
        });
    }

    loadModel() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        const loader = new GLTFLoader();
        const loadingManager = new THREE.LoadingManager();
        
        loadingManager.onProgress = (url, loaded, total) => {
            const progress = (loaded / total) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        };
        
        loadingManager.onLoad = () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        };
        
        loader.manager = loadingManager;
        
        loader.load(
            this.modelData.path,
            (gltf) => this.onModelLoaded(gltf),
            (progress) => {
                const percent = (progress.loaded / progress.total) * 100;
                progressFill.style.width = `${percent}%`;
                progressText.textContent = `${Math.round(percent)}%`;
            },
            (error) => this.onModelError(error)
        );
    }

    onModelLoaded(gltf) {
        this.model = gltf.scene;
        
        // Center and scale model
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        
        this.model.scale.multiplyScalar(scale);
        this.model.position.sub(center.multiplyScalar(scale));
        
        // Enable shadows
        this.model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        
        this.scene.add(this.model);
        
        // Check for animations
        if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.model);
            this.animations = gltf.animations;
            
            // Play first animation by default
            const action = this.mixer.clipAction(this.animations[0]);
            action.play();
            this.isPlaying = true;
        }
        
        console.log('Model loaded successfully');
    }

    onModelError(error) {
        console.error('Error loading model:', error);
        document.getElementById('loadingScreen').innerHTML = `
            <div class="loading-content">
                <h3>Failed to Load Model</h3>
                <p>Please try again or go back to dashboard</p>
                <button class="btn btn-primary" onclick="window.location.href='dashboard.html'">
                    Back to Dashboard
                </button>
            </div>
        `;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        if (this.mixer && this.isPlaying) {
            this.mixer.update(delta * this.animationSpeed);
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onCanvasClick(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Raycast to find intersections
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        if (this.model) {
            const intersects = this.raycaster.intersectObjects(this.model.children, true);
            
            if (intersects.length > 0) {
                this.selectObject(intersects[0].object);
            } else {
                this.deselectObject();
            }
        }
    }

    onMouseMove(event) {
        // Optional: highlight objects on hover
    }

    selectObject(object) {
        // Deselect previous
        this.deselectObject();
        
        // Select new object
        this.selectedObject = object;
        
        if (object.material) {
            // Store original emissive
            this.originalEmissive = object.material.emissive.getHex();
            // Highlight
            object.material.emissive.setHex(0x4488ff);
        }
        
        // Show info panel
        const infoPanel = document.getElementById('infoPanel');
        const partName = document.getElementById('partName');
        const partInfo = document.getElementById('partInfo');
        
        partName.textContent = object.name || 'Model Part';
        partInfo.innerHTML = `<p>Selected: ${object.name || 'Unnamed part'}</p>`;
        infoPanel.classList.remove('hidden');
    }

    deselectObject() {
        if (this.selectedObject && this.selectedObject.material) {
            this.selectedObject.material.emissive.setHex(this.originalEmissive || 0x000000);
        }
        this.selectedObject = null;
    }

    resetCamera() {
        this.camera.position.set(5, 5, 10);
        this.camera.lookAt(0, 0, 0);
        this.controls.reset();
    }

    setTopView() {
        this.camera.position.set(0, 10, 0);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }

    setSideView() {
        this.camera.position.set(10, 2, 0);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }

    toggleAnimation() {
        if (!this.mixer) return;
        
        this.isPlaying = !this.isPlaying;
        const icon = document.getElementById('playPauseIcon');
        const btn = document.getElementById('playPauseBtn');
        
        if (this.isPlaying) {
            icon.textContent = '⏸️';
            btn.innerHTML = '<span id="playPauseIcon">⏸️</span> Pause';
        } else {
            icon.textContent = '▶️';
            btn.innerHTML = '<span id="playPauseIcon">▶️</span> Play';
        }
    }

    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
        document.getElementById('speedValue').textContent = `${speed.toFixed(1)}x`;
    }

    toggleWireframe(enabled) {
        if (this.model) {
            this.model.traverse((node) => {
                if (node.isMesh && node.material) {
                    node.material.wireframe = enabled;
                }
            });
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    takeScreenshot() {
        this.renderer.render(this.scene, this.camera);
        const screenshot = this.canvas.toDataURL('image/png');
        
        // Download
        const link = document.createElement('a');
        link.download = `edulens-${this.modelData.subject}-${Date.now()}.png`;
        link.href = screenshot;
        link.click();
    }

    dispose() {
        // Clean up GPU resources
        if (this.model) {
            this.model.traverse((node) => {
                if (node.geometry) {
                    node.geometry.dispose();
                }
                if (node.material) {
                    if (Array.isArray(node.material)) {
                        node.material.forEach(mat => mat.dispose());
                    } else {
                        node.material.dispose();
                    }
                }
            });
        }
        
        this.renderer.dispose();
    }
}

// Initialize viewer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const viewer = new Viewer3D();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        viewer.dispose();
    });
});
