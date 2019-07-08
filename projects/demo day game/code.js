var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var textureBackground = new THREE.CubeTextureLoader().load( [ 
    "1.png",
    "2.png",
    "1.png",
    "1.png",
    "3.png",
    "4.png"
] );
scene.background = textureBackground;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var objLoader = new THREE.OBJLoader();
objLoader.load( 'eyeball.obj', function ( object ) {
    var eye = object;
scene.add( eye );
} );

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({
    color: 0xf7c56e,
});
var cube = new THREE.Mesh(geometry, material);
//scene.add( cube );

camera.position.z = 5;

var textGeometry;

var textMesh;

var loader = new THREE.FontLoader();
loader.load('gentilis_bold.typeface.json', function (font) {
    textGeometry = new THREE.TextGeometry('Yeet', {
        font: font,
        size: 4,
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
        envMap: textureBackground,
        metalness: 1,
        roughness: 0
    });
    textMesh = new THREE.Mesh(textGeometry, material);


    //textMesh.rotation.z = 90;
    textMesh.position.z = 0;
    textMesh.castShadow = true;
    textGeometry.position = (0, 0, 0);
    scene.add(textMesh);


});

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.minDistance = 10;
controls.maxDistance = 100;

var planeSize = 2000;

var groundTexture = new THREE.TextureLoader().load( 'tile.png') ;
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(planeSize / 30, planeSize / 30);
groundTexture.anisotropy = 6;

var groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });

var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(planeSize, planeSize), groundMaterial);
mesh.position.y = -10;
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var light = new THREE.PointLight

var gui = new dat.GUI();
gui.add(groundTexture, "anisotropy", 0, 50, 1).onChange(function() {
    groundTexture.needsUpdate = true;
});

function animate() {
    controls.update();
    requestAnimationFrame(animate);
    cube.rotation.x -= 0.01;
    cube.rotation.y -= 0.01;
    cube.rotation.z -= 0.01;
    renderer.render(scene, camera);

    textMesh.rotation.y += 0.01;

}
animate();

