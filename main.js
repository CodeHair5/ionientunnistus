// Tuodaan Three.js-kirjasto käyttöön
import * as THREE from 'three';

// 1. Alustus (Scene, Camera, Renderer)

// Kohtaus (Scene) on kuin virtuaalinen maailma, johon objektit lisätään
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0); // Harmaa taustaväri

// Kamera (Camera) määrittelee, mistä kohtaa maailmaa katsotaan
// Parametrit: näkökentän kulma, kuvasuhde, lähin ja kaukaisin näkyvä etäisyys
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderöijä (Renderer) piirtää kohtauksen näytölle
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // Asetetaan piirtoalueen koko
document.body.appendChild(renderer.domElement); // Lisätään piirtoalue (canvas) HTML-sivulle

// 2. Objektien luonti (Geometry, Material, Mesh)

// Geometria (Geometry) määrittelee objektin muodon (tässä laatikko)
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Materiaali (Material) määrittelee objektin pinnan (tässä yksinkertainen sininen väri)
const material = new THREE.MeshBasicMaterial({ color: 0x0077ff });

// Mesh on geometria ja materiaali yhdistettynä. Se on varsinainen 3D-objekti.
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // Lisätään kuutio kohtaukseen

// Siirretään kameraa hieman taaksepäin, jotta kuutio näkyy
camera.position.z = 3;

// 3. Animaatio (Animation Loop)

// Funktio, jota kutsutaan jatkuvasti uudelleen ja joka päivittää näkymän
function animate() {
    requestAnimationFrame(animate); // Pyydetään selainta kutsumaan funktiota seuraavalla ruudunpäivityksellä

    // Pyöritetään kuutiota hieman joka kierroksella
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    // Renderöidään kohtaus kameran näkökulmasta
    renderer.render(scene, camera);
}

// Käynnistetään animaatiolooppi
animate();

// Lisätään toiminnallisuus ikkunan koon muuttamiseen
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});