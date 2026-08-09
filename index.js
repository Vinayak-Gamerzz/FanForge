import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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

            mixer = new THREE.AnimationMixer(character);

            const animation = gltf.animations[0];

            console.log("Playing:", animation.name);

            const action = mixer.clipAction(animation);

            action.play();

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

    renderer.render(
        scene,
        camera
    );

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