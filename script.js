gsap.registerPlugin(ScrollTrigger);

// COUNTDOWN
const eventDate = new Date("2026-02-14T00:00:00+05:30").getTime();

function updateCountdown() {
  const diff = eventDate - Date.now();
  if (diff <= 0) return;

  days.textContent = String(Math.floor(diff / 86400000)).padStart(2,"0");
  hours.textContent = String(Math.floor(diff / 3600000)%24).padStart(2,"0");
  minutes.textContent = String(Math.floor(diff / 60000)%60).padStart(2,"0");
  seconds.textContent = String(Math.floor(diff / 1000)%60).padStart(2,"0");
}

// THREE.JS (UNCHANGED)
let camera;
function initScene() {
  const canvas = document.getElementById("webgl");
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b0f17, 6, 18);

  camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, .1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));

  const group = new THREE.Group();
  const nodes = [];
  const mat = new THREE.MeshBasicMaterial({ color: 0x6aa9ff });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x355d9b });

  for(let i=0;i<60;i++){
    const n = new THREE.Mesh(new THREE.SphereGeometry(.03,8,8),mat);
    n.position.set((Math.random()-.5)*4,(Math.random()-.5)*4,(Math.random()-.5)*4);
    nodes.push(n); group.add(n);
  }

  nodes.forEach((a,i)=>{
    nodes.slice(i+1).forEach(b=>{
      if(a.position.distanceTo(b.position)<1.2){
        const g = new THREE.BufferGeometry().setFromPoints([a.position,b.position]);
        group.add(new THREE.Line(g,lineMat));
      }
    });
  });

  scene.add(group);

  let mx=0,my=0;
  window.addEventListener("mousemove",e=>{
    mx=(e.clientX/innerWidth-.5)*2;
    my=(e.clientY/innerHeight-.5)*2;
  });

  function animate(){
    group.rotation.y+=.0008;
    group.rotation.x+=.0004;
    camera.position.x+=(mx*.6-camera.position.x)*.05;
    camera.position.y+=(-my*.6-camera.position.y)*.05;
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("resize",()=>{
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
  });
}

// SCROLL DEPTH
window.addEventListener("scroll",()=>{
  camera.position.z=6+scrollY*.002;
});

// REVEALS
document.querySelectorAll(".reveal").forEach(section=>{
  ScrollTrigger.create({
    trigger: section,
    start: "top 70%",
    onEnter: ()=>section.classList.add("active")
  });
});

// START
document.addEventListener("DOMContentLoaded",()=>{
  initScene();
  updateCountdown();
  setInterval(updateCountdown,1000);
});

// FOOTER REVEAL
gsap.fromTo(
  ".footer-block",
  { y: 40, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.25,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".footer",
      start: "top 70%",
    }
  }
);

gsap.from(
  ".footer-bottom > div",
  {
    y: 30,
    opacity: 0,
    stagger: 0.2,
    duration: 0.9,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".footer-bottom",
      start: "top 75%",
    }
  }
);
