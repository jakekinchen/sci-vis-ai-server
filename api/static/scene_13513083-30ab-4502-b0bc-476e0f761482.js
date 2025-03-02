// Scientific visualization: Visualizing Ethane Rotation
// Auto-generated code

// Global variables
// Use existing globals if defined, otherwise create new ones
var scene = window.scene || null;
var camera = window.camera || null;
var renderer = window.renderer || null;
var controls = window.controls || null;
var clock = window.clock || null;
var isPlaying = typeof window.isPlaying !== 'undefined' ? window.isPlaying : true;
var TOTAL_DURATION = window.TOTAL_DURATION || 120; // 2 minutes in seconds


// Initialize the scene
function init() {
    // Create scene if it doesn't exist
    if (!scene) {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111122);
    }
    
    // Create camera if it doesn't exist
    if (!camera) {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;
    }
    
    // Look for an existing canvas or create renderer
    if (!renderer) {
        const canvas = document.getElementById('scene-canvas');
        if (canvas) {
            renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                antialias: true 
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
        } else {
            console.warn('No canvas element found with id "scene-canvas"');
            return; // Exit init if canvas not found
        }
    }
    
    // Create lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);
    
    // Add orbit controls if they don't exist
    if (!controls && renderer) {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
    }
    
    // Initialize clock if it doesn't exist
    if (!clock && typeof THREE !== 'undefined') {
        clock = new THREE.Clock();
    }
    
    // Create geometry
    createGeometry();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Set up UI controls
    setupControls();
}

// Create all geometry in the scene
function createGeometry() {
    // Geometry created by the GeometryAgent
// GeometryAgent LLM-generated code
// Atom materials
const carbonMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, shininess: 100 });
const hydrogenMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 });
const bondMaterial = new THREE.MeshPhongMaterial({ color: 0x999999, shininess: 100 });
const sigmaBondMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 100 });

// Atom geometries (using different radii)
const carbonGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const hydrogenGeometry = new THREE.SphereGeometry(0.2, 32, 32);

// Function to create a bond (cylinder) between two points
function createBond(start, end, material) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 16);
  const bond = new THREE.Mesh(bondGeometry, material);
  
  // Position: midpoint between start and end
  const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  bond.position.copy(midPoint);
  
  // Align the cylinder with the direction vector
  bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  return bond;
}

// Create the main group for the ethane molecule
const ethaneMolecule = new THREE.Group();
window.EthaneMoleculeAnimation = ethaneMolecule; // global reference

// The two methyl groups will be built as separate groups.
// They will be positioned such that the carbon-carbon sigma bond (rotation axis) lies along the x-axis.

// ------------------------------
// Left Methyl Group (Fixed)
// ------------------------------
const leftMethylGroup = new THREE.Group();
// Set left methyl group origin at its carbon center (global position will be shifted later)
 
// Carbon atom at origin of left methyl group
const leftCarbon = new THREE.Mesh(carbonGeometry, carbonMaterial);
leftCarbon.position.set(0, 0, 0);
leftMethylGroup.add(leftCarbon);

// Define offsets for three hydrogens (relative to carbon center)
const leftHydrogenOffsets = [
  new THREE.Vector3(0, 0.8, 0),
  new THREE.Vector3(0, -0.8, 0),
  new THREE.Vector3(0, 0, 0.8)
];

const leftHydrogens = [];
leftHydrogenOffsets.forEach(offset => {
  const hAtom = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
  hAtom.position.copy(offset);
  leftMethylGroup.add(hAtom);
  leftHydrogens.push(hAtom);
  
  // Create bond from carbon (origin) to hydrogen (offset)
  const bond = createBond(new THREE.Vector3(0, 0, 0), offset, bondMaterial);
  leftMethylGroup.add(bond);
});

// Position the entire left methyl group in the global scene.
// Place left carbon at (-0.75, 0, 0)
leftMethylGroup.position.set(-0.75, 0, 0);

// ------------------------------
// Right Methyl Group (Rotating)
// ------------------------------
const rightMethylGroup = new THREE.Group();
// For the rotating group, set its local origin as its carbon center.

const rightCarbon = new THREE.Mesh(carbonGeometry, carbonMaterial);
rightCarbon.position.set(0, 0, 0);
rightMethylGroup.add(rightCarbon);

// Define offsets for the three hydrogens.
// To simulate a staggered conformation relative to the fixed group,
// use a slightly different arrangement.
const rightHydrogenOffsets = [
  new THREE.Vector3(0, 0.8, 0),
  new THREE.Vector3(0, -0.8, 0),
  new THREE.Vector3(0, 0, -0.8)
];

const rightHydrogens = [];
rightHydrogenOffsets.forEach(offset => {
  const hAtom = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
  hAtom.position.copy(offset);
  rightMethylGroup.add(hAtom);
  rightHydrogens.push(hAtom);
  
  // Create bond from carbon (origin) to hydrogen (offset)
  const bond = createBond(new THREE.Vector3(0, 0, 0), offset, bondMaterial);
  rightMethylGroup.add(bond);
});

// Position the right methyl group so that its carbon is at (0.75, 0, 0)
// This positions the sigma bond (C-C) along the x-axis.
rightMethylGroup.position.set(0.75, 0, 0);

// Store reference to right methyl group for animation purposes (rotation around x-axis)
window.rotatingMethylGroup = rightMethylGroup;

// ------------------------------
// Connect the two carbons with the sigma bond (rotation axis)
// ------------------------------
// Global positions of the two carbons:
const leftCarbonGlobalPos = new THREE.Vector3().setFromMatrixPosition(leftMethylGroup.matrixWorld).add(leftCarbon.position);
const rightCarbonGlobalPos = new THREE.Vector3().setFromMatrixPosition(rightMethylGroup.matrixWorld).add(rightCarbon.position);

// However, because leftMethylGroup and rightMethylGroup have not yet been updated in world space,
// we can compute the global positions directly from their intended positions:
// left carbon: (-0.75, 0, 0)
// right carbon: (0.75, 0, 0)
const sigmaStart = new THREE.Vector3(-0.75, 0, 0);
const sigmaEnd = new THREE.Vector3(0.75, 0, 0);
const sigmaBond = createBond(sigmaStart, sigmaEnd, sigmaBondMaterial);

// ------------------------------
// Assemble the ethane molecule
// ------------------------------
ethaneMolecule.add(leftMethylGroup);
ethaneMolecule.add(rightMethylGroup);
ethaneMolecule.add(sigmaBond);

// Add the ethane molecule to the scene
scene.add(ethaneMolecule);

// GeometryAgent LLM-generated code
// Create a group for the Energy Profile Diagram
const energyProfileDiagram = new THREE.Group();
window.energyProfileDiagram = energyProfileDiagram;

// Dimensions for the diagram
const diagramWidth = 10;   // x-direction
const diagramHeight = 8;   // y-direction
const diagramDepth = 1;    // z-direction (thickness)

// Create a background plane for the diagram (dark blue matte digital display)
const bgGeometry = new THREE.PlaneGeometry(diagramWidth, diagramHeight);
const bgMaterial = new THREE.MeshPhongMaterial({ color: 0x00008b, side: THREE.DoubleSide });
const backgroundPlane = new THREE.Mesh(bgGeometry, bgMaterial);
// Slight offset in z so that the line and markers appear in front
backgroundPlane.position.set(0, 0, -0.01);
energyProfileDiagram.add(backgroundPlane);

// Function to convert dihedral angle [0,360] into x position in the diagram
// Map 0 deg -> -diagramWidth/2, 360 deg -> +diagramWidth/2
function angleToX(angle) {
  return (angle / 360) * diagramWidth - diagramWidth / 2;
}

// Energy function for ethane rotation using a common potential energy function:
// V(φ) = (V0/2)*(1+cos(3φ)), with V0 chosen to be diagramHeight so that maxima = diagramHeight and minima = 0.
function potentialEnergy(angleDeg) {
  const angleRad = angleDeg * Math.PI / 180;
  return 0.5 * diagramHeight * (1 + Math.cos(3 * angleRad));
}

// Create the energy curve as a line graph (bright green)
// Sample the function over 0 to 360 degrees
const curvePoints = [];
const resolution = 72; // sample every 5 degrees (360/5 = 72 steps)
for (let i = 0; i <= resolution; i++) {
  const angle = i * (360 / resolution);
  const x = angleToX(angle);
  const y = potentialEnergy(angle) - diagramHeight / 2;  // center vertically
  curvePoints.push(new THREE.Vector3(x, y, 0));
}

const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
const curveMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
const energyCurve = new THREE.Line(curveGeometry, curveMaterial);
energyProfileDiagram.add(energyCurve);

// Create sphere geometry for markers (peaks and troughs)
const markerRadius = 0.15;
const markerGeometry = new THREE.SphereGeometry(markerRadius, 16, 16);

function createMarker(angleDeg, material) {
  const x = angleToX(angleDeg);
  const y = potentialEnergy(angleDeg) - diagramHeight / 2;
  const marker = new THREE.Mesh(markerGeometry, material);
  marker.position.set(x, y, 0.02);  // place markers slightly in front of the line
  return marker;
}

// Materials for markers: red for peaks (eclipsed) and blue for troughs (staggered)
const peakMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const troughMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });

// For the potential energy function V = (diagramHeight/2)*(1+cos(3φ)),
// peaks (high energy, eclipsed) occur at angles: 0°, 120°, 240°, and 360°
// troughs (low energy, staggered) occur at angles: 60°, 180°, 300°
const peakAngles = [0, 120, 240, 360];
const troughAngles = [60, 180, 300];

peakAngles.forEach(angle => {
  const marker = createMarker(angle, peakMaterial);
  energyProfileDiagram.add(marker);
});

troughAngles.forEach(angle => {
  const marker = createMarker(angle, troughMaterial);
  energyProfileDiagram.add(marker);
});

// (Optional) Set initial opacity for smooth fade-in animation if required.
energyProfileDiagram.traverse(child => {
  if (child.material) {
    child.material.transparent = true;
    child.material.opacity = 0.0;
  }
});

// Store a reference to the diagram group for later animation syncing with the ethane molecule
window.energyProfileDiagram = energyProfileDiagram;

// Finally, add the Energy Profile Diagram to the scene
scene.add(energyProfileDiagram);
}

// Animation loop
function animate() {
    if (!isPlaying) {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controls.update();
        return;
    }
    
    requestAnimationFrame(animate);
    
    // Get the adjusted time with offset applied
    const adjustedTime = updateUI();
    
    // We'll make this time variable available to the animation code
    window.animationTime = adjustedTime;
    
    // Animation created by the AnimationAgent
// Get elapsed time and delta time
const elapsedTime = window.animationTime || clock.getElapsedTime();
const deltaTime = clock.getDelta();

// Helper: fade object in/out over 'duration' seconds starting at 'startTime'
function fadeObject(object, fadeIn, duration, startTime) {
  if (!object) return;
  object.traverse(child => {
    if (child.isMesh && child.material) {
      child.material.transparent = true;
      let t = (elapsedTime - startTime) / duration;
      t = Math.min(Math.max(t, 0), 1);
      child.material.opacity = fadeIn ? t : (1 - t);
      child.visible = child.material.opacity > 0;
    }
  });
}

// ─────────────────────────────────────────────
// At 00:00 - Introduction to Ethane Molecule
if (elapsedTime >= 0 && elapsedTime < 20) {
  const ethane = scene.getObjectByName("EthaneMoleculeAnimation");
  if (ethane) {
    // Use provided update function if available, else fallback
    if (typeof window.updateEthaneMolecule === "function") {
      window.updateEthaneMolecule(elapsedTime, { phase: "intro" });
    } else {
      ethane.rotation.y += 0.1 * deltaTime;
    }
    // Fade in ethane over first 2 seconds (starting at 0s)
    fadeObject(ethane, true, 2, 0);
  }
  // Hide other objects not needed yet
  const energyDiagram = scene.getObjectByName("energyProfileDiagram");
  if (energyDiagram) energyDiagram.visible = false;
  const rotatingGroup = scene.getObjectByName("rotatingMethylGroup");
  if (rotatingGroup) rotatingGroup.visible = false;
  
  // Slowly zoom camera in to focus on the molecule
  if (camera) {
    const targetPos = new THREE.Vector3(0, 0, 15);
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
}

// ─────────────────────────────────────────────
// At 00:20 - Labeling Atoms and Highlighting Sigma Bond
else if (elapsedTime >= 20 && elapsedTime < 40) {
  const ethane = scene.getObjectByName("EthaneMoleculeAnimation");
  if (ethane) {
    if (typeof window.updateEthaneMolecule === "function") {
      // Show labels and highlight the sigma bond
      window.updateEthaneMolecule(elapsedTime, {
        showLabels: true,
        highlightSigma: true
      });
    }
    // Ensure full opacity
    ethane.traverse(child => {
      if (child.isMesh && child.material) {
        child.material.opacity = 1;
        child.visible = true;
      }
    });
  }
  // Adjust camera a bit for a closer look
  if (camera) {
    const targetPos = new THREE.Vector3(0, 0, 12);
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
}

// ─────────────────────────────────────────────
// At 00:40 - Demonstrating Internal Rotation (One Methyl Group Rotates)
else if (elapsedTime >= 40 && elapsedTime < 60) {
  const ethane = scene.getObjectByName("EthaneMoleculeAnimation");
  if (ethane && typeof window.updateEthaneMolecule === "function") {
    window.updateEthaneMolecule(elapsedTime, { phase: "internalRotation" });
  }
  const rotatingGroup = scene.getObjectByName("rotatingMethylGroup");
  if (rotatingGroup) {
    rotatingGroup.visible = true;
    if (typeof window.updateRotatingMethylGroup === "function") {
      window.updateRotatingMethylGroup(elapsedTime);
    } else {
      rotatingGroup.rotation.y += 0.5 * deltaTime;
    }
  }
  // Camera: focus on the rotation axis
  if (camera) {
    const targetPos = new THREE.Vector3(0, 0, 10);
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
}

// ─────────────────────────────────────────────
// At 01:00 - Energy Diagram Pops Up Beside the Molecule
else if (elapsedTime >= 60 && elapsedTime < 80) {
  const energyDiagram = scene.getObjectByName("energyProfileDiagram");
  if (energyDiagram) {
    energyDiagram.visible = true;
    if (typeof window.updateEnergyProfileDiagram === "function") {
      window.updateEnergyProfileDiagram(elapsedTime, { phase: "popUp" });
    }
    // Fade in energy diagram over 2 seconds starting at 60s
    fadeObject(energyDiagram, true, 2, 60);
  }
  // Ensure ethane molecule stays fully visible
  const ethane = scene.getObjectByName("EthaneMoleculeAnimation");
  if (ethane) {
    ethane.traverse(child => {
      if (child.isMesh && child.material) {
        child.material.opacity = 1;
        child.visible = true;
      }
    });
  }
}

// ─────────────────────────────────────────────
// At 01:20 - Zoom on Rotating Methyl Group with Torsional Strain Cues
else if (elapsedTime >= 80 && elapsedTime < 100) {
  const rotatingGroup = scene.getObjectByName("rotatingMethylGroup");
  if (rotatingGroup) {
    rotatingGroup.visible = true;
    if (typeof window.updateRotatingMethylGroup === "function") {
      // Emphasize torsional strain during eclipsed conformations
      window.updateRotatingMethylGroup(elapsedTime, { emphasizeStrain: true });
    } else {
      rotatingGroup.rotation.y += 0.3 * deltaTime;
      // Simple visual cue: gradually change color toward red
      rotatingGroup.traverse(child => {
        if (child.isMesh && child.material && child.material.color) {
          child.material.color.lerp(new THREE.Color(0xff0000), 0.05);
        }
      });
    }
  }
  // Synchronize energy diagram cues with molecular strain
  const energyDiagram = scene.getObjectByName("energyProfileDiagram");
  if (energyDiagram && typeof window.updateEnergyProfileDiagram === "function") {
    window.updateEnergyProfileDiagram(elapsedTime, { emphasizeStrain: true });
  }
  // Camera: zoom in closer on the rotating methyl group
  if (camera && rotatingGroup) {
    const worldPos = new THREE.Vector3();
    rotatingGroup.getWorldPosition(worldPos);
    camera.position.lerp(new THREE.Vector3(worldPos.x, worldPos.y, worldPos.z + 5), 0.05);
    camera.lookAt(worldPos);
  }
}

// ─────────────────────────────────────────────
// At 01:40 - Continuous Molecule Rotation with Energy Diagram Sync
else if (elapsedTime >= 100 && elapsedTime < 120) {
  const ethane = scene.getObjectByName("EthaneMoleculeAnimation");
  if (ethane) {
    if (typeof window.updateEthaneMolecule === "function") {
      window.updateEthaneMolecule(elapsedTime, { phase: "continuousRotation" });
    } else {
      ethane.rotation.y += 0.2 * deltaTime;
    }
  }
  const energyDiagram = scene.getObjectByName("energyProfileDiagram");
  if (energyDiagram) {
    if (typeof window.updateEnergyProfileDiagram === "function") {
      window.updateEnergyProfileDiagram(elapsedTime, { phase: "syncRotation" });
    } else {
      energyDiagram.rotation.y += 0.05 * deltaTime;
    }
  }
  const rotatingGroup = scene.getObjectByName("rotatingMethylGroup");
  if (rotatingGroup) {
    if (typeof window.updateRotatingMethylGroup === "function") {
      window.updateRotatingMethylGroup(elapsedTime, { phase: "syncRotation" });
    } else {
      rotatingGroup.rotation.y += 0.2 * deltaTime;
    }
  }
  // Camera: pull back to show full scene (molecule and diagram)
  if (camera) {
    const targetPos = new THREE.Vector3(0, 0, 12);
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
}

// ─────────────────────────────────────────────
// At 02:00 - Conclusion: Fade Out Molecule, Diagram, and Wrap Up
else if (elapsedTime >= 120) {
  const ethane = scene.getObjectByName("EthaneMoleculeAnimation");
  if (ethane) {
    fadeObject(ethane, false, 2, 120);
  }
  const energyDiagram = scene.getObjectByName("energyProfileDiagram");
  if (energyDiagram) {
    fadeObject(energyDiagram, false, 2, 120);
  }
  const rotatingGroup = scene.getObjectByName("rotatingMethylGroup");
  if (rotatingGroup) {
    fadeObject(rotatingGroup, false, 2, 120);
  }
  // Camera: slowly zoom out to signal scene end
  if (camera) {
    const targetPos = new THREE.Vector3(0, 0, 20);
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
}
    
    // Update controls
    controls.update();
    
    // Render the scene
    renderer.render(scene, camera);
}

// Update captions and UI based on current time
function updateUI() {
    // Add the time offset to the elapsed time
    const elapsedTime = clock.getElapsedTime() + (window.timeOffset || 0);
    
    // Constrain elapsed time to be between 0 and TOTAL_DURATION
    const constrainedTime = Math.max(0, Math.min(elapsedTime, TOTAL_DURATION));
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    const progress = constrainedTime / TOTAL_DURATION;
    progressBar.style.width = progress * 100 + '%';
    
    // Update captions
    const captions = document.querySelectorAll('.caption');
    captions.forEach(caption => {
        const timeStr = caption.getAttribute('data-time');
        const [min, sec] = timeStr.split(':').map(Number);
        const timeInSeconds = min * 60 + sec;
        
        // Show caption if we're within 5 seconds of its timecode
        if (constrainedTime >= timeInSeconds && constrainedTime < timeInSeconds + 5) {
            caption.style.display = 'block';
        } else {
            caption.style.display = 'none';
        }
    });
    
    return constrainedTime; // Return the constrained time for use in animations
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Set up UI controls
function setupControls() {
    // Store button references
    var playPauseButton = document.getElementById('play-pause');
    var resetButton = document.getElementById('reset');
    var rewindButton = document.getElementById('rewind');
    var fastForwardButton = document.getElementById('fast-forward');
    
    // Only set up event listeners if elements exist
    if (!playPauseButton || !resetButton || !rewindButton || !fastForwardButton) {
        console.warn('Some control buttons not found in the DOM. Control setup may be incomplete.');
    }
    
    let playbackSpeed = 1.0; // Normal speed
    
    // Initialize time offset if not already defined
    window.timeOffset = window.timeOffset || 0;
    
    // Set up play/pause button if it exists
    if (playPauseButton) {
        playPauseButton.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playPauseButton.textContent = isPlaying ? 'Pause' : 'Play';
            if (isPlaying) {
                if (clock) clock.start();
            } else {
                if (clock) clock.stop();
            }
        });
    }
    
    // Set up reset button if it exists
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (typeof THREE !== 'undefined') {
                clock = new THREE.Clock();
            }
            window.timeOffset = 0; // Reset the time offset
            isPlaying = true;
            if (playPauseButton) playPauseButton.textContent = 'Pause';
            playbackSpeed = 1.0; // Reset speed to normal
        });
    }
    
    // Set up rewind button if it exists
    if (rewindButton) {
        rewindButton.addEventListener('click', () => {
            // Decrease the time offset by 10 seconds (but don't go below negative total duration)
            window.timeOffset = Math.max(window.timeOffset - 10, -TOTAL_DURATION);
            
            // Ensure playing state
            isPlaying = true;
            if (playPauseButton) playPauseButton.textContent = 'Pause';
        });
    }
    
    // Set up fast-forward button if it exists
    if (fastForwardButton) {
        fastForwardButton.addEventListener('click', () => {
            // Increase the time offset by 10 seconds (but don't exceed total duration)
            window.timeOffset = Math.min(window.timeOffset + 10, TOTAL_DURATION);
            
            // Ensure playing state
            isPlaying = true;
            if (playPauseButton) playPauseButton.textContent = 'Pause';
        });
    }
}

// Initialize and start animation
init();
animate();
