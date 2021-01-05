import './main.css';

import firebase from 'firebase/app';
import 'firebase/analytics';
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
app.analytics();
var db = app.database();
var msgDbRef = db.ref('messages');
function addMessage(data){
    msgDbRef.push()
    .set(data)
    .then((snapshot) => {
        formharapan.reset();
        var cnt = 60; // timer
        var timer = setInterval(function(){
            statusharapan.innerText = `Berhasil menyimpan harapan kamu! Kamu punya ${cnt} detik sebelum mengirimkan harapan yang lain.`;
            cnt--;
            if(cnt < 0){
                statusharapan.hidden = true;
                formharapan.hidden = false;
                clearInterval(timer);
            }
        }, 1000);
    }, (error) => {
        formharapan.hidden = statusharapan.hidden = false;
        alert(`error: ${error}`);
    });
}

msgDbRef.on('child_added', (a)=>{
    /** @type {{message: string, name: string}} */
    var data = a.val();
    new Geometry(
        data.name,
        data.message,
        a.key,
        new THREE.Vector3(Math.random()*100-50, Math.random()*100-50, Math.random()*100-50),
        color.setHex( Math.random() * 0xffffff )
    );
})

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/** @type {THREE.PerspectiveCamera} */
let camera;
let scene, renderer, stats;

//const amount = parseInt( window.location.search.substr( 1 ) ) || 10;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2( 1, 1 );
const mouseScreen = new THREE.Vector2(1,1);

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
        harapan: {
            button: document.getElementById("info-bar-open-harapan"),
            dom: document.getElementById("menu-harapan"),
            name: "harapan",
        },
        about: {
            button: document.getElementById("info-bar-open-about"),
            dom: document.getElementById("menu-about"),
            name: "about"
        }
    },
    panel: document.getElementById("info-bar-panel"),
    close: document.getElementById("info-bar-close"),
    status: false,
    lastmenu: ""
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
    v.button.addEventListener("click", ()=>{toggleInfobar(true, v.name);});
}
infobar.close.addEventListener("click", ()=>toggleInfobar(false));
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
        infobar.panel.style.transform = "translateX(-30vw)";
        infobar.status = true;
        toggleLight(val);
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

class Geometry {
    static Count = 0;
    static Master = new THREE.InstancedMesh(new THREE.CylinderBufferGeometry(0.5, 0.5, 3), new THREE.MeshStandardMaterial(), 10000);
     /** @type {Geometry[]} */
    static Instances = [];
    #object;

    /**
     * Ubah ukuran maksimal penampungan geometri
     * @param {number} size Ukuran maksimum geometri yang baru
     */
    static ResizeGeometry(size){
        delete Geometry.Master;
        Geometry.Master = new THREE.InstancedMesh(new THREE.IcosahedronGeometry( 0.5, 3 ), new THREE.MeshPhongMaterial(), size);
    }

    /**
     * Mengubah ukuran maksimum geometri dari `multiplier` kali sebelumnya
     * @param {number} multiplier Kelipatan ukuran dari yang sebelumnya
     */
    static EnlargeGeometry(multiplier = 10){
        Geometry.ResizeGeometry(Geometry.Master.count*multiplier);
    }

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
     * @param {THREE.Color} color Warna geometri
     */
    constructor(name, message, key=null, position=null, color=null){
        this.name = name;
        this.message = message;
        this.id = Geometry.Count;
        this.key = key || this.id.toString();
        this.#object = new THREE.Object3D();
        this.setPosition(position || new THREE.Vector3(0,0,0));
        this.setEulerRotation(Math.random(), Math.random(), Math.random());
        this.setColor(color || new THREE.Color(0xfff));
        Geometry.Instances.push(this);
        Geometry.Count++;
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
        this.color = color;
        Geometry.Master.setColorAt(this.id, this.color);
        Geometry.Master.instanceColor.needsUpdate = true;
    }
}

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 20000);
    camera.position.set( 50, 50, 50 );
    camera.lookAt( 0, 0, 0 );

    scene = new THREE.Scene();

    const bgeom = new THREE.SphereBufferGeometry(10000, 60, 40);
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

    scene.add( Geometry.Master );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const controlsdom = document.getElementById("controls");
    let controls = new OrbitControls( camera, controlsdom );
    controls.minDistance = 0;
    controls.maxDistance = 200;
    controls.enablePan = false;

    window.addEventListener( 'resize', onWindowResize, false );
    controlsdom.addEventListener( 'mousemove', onMouseMove, false );
    controlsdom.addEventListener( 'touchmove', onTouchMove, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
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
 * OnTouchEvent
 * @param {TouchEvent} event Touch Event
 */
function onTouchMove(event){
    event.preventDefault();
    let t = event.touches[0];
    mouseScreen.x = t.clientX;
    mouseScreen.y = t.clientY;
    mouseDirty = true;
    mouse.x = ( t.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( t.clientY / window.innerHeight ) * 2 + 1;
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

/**
 * Representasi vektor dalam string (X, Y, Z) dengan 2 digit dibelakang koma
 * @param {THREE.Vector3} v Vektor yang ingin dijadikan string
 */
function VectorToString(v){
    return `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`;
};
/**
 * Representasi euler dalam string (X, Y, Z) dengan 2 digit dibelakang koma
 * @param {THREE.Euler} e Euler yang ingin dijadikan string
 */
function EulerToString(e){
    return `(${THREE.MathUtils.radToDeg(e.x).toFixed(2)}, ${THREE.MathUtils.radToDeg(e.y).toFixed(2)}, ${THREE.MathUtils.radToDeg(e.z).toFixed(2)})`;
}

function render() {
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
            Selected.geometry.setColor(color.setHex( Math.random() * 0xffffff ));
        } else
            hideTooltip();
    } else {
        hideTooltip();
    }
    
    let delta = Clock.getDelta()*0.5;
    
    Geometry.Instances.map((val)=>{
        let r = val.getEulerRotation();
        val.setEulerRotation(r.x+delta,r.y+delta,r.z+delta);
    });

    info.innerText = `Position: ${VectorToString(camera.position)} | Rotation: ${EulerToString(camera.rotation)} | Mouse: (${mouseScreen.x.toFixed(0)}, ${mouseScreen.y.toFixed(0)})`;
    renderer.render( scene, camera );

}

//export {Geometry, Clock, raycaster, scene, renderer, msgDbRef, camera};