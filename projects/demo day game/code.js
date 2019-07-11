


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, -1000, 0);

// background
var textureBackground = new THREE.CubeTextureLoader().load([
    "1.png",
    "2.png",
    "1.png",
    "1.png",
    "3.png",
    "4.png"
]);
scene.background = textureBackground;

var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//For GLTF
// renderer.gammaOutput = true;
// renderer.gammaFactor = 2.2;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// lighting
var light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);
var spotLight = new THREE.SpotLight(0x00ff00);
spotLight.position.set(0, 20, 0);
spotLight.castShadow = true;

spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 300;

var lightHelper = new THREE.SpotLightHelper( spotLight );
scene.add( lightHelper );

// spotLight.shadow.camera.near = 500;
// spotLight.shadow.camera.far = 4000;
// spotLight.shadow.camera.fov = 30;

scene.add(spotLight);

//Roman head 1
//from https://sketchfab.com/3d-models/marcus-aurelius-03d7639ecbe943bba20b22ba1f9746d3#download
var gltfLoader = new THREE.GLTFLoader();
gltfLoader.setPath("antinous/");
gltfLoader.load("scene.gltf", function (object) {
    object.scene.position.set(10, 40, 10);
    //object.scene.scale.set(0.005, 0.005, 0.005);
    scene.add(object.scene);
});

// music
const INITIAL_VOLUME = 0.5;
var listener = new THREE.AudioListener();
camera.add(listener);
var sound = new THREE.Audio(listener);
var audioLoader = new THREE.AudioLoader();
audioLoader.load('kashootmyself.ogg', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(INITIAL_VOLUME);
    sound.play();
});

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({
    color: 0xf7c56e,
});
var cube = new THREE.Mesh(geometry, material);
//scene.add( cube );

var textGeometry;

var textMesh;

var loader = new THREE.FontLoader();
loader.load('gentilis_bold.typeface.json', function (font) {
    textGeometry = new THREE.TextGeometry('Yeet', {
        font: font,
        size: 10,
        height: 0.5,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 5
    });

    textGeometry.computeBoundingBox();
    textGeometry.computeVertexNormals();
    textGeometry.center();

    var material = new THREE.MeshStandardMaterial({
        color: 0xf7c56e,
        //envMap: textureBackground,
        //metalness: 1,
        //roughness: 0
    });
    textMesh = new THREE.Mesh(textGeometry, material);


    //textMesh.rotation.z = 90;
    textMesh.position.z = 0;
    textMesh.castShadow = true;
    textGeometry.position = (0, -900, 0);
    scene.add(textMesh);


});

// orbit controls
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.minDistance = 10;
controls.maxDistance = 100;

var sphere = new THREE.Mesh(new THREE.SphereBufferGeometry( 5, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ffff}));
sphere.position.set(0, 5, 0);
sphere.castShadow = true;
scene.add(sphere);
controls.update();

// ground
var planeSize = 2000;
var groundTexture = new THREE.TextureLoader().load('tile2.png');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(planeSize / 100, planeSize / 100);
groundTexture.anisotropy = 6;
var groundMaterial = new THREE.MeshStandardMaterial({map: groundTexture});

// plane
var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(planeSize, planeSize), groundMaterial);
mesh.position.y = -10;
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

// anisotropy gui
var gui = new dat.GUI();
gui.add(groundTexture, "anisotropy", 0, 50, 1).onChange(function () {
    groundTexture.needsUpdate = true;
});

//music gui
sound.volume = INITIAL_VOLUME;
gui.add(sound, "volume", 0, 1, 0.01).onChange((val) => sound.setVolume(val));

function animate() {
    //controls.update();
    requestAnimationFrame(animate);
    cube.rotation.x -= 0.01;
    cube.rotation.y -= 0.01;
    cube.rotation.z -= 0.01;
    renderer.render(scene, camera);
    textMesh.rotation.y += 0.01;

}
animate();
