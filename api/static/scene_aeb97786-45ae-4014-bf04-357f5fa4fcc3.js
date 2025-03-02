// Scientific visualization: Exploring Acetic Acid: Structure and Behavior
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
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    
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
(function() {
    // Create materials with semi-transparency and glossy highlights
    const carbonMaterial = new THREE.MeshPhongMaterial({ color: 0x333333, transparent: true, opacity: 0.9 });
    const hydrogenMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    const oxygenMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 0.9 });
    const bondMaterial = new THREE.MeshPhongMaterial({ color: 0x999999, transparent: true, opacity: 0.9 });
    const arrowMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, transparent: true, opacity: 0.9 });
    const dissociationArrowMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, transparent: true, opacity: 0.9 });

    // Base sphere geometry for atoms
    const atomGeometry = new THREE.SphereGeometry(1, 32, 32);

    // Utility function to create a cylindrical bond between two points
    function createBond(start, end) {
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 8);
        const bond = new THREE.Mesh(bondGeometry, bondMaterial);
        
        // Position bond at midpoint between start and end
        bond.position.copy(start).lerp(end, 0.5);
        // Align bond with the direction vector
        bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
        return bond;
    }

    // Utility function to create an arrow (shaft + head) between two points
    function createArrow(start, end, material) {
        const arrowGroup = new THREE.Group();
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        const headLength = 0.3;
        const shaftLength = length - headLength;
        if (shaftLength <= 0) return arrowGroup;

        // Shaft geometry
        const shaftGeometry = new THREE.CylinderGeometry(0.05, 0.05, shaftLength, 8);
        const shaft = new THREE.Mesh(shaftGeometry, material);
        // Position shaft midpoint along the first part of the arrow
        let shaftMid = start.clone().lerp(end, shaftLength / (2 * length));
        shaft.position.copy(shaftMid);
        // Align shaft to direction vector
        shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
        arrowGroup.add(shaft);

        // Head geometry
        const headGeometry = new THREE.ConeGeometry(0.1, headLength, 8);
        const head = new THREE.Mesh(headGeometry, material);
        // Position head at the end of the shaft
        let headPosition = start.clone().lerp(end, (shaftLength + headLength/2) / length);
        head.position.copy(headPosition);
        head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
        arrowGroup.add(head);

        return arrowGroup;
    }

    ///////////////
    // Acetic Acid Molecule: CH3COOH
    ///////////////
    const aceticAcid = new THREE.Group();
    window.aceticAcid = aceticAcid;
    // Set a rotation speed (used externally for animation)
    aceticAcid.userData.rotationSpeed = 0.005;
    
    // Define atom scales based on their radii (adjusted for visual clarity)
    const carbonScale = 0.5;
    const hydrogenScale = 0.3;
    const oxygenScale = 0.55;
    
    // Positions (approximate, in angstrom-like units)
    // Methyl group (CH3)
    const c1Pos = new THREE.Vector3(0, 0, 0);
    const h1Pos = new THREE.Vector3(-0.8, 0.8, 0);
    const h2Pos = new THREE.Vector3(-0.8, -0.8, 0);
    const h3Pos = new THREE.Vector3(0, 0, 1);
    
    // Carboxyl group (COOH)
    const c2Pos = new THREE.Vector3(1.5, 0, 0);
    const o1Pos = new THREE.Vector3(2.8, 0.5, 0);  // double-bonded oxygen
    const o2Pos = new THREE.Vector3(2.8, -0.5, 0); // hydroxyl oxygen
    const h4Pos = new THREE.Vector3(3.5, -0.9, 0); // hydrogen from hydroxyl

    // Create atoms for acetic acid
    const c1 = new THREE.Mesh(atomGeometry, carbonMaterial);
    c1.position.copy(c1Pos);
    c1.scale.set(carbonScale, carbonScale, carbonScale);

    const c2 = new THREE.Mesh(atomGeometry, carbonMaterial);
    c2.position.copy(c2Pos);
    c2.scale.set(carbonScale, carbonScale, carbonScale);

    const h1 = new THREE.Mesh(atomGeometry, hydrogenMaterial);
    h1.position.copy(h1Pos);
    h1.scale.set(hydrogenScale, hydrogenScale, hydrogenScale);

    const h2 = new THREE.Mesh(atomGeometry, hydrogenMaterial);
    h2.position.copy(h2Pos);
    h2.scale.set(hydrogenScale, hydrogenScale, hydrogenScale);

    const h3 = new THREE.Mesh(atomGeometry, hydrogenMaterial);
    h3.position.copy(h3Pos);
    h3.scale.set(hydrogenScale, hydrogenScale, hydrogenScale);

    const o1 = new THREE.Mesh(atomGeometry, oxygenMaterial);
    o1.position.copy(o1Pos);
    o1.scale.set(oxygenScale, oxygenScale, oxygenScale);

    const o2 = new THREE.Mesh(atomGeometry, oxygenMaterial);
    o2.position.copy(o2Pos);
    o2.scale.set(oxygenScale, oxygenScale, oxygenScale);

    const h4 = new THREE.Mesh(atomGeometry, hydrogenMaterial);
    h4.position.copy(h4Pos);
    h4.scale.set(hydrogenScale, hydrogenScale, hydrogenScale);
    
    // Create bonds for acetic acid
    const bonds = [];
    bonds.push(createBond(c1Pos, c2Pos));
    bonds.push(createBond(c1Pos, h1Pos));
    bonds.push(createBond(c1Pos, h2Pos));
    bonds.push(createBond(c1Pos, h3Pos));
    bonds.push(createBond(c2Pos, o1Pos));
    bonds.push(createBond(c2Pos, o2Pos));
    bonds.push(createBond(o2Pos, h4Pos));

    // Add atoms and bonds to the acetic acid group
    aceticAcid.add(c1, c2, h1, h2, h3, o1, o2, h4);
    bonds.forEach(bond => aceticAcid.add(bond));

    ///////////////
    // Water Molecules (3 examples)
    ///////////////
    const waterGroup = new THREE.Group();
    window.waterGroup = waterGroup;

    function createWater(oxygenPos, hydrogenOffset1, hydrogenOffset2) {
        const water = new THREE.Group();
        // Oxygen for water (using same oxygen material)
        const o = new THREE.Mesh(atomGeometry, oxygenMaterial);
        o.position.copy(oxygenPos);
        o.scale.set(oxygenScale, oxygenScale, oxygenScale);
        water.add(o);
        
        // Hydrogens for water (positions are relative to oxygen)
        const h1 = new THREE.Mesh(atomGeometry, hydrogenMaterial);
        h1.position.copy(oxygenPos.clone().add(hydrogenOffset1));
        h1.scale.set(hydrogenScale, hydrogenScale, hydrogenScale);
        water.add(h1);
        
        const h2 = new THREE.Mesh(atomGeometry, hydrogenMaterial);
        h2.position.copy(oxygenPos.clone().add(hydrogenOffset2));
        h2.scale.set(hydrogenScale, hydrogenScale, hydrogenScale);
        water.add(h2);
        
        // Bonds within water
        water.add(createBond(oxygenPos, o.position.clone().add(hydrogenOffset1)));
        water.add(createBond(oxygenPos, o.position.clone().add(hydrogenOffset2)));
        
        return { group: water, oxygen: o };
    }

    // Create three water molecules with arbitrary positions and relative hydrogen offsets
    const water1Data = createWater(
        new THREE.Vector3(-2, 1, 0),
        new THREE.Vector3(-0.5, 0.8, 0),
        new THREE.Vector3(0.5, 0.8, 0)
    );
    const water2Data = createWater(
        new THREE.Vector3(4, 2, 1),
        new THREE.Vector3(-0.5, 0.8, 0),
        new THREE.Vector3(0.5, 0.8, 0)
    );
    const water3Data = createWater(
        new THREE.Vector3(0, -3, -1),
        new THREE.Vector3(-0.5, 0.8, 0),
        new THREE.Vector3(0.5, 0.8, 0)
    );

    waterGroup.add(water1Data.group);
    waterGroup.add(water2Data.group);
    waterGroup.add(water3Data.group);

    ///////////////
    // Arrows for dynamic transitions and hydrogen bonding
    ///////////////
    const arrowsGroup = new THREE.Group();
    window.arrowsGroup = arrowsGroup;

    // 1. Arrow illustrating acid dissociation (proton separation from the hydroxyl hydrogen)
    const dissociationStart = h4Pos.clone();
    const dissociationEnd = new THREE.Vector3(5, -0.9, 0);
    const dissociationArrow = createArrow(dissociationStart, dissociationEnd, dissociationArrowMaterial);
    arrowsGroup.add(dissociationArrow);
    
    // 2. Arrow for hydrogen bonding from carboxyl (double-bonded) oxygen to a water molecule (choose water2)
    const hbArrow1 = createArrow(o1Pos, water2Data.oxygen.position.clone(), arrowMaterial);
    arrowsGroup.add(hbArrow1);
    
    // 3. Arrow for hydrogen bonding from hydroxyl oxygen to another water molecule (choose water3)
    const hbArrow2 = createArrow(o2Pos, water3Data.oxygen.position.clone(), arrowMaterial);
    arrowsGroup.add(hbArrow2);

    // Add the assembled groups to the scene
    scene.add(aceticAcid);
    scene.add(waterGroup);
    scene.add(arrowsGroup);
})();
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
    
    // Animation created by the AnimationAgent
// Get elapsed time and delta time
const elapsedTime = clock.getElapsedTime();
const deltaTime = clock.getDelta();

// Retrieve main objects using scene.getObjectByName()
const aceticAcid = scene.getObjectByName("aceticAcid");
const waterGroup  = scene.getObjectByName("waterGroup");
const arrowsGroup = scene.getObjectByName("arrowsGroup");

// ────────────────────────────────────────────────────────────
// At 00:00 - 00:20: Fade-in & Slow Rotation Intro with Caption "Welcome to the world of acetic acid"
if (elapsedTime < 20) {
  // Update the acetic acid model
  if (aceticAcid) {
    if (typeof window.updateAceticAcid === 'function') {
      // Let the provided update function handle fade-in and slow rotation
      window.updateAceticAcid(elapsedTime);
    } else {
      // Fallback: Rotate slowly and fade in opacity
      aceticAcid.rotation.y += 0.2 * deltaTime;
      aceticAcid.traverse(child => {
        if (child.isMesh && child.material && child.material.opacity !== undefined) {
          // Increase opacity over 5 seconds
          child.material.opacity = Math.min(1, elapsedTime / 5);
          child.material.transparent = child.material.opacity < 1;
        }
      });
    }
  }

  // Set up ambient camera position for the initial view
  if (camera) {
    // Slowly move camera from a distant position to a moderate view
    const targetPosition = new THREE.Vector3(0, 0, 15);
    camera.position.lerp(targetPosition, 0.02);
    camera.lookAt(aceticAcid ? aceticAcid.position : new THREE.Vector3(0, 0, 0));
  }
  // (Caption handling assumed to be managed elsewhere)
}

// ────────────────────────────────────────────────────────────
// At 00:20 - 00:40: Zoom In & Highlight Molecular Structure with Caption "Visualizing the acetic acid molecule"
else if (elapsedTime >= 20 && elapsedTime < 40) {
  if (aceticAcid) {
    if (typeof window.updateAceticAcid === 'function') {
      // Pass a flag to emphasize atomic detail (e.g., highlight atoms)
      window.updateAceticAcid(elapsedTime, { highlightAtoms: true });
    } else {
      // Fallback: Continue rotating and highlight atoms by pulsating emissive intensity
      aceticAcid.rotation.y += 0.15 * deltaTime;
      aceticAcid.traverse(child => {
        if (child.isMesh && child.name.toLowerCase().includes("atom")) {
          const pulse = Math.sin(elapsedTime * 3) * 0.5 + 0.5;
          if (child.material) {
            child.material.emissive = new THREE.Color(0x333333);
            child.material.emissiveIntensity = pulse;
          }
        }
      });
    }
  }

  // Move camera closer to focus on the complete molecular structure
  if (camera) {
    const targetPosition = new THREE.Vector3(0, 0, 10);
    camera.position.lerp(targetPosition, 0.03);
    camera.lookAt(aceticAcid ? aceticAcid.position : new THREE.Vector3(0, 0, 0));
  }
}

// ────────────────────────────────────────────────────────────
// At 00:40 - 01:00: Close-up on Carboxyl Group with Labels, Caption "Zooming into the carboxylic group"
else if (elapsedTime >= 40 && elapsedTime < 60) {
  if (aceticAcid) {
    if (typeof window.updateAceticAcid === 'function') {
      // Indicate a close-up focus on the carboxyl group via parameters
      window.updateAceticAcid(elapsedTime, { closeUpCarboxyl: true });
    } else {
      // Fallback: Slow rotation and adjust camera for closer view of the carboxyl region
      aceticAcid.rotation.y += 0.1 * deltaTime;
    }
  }

  // Adjust camera to focus on the carboxyl group area (assume at position x:1, y:0)
  if (camera) {
    const carboxylTarget = new THREE.Vector3(1, 0, 8);
    camera.position.lerp(carboxylTarget, 0.04);
    camera.lookAt(aceticAcid ? aceticAcid.position : new THREE.Vector3(1, 0, 0));
  }

  // (Labels on atoms are assumed to be part of the update function or pre-attached)
}

// ────────────────────────────────────────────────────────────
// At 01:00 - 01:20: Introduce Water Molecules & Animate Hydrogen Bonds, Caption "Hydrogen bonding with water molecules"
else if (elapsedTime >= 60 && elapsedTime < 80) {
  // Continue updating the acetic acid model
  if (aceticAcid) {
    if (typeof window.updateAceticAcid === 'function') {
      window.updateAceticAcid(elapsedTime, { includeWater: true });
    } else {
      aceticAcid.rotation.y += 0.08 * deltaTime;
    }
  }

  // Update water molecules animation
  if (waterGroup) {
    if (typeof window.updateWaterGroup === 'function') {
      window.updateWaterGroup(elapsedTime);
    } else {
      // Fallback: gentle oscillation for water molecules
      waterGroup.rotation.y += 0.1 * deltaTime;
    }
  }

  // Update arrows to illustrate hydrogen bonds
  if (arrowsGroup) {
    if (typeof window.updateArrowsGroup === 'function') {
      window.updateArrowsGroup(elapsedTime, { bonding: true });
    } else {
      // Fallback: animate arrows pulsing to indicate dynamic bonds
      arrowsGroup.traverse(child => {
        if (child.isMesh && child.material) {
          const scale = Math.sin(elapsedTime * 5) * 0.2 + 1;
          child.scale.set(scale, scale, scale);
        }
      });
    }
  }

  // Keep camera steady during water interactions
  if (camera) {
    const targetPosition = new THREE.Vector3(0, 0, 9);
    camera.position.lerp(targetPosition, 0.03);
    camera.lookAt(aceticAcid ? aceticAcid.position : new THREE.Vector3(0, 0, 0));
  }
}

// ────────────────────────────────────────────────────────────
// At 01:20 - 01:40: Display Acid Dissociation Process with Animated Arrows, Caption "Acid dissociation and ion formation"
else if (elapsedTime >= 80 && elapsedTime < 100) {
  if (aceticAcid) {
    if (typeof window.updateAceticAcid === 'function') {
      // Use parameter to indicate dissociation animation
      window.updateAceticAcid(elapsedTime, { dissociate: true });
    } else {
      // Fallback: continue slow rotation and simulate dissociation via subtle scaling changes
      aceticAcid.rotation.y += 0.07 * deltaTime;
    }
  }

  // Enhance arrows animation to trace the dissociation pathway
  if (arrowsGroup) {
    if (typeof window.updateArrowsGroup === 'function') {
      window.updateArrowsGroup(elapsedTime, { dissociationPath: true });
    } else {
      arrowsGroup.traverse(child => {
        if (child.isMesh && child.material) {
          const pulse = Math.abs(Math.sin(elapsedTime * 4));
          child.material.emissive = new THREE.Color(0xffaa00);
          child.material.emissiveIntensity = pulse;
        }
      });
    }
  }

  // Camera moves to capture both the original acetic acid and the emerging ions 
  if (camera) {
    const targetPosition = new THREE.Vector3(0.5, 0, 8.5);
    camera.position.lerp(targetPosition, 0.04);
    camera.lookAt(aceticAcid ? aceticAcid.position : new THREE.Vector3(0.5, 0, 0));
  }
}

// ────────────────────────────────────────────────────────────
// At 01:40 - 02:00: Integrated Visual Summary with Overlay Text, Caption "Summary: Properties and reactivity"
else if (elapsedTime >= 100 && elapsedTime < 120) {
  // Consolidate all elements together by updating the acetic acid model with an integrated view
  if (aceticAcid) {
    if (typeof window.updateAceticAcid === 'function') {
      window.updateAceticAcid(elapsedTime, { summary: true });
    } else {
      aceticAcid.rotation.y += 0.05 * deltaTime;
    }
  }

  // Maintain water and arrow animations to merge into the summary
  if (waterGroup && typeof window.updateWaterGroup === 'function') {
    window.updateWaterGroup(elapsedTime, { summary: true });
  }
  if (arrowsGroup && typeof window.updateArrowsGroup === 'function') {
    window.updateArrowsGroup(elapsedTime, { summary: true });
  }

  // Smooth camera transition to a balanced overview
  if (camera) {
    const summaryPosition = new THREE.Vector3(0, 0, 10);
    camera.position.lerp(summaryPosition, 0.02);
    camera.lookAt(aceticAcid ? aceticAcid.position : new THREE.Vector3(0, 0, 0));
  }

  // (Flowing text overlay for summary is assumed to be managed in a separate GUI element)
}
    
    // Update controls
    controls.update();
    
    // Update captions and timeline
    updateUI();
    
    // Render the scene
    renderer.render(scene, camera);
}

// Update captions and UI based on current time
function updateUI() {
    const elapsedTime = clock.getElapsedTime();
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    const progress = Math.min(elapsedTime / TOTAL_DURATION, 1);
    progressBar.style.width = progress * 100 + '%';
    
    // Update captions
    const captions = document.querySelectorAll('.caption');
    captions.forEach(caption => {
        const timeStr = caption.getAttribute('data-time');
        const [min, sec] = timeStr.split(':').map(Number);
        const timeInSeconds = min * 60 + sec;
        
        // Show caption if we're within 5 seconds of its timecode
        if (elapsedTime >= timeInSeconds && elapsedTime < timeInSeconds + 5) {
            caption.style.display = 'block';
        } else {
            caption.style.display = 'none';
        }
    });
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
        isPlaying = true;
        playPauseButton.textContent = 'Pause';
        playbackSpeed = 1.0; // Reset speed to normal
    });
    
    rewindButton.addEventListener('click', () => {
        // Get current time
        const currentTime = clock.getElapsedTime();
        // Create new clock with time set back by 10 seconds (but not below 0)
        const newTime = Math.max(0, currentTime - 10);
        clock = new THREE.Clock();
        clock.startTime = -newTime; // Offset the start time to simulate setting the time
        
        // Ensure playing state
        isPlaying = true;
        playPauseButton.textContent = 'Pause';
    });
    
    fastForwardButton.addEventListener('click', () => {
        // Get current time
        const currentTime = clock.getElapsedTime();
        // Create new clock with time set forward by 10 seconds
        clock = new THREE.Clock();
        clock.startTime = -(currentTime + 10); // Offset the start time to simulate setting the time
        
        // Ensure playing state
        isPlaying = true;
        playPauseButton.textContent = 'Pause';
    });
}

// Initialize and start animation
init();
animate();
