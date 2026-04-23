/**
 * Glow Effects Component
 * Reusable aura and glow materials for nodes
 */

import * as THREE from 'three';

// Color palette for glows
export const GLOW_COLORS = {
  cyan: 0x64f4f4,
  magenta: 0xf464f4,
  violet: 0xa464f4,
  teal: 0x64f4c8,
  white: 0xffffff,
  revealed: 0x404040,
};

/**
 * Create a glowing sphere material
 */
export function createGlowMaterial(
  color: THREE.ColorRepresentation,
  intensity: number = 1,
  opacity: number = 0.5
): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: opacity * intensity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

/**
 * Create a multi-layer glow effect
 */
export function createMultiLayerGlow(
  baseSize: number,
  color: THREE.ColorRepresentation,
  layers: number = 3
): THREE.Group {
  const group = new THREE.Group();

  for (let i = 0; i < layers; i++) {
    const size = baseSize * (1 + i * 0.8);
    const opacity = 0.4 / (i + 1);

    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = createGlowMaterial(color, 1, opacity);
    const glow = new THREE.Mesh(geometry, material);

    group.add(glow);
  }

  return group;
}

/**
 * Create a pulsing glow animation
 */
export function createPulsingGlow(
  size: number,
  color: THREE.ColorRepresentation,
  pulseSpeed: number = 1
): { mesh: THREE.Mesh; animate: (time: number) => void } {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = createGlowMaterial(color, 1, 0.3);
  const mesh = new THREE.Mesh(geometry, material);

  const animate = (time: number) => {
    const pulse = Math.sin(time * pulseSpeed) * 0.5 + 0.5; // 0 to 1
    const scale = 1 + pulse * 0.2;
    mesh.scale.set(scale, scale, scale);
    material.opacity = 0.2 + pulse * 0.2;
  };

  return { mesh, animate };
}

/**
 * Create shifting aura for center orb
 */
export function createShiftingAura(
  baseSize: number,
  color1: THREE.ColorRepresentation,
  color2: THREE.ColorRepresentation
): { group: THREE.Group; animate: (time: number) => void } {
  const group = new THREE.Group();

  // Layer 1 - Color 1
  const glow1Geometry = new THREE.SphereGeometry(baseSize * 1.5, 32, 32);
  const glow1Material = createGlowMaterial(color1, 1, 0.4);
  const glow1 = new THREE.Mesh(glow1Geometry, glow1Material);
  group.add(glow1);

  // Layer 2 - Color 2
  const glow2Geometry = new THREE.SphereGeometry(baseSize * 2.2, 32, 32);
  const glow2Material = createGlowMaterial(color2, 1, 0.25);
  const glow2 = new THREE.Mesh(glow2Geometry, glow2Material);
  group.add(glow2);

  const animate = (time: number) => {
    const shift = Math.sin(time * 0.5) * 0.5 + 0.5; // 0 to 1

    // Shift opacities
    glow1Material.opacity = 0.3 + shift * 0.2;
    glow2Material.opacity = 0.2 + (1 - shift) * 0.2;

    // Shift scales slightly
    const scale1 = 1 + shift * 0.1;
    const scale2 = 1 + (1 - shift) * 0.1;
    glow1.scale.set(scale1, scale1, scale1);
    glow2.scale.set(scale2, scale2, scale2);
  };

  return { group, animate };
}

/**
 * Create a link glow effect
 */
export function createLinkGlow(
  from: THREE.Vector3,
  to: THREE.Vector3,
  color: THREE.ColorRepresentation,
  strength: number
): THREE.Line {
  const geometry = new THREE.BufferGeometry().setFromPoints([from, to]);
  const material = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.2 + strength * 0.3,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Line(geometry, material);
}

/**
 * Particle system for ambient effects
 */
export function createParticleField(
  count: number = 100,
  radius: number = 300
): { points: THREE.Points; animate: (time: number) => void } {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    // Random position in sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random()); // Uniform distribution

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    // Random slow velocity
    velocities.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      )
    );
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x64f4f4,
    size: 2,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);

  const animate = (time: number) => {
    const positions = geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Slow drift
      positions[i * 3] += velocities[i].x;
      positions[i * 3 + 1] += velocities[i].y;
      positions[i * 3 + 2] += velocities[i].z;

      // Wrap around
      if (Math.abs(positions[i * 3]) > radius) velocities[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > radius) velocities[i].y *= -1;
      if (Math.abs(positions[i * 3 + 2]) > radius) velocities[i].z *= -1;
    }

    geometry.attributes.position.needsUpdate = true;

    // Twinkle effect
    material.opacity = 0.2 + Math.sin(time * 0.5) * 0.1;
  };

  return { points, animate };
}

/**
 * Sprite-based glow (for performance with many nodes)
 */
export function createSpriteGlow(
  color: THREE.ColorRepresentation,
  size: number
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;

  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);

  const hexColor = typeof color === 'number' ? `#${color.toString(16).padStart(6, '0')}` : color.toString();

  gradient.addColorStop(0, hexColor + 'ff');
  gradient.addColorStop(0.4, hexColor + '80');
  gradient.addColorStop(1, hexColor + '00');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(size * 2, size * 2, 1);

  return sprite;
}

export default {
  createGlowMaterial,
  createMultiLayerGlow,
  createPulsingGlow,
  createShiftingAura,
  createLinkGlow,
  createParticleField,
  createSpriteGlow,
  GLOW_COLORS,
};
