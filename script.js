import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const viewer = document.getElementById("character-viewer");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xff8050);

const camera = new THREE.PerspectiveCamera(
    45,
    viewer.clientWidth / viewer.clientHeight,
    0.1,
    100
);

camera.position.set(0, 1.5, 5);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    viewer.clientWidth,
    viewer.clientHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

viewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;

controls.enableRotate = true;

controls.enableZoom = true;

controls.enablePan = false;

controls.dampingFactor = 0.08;

controls.minDistance = 2;
controls.maxDistance = 8;

controls.target.set(0, 1.2, 0);

controls.update();

const ambientLight = new THREE.HemisphereLight(
    0xffffff,
    0x444444,
    2
);

scene.add(ambientLight);

const light = new THREE.DirectionalLight(
    0xffffff,
    3
);

light.position.set(3, 5, 4);

scene.add(light);

const loader = new GLTFLoader();

let character;
let mixer;
let action;

loader.load(
    "assets/models/spiderman.glb",

    (gltf) => {

        character = gltf.scene;

        character.scale.set(1, 1, 1);

        character.position.set(0, 0, 0);

        scene.add(character);

        console.log("Spider-Man loaded!");
        console.log("Animations:", gltf.animations);

        if (gltf.animations.length > 0) {
            console.log("Duration:", gltf.animations[0].duration);

            mixer = new THREE.AnimationMixer(character);

            const clip = gltf.animations[0];

            console.log("Animation name:", clip.name);
            console.log("Animation duration:", clip.duration);
            console.log("Animation tracks:", clip.tracks.length);

            action = mixer.clipAction(clip);

            action.reset();
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.clampWhenFinished = false;
            action.enabled = true;
            action.setEffectiveWeight(1);
            action.setEffectiveTimeScale(1);

            action.play();

            console.log("Action running:", action.isRunning());
        }

    },

    undefined,

    (error) => {

        console.error(
            "Spider-Man failed to load:",
            error
        );

    }
);

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixer) {
        mixer.update(delta);
    }

    if (character) {

        character.rotation.y +=
            (targetRotationY - character.rotation.y) * 0.08;

        character.rotation.x +=
            (targetRotationX - character.rotation.x) * 0.08;

    }

    controls.update();

    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {

    const width = viewer.clientWidth;
    const height = viewer.clientHeight;

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
        width,
        height
    );

});

let mouseX = 0;
let mouseY = 0;

let targetRotationY = 0;
let targetRotationX = 0;

window.addEventListener("mousemove", (event) => {

    const rect = viewer.getBoundingClientRect();

    mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    targetRotationY = mouseX * 1.75;
    targetRotationX = mouseY * 1.72;

});