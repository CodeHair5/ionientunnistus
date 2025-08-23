import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// 1. Perusasetukset (Scene, Camera, Renderer)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Realistisempi valaistus
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();

// 2. Valaistus (HDRI-ympäristö antaa parhaat heijastukset lasille)
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = new THREE.Color(0xdddddd); // Vaaleanharmaa tausta
});

// 3. Materiaalit
// Luodaan realistinen lasimateriaali
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    ior: 1.5, // Valon taitokerroin (lasille tyypillinen)
    transmission: 1.0, // Täysin läpinäkyvä
    thickness: 1.5,
    transparent: true,
});

// Luodaan nestemateriaalit
const copperSulfateMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x6495ED, // Sinertävä
    metalness: 0,
    roughness: 0.1,
    ior: 1.33,
    transmission: 1.0,
    thickness: 2.0,
    transparent: true,
});

const ironSulfateMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x98FB98, // Vihertävä
    metalness: 0,
    roughness: 0.1,
    ior: 1.33,
    transmission: 1.0,
    thickness: 2.0,
    transparent: true,
});

const leadNitrateMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, // Väritön
    metalness: 0,
    roughness: 0.1,
    ior: 1.33,
    transmission: 1.0,
    thickness: 2.0,
    transparent: true,
});


// 4. Apufunktio koeputken luomiseen
function createTestTube(position, liquidMaterial, liquidLevel) {
    const group = new THREE.Group();
    
    // Koeputken mitat
    const radius = 0.5;
    const height = 3;
    
    // Ulkokuori (lasi)
    // Sylinteri on ylhäältä auki (openEnded = true)
    const tubeGeometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, true);
    const tubeMesh = new THREE.Mesh(tubeGeometry, glassMaterial);

    // Pyöreä pohja (lasi)
    const bottomGeometry = new THREE.SphereGeometry(radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const bottomMesh = new THREE.Mesh(bottomGeometry, glassMaterial);
    bottomMesh.position.y = -height / 2; // Asetetaan sylinterin alapuolelle
    
    group.add(tubeMesh);
    group.add(bottomMesh);

    // Nesteen luonti
    if (liquidMaterial) {
        const liquidHeight = height * liquidLevel;
        const liquidRadius = radius * 0.95; // Hieman kapeampi kuin putki
        const liquidGeometry = new THREE.CylinderGeometry(liquidRadius, liquidRadius, liquidHeight, 32);
        const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
        
        // Asetetaan neste putken pohjalle
        liquidMesh.position.y = - (height - liquidHeight) / 2;
        group.add(liquidMesh);
    }
    
    group.position.copy(position);
    scene.add(group);
    return group;
}

// 5. Luodaan kolme koeputkea
const tubeSpacing = 1.5;

// Vasen: Kuparisulfaatti (sininen), 70% täynnä
createTestTube(
    new THREE.Vector3(-tubeSpacing, 1.5, 0),
    copperSulfateMaterial,
    0.7
);

// Keskellä: Rautasulfaatti (vihreä), 50% täynnä
createTestTube(
    new THREE.Vector3(0, 1.5, 0),
    ironSulfateMaterial,
    0.5
);

// Oikealla: Lyijynitraatti (väritön), 80% täynnä
createTestTube(
    new THREE.Vector3(tubeSpacing, 1.5, 0),
    leadNitrateMaterial,
    0.8
);

// Lisätään lattia heijastuksia varten
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);


// 6. Animaatiolooppi
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Ikkunan koon muutos
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();