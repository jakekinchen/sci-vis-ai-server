// Scientific visualization: Methane Molecular Geometry Explained
// Auto-generated code

// Global variables
// Use existing globals if defined, otherwise create new ones
var scene = window.scene || null;
var camera = window.camera || null;
var renderer = window.renderer || null;
var controls = window.controls || null;
var clock = window.clock || null;
var isPlaying = typeof window.isPlaying !== 'undefined' ? window.isPlaying : true;
// Set animation duration to 2 minutes
var ANIMATION_DURATION = 120;


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
// Materials for atoms, bonds, and arcs
const carbonMaterial = new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 100 });
const hydrogenMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff, 
    emissive: 0x333333, // gives a subtle glow effect
    shininess: 100 
});
const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 80 });
const arcMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.7 });

// Atom geometry dimensions (radii)
const carbonRadius = 0.6;
const hydrogenRadius = 0.3;
const sphereSegments = 32;
const carbonGeometry = new THREE.SphereGeometry(carbonRadius, sphereSegments, sphereSegments);
const hydrogenGeometry = new THREE.SphereGeometry(hydrogenRadius, sphereSegments, sphereSegments);

// Create the methane molecule group
const methaneGroup = new THREE.Group();
window.MethaneMolecule = methaneGroup; // store globally

// Central Carbon atom at the origin
const carbon = new THREE.Mesh(carbonGeometry, carbonMaterial);
carbon.position.set(0, 0, 0);
methaneGroup.add(carbon);

// Define tetrahedral hydrogen positions
// Using the normalized vectors (±1, ±1, ±1) that form a tetrahedron 
// (the four positions chosen so that each pair of bonds is ~109.5° apart)
const bondLength = 2.5; // distance from carbon to each hydrogen

const rawPositions = [
  new THREE.Vector3( 1,  1,  1),
  new THREE.Vector3( 1, -1, -1),
  new THREE.Vector3(-1,  1, -1),
  new THREE.Vector3(-1, -1,  1)
];

// Normalize and scale hydrogen positions
const hydrogenPositions = rawPositions.map(v => v.normalize().multiplyScalar(bondLength));

// Create hydrogen atoms and store them for later use (for arcs and bonds)
const hydrogens = [];
hydrogenPositions.forEach(pos => {
  const h = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
  h.position.copy(pos);
  methaneGroup.add(h);
  hydrogens.push(h);
});

// Function to create a bond (cylinder) from start to end positions
function createBond(start, end) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 16);
  const bond = new THREE.Mesh(bondGeometry, bondMaterial);
  
  // position the bond midway between start and end
  bond.position.copy(start).lerp(end, 0.5);
  
  // orient the bond: default cylinder is along Y axis
  bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  return bond;
}

// Create bonds from carbon to each hydrogen
hydrogenPositions.forEach(pos => {
  const bond = createBond(carbon.position, pos);
  methaneGroup.add(bond);
});

// Function to create an arc (Quadratic Bezier curve) between two hydrogen atoms
// The curve will have its control point along the bisector direction to create a nice bulge.
function createBondAngleArc(start, end) {
  // Calculate control point: the midpoint, normalized and then scaled outwards a bit
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(bondLength * 1.1);
  
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(50);
  const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const arc = new THREE.Line(arcGeometry, arcMaterial);
  return arc;
}

// Create arcs to illustrate tetrahedral bond angles
// We create an arc for each unique pair of hydrogen atoms (6 total)
for (let i = 0; i < hydrogenPositions.length; i++) {
  for (let j = i + 1; j < hydrogenPositions.length; j++) {
    const arc = createBondAngleArc(hydrogenPositions[i], hydrogenPositions[j]);
    methaneGroup.add(arc);
  }
}

// Optional: tag the molecule group with a rotation speed for external animation routines
methaneGroup.userData.rotationSpeed = 0.001;

// Finally, add the methane molecule group to the scene
scene.add(methaneGroup);

// GeometryAgent LLM-generated code
// Create a parent group for the Hybridization_Overlay
const hybridizationOverlay = new THREE.Group();
window.hybridizationOverlay = hybridizationOverlay;

// MATERIALS
const sp3OrbitalMaterial = new THREE.MeshBasicMaterial({ 
  color: 0x99ccff, 
  side: THREE.DoubleSide, 
  transparent: true, 
  opacity: 0.8 
});

const carbonOrbitalMaterial = new THREE.MeshBasicMaterial({ 
  color: 0xffcc00, 
  side: THREE.DoubleSide, 
  transparent: true, 
  opacity: 0.8 
});

const hydrogenOrbitalMaterial = new THREE.MeshBasicMaterial({ 
  color: 0x66ff66, 
  side: THREE.DoubleSide, 
  transparent: true, 
  opacity: 0.8 
});

// GEOMETRY
// Circle geometry for orbitals (flat schematic style)
const orbitalCircleGeometry = new THREE.CircleGeometry(1, 32);
const smallOrbitalCircleGeometry = new THREE.CircleGeometry(0.5, 32);

// GROUP: Left half - sp3 hybridization diagram
const sp3Group = new THREE.Group();

// Arrange four equivalent sp3 orbitals in a tetrahedral-inspired 2D layout on left half of the screen
// Positions chosen so that the group covers roughly the left half
const sp3OrbitalPositions = [
  new THREE.Vector3(-5,  2, 0),
  new THREE.Vector3(-3,  2, 0),
  new THREE.Vector3(-5, -2, 0),
  new THREE.Vector3(-3, -2, 0)
];

sp3OrbitalPositions.forEach(pos => {
  const orbital = new THREE.Mesh(orbitalCircleGeometry, sp3OrbitalMaterial);
  orbital.position.copy(pos);
  sp3Group.add(orbital);
});

// (Optional schematic addition: Draw simple lines/arcs between orbitals to indicate equivalence)
// For clarity, here we add simple line segments between the centers
const sp3LineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
for (let i = 0; i < sp3OrbitalPositions.length; i++) {
  for (let j = i + 1; j < sp3OrbitalPositions.length; j++) {
    const points = [];
    points.push(sp3OrbitalPositions[i]);
    points.push(sp3OrbitalPositions[j]);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, sp3LineMaterial);
    sp3Group.add(line);
  }
}

// GROUP: Right half - sigma bond formation overlay
const sigmaBondGroup = new THREE.Group();

// Create a schematic representation of the orbital overlap for sigma bonds.
// Place a central carbon orbital and four hydrogen orbitals with arrows representing orbital overlap.

// Central carbon orbital at right half center area
const carbonOrbital = new THREE.Mesh(smallOrbitalCircleGeometry, carbonOrbitalMaterial);
carbonOrbital.position.set(1, 0, 0);
sigmaBondGroup.add(carbonOrbital);

// Define positions for hydrogen orbitals relative to the carbon orbital
const hydrogenOrbitalPositions = [
  new THREE.Vector3(3,  1, 0),
  new THREE.Vector3(3, -1, 0),
  new THREE.Vector3(1,  2, 0),
  new THREE.Vector3(1, -2, 0)
];

hydrogenOrbitalPositions.forEach(pos => {
  const hydOrbital = new THREE.Mesh(smallOrbitalCircleGeometry, hydrogenOrbitalMaterial);
  hydOrbital.position.copy(pos);
  sigmaBondGroup.add(hydOrbital);
  
  // Create an arrow indicating the orbital overlap (sigma bond formation)
  const start = new THREE.Vector3(1, 0, 0); // carbon orbital center
  const dir = new THREE.Vector3().subVectors(pos, start).normalize();
  const length = new THREE.Vector3().subVectors(pos, start).length() - 0.7; // shorten arrow to not overlap the hydrogen circle
  const arrowColor = 0xffffff;
  const arrowHelper = new THREE.ArrowHelper(dir, start, length, arrowColor, 0.3, 0.2);
  sigmaBondGroup.add(arrowHelper);
});

// Position the sigmaBondGroup so it generally occupies the right half of the screen
// (already chosen coordinates are positive in x, but you can adjust if needed)

// Combine both overlays into the main hybridization overlay group
hybridizationOverlay.add(sp3Group);
hybridizationOverlay.add(sigmaBondGroup);

// Finally add the overlay group to the scene
scene.add(hybridizationOverlay);
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
const elapsedTime = window.animationTime || clock.getElapsedTime();
const deltaTime = clock.getDelta();

// Get objects using provided names
const methane = scene.getObjectByName("MethaneMolecule");
const hybridOverlay = scene.getObjectByName("hybridizationOverlay");

//────────────────────────────────────────────
// Helper functions for fading objects in/out
function fadeInObject(object, sectionTime, duration) {
  if (!object) return;
  object.traverse(child => {
    if (child.isMesh && child.material) {
      child.material.transparent = true;
      const opacity = Math.min(1, sectionTime / duration);
      child.material.opacity = opacity;
      if (opacity > 0) child.visible = true;
    }
  });
}

function fadeOutObject(object, sectionTime, duration) {
  if (!object) return;
  object.traverse(child => {
    if (child.isMesh && child.material) {
      child.material.transparent = true;
      const opacity = Math.max(0, 1 - sectionTime / duration);
      child.material.opacity = opacity;
      if (opacity <= 0) child.visible = false;
    }
  });
}

//────────────────────────────────────────────
// At 00:00 - 00:20: Introduction with soft illumination and gentle zoom-in
if (elapsedTime >= 0 && elapsedTime < 20) {
  // Animate methane molecule's entrance
  if (methane) {
    // Use geometry's update function if available
    if (typeof window.updateMolecule === 'function') {
      window.updateMolecule(elapsedTime, { phase: "init" });
    } else {
      // Fallback: rotation animation
      methane.rotation.y += 0.2 * deltaTime;
    }
    // Fade in methane over the first 2 seconds
    if (elapsedTime < 2) {
      fadeInObject(methane, elapsedTime, 2);
    } else {
      // Ensure full opacity after fade-in
      methane.traverse(child => {
        if (child.isMesh && child.material) child.material.opacity = 1;
      });
    }
  }
  
  // Camera gentle zoom-in to focus the central structure
  if (camera) {
    const targetPosition = new THREE.Vector3(0, 0, 10);
    camera.position.lerp(targetPosition, 0.05);
    camera.lookAt(0, 0, 0);
  }
  
  // Keep hybrid overlay hidden during this phase
  if (hybridOverlay) {
    hybridOverlay.visible = false;
  }
  
  // (Caption: "Introducing methane's central structure")
}

//────────────────────────────────────────────
// At 00:20 - 00:40: Hydrogen atoms and bonds materialize around carbon
else if (elapsedTime >= 20 && elapsedTime < 40) {
  const sectionTime = elapsedTime - 20;
  
  if (methane) {
    if (typeof window.updateMolecule === 'function') {
      // Inform update function to show hydrogen atoms and bonds with labels
      window.updateMolecule(elapsedTime, { phase: "atomsVisible" });
    } else {
      methane.rotation.y += 0.1 * deltaTime; // fallback rotation
    }
  }
  
  // Slight camera adjustment to enhance focus (if desired)
  if (camera) {
    const targetPosition = new THREE.Vector3(0, 0, 9);
    camera.position.lerp(targetPosition, 0.05);
    camera.lookAt(0, 0, 0);
  }
  
  // (Caption: "Carbon with four bound hydrogens")
}

//────────────────────────────────────────────
// At 00:40 - 01:00: Tetrahedral overlay and highlighting bond angles (~109.5°)
else if (elapsedTime >= 40 && elapsedTime < 60) {
  const sectionTime = elapsedTime - 40;
  
  if (methane) {
    if (typeof window.updateMolecule === 'function') {
      // Request the methane update function to activate tetrahedral arcs and bond angle highlights
      window.updateMolecule(elapsedTime, { phase: "tetrahedral" });
    } else {
      methane.rotation.y += 0.05 * deltaTime;
    }
  }
  
  // Optionally, adjust camera or background to reveal a grid overlay (assumed handled internally)
  if (camera) {
    // Subtle camera adjustment for clarity
    const targetPosition = new THREE.Vector3(0, 0, 8);
    camera.position.lerp(targetPosition, 0.05);
    camera.lookAt(0, 0, 0);
  }
  
  // (Caption: "Tetrahedral shape and 109.5° angles")
}

//────────────────────────────────────────────
// At 01:00 - 01:20: Molecule begins slow rotation with glow accent on hydrogens
else if (elapsedTime >= 60 && elapsedTime < 80) {
  const sectionTime = elapsedTime - 60;
  
  if (methane) {
    if (typeof window.updateMolecule === 'function') {
      // Activate rotation with optional glow effects on hydrogen atoms
      window.updateMolecule(elapsedTime, { phase: "rotation", glow: true });
    } else {
      methane.rotation.y += 0.2 * deltaTime;
    }
  }
  
  // Rotate camera around the molecule for a dynamic view
  if (camera) {
    const angle = sectionTime * 0.5; // control rotation speed
    camera.position.x = 10 * Math.sin(angle);
    camera.position.z = 10 * Math.cos(angle);
    camera.lookAt(0, 0, 0);
  }
  
  // (Caption: "Rotating view of methane's geometry")
}

//────────────────────────────────────────────
// At 01:20 - 01:45: Split-screen overlay explaining sp3 hybridization and sigma bond formation
else if (elapsedTime >= 80 && elapsedTime < 105) {
  const sectionTime = elapsedTime - 80;
  
  // Animate the hybridization overlay's appearance
  if (hybridOverlay) {
    if (sectionTime < 2) {
      fadeInObject(hybridOverlay, sectionTime, 2);
    } else {
      // Ensure it stays fully visible
      hybridOverlay.traverse(child => {
        if (child.isMesh && child.material) child.material.opacity = 1;
      });
      hybridOverlay.visible = true;
    }
    // Use provided update function for the overlay if available
    if (typeof window.updateHybridization === 'function') {
      window.updateHybridization(elapsedTime);
    }
  }
  
  // Continue rotating the methane molecule
  if (methane) {
    if (typeof window.updateMolecule === 'function') {
      window.updateMolecule(elapsedTime, { phase: "rotation" });
    } else {
      methane.rotation.y += 0.1 * deltaTime;
    }
  }
  
  // Optionally adjust camera to accommodate the split-screen view
  if (camera) {
    const targetPosition = new THREE.Vector3(-2, 0, 10);
    camera.position.lerp(targetPosition, 0.05);
    camera.lookAt(0, 0, 0);
  }
  
  // (Caption: "Explaining sp3 hybridization and bonds")
}

//────────────────────────────────────────────
// At 01:45 - 02:00: Final zoom out, displaying the complete illuminated methane molecule with summary annotation
else if (elapsedTime >= 105 && elapsedTime < 120) {
  const sectionTime = elapsedTime - 105;
  
  if (methane) {
    if (typeof window.updateMolecule === 'function') {
      window.updateMolecule(elapsedTime, { phase: "final" });
    } else {
      methane.rotation.y += 0.05 * deltaTime;
    }
  }
  
  // Fade out the hybridization overlay as it is no longer needed
  if (hybridOverlay) {
    fadeOutObject(hybridOverlay, sectionTime, 2);
  }
  
  // Gradually zoom camera out to show the entire molecule in context
  if (camera) {
    const targetPosition = new THREE.Vector3(0, 0, 15);
    camera.position.lerp(targetPosition, 0.05);
    camera.lookAt(0, 0, 0);
  }
  
  // (Caption: "Summary: Methane's 3D geometry explained")
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
    
    // Constrain elapsed time to be between 0 and animation duration
    const constrainedTime = Math.max(0, Math.min(elapsedTime, ANIMATION_DURATION));
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    const progress = constrainedTime / ANIMATION_DURATION;
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
            // Decrease the time offset by 10 seconds (but don't go below negative animation duration)
            window.timeOffset = Math.max(window.timeOffset - 10, -ANIMATION_DURATION);
            
            // Ensure playing state
            isPlaying = true;
            if (playPauseButton) playPauseButton.textContent = 'Pause';
        });
    }
    
    // Set up fast-forward button if it exists
    if (fastForwardButton) {
        fastForwardButton.addEventListener('click', () => {
            // Increase the time offset by 10 seconds (but don't exceed animation duration)
            window.timeOffset = Math.min(window.timeOffset + 10, ANIMATION_DURATION);
            
            // Ensure playing state
            isPlaying = true;
            if (playPauseButton) playPauseButton.textContent = 'Pause';
        });
    }
}

// Initialize and start animation
init();
animate();
