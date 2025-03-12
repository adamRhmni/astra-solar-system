import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
//  import blowm
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import GSAP from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

GSAP.registerPlugin(TextPlugin);

let Mercurytuloaded,
  suntuxtureloaded,
  Venustuloaded,
  Earthtuloaded,
  Marstuloaded,
  moontuxloaded,
  cubetexloaded;

const textureloader = new THREE.TextureLoader();
const Mercurytu = textureloader.load("public/taxtures/mercury.jpg", () => {
  Mercurytuloaded = true;
});
const suntuxture = textureloader.load("public/taxtures/sun.jpg", () => {
  suntuxtureloaded = true;
});
const Venustu = textureloader.load("/taxtures/venus.jpg", () => {
  Venustuloaded = true;
});
const Earthtu = textureloader.load("public/taxtures/earth.jpg", () => {
  Earthtuloaded = true;
});
const Marstu = textureloader.load("public/taxtures/mars.jpg", () => {
  Marstuloaded = true;
});
const moontux = textureloader.load("public/taxtures/moon.jpg", () => {
  moontuxloaded = true;
});
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

cubeTextureLoader.setPath("/public/taxtures/milkey-way/"); // Ensure correct folder name and path

const bgCUBE = cubeTextureLoader.load(
  ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
  () => {
    cubetexloaded = true;
  }
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
const PLANETS = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: MercuryMaterial,
    moon: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: VenusMaterial,
    moon: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: EarthMaterial,
    moon: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: MarsMaterial,
    moon: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
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
const renderer = new THREE.WebGLRenderer({});
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 20;
camera.position.y = 20;

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
  1.2,
  0.1,
  0.1
);
composer.addPass(bloomPass);

renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 1.5;

const sungroup = new THREE.Group();
const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
const sunMatirial = new THREE.MeshBasicMaterial({
  map: suntuxture,
});
const sun = new THREE.Mesh(sphereGeo, sunMatirial);
sun.scale.setScalar(5);
const sun2Matirial = new THREE.MeshStandardMaterial({
  map: textureloader.load("public/taxtures/sun.jpg"),
  blending: THREE.AdditiveBlending,
});
const sun2 = new THREE.Mesh(sphereGeo, sun2Matirial);
sungroup.add(sun2);
sun2.scale.setScalar(5.3);

scene.add(sungroup);
sungroup.add(sun);

const planetsMeshs = PLANETS.map((planet) => {
  //create mesh
  const planetGeo = new THREE.SphereGeometry(1, 32, 32);
  const planetMesh = new THREE.Mesh(planetGeo, planet.material);

  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;
  scene.add(planetMesh);
  planet.moon.forEach((MOON) => {
    const maMoon = new THREE.MeshStandardMaterial({
      map: moontux,
    });
    const moonMesh = new THREE.Mesh(planetGeo, maMoon);
    moonMesh.scale.setScalar(MOON.radius);
    moonMesh.position.x = MOON.distance;
    planetMesh.add(moonMesh);
  });
  return planetMesh;
});

const ampiantlight = new THREE.AmbientLight(0xffffff, 0.1);

scene.add(ampiantlight);
const lightsun = new THREE.PointLight(0xffffff, 1);
lightsun.position.set(0, 0, 0); // Center it at the sun
scene.add(lightsun);

const asteroidCount = 2;
const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8);
const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });

// add rockets
const asteroidBelt = new THREE.Group();

for (let i = 0; i < asteroidCount; i++) {
  const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

  // Random position in orbit
  const angle = Math.random() * Math.PI * 2;
  const distance = THREE.MathUtils.randFloat(25, 30); // Between Mars & Jupiter

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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const loaderText = document.getElementById("loader");
const loader_cont = document.querySelector(".loaderCont");
const main_page = document.querySelector(".main");

function animate() {
  planetsMeshs.forEach((planet, index) => {
    planet.rotation.y += PLANETS[index].speed;
    planet.position.x = Math.sin(planet.rotation.y) * PLANETS[index].distance;
    planet.position.z = Math.cos(planet.rotation.y) * PLANETS[index].distance;
    sun2.rotation.y += 0.1;
    sun2.rotation.z += 0.1;
    planet.children.forEach((moonmesh, index2) => {
      moonmesh.rotation.y += PLANETS[index].moon[index2].speed;
      moonmesh.position.x =
        Math.sin(moonmesh.rotation.y) * PLANETS[index].moon[index2].distance;
      moonmesh.position.z =
        Math.cos(moonmesh.rotation.y) * PLANETS[index].moon[index2].distance;
    });
    sun2.rotation;
  });

  asteroidBelt.rotation.y += 0.002; //this one for rockets

  asteroidBelt.children.forEach((asteroid) => {
    asteroid.rotation.x += 0.005 * Math.random();
    asteroid.rotation.y += 0.005 * Math.random();
  });
  composer.render();
  controls.update();
  requestAnimationFrame(animate);
}
animate();

//sounds
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioElement = new Audio("public/sounds/reverb.flac");
audioElement.loop = true;

// Ensure audio is loaded before allowing playback
audioElement.addEventListener(
  "canplaythrough",
  () => {
    console.log("✅ Audio is fully loaded and ready to play.");
  },
  { once: true }
);

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

  startAudio(); // Ensure audio is playing
  downMainCss.classList.add("down");

  smoothTransition(gainNode.gain, 0.9); // Lower volume smoothly
  smoothTransition(filter.frequency, 1000); // Muffle sound smoothly
  smoothTransition(audioElement.playbackRate, 0.2, 1); // Slow down over 1 sec
}

function onPointerUp(event) {
  event.preventDefault(); // Prevent OrbitControls interference

  downMainCss.classList.remove("down");

  smoothTransition(gainNode.gain, 0.1); // Restore volume smoothly
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
        MUTED.play()
      })
      .catch((error) => {
        console.error("❌ Audio playback failed:", error);
      });
  } else {
    audioElement.pause();
    MUTED.progress(1).pause();
  }
});

const intervalId = setInterval(() => {
  if (
    Mercurytuloaded &&
    suntuxtureloaded &&
    Venustuloaded &&
    Earthtuloaded &&
    Marstuloaded &&
    moontuxloaded &&
    cubetexloaded
  ) {
    clearInterval(intervalId);
    loaderText.innerHTML = `click any were to start`;
    GSAP.to("#loader", {
      opacity: 0,
      duration: 2.3,
      ease: "elastic.inOut",

      repeat: -1,
    });
    loader_cont.addEventListener("click", () => {
      loader_cont.classList.add("Hidden-loader");
      main_page.classList.add("Visble-main");
      audioElement.play();
      MUTED.play()
      const tlanimation = GSAP.timeline();
      const cursor = GSAP.timeline({ repeat: -1, yoyo: true, paused: true });

      cursor.to("#cursor", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });

      tlanimation
        .to("#typing-text", {
          duration: 2.3,
          text: { value: "this was created by adam", delimiter: "" },
          ease: "power2.inOut",
          yoyo: true,
          onStart: () => {
            cursor.restart;
            cursor.pause();
          },
          onComplete: () => cursor.play(),
        })
        .to("#typing-text", {
          duration: 2,
          delay: 1,
          text: { value: "Enjoy !", delimiter: "" },
          ease: "power2.inOut",
          yoyo: true,
          onStart: () => {
            cursor.restart;
            cursor.pause();
          },
          onComplete: () => cursor.play(),
        })
        .to("#typing-text", {
          duration: 1.3,
          delay: 1,
          text: { value: "Solar System", delimiter: "" },
          ease: "power3.inOut",
          yoyo: true,
          onStart: () => {
            cursor.restart;
            cursor.pause();
          },
          onComplete: () => cursor.play(),
        });

      cursor.play();
    });
  }
}, 500);

// const contact_cont = document.querySelector(".contact-cont");
// const Fill_contact = document.querySelector(".Fill-contact");
// const contact_button = document.getElementById("contact-button");

// contact_button.addEventListener("click",()=>{
//   contact_cont.classList.add("visible-contact")
//   Fill_contact.classList.add("visible-fill")
// })