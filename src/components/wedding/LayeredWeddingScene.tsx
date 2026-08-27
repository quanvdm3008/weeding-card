import { useEffect, useRef, useState } from "react";
import {
  Clock,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  TorusGeometry,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from "three";

interface LayeredWeddingSceneProps {
  images: string[];
  accentColor: string;
}

const hexToNumber = (value: string) => {
  const normalized = value.replace("#", "");
  return Number.parseInt(normalized.length === 3 ? normalized.split("").map((char) => `${char}${char}`).join("") : normalized, 16) || 0xb89b62;
};

const fitTexture = (texture: Texture) => {
  const image = texture.image as { width?: number; height?: number } | undefined;
  if (!image?.width || !image.height) return;
  const imageAspect = image.width / image.height;
  const frameAspect = 2.45 / 3.3;
  if (imageAspect > frameAspect) {
    texture.repeat.set(frameAspect / imageAspect, 1);
    texture.offset.set((1 - texture.repeat.x) / 2, 0);
  } else {
    texture.repeat.set(1, imageAspect / frameAspect);
    texture.offset.set(0, (1 - texture.repeat.y) / 2);
  }
  texture.needsUpdate = true;
};

const LayeredWeddingScene = ({ images, accentColor }: LayeredWeddingSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const imageKey = images.join("|");

  useEffect(() => {
    const mount = mountRef.current;
    const sceneImages = imageKey.split("|").filter(Boolean);
    if (!mount || sceneImages.length === 0) return;
    if (!("WebGLRenderingContext" in window)) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new Scene();
    const camera = new PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.05, 10.8);

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mount.clientWidth < 640 ? 1.35 : 1.8));
    renderer.domElement.className = "absolute inset-0 h-full w-full";
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);
    setSceneReady(true);

    const stage = new Group();
    stage.rotation.x = -0.035;
    scene.add(stage);

    const accent = hexToNumber(accentColor);
    scene.add(new HemisphereLight(0xfffbf3, 0x425546, 2.3));
    const keyLight = new DirectionalLight(0xffe7bd, 4.2);
    keyLight.position.set(4, 5, 7);
    scene.add(keyLight);
    const rimLight = new PointLight(accent, 18, 20, 2);
    rimLight.position.set(-4, 1, 4);
    scene.add(rimLight);

    const resources: Array<BufferGeometry | Material | Texture> = [];
    const loader = new TextureLoader();
    loader.setCrossOrigin("anonymous");

    const paperGeometry = new PlaneGeometry(7.7, 5.9);
    const paperMaterial = new MeshPhysicalMaterial({
      color: 0xf2eadb,
      roughness: 0.82,
      metalness: 0,
      transparent: true,
      opacity: 0.72,
      side: DoubleSide,
    });
    resources.push(paperGeometry, paperMaterial);
    [-0.72, -0.48, -0.25].forEach((z, index) => {
      const paper = new Mesh(paperGeometry, paperMaterial.clone());
      resources.push(paper.material);
      paper.position.set((index - 1) * 0.22, (1 - index) * 0.12, z);
      paper.rotation.z = (index - 1) * 0.025;
      stage.add(paper);
    });

    const photoGeometry = new PlaneGeometry(2.45, 3.3, 16, 16);
    resources.push(photoGeometry);
    const photoMeshes: Mesh<PlaneGeometry, MeshPhysicalMaterial>[] = [];
    const sourceImages = Array.from({ length: 3 }, (_, index) => sceneImages[index % sceneImages.length]);
    sourceImages.forEach((src, index) => {
      const texture = loader.load(src, fitTexture);
      texture.colorSpace = SRGBColorSpace;
      resources.push(texture);
      const material = new MeshPhysicalMaterial({
        map: texture,
        roughness: 0.58,
        metalness: 0.04,
        clearcoat: 0.2,
        clearcoatRoughness: 0.55,
        side: DoubleSide,
      });
      resources.push(material);
      const photo = new Mesh(photoGeometry, material);
      photo.userData.slot = index;
      stage.add(photo);
      photoMeshes.push(photo);

      const frameGeometry = new EdgesGeometry(photoGeometry);
      const frameMaterial = new LineBasicMaterial({ color: accent, transparent: true, opacity: 0.78 });
      resources.push(frameGeometry, frameMaterial);
      const frame = new LineSegments(frameGeometry, frameMaterial);
      frame.position.z = 0.012;
      photo.add(frame);
    });

    const ringGeometry = new TorusGeometry(2.9, 0.018, 12, 120);
    const ringMaterial = new MeshStandardMaterial({ color: accent, metalness: 0.8, roughness: 0.24, transparent: true, opacity: 0.7 });
    resources.push(ringGeometry, ringMaterial);
    const ring = new Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = 0.14;
    ring.position.z = 0.12;
    stage.add(ring);

    const leafGeometry = new SphereGeometry(0.13, 16, 10);
    const leafMaterial = new MeshStandardMaterial({ color: 0x789174, roughness: 0.72 });
    resources.push(leafGeometry, leafMaterial);
    for (let index = 0; index < 18; index += 1) {
      const angle = (index / 18) * Math.PI * 2;
      const leaf = new Mesh(leafGeometry, leafMaterial);
      leaf.scale.set(0.58, 1.45, 0.34);
      leaf.position.set(Math.cos(angle) * 3.4, Math.sin(angle) * 2.45, -0.05 + (index % 3) * 0.05);
      leaf.rotation.z = angle - Math.PI / 2;
      stage.add(leaf);
    }

    const slots = [
      { x: -2.05, y: -0.12, z: 0.12, ry: 0.22, rz: -0.065, scale: 0.86 },
      { x: 0, y: 0.22, z: 1.05, ry: 0, rz: 0, scale: 1.08 },
      { x: 2.05, y: -0.12, z: 0.12, ry: -0.22, rz: 0.065, scale: 0.86 },
    ];
    let cycle = 0;
    const applySlot = (mesh: Mesh, slotIndex: number, immediate = false) => {
      const slot = slots[slotIndex];
      if (immediate) {
        mesh.position.set(slot.x, slot.y, slot.z);
        mesh.rotation.set(0, slot.ry, slot.rz);
        mesh.scale.setScalar(slot.scale);
      }
      mesh.userData.target = slot;
    };
    photoMeshes.forEach((mesh, index) => applySlot(mesh, index, true));

    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 640 ? 13.2 : 10.8;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const interval = reducedMotion ? undefined : window.setInterval(() => {
      cycle = (cycle + 1) % 3;
      photoMeshes.forEach((mesh, index) => applySlot(mesh, (index + cycle) % 3));
    }, 8000);

    let frameId = 0;
    const clock = new Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      stage.rotation.y += ((pointerX * 0.075) - stage.rotation.y) * 0.035;
      stage.rotation.x += ((-pointerY * 0.045 - 0.035) - stage.rotation.x) * 0.035;
      ring.rotation.z = elapsed * 0.035;
      photoMeshes.forEach((mesh, index) => {
        const target = mesh.userData.target as (typeof slots)[number];
        mesh.position.x += (target.x - mesh.position.x) * 0.045;
        mesh.position.y += (target.y + Math.sin(elapsed * 0.72 + index) * 0.045 - mesh.position.y) * 0.045;
        mesh.position.z += (target.z - mesh.position.z) * 0.045;
        mesh.rotation.y += (target.ry - mesh.rotation.y) * 0.045;
        mesh.rotation.z += (target.rz - mesh.rotation.z) * 0.045;
        const nextScale = mesh.scale.x + (target.scale - mesh.scale.x) * 0.045;
        mesh.scale.setScalar(nextScale);
      });
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    if (reducedMotion) renderer.render(scene, camera);
    else animate();

    return () => {
      if (interval) window.clearInterval(interval);
      window.cancelAnimationFrame(frameId);
      mount.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
      resources.forEach((resource) => resource.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [accentColor, imageKey]);

  return (
    <div ref={mountRef} className="absolute inset-0" data-testid="layered-wedding-scene">
      <div className={`absolute inset-0 grid place-items-center overflow-hidden transition-opacity duration-700 [perspective:1200px] ${sceneReady ? "opacity-0" : "opacity-100"}`} aria-hidden="true">
        {images.slice(0, 3).map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt=""
            className="absolute h-[42%] w-[34%] min-w-32 max-w-64 object-cover shadow-2xl"
            style={{
              transform: `translate3d(${(index - 1) * 64}%, ${index === 1 ? -4 : 4}%, ${index === 1 ? 45 : 0}px) rotateY(${(1 - index) * 10}deg) rotateZ(${(index - 1) * 4}deg)`,
              opacity: index === 1 ? 0.9 : 0.58,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LayeredWeddingScene;
