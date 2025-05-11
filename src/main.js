import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

const scene = new THREE.Scene();
//Loading BackGround Image
const loader = new THREE.TextureLoader();
loader.load("src/bg.jpg", function (texture) {
  scene.background = texture;
});

// Camera
const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(5, 5, 10);

// Getting Canvas
const canvas = document.getElementById("canvas");

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  stencil: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 7.5);
scene.add(light);

// Ground
const radialSegments = 10;
const radiusInner = 0;
const radiusOuter = 10;

const ringGeometry = new THREE.RingGeometry(
  radiusInner,
  radiusOuter,
  radialSegments,
  2
);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0x444444,
  side: THREE.DoubleSide,
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = -Math.PI / 2;
scene.add(ring);

//Grid Lines
const gridMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

for (let i = 0; i < radialSegments; i++) {
  const angle = (i / radialSegments) * Math.PI * 2;
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(6);

  vertices[0] = radiusInner * Math.cos(angle);
  vertices[1] = 0;
  vertices[2] = radiusInner * Math.sin(angle);
  vertices[3] = radiusOuter * Math.cos(angle);
  vertices[4] = 0;
  vertices[5] = radiusOuter * Math.sin(angle);

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  const line = new THREE.Line(geometry, gridMaterial);
  scene.add(line);
}

// Create concentric grid lines
const concentricSegments = 20;
for (let i = 1; i <= concentricSegments; i++) {
  const radius =
    radiusInner + (i * (radiusOuter - radiusInner)) / concentricSegments;
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let j = 0; j < radialSegments; j++) {
    const angle = (j / radialSegments) * Math.PI * 2;
    vertices.push(radius * Math.cos(angle), 0, radius * Math.sin(angle));
  }
  vertices.push(vertices[0], vertices[1], vertices[2]); // Close the loop

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices), 3)
  );

  const line = new THREE.Line(geometry, gridMaterial);
  scene.add(line);
}

// Human Body - Main container group
const human = new THREE.Group();
human.position.y = 1;
scene.add(human);

// Body (Cube)
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff });
const body = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 1), bodyMaterial);
body.position.y = 3;
human.add(body);

// Head (Sphere)
const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 32),
  headMaterial
);
head.position.y = 5.3;
human.add(head);

// Cap (Cone)
const capMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cap = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.2, 32), capMaterial);
cap.position.y = 6.4;
human.add(cap);

// Left Arm
const armMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const leftArm = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 2.5, 0.5),
  armMaterial
);
leftArm.position.set(-1.4, 3, 0);
human.add(leftArm);

// Right Arm
const rightArm = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 2.5, 0.5),
  armMaterial
);
rightArm.position.set(1.4, 3, 0);
human.add(rightArm);

// Left Leg
const legMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const leftLeg = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 2.5, 0.6),
  legMaterial
);
leftLeg.position.set(-0.5, 1, 0);
human.add(leftLeg);

// Right Leg
const rightLeg = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 2.5, 0.6),
  legMaterial
);
rightLeg.position.set(0.5, 1, 0);
human.add(rightLeg);

// Collection of clickable objects
const objects = [head, body, rightArm, leftArm, rightLeg, leftLeg, cap];

// Store original properties
objects.forEach((obj) => {
  // Store original scale only
  obj.userData.originalScale = {
    x: obj.scale.x,
    y: obj.scale.y,
    z: obj.scale.z,
  };
});

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Highlight variables
let outlineMesh = null;
let selectedObject = null;

// Outline material
const outlineMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.BackSide,
});

//  function to animate scale changes only using GSAP
function animateScale(object, targetScale, duration = 0.5) {
  gsap.to(object.scale, {
    x: targetScale.x,
    y: targetScale.y,
    z: targetScale.z,
    duration: duration,
    ease: "power2.out",
  });
}

//Stencil-Outline Function
function createStencilOutline(targetObject) {
  const stencilMat = new THREE.MeshStandardMaterial({
    colorWrite: false,
    depthWrite: false,
    stencilWrite: true,
    stencilFunc: THREE.AlwaysStencilFunc,
    stencilRef: 1,
    stencilZPass: THREE.ReplaceStencilOp,
  });

  const stencilMesh = new THREE.Mesh(targetObject.geometry.clone(), stencilMat);
  stencilMesh.position.copy(targetObject.position);
  stencilMesh.quaternion.copy(targetObject.quaternion);
  stencilMesh.scale.copy(target.scale);
  scene.add(stencilMesh);

  const outlineMat = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.BackSide,
    depthTest: true,
    stencilWrite: true,
    stencilFunc: THREE.NotEqualStencilFunc,
    stencilRef: 1,
    stencilFail: THREE.KeepStencilOp,
    stencilZFail: THREE.KeepStencilOp,
    stencilZPass: THREE.KeepStencilOp,
  });

  const outlineMesh = new THREE.Mesh(target.geometry.clone(), outlineMat);
  outlineMesh.position.copy(target.position);
  outlineMesh.quaternion.copy(target.quaternion);
  outlineMesh.scale.copy(target.scale).multiplyScalar(1.1);
  scene.add(outlineMesh);

  return [stencilMesh, outlineMesh];
}

// Click handler
function onMouseClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(objects);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;

    if (selectedObject !== clickedObject) {
      if (selectedObject) {
        animateScale(selectedObject, selectedObject.userData.originalScale);

        outlineGroup.forEach((mesh) => scene.remove(mesh));
        outlineGroup = [];
      }

      animateScale(clickedObject, {
        x: clickedObject.userData.originalScale.x * 1.5,
        y: clickedObject.userData.originalScale.y * 1.5,
        z: clickedObject.userData.originalScale.z * 1.5,
      });

      outlineGroup = createStencilOutline(clickedObject);

      selectedObject = clickedObject;
    } else {
      animateScale(selectedObject, selectedObject.userData.originalScale);

      outlineGroup.forEach((mesh) => scene.remove(mesh));
      outlineGroup = [];
      selectedObject = null;
    }
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.clearStencil();
  controls.update();
  renderer.render(scene, camera);
}

// Start animation
animate();

// Event listeners
window.addEventListener("click", onMouseClick);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
