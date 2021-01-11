import './main.css';

import firebase from 'firebase/app';
import 'firebase/database';
const firebaseConfig = {
    apiKey: "AIzaSyAysud3LYywY0HQhG4MAWcnqwxXgbuamT0",
    authDomain: "ruangharapan-72f60.firebaseapp.com",
    projectId: "ruangharapan-72f60",
    storageBucket: "ruangharapan-72f60.appspot.com",
    messagingSenderId: "603724326519",
    appId: "1:603724326519:web:5ae7aed7bd782fb1e50872",
    databaseId: "https://ruangharapan-72f60-default-rtdb.firebaseio.com/",
    measurementId: "G-PVK8MNL8CW"
};
var app = firebase.initializeApp(firebaseConfig);
var db = app.database();
const query = new URLSearchParams(window.location.search);
var roomslug;
if(query.has("room")){
    roomslug = query.get("room").match('^[a-zA-Z0-9]+$');
    roomslug = (roomslug == null? "messages": roomslug[0]);
} else {
    roomslug = "messages";
    msgDbRef = db.ref("messages");
    document.getElementById("room-slug").innerText = "Utama";
}
var msgDbRef = db.ref(roomslug);
document.getElementById("room-slug").innerText = (roomslug == "messages"? "Utama":roomslug);

function addMessage(data){
    console.log(data.name);
    if(!data.name.match('^[A-Za-z0-9 ]+$')){
        formharapan.hidden = false;
        statusharapan.hidden = true;
        alert(`error: Nama terdiri dari karakter ilegal. Gunakan huruf, angka, dan spasi (a-z,A-Z,0-9, ) saja`);
        return;
    }
    msgDbRef.push()
    .set(data)
    .then(() => {
        formharapan.reset();
        var cnt = 60; // timer
        statusharapan.innerText = `Berhasil menyimpan harapan kamu!\r\n`;
        statusharapan.innerText += `Kamu punya ${cnt} detik sebelum mengirimkan harapan yang lain.`;
        var timer = setInterval(function(){
            cnt--;
            statusharapan.innerText = `Berhasil menyimpan harapan kamu!\r\n`;
            statusharapan.innerText += `Kamu punya ${cnt} detik sebelum mengirimkan harapan yang lain.`;
            if(cnt < 0){
                statusharapan.hidden = true;
                formharapan.hidden = false;
                clearInterval(timer);
            }
        }, 1000);
    }, (error) => {
        formharapan.hidden = false;
        statusharapan.hidden = true;
        alert(`error: ${error}`);
    });
}

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/** @type {THREE.PerspectiveCamera} */
let camera;
let scene, renderer;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2( -1, -1 );
const mouseScreen = new THREE.Vector2(-1,-1);

const color = new THREE.Color();
var Clock = new THREE.Clock();
var tooltip = {
    status: false,
    panel: document.getElementById("tooltip"),
    nameEl: document.getElementById("tooltip-name"),
    messageEl: document.getElementById("tooltip-message")
};
var info = document.getElementById("info-text");
var infobar = {
    menu: {
        form: {
            button: document.getElementById("info-bar-open-form"),
            dom: document.getElementById("menu-form"),
            name: "form"
        },
        about: {
            button: document.getElementById("info-bar-open-about"),
            dom: document.getElementById("menu-about"),
            name: "about"
        },
        harapan: {
            dom: document.getElementById("menu-harapan"),
            name: "harapan",
            dname: document.getElementById("h-name"),
            dmessage: document.getElementById("h-mess"),
        },
        howtouse: {
            button: document.getElementById("info-bar-open-howtouse"),
            dom: document.getElementById("menu-howtouse"),
            name: "howtouse"
        },
    },
    panel: document.getElementById("info-bar-panel"),
    close: [
        document.getElementById("info-bar-close"),
        document.getElementById("light")
    ],
    status: false,
    lastmenu: ""
}
function setHarapan(name, message){
    const h = infobar.menu.harapan;
    h.dname.innerText = name;
    h.dmessage.innerText = message;
}
var lightDOM = {
    dom: document.getElementById("light"),
    status: false
}
lightDOM.dom.addEventListener("transitionend", function(){
    if (!lightDOM.status){
        lightDOM.dom.style.display = "none";
    }
})
for (var k in infobar.menu){
    let v = infobar.menu[k];
    if(v.button)
        v.button.addEventListener("click", ()=>{toggleInfobar(true, v.name);}, false);
}
infobar.close.map((ev)=>{
    ev.addEventListener("click", ()=>toggleInfobar(false), false);
})
function toggleInfobar(val, menu=""){
    if(infobar.status && !val){
        infobar.panel.style.transform = "translateX(0)";
        infobar.status = false;
        toggleLight(val);
    } else if(!infobar.status && val) {
        if (menu != "") {
            if (infobar.lastmenu != "") {
                infobar.menu[infobar.lastmenu].dom.hidden = true;
            }
            infobar.menu[menu].dom.hidden = false;
            infobar.lastmenu = menu;
        }
        infobar.panel.hidden = false;
        infobar.panel.style.transform = `translateX(-${getComputedStyle(infobar.panel).width})`;
        infobar.status = true;
        toggleLight(val);
        if(infobar.menu[menu].onOpen)
            infobar.menu[menu].onOpen(data ? data : null);
    }
}
function toggleLight(val){
    if(lightDOM.status && !val){
        lightDOM.dom.style.background = "rgba(0, 0, 0, 0)";
        lightDOM.status = false;
    }else if(!lightDOM.status && val){
        lightDOM.dom.style.display = "unset";
        lightDOM.dom.offsetHeight; // force repaint
        lightDOM.dom.style.background = "rgba(0, 0, 0, 0.7)";
        lightDOM.status = true;
    }
}
const formharapan = document.getElementById("form-harapan");
const statusharapan = document.getElementById("status-harapan");
formharapan.addEventListener("submit", function(ev){
    ev.preventDefault();
    var data = Object.fromEntries(new FormData(ev.target).entries());
    formharapan.hidden = true;
    statusharapan.hidden = false;
    statusharapan.innerText = "Mengirimkan harapan kamu...";
    addMessage(data);
})

var mouseDirty = false;

import { BufferGeometry, Sphere, Box3, Texture, Color, BufferAttribute  } from 'three';
window.THREE = { ...(window).THREE, BufferGeometry, Sphere, Box3, Texture, Color, BufferAttribute };
import { Buffer } from 'buffer';
window.Buffer = Buffer;
var loadFont = require('load-bmfont');
/** Buat text baru
 * @param {string} text Text yang akan ditulis
 * @returns {THREE.Mesh} Mesh yang dibuat untuk teks
 */
var TextGeometry = (text)=>{};
loadFont('consola-msdf.json', function(err, font){
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('consola.png', function (texture) {
        const MSDFShader = function (opt) {
            opt = opt || {};
            var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
            var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001;
            var precision = opt.precision || 'highp';
            var color = opt.color;
            var map = opt.map;
            var negate = typeof opt.negate === 'boolean' ? opt.negate : true;
          
            // remove to satisfy r73
            delete opt.map;
            delete opt.color;
            delete opt.precision;
            delete opt.opacity;
            delete opt.negate;
          
            return Object.assign({
                uniforms: {
                    opacity: { type: 'f', value: opacity },
                    map: { type: 't', value: map || new THREE.Texture() },
                    color: { type: 'c', value: new THREE.Color(color) }
                },
                vertexShader: [
                    '#version 300 es',
                    'in vec2 uv;',
                    'in vec4 position;',
                    'uniform mat4 projectionMatrix;',
                    'uniform mat4 modelViewMatrix;',
                    'out vec2 vUv;',
                    'void main() {',
                    'vUv = uv;',
                    'gl_Position = projectionMatrix * modelViewMatrix * position;',
                    '}'
                ].join('\n'),
                fragmentShader: [
                    '#version 300 es',
                    '#ifdef GL_OES_standard_derivatives',
                    '#extension GL_OES_standard_derivatives : enable',
                    '#endif',
                    'precision ' + precision + ' float;',
                    'uniform float opacity;',
                    'uniform vec3 color;',
                    'uniform sampler2D map;',
                    'in vec2 vUv;',
                    'out vec4 myOutputColor;',
                    'float median(float r, float g, float b) {',
                    '  return max(min(r, g), min(max(r, g), b));',
                    '}',                
                    'void main() {',
                    '  vec3 s = ' + (negate ? '1.0 - ' : '') + 'texture(map, vUv).rgb;',
                    '  float sigDist = median(s.r, s.g, s.b) - 0.5;',
                    '  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);',
                    '  myOutputColor = vec4(color.xyz, alpha * opacity);',
                    alphaTest === 0
                        ? ''
                        : '  if (myOutputColor.a < ' + alphaTest + ') discard;',
                    '}'
                ].join('\n')
            }, opt);
        };
        const material = new THREE.RawShaderMaterial(MSDFShader({
            map: texture,
            transparent: true,
            precision: "mediump",
            negate: false,
            color: 0xffffff
        }));
        const createGeometry = require('three-bmfont-text');
        function create(text){
            const geometry = createGeometry({
                font: font,
                text: text
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(0.2, -0.2, -0.2);
            return mesh;
        }
        TextGeometry = create;
        msgDbRef.on('child_added', (a)=>{
            const data = a.val();
            const pos = new THREE.Vector3(Math.random()*400-200, Math.random()*500-250, Math.random()*500-250);
            new Geometry(
                data.name,
                data.message,
                a.key,
                pos
            );
        });
    });
});

class Geometry {
    static Count = 0;
    static TextOffset = new THREE.Vector3(8, 0, 0);
    static Master = new THREE.InstancedMesh(new THREE.CylinderBufferGeometry(3, 3, 15), new THREE.MeshPhongMaterial(), 5000);
     /** @type {Geometry[]} */
    static Instances = [];
    #object;

    /**
     * Dapatkan geometri dengan id tertentu.
     * @param {number} id Id dari geometri yang ingin didapatkan
     */
    static GetWithId(id){
        return Geometry.Instances.find((val)=>val.id == id);
    }
    
    /**
     * Dapatkan geometri dengan key tertentu.
     * @param {string} key Key dari geometri yang ingin didapatkan
     */
    static GetWithKey(key){
        return Geometry.Instances.find((val)=>val.key == key);
    }

    /**
     * Buat geometri baru.
     * @param {string} name Nama geometri
     * @param {string} message Pesan geometri
     * @param {string} key Key geometri
     * @param {THREE.Vector3} position Posisi geometri
     * @param {THREE.Color} col Warna geometri
     */
    constructor(name, message, key=null, position=null, col=null){
        this.name = name;
        this.message = message;
        this.id = Geometry.Count;
        this.key = key || this.id.toString();
        this.text = TextGeometry(this.name);
        this.#object = new THREE.Object3D();
        this.pivot = new THREE.Object3D();
        this.setPosition(position || new THREE.Vector3(0,0,0));
        this.pivot.add(this.text);
        this.text.position.set(Geometry.TextOffset.x, Geometry.TextOffset.y, Geometry.TextOffset.z);
        scene.add(this.pivot);
        this.setEulerRotation(Math.random(), Math.random(), Math.random());
        this.setColor(col || color.setHex( Math.random() * 0xffffff ));
        Geometry.Instances.push(this);
        Geometry.Count++;
        Geometry.Master.count = Geometry.Count;
    }

    /**
     * Dapatkan posisi geometri
     */
    getPosition(){
        return this.#object.position;
    }

    /**
     * Atur posisi geometri dengan Vektor / XYZ
     * @param {number | THREE.Vector3} v Vektor / Posisi X
     * @param {number} y Posisi Y
     * @param {number} z Posisi Z
     */
    setPosition(v, y=0, z=0){
        if (v instanceof THREE.Vector3){
            this.#object.position.set(v.x, v.y, v.z);
        } else {
            this.#object.position.set(v, y, z);
        }
        this.#object.updateMatrix();
        this.pivot.position.copy(this.#object.position);
        Geometry.Master.setMatrixAt(this.id, this.#object.matrix);
        Geometry.Master.instanceMatrix.needsUpdate = true;
    }

    /**
     * Dapatkan rotasi euler geometri
     */
    getEulerRotation(){
        return this.#object.rotation;
    }

    /**
     * Atur rotasi euler geometri
     * @param {number | THREE.Euler} e Euler / X axis rotation
     * @param {number} y Y axis rotation
     * @param {number} z Z axis rotation
     */
    setEulerRotation(e, y, z){
        if (e instanceof THREE.Euler){
            this.#object.rotation.set(e.x, e.y, e.z);
        } else {
            this.#object.rotation.set(e, y, z);
        }
        this.#object.updateMatrix();
        Geometry.Master.setMatrixAt(this.id, this.#object.matrix);
        Geometry.Master.instanceMatrix.needsUpdate = true;
    }

    /**
     * Atur warna geometri
     * @param {THREE.Color} color
     */
    setColor(color){
        //this.color = color;
        Geometry.Master.setColorAt(this.id, color);
        Geometry.Master.instanceColor.needsUpdate = true;
    }
}

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 50000);
    camera.position.set( 250, 250, 250 );
    camera.lookAt( 0, 0, 0 );

    scene = new THREE.Scene();

    const bgeom = new THREE.SphereBufferGeometry(25000, 60, 40);
    bgeom.scale(-1, 1, 1);
    const bgtex = new THREE.TextureLoader().load('stars.jpg');
    const bgmat = new THREE.MeshBasicMaterial({ map: bgtex });
    const bgmesh = new THREE.Mesh(bgeom, bgmat);
    scene.add(bgmesh);
    
    const light1 = new THREE.HemisphereLight( 0xffffff, 0x000088 );
    light1.position.set( -1, 1.5, 1 );
    scene.add( light1 );

    const light2 = new THREE.HemisphereLight( 0xffffff, 0x880000, 0.5 );
    light2.position.set( -1, -1.5, -1 );
    scene.add( light2 );

    Geometry.Master.setColorAt(-1, color.setHex( Math.random() * 0xffffff )); //required to fill instanceColor
    scene.add( Geometry.Master );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const controlsdom = document.getElementById("controls");
    let controls = new OrbitControls( camera, controlsdom );
    controls.minDistance = 100;
    controls.maxDistance = 1200;
    controls.enablePan = false;

    window.addEventListener('resize', onWindowResize, false );
    controlsdom.addEventListener('mousemove', onMouseMove, false );
    controlsdom.addEventListener('click', (ev)=>onSelectGeometry(ev, true), false );
    controlsdom.addEventListener('touchstart', (ev)=>onSelectGeometry(ev, false), false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    if(infobar.status)
        infobar.panel.style.transform = `translateX(-${getComputedStyle(infobar.panel).width})`;
}

function onMouseMove( event ) {
    event.preventDefault();
    mouseScreen.x = event.clientX;
    mouseScreen.y = event.clientY;
    mouseDirty = true;
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

/**
 * On Select Geometry
 * @param {TouchEvent} event Touch Event
 */
function onSelectGeometry(event, isMouse){
    event.preventDefault();
    raycaster.setFromCamera({
        x: ( (isMouse?event.clientX:event.touches[0].clientX) / window.innerWidth ) * 2 - 1,
        y: - ( (isMouse?event.clientY:event.touches[0].clientY) / window.innerHeight ) * 2 + 1
    }, camera);
    const intersection = raycaster.intersectObject( Geometry.Master );
    if ( intersection.length > 0 ) {
        const instanceId = intersection[0].instanceId;
        const geom = Geometry.GetWithId(instanceId);
        if(geom){
            setHarapan(geom.name, geom.message);
            toggleInfobar(true, "harapan");
        }
    }
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

/**
 * Tampilkan tooltip
 * @param {Geometry} geom Instance geometri
 */
function showTooltip(){
    if(!tooltip.status){
        tooltip.panel.style.display = "block";
        tooltip.status = true;
    }
    if(mouseDirty){
        tooltip.panel.style.transform = `translate(${mouseScreen.x}px,${mouseScreen.y}px)`;
        mouseDirty = false;
    }
}

function writeTooltip(geom){
    tooltip.nameEl.innerText = geom.name;
    tooltip.messageEl.innerText = geom.message;
}

function hideTooltip(){
    if(!tooltip.status)
        return;
    tooltip.panel.style.display = "none";
    tooltip.status = false;
}

/**
 * @type {{geometry: Geometry, id: number}}
 */
var Selected = {
    geometry: undefined,
    id: -1
};

function render() {
    if(!(mouseScreen.x == -1 || mouseScreen.y == -1)){
        raycaster.setFromCamera( mouse, camera );
        const intersection = raycaster.intersectObject( Geometry.Master );
        if ( intersection.length > 0 ) {
            const instanceId = intersection[0].instanceId;
            if (Selected.id != instanceId){
                Selected.id = instanceId;
                Selected.geometry = Geometry.GetWithId(instanceId);
                writeTooltip(Selected.geometry);
            }
            if (Selected.geometry != undefined){
                showTooltip();
                //Geometry.Master.setColorAt(Selected.id, color.setHex( Math.random() * 0xffffff ));
                //Geometry.Master.instanceColor.needsUpdate = true;
                Selected.geometry.setColor(color.setHex( Math.random() * 0xffffff ));
            } else
                hideTooltip();
        } else {
            hideTooltip();
        }
    }
    
    let delta = Clock.getDelta()*0.5;
    Geometry.Instances.map((val)=>{
        let r = val.getEulerRotation();
        val.setEulerRotation(r.x+delta,r.y+delta,r.z+delta);
        val.pivot.lookAt(camera.position);
    });
    renderer.render( scene, camera );

}