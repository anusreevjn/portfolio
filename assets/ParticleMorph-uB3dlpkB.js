import{r as u,j as R,S as L}from"./index-CpT32BDW.js";import{C as O,u as j,B as z,a as h,S as W,V as p,b as _,c as F,A as H,N as k,d as q,P as D,R as V,e as I}from"./react-three-fiber.esm-Cued0n3i.js";const N=`
  attribute vec3 aA;
  attribute vec3 aB;
  attribute vec3 aC;
  attribute vec3 aDir;
  attribute float aRand;
  attribute float aScale;

  uniform vec3 uFrom;
  uniform vec3 uTo;
  uniform float uT;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uHover;
  uniform float uWobble;
  uniform vec3 uMouse;
  uniform vec3 uPulseOrigin;
  uniform float uPulseTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 pick(vec3 w) {
    return aA * w.x + aB * w.y + aC * w.z;
  }

  void main() {
    vec3 from = pick(uFrom);
    vec3 to = pick(uTo);
    float t = clamp(uT * 1.5 - aRand * 0.5, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 pos = mix(from, to, t);

    float burst = sin(t * 3.14159265);
    pos += aDir * burst * (0.5 + aRand * 1.1);
    pos += aDir * sin(uTime * 0.9 + aRand * 6.2831853) * 0.04 * uWobble;

    vec3 d = pos - uMouse;
    float dist = length(d);
    float f = smoothstep(1.35, 0.0, dist) * uHover;
    pos += normalize(d + vec3(0.0001)) * f * 0.9;

    vec3 pd = pos - uPulseOrigin;
    float pdist = length(pd);
    float wave = uPulseTime * 4.5;
    float ring = exp(-pow(pdist - wave, 2.0) * 5.0) * exp(-uPulseTime * 1.4);
    pos += normalize(pd + vec3(0.0001)) * ring * 0.75;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 + f * 1.3 + ring * 1.6) / -mv.z;

    float h = clamp(pos.y * 0.2 + 0.5, 0.0, 1.0);
    vec3 c = mix(uColorA, uColorB, h);
    c = mix(c, uColorC, smoothstep(0.72, 1.0, aRand));
    c += (f + ring) * 0.4;
    vColor = c;
    vAlpha = 0.5 + aScale * 0.32;
  }
`,X=`
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 1.7);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`,d=[new p(1,0,0),new p(0,1,0),new p(0,0,1)],Y=4.6,G=2.2;function U({count:f,pointer:E,control:w,onShape:C,reduced:g,scale:S,theme:M}){const x=u.useRef(),{camera:c,gl:P}=j(),m=u.useMemo(()=>{const o=new z,[s,l,t]=L.map(n=>n.build(f)),e=new Float32Array(f*3),v=new Float32Array(f),a=new Float32Array(f);for(let n=0;n<f;n++){const b=Math.random()*2-1,T=Math.random()*Math.PI*2,A=Math.sqrt(1-b*b);e[n*3]=A*Math.cos(T),e[n*3+1]=b,e[n*3+2]=A*Math.sin(T),v[n]=Math.random(),a[n]=.45+Math.random()*1}return o.setAttribute("position",new h(s.slice(),3)),o.setAttribute("aA",new h(s,3)),o.setAttribute("aB",new h(l,3)),o.setAttribute("aC",new h(t,3)),o.setAttribute("aDir",new h(e,3)),o.setAttribute("aRand",new h(v,1)),o.setAttribute("aScale",new h(a,1)),o.boundingSphere=new W(new p,6),o},[f]),i=u.useMemo(()=>new _({vertexShader:N,fragmentShader:X,transparent:!0,depthWrite:!1,blending:H,uniforms:{uFrom:{value:d[0].clone()},uTo:{value:d[0].clone()},uT:{value:0},uTime:{value:0},uSize:{value:34},uPixelRatio:{value:1},uHover:{value:0},uWobble:{value:1},uMouse:{value:new p(99,99,99)},uPulseOrigin:{value:new p},uPulseTime:{value:100},uColorA:{value:new F("#2ee6d6")},uColorB:{value:new F("#8b5cf6")},uColorC:{value:new F("#ff5fa2")}}}),[]);u.useEffect(()=>()=>m.dispose(),[m]),u.useEffect(()=>()=>i.dispose(),[i]),u.useEffect(()=>{const o=M==="light",s=i.uniforms;i.blending=o?k:H,s.uColorA.value.set(o?"#0aa79c":"#2ee6d6"),s.uColorB.value.set(o?"#7c3aed":"#8b5cf6"),s.uColorC.value.set(o?"#e23b84":"#ff5fa2"),i.needsUpdate=!0},[M,i]);const y=u.useRef({current:0,next:0,phase:"hold",since:0}),r=u.useMemo(()=>({raycaster:new V,plane:new D(new p(0,0,1),0),hit:new p,ndc:new q}),[]);return I((o,s)=>{const l=Math.min(s,.05),t=i.uniforms,e=y.current;t.uTime.value+=l,t.uPixelRatio.value=P.getPixelRatio(),t.uWobble.value=g?0:1,e.since+=l;const v=w.current.request;if(v!==null&&e.phase==="hold"&&v!==e.current?(e.next=v,e.phase="morph",e.since=0,w.current.request=null,t.uFrom.value.copy(d[e.current]),t.uTo.value.copy(d[e.next]),C(e.next)):v===e.current&&(w.current.request=null),e.phase==="hold"&&!g&&!w.current.paused&&e.since>Y&&(e.next=(e.current+1)%L.length,e.phase="morph",e.since=0,t.uFrom.value.copy(d[e.current]),t.uTo.value.copy(d[e.next]),C(e.next)),e.phase==="morph"){const B=Math.min(e.since/G,1);t.uT.value=B,B>=1&&(e.current=e.next,e.phase="hold",e.since=0,t.uFrom.value.copy(d[e.current]),t.uTo.value.copy(d[e.current]),t.uT.value=0)}const a=E.current;t.uHover.value+=((a.inside?1:0)-t.uHover.value)*Math.min(l*5,1);const n=x.current;if(!n)return;const b=t.uTime.value,T=(g?0:Math.sin(b*.22)*.45)+a.x*.3,A=-a.y*.18;n.rotation.y+=(T-n.rotation.y)*Math.min(l*2.5,1),n.rotation.x+=(A-n.rotation.x)*Math.min(l*2.5,1),n.scale.setScalar(S),n.updateMatrixWorld(),a.inside&&(r.ndc.set(a.x,a.y),r.raycaster.setFromCamera(r.ndc,c),r.raycaster.ray.intersectPlane(r.plane,r.hit)&&(n.worldToLocal(r.hit),t.uMouse.value.lerp(r.hit,Math.min(l*12,1)))),a.pulse&&(a.pulse=!1,r.ndc.set(a.x,a.y),r.raycaster.setFromCamera(r.ndc,c),r.raycaster.ray.intersectPlane(r.plane,r.hit)&&(n.worldToLocal(r.hit),t.uPulseOrigin.value.copy(r.hit),t.uPulseTime.value=0)),t.uPulseTime.value+=l}),R.jsx("points",{ref:x,geometry:m,material:i,frustumCulled:!1})}function Q({count:f=7e3,onShape:E,control:w,reduced:C=!1,scale:g=1,theme:S="dark",className:M=""}){const x=u.useRef(null),c=u.useRef({x:0,y:0,inside:!1,pulse:!1}),P=u.useRef("always"),m=u.useRef(null);return u.useEffect(()=>{const i=x.current;if(!i)return;const y=t=>{const e=i.getBoundingClientRect(),v=(t.clientX-e.left)/e.width*2-1,a=-((t.clientY-e.top)/e.height*2-1);c.current.x=v,c.current.y=a,c.current.inside=v>=-1&&v<=1&&a>=-1&&a<=1},r=t=>{y(t),c.current.inside&&(c.current.pulse=!0)},o=t=>{t.relatedTarget||(c.current.inside=!1)},s=t=>{t.pointerType!=="mouse"&&(c.current.inside=!1)};window.addEventListener("pointermove",y,{passive:!0}),window.addEventListener("pointerdown",r,{passive:!0}),window.addEventListener("pointerup",s,{passive:!0}),window.addEventListener("pointercancel",s,{passive:!0}),window.addEventListener("pointerout",o,{passive:!0});const l=new IntersectionObserver(([t])=>{const e=t.isIntersecting?"always":"never";P.current!==e&&m.current&&(P.current=e,m.current(e))},{threshold:0});return l.observe(i),()=>{window.removeEventListener("pointermove",y),window.removeEventListener("pointerdown",r),window.removeEventListener("pointerup",s),window.removeEventListener("pointercancel",s),window.removeEventListener("pointerout",o),l.disconnect()}},[]),R.jsx("div",{ref:x,className:M,"aria-hidden":"true",children:R.jsx(O,{dpr:[1,1.75],camera:{position:[0,0,8],fov:45},gl:{antialias:!1,alpha:!0,powerPreference:"high-performance"},onCreated:i=>{m.current=i.setFrameloop},children:R.jsx(U,{count:f,pointer:c,control:w,onShape:E,reduced:C,scale:g,theme:S})})})}export{Q as default};
