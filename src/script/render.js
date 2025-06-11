import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//effeccts composer
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js";
import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls.js";


import GSAP from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
const manager = new THREE.LoadingManager();
GSAP.registerPlugin(TextPlugin);
const listener = new THREE.AudioListener();
// Attach it to the camera
const soundtyping = new THREE.Audio(listener);
const soundExplotion = new THREE.Audio(listener);
const soundEnter = new THREE.Audio(listener);
const soundAcces = new THREE.Audio(listener);
const soundleft = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader(manager);




const textureloader = new THREE.TextureLoader(manager);
const Mercurytu = textureloader.load("taxtures/mercury.jpg");
const suntuxture = textureloader.load("taxtures/sun.jpg");
const Venustu = textureloader.load("taxtures/venus.jpg");
const Earthtu = textureloader.load("taxtures/Earth.jpg");
const Marstu = textureloader.load("taxtures/mars.jpg");
const moontux = textureloader.load("taxtures/moon.jpg");
const scene = new THREE.Scene();

const cubeTextureLoader = new THREE.CubeTextureLoader(manager);

cubeTextureLoader.setPath("taxtures/milkey-way/"); // Ensure correct folder name and path

const bgCUBE = cubeTextureLoader.load(
  ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]
);

scene.background = bgCUBE;

const MercuryMaterial = new THREE.MeshStandardMaterial({
  map: Mercurytu,
});
const VenusMaterial = new THREE.MeshStandardMaterial({
  map: Venustu,
});
const EarthMaterial = new THREE.MeshStandardMaterial({
  map: Earthtu,
});
const MarsMaterial = new THREE.MeshStandardMaterial({
  map: Marstu,
});
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moontux,
});
const jupiterMaterial = new THREE.MeshStandardMaterial({
  map: textureloader.load("taxtures/jupiter.jpg"),
});
const PLANETS = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 15, // Increased by 5
    speed: 0.01,
    material: MercuryMaterial,
    moon: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 20, // Increased by 5
    speed: 0.007,
    material: VenusMaterial,
    moon: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 25, // Increased by 5
    speed: 0.005,
    material: EarthMaterial,
    moon: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
        material: moonMaterial,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 30, // Increased by 5
    speed: 0.003,
    material: MarsMaterial,
    moon: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
        material: moonMaterial,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        material: moonMaterial,
      },
    ],
  },
  {
    name: "Jupiter",
    radius: 2,
    distance: 45, // Increased by 5
    speed: 0.002,
    material: jupiterMaterial,
    moon: [
      {
        name: "Io",
        radius: 0.2,
        distance: 3,
        speed: 0.02,
        material: MarsMaterial,
      },
      {
        name: "Europa",
        radius: 0.2,
        distance: 4,
        speed: 0.018,
        material: moonMaterial,
      },
      {
        name: "Ganymede",
        radius: 0.35,
        distance: 5,
        speed: 0.016,
        material: moonMaterial,
      },
      {
        name: "Callisto",
        radius: 0.3,
        distance: 6,
        speed: 0.014,
        material: VenusMaterial,
      },
    ],
  },
];

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.add(listener);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.03;
orbitControls.minDistance = 8;
orbitControls.maxDistance = 55;
orbitControls.zoomToCursor = true;
orbitControls.enablePan = false;
camera.position.z = 20;
camera.position.y = 20;
const maxpexilratio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(maxpexilratio);

//

renderer.setSize(window.innerWidth, window.innerHeight);
const modelcont = document.querySelector(".model");
modelcont.appendChild(renderer.domElement);
// make renderer for effects
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
//bloom
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.8, // Increased intensity
  0.5, // Increased radius for softer glow
  0.2 // Lower threshold for a subtle effect
);
composer.addPass(bloomPass);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// this effect to ceperate RGP
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms["amount"].value = 0.0005; // Subtle effect
composer.addPass(rgbShiftPass);

const vignettePass = new ShaderPass(VignetteShader);
vignettePass.uniforms["darkness"].value = 1; // More pronounced vignette
vignettePass.uniforms["offset"].value = 0.2; // Adjust offset for vignette effect
composer.addPass(vignettePass);




let activeControls = orbitControls;

// Handle gyroscope permission (iOS)
if (
  typeof DeviceOrientationEvent !== "undefined" &&
  typeof DeviceOrientationEvent.requestPermission === "function"
) {
  const gyroButton = document.createElement("button");
  gyroButton.innerText = "Enable Gyroscope";
  gyroButton.style.cssText = `
    position:fixed;
    top:20px;
    left:20px;
    z-index:9999;
    background-color:#f80000;
    color:white;
    border:none;
    border-radius:8px;
    padding:10px;
    font-size:14px;
    cursor:pointer
  `;
  document.body.appendChild(gyroButton);

  gyroButton.addEventListener("click", () => {
    DeviceOrientationEvent.requestPermission().then((response) => {
      if (response === "granted") {
        const deviceControls = new DeviceOrientationControls(camera);
        deviceControls.connect();
        activeControls = deviceControls;
        gyroButton.remove();
      }
    });
  });
} else {
  // Android or other browsers
  const deviceControls = new DeviceOrientationControls(camera);
  deviceControls.connect();
  activeControls = deviceControls;
}




const positionalSound = new THREE.PositionalAudio(listener);
audioLoader.load("sounds/sun.mp3", function (buffer) {
  positionalSound.setBuffer(buffer);
  positionalSound.setRefDistance(10);
  positionalSound.setLoop(true);
  positionalSound.setVolume(1);
});

const sungroup = new THREE.Group();
const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: suntuxture,
});
const sun = new THREE.Mesh(sphereGeo, sunMaterial);
sun.scale.setScalar(5);
const sun2Matirial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    texture: { value: suntuxture },
  },
  vertexShader: /*glsl*/ `
    precision mediump float;
    uniform float time;
    varying vec2 vUv;

    // Simple 3D Noise Function
    float hash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
    }

    float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
                       mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
                   mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
                       mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
    }

    void main() {
        vUv = uv;
        vec3 pos = position;

        // Reduce noise effect
        float displacement = noise(pos * 7.5 + time * 1.2) * 0.03;
        pos += normal * displacement;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: /*glsl*/ `
    precision mediump float;
    uniform sampler2D texture;
    varying vec2 vUv;

    void main() {
        vec4 texColor = texture2D(texture, vUv);
        if (texColor.a < 0.1) discard;  // Fix transparency issues
        gl_FragColor = vec4(texColor);
    }
  `,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true,
});
const sun2 = new THREE.Mesh(sphereGeo, sun2Matirial);
sungroup.add(sun2);
sun2.scale.setScalar(5.1);

scene.add(sungroup);
sungroup.add(sun);
sun.add(positionalSound);

const planetsMeshs = PLANETS.map((planet) => {
  //create mesh
  const planetGeo = new THREE.SphereGeometry(1, 32, 32);
  const planetMesh = new THREE.Mesh(planetGeo, planet.material);

  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;
  scene.add(planetMesh);
  planet.moon.forEach((MOON) => {
    const moonMesh = new THREE.Mesh(planetGeo, MOON.material);
    moonMesh.scale.setScalar(MOON.radius);
    moonMesh.position.x = MOON.distance;
    planetMesh.add(moonMesh);
  });
  return planetMesh;
});

const lightsun = new THREE.PointLight(0xffffff, 1);
lightsun.position.set(0, 0, 0); // Center it at the sun
scene.add(lightsun);
// TODO 120
const asteroidCount = 1;


// add rockets
const asteroidBelt = new THREE.Group();
const aseColorsb = [
  new THREE.Color(0x4b4b4b), // dark grey
  new THREE.Color(0x5c5248), // rocky brown
  new THREE.Color(0x3b3b3b), // basalt grey
  new THREE.Color(0x6e6259), // dusty brown
  new THREE.Color(0x2f2f2f), // charcoal
];
for (let i = 0; i < asteroidCount; i++) {
  const asteroidMaterial = new THREE.MeshStandardMaterial({
      color: aseColorsb[THREE.MathUtils.randInt(0, aseColorsb.length - 1)],
    });
    const widthSegments = Math.floor(Math.random() * 5) + 3; // 4–8
    const heightSegments = Math.floor(Math.random() * 5) + 3; // 4–8
  
    const asteroidGeometry = new THREE.SphereGeometry(
      THREE.MathUtils.randFloat(0.1, 0.3),
      widthSegments,
      heightSegments
    );
  const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

  // Random position in orbit
  const angle = Math.random() * Math.PI * 2;
  const distance = THREE.MathUtils.randFloat(30, 45); // Between Mars & Jupiter
  asteroid.scale.setScalar(THREE.MathUtils.randFloat(0.8, 1));
  asteroid.position.set(
    distance * Math.cos(angle),
    THREE.MathUtils.randFloat(-0.2, 0.2), // Small variation
    distance * Math.sin(angle)
  );

  // Add each asteroid to the asteroid belt
  asteroidBelt.add(asteroid);
}

// Add the asteroid belt to the scene
scene.add(asteroidBelt);
// TODO
// TODO 110
const asteroid2Count = 1;

// add rockets
const asteroid2Belt = new THREE.Group();

for (let i = 0; i < asteroid2Count; i++) {
  const asteroidMaterial = new THREE.MeshStandardMaterial({
    color: aseColorsb[THREE.MathUtils.randInt(0, aseColorsb.length - 1)],
  });
  const widthSegments = Math.floor(Math.random() * 5) + 3; // 4–8
  const heightSegments = Math.floor(Math.random() * 5) + 3; // 4–8

  const asteroidGeometry = new THREE.SphereGeometry(
    THREE.MathUtils.randFloat(0.1, 0.3),
    widthSegments,
    heightSegments
  );
  const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

  // Random position in orbit
  const angle = Math.random() * Math.PI * 2;
  const distance = THREE.MathUtils.randFloat(50, 55); // Between
  asteroid.scale.setScalar(THREE.MathUtils.randFloat(0.8, 1.1));
  asteroid.position.set(
    distance * Math.cos(angle),
    THREE.MathUtils.randFloat(-0.2, 0.2), // Small variation
    distance * Math.sin(angle)
  );

  // Add each asteroid to the asteroid belt
  asteroid2Belt.add(asteroid);
}

// Add the asteroid belt to the scene
scene.add(asteroid2Belt);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);


audioLoader.load("sounds/left-page.mp3", function (buffer) {
  soundleft.setBuffer(buffer);
  soundleft.setLoop(false);
  soundleft.setVolume(0.6);
});

audioLoader.load("sounds/explosion.mp3", function (buffer) {
  soundExplotion.setBuffer(buffer);
  soundExplotion.setLoop(false);
  soundExplotion.setVolume(1);
});
audioLoader.load("sounds/access-denied.mp3", function (buffer) {
  soundAcces.setBuffer(buffer);
  soundAcces.setLoop(false);
  soundAcces.setVolume(0.6);
});
audioLoader.load("sounds/enter.mp3", function (buffer) {
  soundEnter.setBuffer(buffer);
  soundEnter.setLoop(false);
  soundEnter.setVolume(1);
});

audioLoader.load("sounds/typing.mp3", function (buffer) {
  soundtyping.setBuffer(buffer);
  soundtyping.setLoop(false);
  soundtyping.setVolume(0.5);
});

const loaderText = document.getElementById("loader");
const loader_cont = document.querySelector(".loaderCont");
const main_page = document.querySelector(".main");

let selectedplanet;
const planetsSelectList = document.querySelectorAll(".selected-input");
planetsSelectList.forEach((select) => {
  select.addEventListener("click", () => {
    soundEnter.play();

    if (selectedplanet === select.value) {
      selectedplanet = NaN;
      select.checked = false;
      orbitControls.target = new THREE.Vector3(0, 0, 0);
      orbitControls.minDistance = 5;
      camera.position.z = 20;
      camera.position.y = 20;
      orbitControls.maxDistance = 55;
      GSAP.to("#typing-text", {
        duration: 2,
        text: { value: "SOlar system !", delimiter: "" },
        ease: "power3.inOut",
        yoyo: true,
        onStart: () => {
          soundtyping.play();
          cursor.restart;
          cursor.play();
        },
        onComplete: () => {
          cursor.pause(), soundtyping.pause();
        },
      });
    } else {
      selectedplanet = select.value;
      orbitControls.minDistance = 3;
      camera.position.z = 5;
      camera.position.y = 5;
      orbitControls.maxDistance = 10;
      GSAP.to("#typing-text", {
        duration: 2,
        text: { value: select.value, delimiter: "" },
        ease: "power3.inOut",
        yoyo: true,
        onStart: () => {
          soundtyping.play();
          cursor.restart;
          cursor.play();
        },
        onComplete: () => {
          cursor.pause(), soundtyping.pause();
        },
      });
    }
  });
});
function animate() {
  sun2Matirial.uniforms.time.value += 0.05;
  sun2.rotation.z += 0.001;
  planetsMeshs.forEach((planet, index) => {
    planet.rotation.y += PLANETS[index].speed;
    planet.position.x = Math.sin(planet.rotation.y) * PLANETS[index].distance;
    planet.position.z = Math.cos(planet.rotation.y) * PLANETS[index].distance;
    // sun2.rotation.y += 0.1;
    // sun2.rotation.z += 0.1;
    if (selectedplanet === PLANETS[index].name) {
      let planetPosition = planet.position.clone()

      orbitControls.target = planetPosition;

      camera.position.lerp(planetPosition, 0.001);
      // Smooth transition
      // GSAP.to(camera.position, {
      //   x: cameraPosition.x,
      //   y: cameraPosition.y,
      //   z: cameraPosition.z,
      //   duration: 0.01,
      //   onUpdate: () => {
      //     camera.lookAt(planet.position);
      //   },
      // });
    }

    planet.children.forEach((moonmesh, index2) => {
      moonmesh.rotation.y += PLANETS[index].moon[index2].speed;
      moonmesh.position.x =
        Math.sin(moonmesh.rotation.y) * PLANETS[index].moon[index2].distance;
      moonmesh.position.z =
        Math.cos(moonmesh.rotation.y) * PLANETS[index].moon[index2].distance;
    });
  });

  asteroidBelt.rotation.y += 0.002; //this one for rockets

  asteroidBelt.children.forEach((asteroid) => {
    asteroid.rotation.x += 0.005 * Math.random();
    asteroid.rotation.y += 0.005 * Math.random();
  });
  asteroid2Belt.rotation.y += 0.002; //this one for rockets

  asteroid2Belt.children.forEach((asteroid) => {
    asteroid.rotation.x += 0.006 * Math.random();
    asteroid.rotation.y += 0.006 * Math.random();
  });
  composer.render();
//  activeorbitControls.update();
//  orbitControls.update();
if (activeControls) activeControls.update();

  requestAnimationFrame(animate);
}
animate();

//sounds
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioElement = new Audio("./sounds/main.mp3");
audioElement.loop = true;

// Ensure audio is loaded before allowing playback
audioElement.addEventListener("canplaythrough", () => {}, { once: true });

const track = audioContext.createMediaElementSource(audioElement);

// 🎛 Create Effect Nodes
const gainNode = audioContext.createGain();
const filter = audioContext.createBiquadFilter();
filter.type = "lowpass";
filter.frequency.value = 10000; // Normal sound

// 🎛 Connect Nodes Properly (No Reverb)
track.connect(gainNode);
gainNode.connect(filter);
filter.connect(audioContext.destination);

// Smooth Transition Function
function smoothTransition(param, value, duration = 0.5) {
  if (param instanceof AudioParam) {
    param.cancelScheduledValues(audioContext.currentTime);
    param.setTargetAtTime(value, audioContext.currentTime, duration);
  }
}

// Ensure audio starts on user interaction
function startAudio() {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  if (audioElement.paused) {
    audioElement
      .play()
      .catch((err) => console.error("❌ Audio playback failed:", err));
  }
}

// UI Elements
const downMainCss = document.querySelector(".main");

// Fix: Listen on renderer.domElement to avoid OrbitControls interference
renderer.domElement.addEventListener("pointerdown", onPointerDown);
renderer.domElement.addEventListener("pointerup", onPointerUp);

// Prevent OrbitControls from blocking click detection
renderer.domElement.style.touchAction = "none";

function onPointerDown(event) {
  event.preventDefault(); // Prevent OrbitControls interference
  document.body.style.cursor = "none";
  downMainCss.classList.add("down");

  smoothTransition(gainNode.gain, 0.9); // Lower volume smoothly
  smoothTransition(filter.frequency, 1000); // Muffle sound smoothly
  smoothTransition(audioElement.playbackRate, 0.2, 1); // Slow down over 1 sec
}

function onPointerUp(event) {
  event.preventDefault(); // Prevent OrbitControls interference
  document.body.style.cursor = "default";

  downMainCss.classList.remove("down");

  smoothTransition(gainNode.gain, 1); // Restore volume smoothly
  smoothTransition(filter.frequency, 10000); // Restore normal sound
  smoothTransition(audioElement.playbackRate, 1, 1); // Reset speed over 1 sec
}
//mute button
const MUTED = GSAP.to("#muted-play", {
  scale: 0.9,
  opacity: 0.3,
  duration: 0.5,
  repeat: -1,
  yoyo: true,
  ease: "power4.inOut",
});
document.getElementById("muted-play").addEventListener("click", () => {
  if (audioContext.state === "suspended") {
    audioContext.resume().then(() => {
      console.log("▶️ Audio Context Resumed.");
    });
  }

  if (audioElement.paused) {
    audioElement
      .play()
      .then(() => {
        console.log("▶️ Audio Playing...");
        MUTED.play();
      })
      .catch((error) => {
        console.error("❌ Audio playback failed:", error);
      });
  } else {
    audioElement.pause();
    MUTED.progress(1).pause();
  }
});

manager.onStart = (url, itemsLoaded, itemsTotal) => {
  document.body.style.cursor = "wait";
}
manager.onLoad = () => {
  document.body.style.cursor = "pointer";

  loaderText.innerHTML = `Press to start`;
  GSAP.to("#loader", {
    opacity: 0,
    duration: 2.3,
    ease: "power2.in",

    repeat: -1,
  });
  loader_cont.addEventListener("click", () => {
    document.body.style.cursor = "default";
    soundExplotion.play();
    loader_cont.classList.add("Hidden-loader");
    main_page.classList.add("Visble-main");
    startAudio();
    MUTED.play();
    positionalSound.play();
    const tlanimation = GSAP.timeline();
    const cursor = GSAP.timeline({ repeat: -1, yoyo: true, paused: true });

    cursor.to("#cursor", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });

    tlanimation
      .to("#typing-text", {
        duration: 1.5,
        text: { value: "Hey there", delimiter: "" },
        ease: "power3.inOut",
        yoyo: true,
        onStart: () => {
          soundtyping.play();
          cursor.restart;
          cursor.pause();
        },
        onComplete: () => cursor.play(),
      })
      .to("#typing-text", {
        duration: 1.2,
        text: { value: "welcome back", delimiter: "" },
        ease: "power3.inOut",
        yoyo: true,
        onStart: () => {
          cursor.restart;
          cursor.pause();
        },
        onComplete: () => cursor.play(),
      })
      .to("#typing-text", {
        duration: 1.1,
        delay: 1,
        text: { value: "Enjoy !", delimiter: "" },
        ease: "power3.inOut",
        yoyo: true,
        onStart: () => {
          cursor.restart;
          cursor.pause();
        },
        onComplete: () => cursor.play(),
      })
      .to("#typing-text", {
        duration: 1.1,
        delay: 1,
        text: { value: "Solar System", delimiter: "" },
        ease: "power3.inOut",
        yoyo: true,
        onStart: () => {
          cursor.restart;
          cursor.pause();
        },
        onComplete: () => {
          soundtyping.pause();
          cursor.play();
        },
      });

    cursor.play();
  });
  
};


const contact_cont = document.querySelector(".contact-cont");
const Fill_contact = document.querySelector(".Fill-contact");
const contact_button = document.getElementById("contact-button");

contact_button.addEventListener("click", () => {
  contact_cont.classList.add("visble-contact");
  Fill_contact.classList.add("visble-fill");
  soundEnter.play();
});
Fill_contact.addEventListener("click", () => {
  soundleft.play();
  contact_cont.classList.remove("visble-contact");
  Fill_contact.classList.remove("visble-fill");
});
const undefined_item = document.getElementById("undefined-item");

if (undefined_item) {
  undefined_item.addEventListener("click", () => {
    soundAcces.play();
  });
}
