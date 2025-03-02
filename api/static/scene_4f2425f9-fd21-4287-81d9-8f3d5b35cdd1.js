// Scientific visualization: Acetylene's Triple Bond Explained
// Auto-generated code

// Global variables
let scene, camera, renderer, controls, clock;
let isPlaying = true;
const TOTAL_DURATION = 120; // 2 minutes in seconds


// Initialize the scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    
    // Create renderer using the canvas element
    const canvas = document.getElementById('scene-canvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);
    
    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    
    // Initialize clock
    clock = new THREE.Clock();
    
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
// Materials
const carbonMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, shininess: 10 }); // matte finish gray
const hydrogenMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 10 }); // matte finish white
const sigmaBondMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 100 }); // glossy finish blue
const piBondMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 100 });   // glossy finish red
const bondMaterial = sigmaBondMaterial; // for C-H bonds, reusing sigma style
const orbitalMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x00ffff, 
    transparent: true, 
    opacity: 0.5, 
    shininess: 50 
});

// Geometries for atoms
const carbonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const hydrogenGeometry = new THREE.SphereGeometry(0.3, 32, 32);

// Create a group for the acetylene molecule
const acetylene = new THREE.Group();
window.acetylene = acetylene;

// Positions for atoms (arranged along the x-axis for linear acetylene: H-C≡C-H)
const c1Pos = new THREE.Vector3(-1.5, 0, 0);
const c2Pos = new THREE.Vector3( 1.5, 0, 0);
const h1Pos = new THREE.Vector3(-3.0, 0, 0);
const h2Pos = new THREE.Vector3( 3.0, 0, 0);

// Create atom meshes
const carbon1 = new THREE.Mesh(carbonGeometry, carbonMaterial);
carbon1.position.copy(c1Pos);
const carbon2 = new THREE.Mesh(carbonGeometry, carbonMaterial);
carbon2.position.copy(c2Pos);
const hydrogen1 = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
hydrogen1.position.copy(h1Pos);
const hydrogen2 = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
hydrogen2.position.copy(h2Pos);

// Helper function to create a bond (cylinder) between two points with an optional offset
function createBond(start, end, radius, material, offset = new THREE.Vector3(0, 0, 0)) {
    const s = new THREE.Vector3().copy(start).add(offset);
    const e = new THREE.Vector3().copy(end).add(offset);
    const direction = new THREE.Vector3().subVectors(e, s);
    const length = direction.length();
    const bondGeometry = new THREE.CylinderGeometry(radius, radius, length, 16);
    const bond = new THREE.Mesh(bondGeometry, material);
    
    // Position bond at midpoint
    bond.position.copy(s).lerp(e, 0.5);
    
    // Align the cylinder to point from s to e.
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    return bond;
}

// Create C≡C triple bond components between the two carbon atoms
// Sigma bond (thick, along the molecular axis)
const sigmaBond = createBond(c1Pos, c2Pos, 0.2, sigmaBondMaterial);

// Two pi bonds (thin, offset perpendicular to the bond axis)
// First pi bond: offset along positive Y
const piBond1 = createBond(c1Pos, c2Pos, 0.08, piBondMaterial, new THREE.Vector3(0, 0.3, 0));
// Second pi bond: offset along positive Z
const piBond2 = createBond(c1Pos, c2Pos, 0.08, piBondMaterial, new THREE.Vector3(0, 0, 0.3));

// Create bonds connecting the carbons to their attached hydrogens
const chBond1 = createBond(c1Pos, h1Pos, 0.1, bondMaterial);
const chBond2 = createBond(c2Pos, h2Pos, 0.1, bondMaterial);

// Create orbital geometries around the carbon atoms to indicate bonding regions
const orbitalGeometry = new THREE.TorusGeometry(0.7, 0.05, 16, 100);

// For carbon1, create two orbitals with different orientations
const orbitalC1a = new THREE.Mesh(orbitalGeometry, orbitalMaterial);
orbitalC1a.position.copy(c1Pos);
orbitalC1a.rotation.y = Math.PI / 2;  // rotate so that its plane is in the xz plane

const orbitalC1b = new THREE.Mesh(orbitalGeometry, orbitalMaterial);
orbitalC1b.position.copy(c1Pos);
orbitalC1b.rotation.z = Math.PI / 2;  // rotate so that its plane is in the xy plane

// For carbon2, similarly create two orbitals
const orbitalC2a = new THREE.Mesh(orbitalGeometry, orbitalMaterial);
orbitalC2a.position.copy(c2Pos);
orbitalC2a.rotation.y = Math.PI / 2;

const orbitalC2b = new THREE.Mesh(orbitalGeometry, orbitalMaterial);
orbitalC2b.position.copy(c2Pos);
orbitalC2b.rotation.z = Math.PI / 2;

// Assemble the acetylene molecule by adding atoms, bonds, and orbitals to the group
acetylene.add(carbon1, carbon2, hydrogen1, hydrogen2);
acetylene.add(sigmaBond, piBond1, piBond2, chBond1, chBond2);
acetylene.add(orbitalC1a, orbitalC1b, orbitalC2a, orbitalC2b);

// Add the acetylene molecule group to the global scene
scene.add(acetylene);

// GeometryAgent LLM-generated code
// Create a group for the infographic panel
const infographicPanel = new THREE.Group();
window.infographicPanel = infographicPanel;

// Panel dimensions and rounded corner radius
const panelWidth = 10;
const panelHeight = 10;
const halfWidth = panelWidth / 2;
const halfHeight = panelHeight / 2;
const cornerRadius = 1;

// Create a rounded rectangle shape centered at the origin
const shape = new THREE.Shape();
// Start at bottom left corner (adjusted for the radius)
shape.moveTo(-halfWidth + cornerRadius, -halfHeight);
// Bottom edge
shape.lineTo(halfWidth - cornerRadius, -halfHeight);
// Bottom-right corner curve
shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + cornerRadius);
// Right edge
shape.lineTo(halfWidth, halfHeight - cornerRadius);
// Top-right corner curve
shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - cornerRadius, halfHeight);
// Top edge
shape.lineTo(-halfWidth + cornerRadius, halfHeight);
// Top-left corner curve
shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - cornerRadius);
// Left edge
shape.lineTo(-halfWidth, -halfHeight + cornerRadius);
// Bottom-left corner curve
shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + cornerRadius, -halfHeight);

// Extrude settings: small depth with bevel for smooth edges
const extrudeSettings = {
  steps: 1,
  depth: 0.2,
  bevelEnabled: true,
  bevelThickness: 0.2,
  bevelSize: 0.2,
  bevelSegments: 2
};

const panelGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

// Create a semi-transparent material with a white base
const panelMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.8,
  side: THREE.DoubleSide
});

// Create the main panel mesh and add it to the group
const panelMesh = new THREE.Mesh(panelGeometry, panelMaterial);
infographicPanel.add(panelMesh);

/*
  Create highlight callout elements.
  These represent the blue and red highlights for key data points.
  They are simple small rounded panels that can be animated later.
*/

// Blue highlight callout (e.g., for bond length)
const blueCalloutGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.1);
const blueCalloutMaterial = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  transparent: true,
  opacity: 0.9
});
const blueCallout = new THREE.Mesh(blueCalloutGeometry, blueCalloutMaterial);
// Position the blue callout on the left side of the panel
blueCallout.position.set(-halfWidth + 1, 1, 0.15);
infographicPanel.add(blueCallout);

// Red highlight callout (e.g., for bond energy)
const redCalloutGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.1);
const redCalloutMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.9
});
const redCallout = new THREE.Mesh(redCalloutGeometry, redCalloutMaterial);
// Position the red callout on the right side of the panel
redCallout.position.set(halfWidth - 1, -1, 0.15);
infographicPanel.add(redCallout);

/*
  (Optional) Create animated measurement lines as thin cylinders.
  They are placeholders that can later be animated synchronously with the bonding visualization.
*/

// Function to create a measurement line between two points
function createMeasurementLine(start, end, color) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const lineLength = direction.length();
  const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const lineGeometry = new THREE.CylinderGeometry(0.05, 0.05, lineLength, 8);
  const lineMaterial = new THREE.MeshPhongMaterial({ color: color, transparent: true, opacity: 0.8 });
  const lineMesh = new THREE.Mesh(lineGeometry, lineMaterial);
  // Align the cylinder along Y axis then rotate to the correct direction.
  lineMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  lineMesh.position.copy(midPoint);
  return lineMesh;
}

// Create two example measurement lines on the panel
const line1 = createMeasurementLine(new THREE.Vector3(-halfWidth + 2, 0, 0.11), new THREE.Vector3(-halfWidth + 4, 2, 0.11), 0x0000ff);
const line2 = createMeasurementLine(new THREE.Vector3(halfWidth - 2, 0, 0.11), new THREE.Vector3(halfWidth - 4, -2, 0.11), 0xff0000);
infographicPanel.add(line1, line2);

// Optionally, set the initial opacity to 0 and fade it in with an animation later.
// For now, this code creates static geometry ready for animation integration.

// Add the infographic panel group to the scene
scene.add(infographicPanel);
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
// Get elapsed time and delta time (ensure these globals exist)
const elapsedTime = window.animationTime || clock.getElapsedTime();
const deltaTime = clock.getDelta();

// Retrieve main objects (always check existence)
const acetylene = scene.getObjectByName("acetylene");
const infographicPanel = scene.getObjectByName("infographicPanel");

// Helper: Fade an object's material opacity (fades over duration seconds)
// fadeIn: true = fade in (opacity from 0 to 1), false = fade out (opacity from 1 to 0)
function fadeObject(object, fadeIn, startTime, duration = 2.0) {
  if (!object) return;
  // Calculate local progress from startTime
  const localTime = elapsedTime - startTime;
  const progress = Math.min(1, Math.max(0, localTime / duration));
  // Traverse object's meshes to update opacity
  object.traverse(child => {
    if (child.isMesh && child.material) {
      // Ensure material is transparent so opacity changes are visible
      child.material.transparent = true;
      if (fadeIn) {
        child.material.opacity = progress;
      } else {
        child.material.opacity = 1 - progress;
      }
      // Toggle visibility when fully faded out
      if ((!fadeIn && progress >= 1) || (fadeIn && progress <= 0)) {
        child.visible = fadeIn;
      } else {
        child.visible = true;
      }
    }
  });
}

// ─────────────────────────────────────────────
// TIMECODE 00:00 - Introduction: Show full acetylene molecule, slow rotation, neutral background
if (elapsedTime >= 0 && elapsedTime < 20) {
  if (acetylene) {
    // Use geometry's provided update function if available, flag phase "intro"
    if (typeof window.updateAcetylene === 'function') {
      window.updateAcetylene(elapsedTime, { phase: "intro" });
    } else {
      // Fallback: Slowly rotate the molecule
      acetylene.rotation.y += 0.2 * deltaTime;
    }
    // Fade in acetylene (fade starting at 0 sec over 2 sec)
    fadeObject(acetylene, true, 0, 2.0);
  }
  
  // Ensure infographic panel is hidden in this phase
  if (infographicPanel) {
    infographicPanel.visible = false;
  }
  
  // Camera: Set a neutral view (e.g., gradually move to (0,0,10))
  if (camera) {
    const targetPos = new THREE.Vector3(0, 0, 10);
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(0, 0, 0);
  }
}

// ─────────────────────────────────────────────
// TIMECODE 00:20 - Focus on Central Carbon Atoms: Zoom in on the carbon atoms and show orbital overlays
else if (elapsedTime >= 20 && elapsedTime < 40) {
  if (acetylene) {
    if (typeof window.updateAcetylene === 'function') {
      window.updateAcetylene(elapsedTime, { phase: "focusCarbon" });
    } else {
      // Slow rotation fallback
      acetylene.rotation.y += 0.15 * deltaTime;
    }
    // Maintain full visibility once already faded in
    acetylene.visible = true;
  }
  
  // Camera: Smoothly zoom in towards the carbon atoms center (assumed at (0,0,0))
  if (camera) {
    const targetPos = new THREE.Vector3(0, 0, 6);
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(0, 0, 0);
  }
  
  // (Optional) You might trigger orbital label animations via update function
}

// ─────────────────────────────────────────────
// TIMECODE 00:40 - Triple Bond Formation Animation: Animate sigma and pi bonds overlay
else if (elapsedTime >= 40 && elapsedTime < 60) {
  if (acetylene) {
    if (typeof window.updateAcetylene === 'function') {
      // Inform the update function to animate the triple bond formation phase
      window.updateAcetylene(elapsedTime, { phase: "tripleBondFormation" });
    } else {
      // Fallback: A gentle pulsating or rotation can be applied to simulate overlay dynamics
      acetylene.rotation.y += 0.1 * deltaTime;
    }
    // Ensure acetylene remains fully visible
    acetylene.visible = true;
  }
  
  // Camera: Stable view remains, with slight adjustment if needed
  if (camera) {
    const targetPos = new THREE.Vector3(0, 0, 6);
    camera.position.lerp(targetPos, 0.03);
    camera.lookAt(0, 0, 0);
  }
}

// ─────────────────────────────────────────────
// TIMECODE 01:00 - Electron Density Map: Animate a semi-transparent electron density overlay
else if (elapsedTime >= 60 && elapsedTime < 90) {
  if (acetylene) {
    if (typeof window.updateAcetylene === 'function') {
      window.updateAcetylene(elapsedTime, { phase: "electronDensity" });
    } else {
      // Fallback: Slight modulation (e.g., a small scale pulsation could mimic density change)
      acetylene.scale.lerp(new THREE.Vector3(1.01, 1.01, 1.01), 0.005);
    }
    acetylene.visible = true;
  }
  
  // Camera: Keep steady view during electron density visualization
  if (camera) {
    const targetPos = new THREE.Vector3(0, 0, 6);
    camera.position.lerp(targetPos, 0.03);
    camera.lookAt(0, 0, 0);
  }
}

// ─────────────────────────────────────────────
// TIMECODE 01:30 - Bond Geometry and Stats: Animate measurement lines, numerical tags, and key bond data
else if (elapsedTime >= 90 && elapsedTime < 110) {
  if (acetylene) {
    if (typeof window.updateAcetylene === 'function') {
      window.updateAcetylene(elapsedTime, { phase: "bondMeasurements" });
    } else {
      // Fallback: Continue slow rotation
      acetylene.rotation.y += 0.05 * deltaTime;
    }
    acetylene.visible = true;
  }
  
  // Camera: Slight adjustment to focus on the bond region (if needed)
  if (camera) {
    const targetPos = new THREE.Vector3(0, 0, 5.5);
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(0, 0, 0);
  }
}

// ─────────────────────────────────────────────
// TIMECODE 01:50 - Final Segment: Emphasize reactivity, display infographic callout
else if (elapsedTime >= 110 && elapsedTime < 130) {
  if (acetylene) {
    if (typeof window.updateAcetylene === 'function') {
      window.updateAcetylene(elapsedTime, { phase: "finalSummary" });
    } else {
      acetylene.rotation.y += 0.05 * deltaTime;
    }
    acetylene.visible = true;
  }
  
  // Activate and fade in the Infographic Panel if it exists
  if (infographicPanel) {
    infographicPanel.visible = true;
    fadeObject(infographicPanel, true, 110, 2.0); // Start fading at 01:50 over 2 seconds
    // (Optional) If the Infographic Panel has its own update function, call it:
    if (typeof window.updateInfographic === 'function') {
      window.updateInfographic(elapsedTime);
    }
  }
  
  // Camera: Shift view slightly to include the infographic panel (e.g., move right)
  if (camera) {
    const targetPos = new THREE.Vector3(2, 0, 5.5);
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(0, 0, 0);
  }
}

// ─────────────────────────────────────────────
// Outside defined script timeline, ensure non-active objects are hidden
if (elapsedTime >= 130) {
  // After 2:10, you might choose to keep both objects visible or start a fade-out:
  if (infographicPanel) {
    fadeObject(infographicPanel, false, 130, 2.0);
  }
  // Continue to update acetylene if needed, or maintain final view
  if (acetylene) {
    acetylene.visible = true;
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
    const playPauseButton = document.getElementById('play-pause');
    const resetButton = document.getElementById('reset');
    const rewindButton = document.getElementById('rewind');
    const fastForwardButton = document.getElementById('fast-forward');
    
    let playbackSpeed = 1.0; // Normal speed
    
    playPauseButton.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playPauseButton.textContent = isPlaying ? 'Pause' : 'Play';
        if (isPlaying) {
            clock.start();
        } else {
            clock.stop();
        }
    });
    
    resetButton.addEventListener('click', () => {
        clock = new THREE.Clock();
        window.timeOffset = 0; // Reset the time offset
        isPlaying = true;
        playPauseButton.textContent = 'Pause';
        playbackSpeed = 1.0; // Reset speed to normal
    });
    
    // Define a global variable to track the time offset
    window.timeOffset = 0;
    
    rewindButton.addEventListener('click', () => {
        // Decrease the time offset by 10 seconds (but don't go below negative total duration)
        window.timeOffset = Math.max(window.timeOffset - 10, -TOTAL_DURATION);
        
        // Ensure playing state
        isPlaying = true;
        playPauseButton.textContent = 'Pause';
    });
    
    fastForwardButton.addEventListener('click', () => {
        // Increase the time offset by 10 seconds (but don't exceed total duration)
        window.timeOffset = Math.min(window.timeOffset + 10, TOTAL_DURATION);
        
        // Ensure playing state
        isPlaying = true;
        playPauseButton.textContent = 'Pause';
    });
}

// Initialize and start animation
init();
animate();
