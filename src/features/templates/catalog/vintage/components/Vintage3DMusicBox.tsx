import { useEffect, useRef, useState } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  CylinderGeometry,
  BoxGeometry,
  TorusGeometry,
  SphereGeometry,
  DirectionalLight,
  PointLight,
  HemisphereLight,
  TextureLoader,
  Group,
  Clock,
  SRGBColorSpace,
  Color,
} from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, Sparkles, Disc3, Radio } from "lucide-react";

interface Props {
  coverImage?: string;
  songTitle?: string;
  artistName?: string;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

export const Vintage3DMusicBox = ({
  coverImage = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  songTitle = "Can't Help Falling in Love",
  artistName = "Elvis Presley • Vintage Acoustic Edition",
  isPlaying: externalPlaying,
  onTogglePlay,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalPlaying, setInternalPlaying] = useState(true);
  const [speed, setSpeed] = useState<33 | 45>(33);
  const [hasWebGL, setHasWebGL] = useState(true);
  const isPlaying = externalPlaying !== undefined ? externalPlaying : internalPlaying;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const handleToggle = () => {
    if (onTogglePlay) {
      onTogglePlay();
    } else {
      setInternalPlaying(!internalPlaying);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      setHasWebGL(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(0, 3.6, 5.8);
    camera.lookAt(0, 0.2, 0);

    // Ambient & Studio Lights
    const ambientLight = new HemisphereLight(0xfff5e6, 0x2e1a11, 1.8);
    scene.add(ambientLight);

    const keyLight = new DirectionalLight(0xffecd0, 2.8);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const fillLight = new PointLight(0xd4af37, 2.5, 10);
    fillLight.position.set(-4, 3, 3);
    scene.add(fillLight);

    const rimLight = new DirectionalLight(0xc5a880, 1.6);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // Master 3D Music Box Model Group
    const masterGroup = new Group();
    scene.add(masterGroup);

    // --- 1. Materials ---
    // Antique Mahogany Wood Box
    const woodMaterial = new MeshPhysicalMaterial({
      color: 0x3d2314,
      roughness: 0.35,
      metalness: 0.08,
      clearcoat: 0.7,
      clearcoatRoughness: 0.2,
    });

    // Antique Gold / Brass Metal
    const goldMaterial = new MeshPhysicalMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 0.9,
    });

    // Rich Black Vinyl
    const vinylMaterial = new MeshPhysicalMaterial({
      color: 0x0a0a0a,
      roughness: 0.45,
      metalness: 0.85,
      clearcoat: 0.8,
    });

    // Dark Inset Surface
    const velvetSurface = new MeshStandardMaterial({
      color: 0x1a110a,
      roughness: 0.9,
    });

    // --- 2. 3D Music Box Base & Body ---
    // Lower Base Tier
    const baseGeo = new BoxGeometry(4.2, 0.45, 3.8);
    const baseMesh = new Mesh(baseGeo, woodMaterial);
    baseMesh.position.y = -0.25;
    masterGroup.add(baseMesh);

    // Gold Trim Ring around base
    const trimGeo = new BoxGeometry(4.35, 0.08, 3.95);
    const trimMesh = new Mesh(trimGeo, goldMaterial);
    trimMesh.position.y = -0.05;
    masterGroup.add(trimMesh);

    // Upper Box Body
    const topBoxGeo = new BoxGeometry(3.9, 0.5, 3.5);
    const topBoxMesh = new Mesh(topBoxGeo, woodMaterial);
    topBoxMesh.position.y = 0.25;
    masterGroup.add(topBoxMesh);

    // 4 Brass Corner Feet
    const footGeo = new SphereGeometry(0.18, 16, 16);
    const footPositions = [
      [-1.9, -0.45, -1.7],
      [1.9, -0.45, -1.7],
      [-1.9, -0.45, 1.7],
      [1.9, -0.45, 1.7],
    ];
    footPositions.forEach(([x, y, z]) => {
      const foot = new Mesh(footGeo, goldMaterial);
      foot.position.set(x, y, z);
      masterGroup.add(foot);
    });

    // Top Inset Plaque
    const topPlateGeo = new BoxGeometry(3.6, 0.04, 3.2);
    const topPlateMesh = new Mesh(topPlateGeo, velvetSurface);
    topPlateMesh.position.y = 0.52;
    masterGroup.add(topPlateMesh);

    // --- 3. 3D Spinning Turntable Platter ---
    const platterGroup = new Group();
    platterGroup.position.set(-0.35, 0.56, 0.1);
    masterGroup.add(platterGroup);

    // Gold Platter Base
    const platterBaseGeo = new CylinderGeometry(1.45, 1.48, 0.1, 48);
    const platterBase = new Mesh(platterBaseGeo, goldMaterial);
    platterGroup.add(platterBase);

    // Vinyl Disc
    const vinylGeo = new CylinderGeometry(1.4, 1.4, 0.04, 48);
    const vinylMesh = new Mesh(vinylGeo, vinylMaterial);
    vinylMesh.position.y = 0.07;
    platterGroup.add(vinylMesh);

    // Vinyl Record Center Texture
    const labelGeo = new CylinderGeometry(0.55, 0.55, 0.045, 32);
    const textureLoader = new TextureLoader();
    let labelMesh: Mesh;

    textureLoader.load(
      coverImage,
      (texture) => {
        texture.colorSpace = SRGBColorSpace;
        const labelMat = new MeshStandardMaterial({
          map: texture,
          roughness: 0.3,
        });
        labelMesh = new Mesh(labelGeo, labelMat);
        labelMesh.position.y = 0.072;
        platterGroup.add(labelMesh);
      },
      undefined,
      () => {
        const fallbackMat = new MeshStandardMaterial({ color: 0xc5a880 });
        labelMesh = new Mesh(labelGeo, fallbackMat);
        labelMesh.position.y = 0.072;
        platterGroup.add(labelMesh);
      }
    );

    // Gold Center Spindle
    const spindleGeo = new CylinderGeometry(0.05, 0.05, 0.28, 16);
    const spindle = new Mesh(spindleGeo, goldMaterial);
    spindle.position.y = 0.15;
    platterGroup.add(spindle);

    // --- 4. 3D Articulated Tone Arm ---
    const toneArmGroup = new Group();
    toneArmGroup.position.set(1.2, 0.58, -0.9);
    masterGroup.add(toneArmGroup);

    // Tone Arm Gold Base Pivot
    const pivotBaseGeo = new CylinderGeometry(0.18, 0.22, 0.2, 24);
    const pivotBase = new Mesh(pivotBaseGeo, goldMaterial);
    pivotBase.position.y = 0.1;
    toneArmGroup.add(pivotBase);

    const pivotSphereGeo = new SphereGeometry(0.14, 16, 16);
    const pivotSphere = new Mesh(pivotSphereGeo, goldMaterial);
    pivotSphere.position.y = 0.22;
    toneArmGroup.add(pivotSphere);

    // Moving Arm Group (rotates onto record)
    const armBarGroup = new Group();
    armBarGroup.position.set(0, 0.22, 0);
    toneArmGroup.add(armBarGroup);

    // Arm Tube
    const armTubeGeo = new CylinderGeometry(0.035, 0.035, 1.9, 16);
    const armTube = new Mesh(armTubeGeo, goldMaterial);
    armTube.rotation.z = Math.PI / 2;
    armTube.position.set(-0.95, 0.05, 0.45);
    armTube.rotation.y = -Math.PI / 6;
    armBarGroup.add(armTube);

    // Cartridge & Stylus Needle
    const headshellGeo = new BoxGeometry(0.14, 0.1, 0.25);
    const headshell = new Mesh(headshellGeo, goldMaterial);
    headshell.position.set(-1.8, -0.02, 0.95);
    armBarGroup.add(headshell);

    // Stylus Needle Tip
    const needleGeo = new CylinderGeometry(0.015, 0.005, 0.12, 8);
    const needleMat = new MeshStandardMaterial({ color: 0xff3333 });
    const needle = new Mesh(needleGeo, needleMat);
    needle.position.set(-1.8, -0.09, 0.95);
    armBarGroup.add(needle);

    // --- 5. 3D Antique Gramophone Horn (Kèn Hát Cổ Điển) ---
    const hornGroup = new Group();
    hornGroup.position.set(1.2, 0.6, -1.1);

    // Horn Stand Bracket
    const hornStemGeo = new CylinderGeometry(0.06, 0.06, 0.8, 16);
    const hornStem = new Mesh(hornStemGeo, goldMaterial);
    hornStem.position.set(0, 0.4, 0);
    hornGroup.add(hornStem);

    // Curved Horn Flare
    const hornConeGeo = new CylinderGeometry(0.95, 0.08, 1.8, 32, 1, true);
    const hornCone = new Mesh(hornConeGeo, goldMaterial);
    hornCone.rotation.x = Math.PI / 2.8;
    hornCone.rotation.y = -Math.PI / 4;
    hornCone.position.set(-0.3, 1.3, 0.3);
    hornGroup.add(hornCone);

    masterGroup.add(hornGroup);

    // --- 6. 3D Floating Gold Musical Notes & Stardust Particles ---
    const particlesGroup = new Group();
    const particleGeo = new SphereGeometry(0.035, 8, 8);
    const particleMat = new MeshPhysicalMaterial({
      color: 0xffe28a,
      emissive: 0xd4af37,
      emissiveIntensity: 0.8,
      metalness: 0.9,
    });

    const particles: { mesh: Mesh; speedY: number; angle: number; radius: number }[] = [];
    for (let i = 0; i < 28; i++) {
      const p = new Mesh(particleGeo, particleMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.3 + Math.random() * 1.2;
      p.position.set(
        -0.35 + Math.cos(angle) * radius,
        0.7 + Math.random() * 2.5,
        0.1 + Math.sin(angle) * radius
      );
      masterGroup.add(p);
      particles.push({
        mesh: p,
        speedY: 0.008 + Math.random() * 0.015,
        angle,
        radius,
      });
    }

    // --- 7. Mouse & Touch Interaction (3D Orbit Dragging) ---
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let targetYaw = 0;
    let targetPitch = 0.05;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;
        targetYaw += deltaX * 0.008;
        targetPitch += deltaY * 0.005;
        targetPitch = Math.max(-0.25, Math.min(0.5, targetPitch));
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch events for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMouseX;
        const deltaY = e.touches[0].clientY - previousMouseY;
        targetYaw += deltaX * 0.01;
        targetPitch += deltaY * 0.007;
        targetPitch = Math.max(-0.25, Math.min(0.5, targetPitch));
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    dom.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // --- 8. Animation Render Loop ---
    const clock = new Clock();
    let animationFrameId: number;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth 3D Inertia Rotation
      masterGroup.rotation.y += (targetYaw - masterGroup.rotation.y) * 0.08;
      masterGroup.rotation.x += (targetPitch - masterGroup.rotation.x) * 0.08;

      // Gentle Ambient Float
      masterGroup.position.y = Math.sin(elapsed * 1.4) * 0.04;

      // If Playing: Rotate vinyl platter and animate tone arm onto record
      if (isPlayingRef.current) {
        const rSpeed = speedRef.current === 33 ? 0.035 : 0.05;
        platterGroup.rotation.y += rSpeed;

        // Tone arm engages record (target angle ~0.24 rad)
        armBarGroup.rotation.y += (0.24 - armBarGroup.rotation.y) * 0.05;

        // Float musical notes upwards
        particles.forEach((p) => {
          p.mesh.visible = true;
          p.mesh.position.y += p.speedY;
          p.angle += 0.02;
          p.mesh.position.x = -0.35 + Math.cos(p.angle) * p.radius;
          p.mesh.position.z = 0.1 + Math.sin(p.angle) * p.radius;

          if (p.mesh.position.y > 3.2) {
            p.mesh.position.y = 0.7;
          }
        });
      } else {
        // Tone arm rests on cradle (angle 0)
        armBarGroup.rotation.y += (0 - armBarGroup.rotation.y) * 0.05;
        particles.forEach((p) => (p.mesh.visible = false));
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [coverImage]);

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none my-8">
      {/* 🌟 3D Canvas Box Container */}
      <div className="relative w-full h-[460px] sm:h-[540px] rounded-3xl bg-[#FDFBF7] border border-[#C5A880]/60 shadow-[0_25px_60px_rgba(154,123,86,0.2)] overflow-hidden flex items-center justify-center">
        {/* 3D WebGL Canvas */}
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* 3D Interactive Tag Banner */}
        <div className="absolute top-4 inset-x-0 flex items-center justify-between px-6 pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md border border-[#C5A880]/50 text-[#9A7B56] shadow-sm text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#C5A880] animate-pulse" />
            <span>HỘP NHẠC 3D VINTAGE</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md border border-[#C5A880]/50 text-[#6B5D55] shadow-sm text-[10px] font-serif italic flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            <span>Kéo chuột để xoay 360°</span>
          </div>
        </div>

        {/* Floating Musical Notes Animation Overlay */}
        <AnimatePresence>
          {isPlaying && (
            <div className="absolute inset-x-0 bottom-24 pointer-events-none z-10 flex justify-center">
              {[
                { note: "♪", delay: 0, x: -70 },
                { note: "♫", delay: 0.7, x: -20 },
                { note: "♩", delay: 1.4, x: 35 },
                { note: "✨", delay: 2.1, x: 80 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.6, x: item.x }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [10, -50, -100],
                    scale: [0.6, 1.3, 0.9],
                    x: [item.x, item.x + 20, item.x - 15],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    delay: item.delay,
                    ease: "easeOut",
                  }}
                  className="absolute text-[#C5A880] font-serif font-bold text-xl drop-shadow-[0_0_10px_rgba(197,168,128,0.9)]"
                >
                  {item.note}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Bottom Audio Controls Bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/90 to-transparent border-t border-[#C5A880]/30 flex items-center justify-between z-20">
          <div className="text-left max-w-[180px] sm:max-w-[240px] truncate">
            <p className="text-xs sm:text-sm font-serif font-bold text-[#2C2523] truncate flex items-center gap-1.5">
              <Volume2 className="h-4 w-4 text-[#9A7B56] shrink-0" />
              {songTitle}
            </p>
            <p className="text-[10px] text-[#8C7A70] font-mono truncate tracking-wider">
              {artistName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Toggle */}
            <button
              type="button"
              onClick={() => setSpeed(speed === 33 ? 45 : 33)}
              className="px-3 py-1.5 rounded-full bg-[#F3EDE2] border border-[#C5A880]/50 text-[10px] font-mono text-[#9A7B56] font-bold hover:bg-[#EAE1D3] transition-colors cursor-pointer"
              title="Đổi tốc độ vòng quay (33 RPM / 45 RPM)"
            >
              {speed} RPM
            </button>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={handleToggle}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#9A7B56] text-[#FAF7F2] text-xs font-serif font-bold tracking-wider uppercase shadow-md hover:bg-[#7D6344] transition-all cursor-pointer active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>TẠM DỪNG</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>PHÁT NHẠC</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
