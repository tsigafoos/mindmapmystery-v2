import { useEffect, useRef, useState, useCallback } from 'react';

const loadForceGraph = async () => {
  const module = await import('3d-force-graph');
  return module.default;
};

const loadThree = async () => {
  const module = await import('three');
  return module;
};

interface GraphNode {
  id: string;
  label: string;
  val: number;
  revealed?: boolean;
}

interface GraphLink {
  source: string;
  target: string;
}

type MaterialType = 'standard' | 'basic' | 'toon';

interface GraphConfig {
  centerColor: string;
  revealedColor: string;
  childColors: string[];
  linkColor: string;
  linkOpacity: number;
  linkWidth: number;
  backgroundColor: string;
  centerSize: number;
  childSize: number;
  linkDistance: number;
  chargeStrength: number;
  warmupTicks: number;
  cooldownTicks: number;
  nodeResolution: number;
  materialType: MaterialType;
  metalness: number;
  roughness: number;
  emissiveIntensity: number;
  wireframe: boolean;
  linkCurvature: number;
  linkParticleCount: number;
  particleSpeed: number;
}

const defaultConfig: GraphConfig = {
  centerColor: '#ffffff',
  revealedColor: '#606060',
  childColors: ['#64f4f4', '#f464f4', '#a464f4', '#64f4c8'],
  linkColor: '100, 244, 244',
  linkOpacity: 0.4,
  linkWidth: 1,
  backgroundColor: '#0a0a1f',
  centerSize: 24,
  childSize: 6.4,
  linkDistance: 60,
  chargeStrength: -300,
  warmupTicks: 30,
  cooldownTicks: 50,
  nodeResolution: 16,
  materialType: 'standard',
  metalness: 0.3,
  roughness: 0.4,
  emissiveIntensity: 0.3,
  wireframe: false,
  linkCurvature: 0.2,
  linkParticleCount: 4,
  particleSpeed: 0.01,
};

export default function TestBench() {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<GraphConfig>(defaultConfig);
  const threeRef = useRef<any>(null);

  const getNodeColor = useCallback((node: GraphNode): string => {
    if (node.id === 'center') return config.centerColor;
    if (node.revealed) return config.revealedColor;
    return config.childColors[parseInt(node.id.split('-')[1] || '0') % config.childColors.length];
  }, [config.centerColor, config.revealedColor, config.childColors]);

  const createNodeObject = useCallback((node: GraphNode) => {
    if (!threeRef.current) return null;
    const THREE = threeRef.current;
    
    const color = getNodeColor(node);
    const size = (node.id === 'center' ? config.centerSize : config.childSize) * 0.5;
    
    const geometry = new THREE.SphereGeometry(size, config.nodeResolution, config.nodeResolution);
    
    let material;
    switch (config.materialType) {
      case 'basic':
        material = new THREE.MeshBasicMaterial({
          color: color,
          wireframe: config.wireframe,
        });
        break;
      case 'toon':
        material = new THREE.MeshToonMaterial({
          color: color,
          wireframe: config.wireframe,
        });
        break;
      case 'standard':
      default:
        material = new THREE.MeshStandardMaterial({
          color: color,
          metalness: config.metalness,
          roughness: config.roughness,
          emissive: color,
          emissiveIntensity: config.emissiveIntensity,
          wireframe: config.wireframe,
        });
        break;
    }
    
    return new THREE.Mesh(geometry, material);
  }, [config, getNodeColor]);

  const updateGraph = useCallback(() => {
    const graph = graphRef.current;
    if (!graph) return;

    graph
      .backgroundColor(config.backgroundColor)
      .linkOpacity(config.linkOpacity)
      .linkWidth(config.linkWidth)
      .linkColor(() => `rgba(${config.linkColor}, ${config.linkOpacity})`)
      .linkDirectionalParticles(config.linkParticleCount)
      .linkDirectionalParticleSpeed(config.particleSpeed)
      .linkCurvature(config.linkCurvature)
      .nodeThreeObject(createNodeObject)
      .warmupTicks(config.warmupTicks)
      .cooldownTicks(config.cooldownTicks);

    graph.d3Force('charge').strength(config.chargeStrength);
    graph.d3Force('link').distance(config.linkDistance);

    graph.refresh();
  }, [config, createNodeObject]);

  useEffect(() => {
    updateGraph();
  }, [config, updateGraph]);

  useEffect(() => {
    const initGraph = async () => {
      if (!graphContainerRef.current) return;

      try {
        const [ForceGraph3D, THREE] = await Promise.all([loadForceGraph(), loadThree()]);
        threeRef.current = THREE;
        
        if (!graphContainerRef.current) return;

        const graph = (ForceGraph3D as any)()(graphContainerRef.current)
          .width(graphContainerRef.current.clientWidth)
          .height(graphContainerRef.current.clientHeight)
          .backgroundColor(config.backgroundColor)
          .showNavInfo(false)
          .linkOpacity(config.linkOpacity)
          .linkWidth(config.linkWidth)
          .linkColor(() => `rgba(${config.linkColor}, ${config.linkOpacity})`)
          .linkDirectionalParticles(config.linkParticleCount)
          .linkDirectionalParticleSpeed(config.particleSpeed)
          .linkCurvature(config.linkCurvature)
          .nodeLabel('label')
          .nodeThreeObject(createNodeObject)
          .warmupTicks(config.warmupTicks)
          .cooldownTicks(config.cooldownTicks)
          .d3AlphaDecay(0.02)
          .d3VelocityDecay(0.3)
          .onNodeClick((node: GraphNode) => {
            console.log('Clicked:', node.label);
            node.revealed = true;
            graph.refresh();
          });

        graphRef.current = graph;

        const sampleWords = [
          'chlorophyll', 'sunlight', 'carbon', 'stomata', 'oxygen',
          'glucose', 'plant', 'leaf', 'green', 'energy', 'CO2', 'water'
        ];

        const nodes: GraphNode[] = [
          { id: 'center', label: '?????', val: config.centerSize },
          ...sampleWords.map((word, i) => ({
            id: `node-${i}`,
            label: word,
            val: config.childSize
          }))
        ];

        const links: GraphLink[] = sampleWords.map((_, i) => ({
          source: 'center',
          target: `node-${i}`
        }));

        graph.graphData({ nodes, links });

        graph.d3Force('charge').strength(config.chargeStrength);
        graph.d3Force('link').distance(config.linkDistance);

        setTimeout(() => {
          graph.cameraPosition({ x: 0, y: 0, z: 300 });
        }, 100);

        const handleResize = () => {
          if (graphContainerRef.current && graph) {
            graph.width(graphContainerRef.current.clientWidth);
            graph.height(graphContainerRef.current.clientHeight);
          }
        };

        window.addEventListener('resize', handleResize);

        cleanupRef.current = () => {
          window.removeEventListener('resize', handleResize);
          if (graph) {
            graph.graphData({ nodes: [], links: [] });
          }
        };

        setIsLoaded(true);
      } catch (err) {
        console.error('Graph init error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load 3D graph');
      }
    };

    initGraph();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      graphRef.current = null;
    };
  }, [createNodeObject]);

  const updateConfig = (updates: Partial<GraphConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateChildColor = (index: number, color: string) => {
    const newColors = [...config.childColors];
    newColors[index] = color;
    updateConfig({ childColors: newColors });
  };

  if (error) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#0a0a1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f46464',
        fontFamily: 'Inter, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <h2>Error Loading 3D Graph</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      background: config.backgroundColor,
      overflow: 'hidden'
    }}>
      {/* Control Panel */}
      <div style={{
        width: '280px',
        minWidth: '280px',
        height: '100%',
        flexShrink: 0,
        background: 'rgba(10, 10, 31, 0.95)',
        borderRight: '1px solid rgba(100, 244, 244, 0.2)',
        padding: '16px',
        overflowY: 'auto',
        fontFamily: 'Inter, sans-serif',
        color: '#fff',
        fontSize: '12px',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, color: '#64f4f4', fontSize: '15px' }}>Visual Test Bench</h2>
          <a 
            href="/"
            style={{
              background: 'transparent',
              border: '1px solid rgba(100, 244, 244, 0.3)',
              color: '#64f4f4',
              padding: '4px 8px',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '11px',
              textDecoration: 'none'
            }}
          >
            To Game
          </a>
        </div>

        {/* Material Type */}
        <Section title="Material Type">
          <ControlRow label="Type">
            <select
              value={config.materialType}
              onChange={(e) => updateConfig({ materialType: e.target.value as MaterialType })}
              style={{
                padding: '4px 8px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(100,244,244,0.3)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              <option value="standard">MeshStandardMaterial</option>
              <option value="basic">MeshBasicMaterial</option>
              <option value="toon">MeshToonMaterial</option>
            </select>
          </ControlRow>
          <div style={{ color: '#888', fontSize: '10px', marginTop: '4px' }}>
            {config.materialType === 'standard' && 'PBR material with lighting, metalness, roughness'}
            {config.materialType === 'basic' && 'Simple flat color, no lighting needed'}
            {config.materialType === 'toon' && 'Cel-shaded cartoon style'}
          </div>
          <ControlRow label="Wireframe">
            <input
              type="checkbox"
              checked={config.wireframe}
              onChange={(e) => updateConfig({ wireframe: e.target.checked })}
              style={{ cursor: 'pointer' }}
            />
          </ControlRow>
        </Section>

        {/* Colors */}
        <Section title="Colors">
          <ColorControl label="Center" value={config.centerColor} onChange={(v) => updateConfig({ centerColor: v })} />
          <ColorControl label="Revealed" value={config.revealedColor} onChange={(v) => updateConfig({ revealedColor: v })} />
          <ColorControl label="Background" value={config.backgroundColor} onChange={(v) => updateConfig({ backgroundColor: v })} />
          <div style={{ marginTop: '8px' }}>
            <label style={{ display: 'block', marginBottom: '4px', color: '#aaa', fontSize: '11px' }}>Child Colors:</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {config.childColors.map((color, i) => (
                <input
                  key={i}
                  type="color"
                  value={color}
                  onChange={(e) => updateChildColor(i, e.target.value)}
                  style={{ width: '32px', height: '24px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* Standard Material Props */}
        {config.materialType === 'standard' && (
          <Section title="PBR Properties">
            <SliderControl label="Metalness" value={config.metalness} min={0} max={1} step={0.1}
              onChange={(v) => updateConfig({ metalness: v })} />
            <SliderControl label="Roughness" value={config.roughness} min={0} max={1} step={0.1}
              onChange={(v) => updateConfig({ roughness: v })} />
            <SliderControl label="Glow" value={config.emissiveIntensity} min={0} max={2} step={0.1}
              onChange={(v) => updateConfig({ emissiveIntensity: v })} />
          </Section>
        )}

        {/* Geometry */}
        <Section title="Geometry">
          <SliderControl label="Resolution" value={config.nodeResolution} min={4} max={32} step={2}
            onChange={(v) => updateConfig({ nodeResolution: v })} />
        </Section>

        {/* Sizes */}
        <Section title="Sizes">
          <SliderControl label="Center Size" value={config.centerSize} min={10} max={50} step={1}
            onChange={(v) => updateConfig({ centerSize: v })} />
          <SliderControl label="Child Size" value={config.childSize} min={2} max={15} step={0.5}
            onChange={(v) => updateConfig({ childSize: v })} />
          <SliderControl label="Link Width" value={config.linkWidth} min={0.5} max={5} step={0.5}
            onChange={(v) => updateConfig({ linkWidth: v })} />
        </Section>

        {/* Links */}
        <Section title="Links & Curves">
          <ControlRow label="Link RGB">
            <input
              type="text"
              value={config.linkColor}
              onChange={(e) => updateConfig({ linkColor: e.target.value })}
              style={{
                width: '80px',
                padding: '3px 6px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(100,244,244,0.3)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '11px'
              }}
            />
          </ControlRow>
          <SliderControl label="Link Opacity" value={config.linkOpacity} min={0.1} max={1} step={0.1}
            onChange={(v) => updateConfig({ linkOpacity: v })} />
          <SliderControl label="Link Curvature" value={config.linkCurvature} min={0} max={1} step={0.1}
            onChange={(v) => updateConfig({ linkCurvature: v })} />
          <SliderControl label="Particles" value={config.linkParticleCount} min={0} max={10} step={1}
            onChange={(v) => updateConfig({ linkParticleCount: v })} />
          <SliderControl label="Particle Speed" value={config.particleSpeed} min={0} max={0.1} step={0.001}
            onChange={(v) => updateConfig({ particleSpeed: v })} />
        </Section>

        {/* Physics */}
        <Section title="Physics">
          <SliderControl label="Link Distance" value={config.linkDistance} min={20} max={150} step={5}
            onChange={(v) => updateConfig({ linkDistance: v })} />
          <SliderControl label="Charge" value={config.chargeStrength} min={-800} max={-50} step={50}
            onChange={(v) => updateConfig({ chargeStrength: v })} />
        </Section>

        {/* Reset */}
        <button
          onClick={() => setConfig(defaultConfig)}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(100, 244, 244, 0.1)',
            border: '1px solid rgba(100, 244, 244, 0.3)',
            color: '#64f4f4',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Reset to Default
        </button>
      </div>

      {/* Graph Container */}
      <div style={{ flex: 1, position: 'relative' }}>
        {!isLoaded && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#64f4f4',
            fontSize: '18px',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            zIndex: 10
          }}>
            <div>Loading 3D Graph...</div>
          </div>
        )}

        <div
          ref={graphContainerRef}
          style={{
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    </div>
  );
}

// Helper Components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{
        color: '#64f4f4',
        fontSize: '12px',
        marginBottom: '8px',
        borderBottom: '1px solid rgba(100,244,244,0.2)',
        paddingBottom: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
      <label style={{ color: '#aaa', fontSize: '11px' }}>{label}</label>
      {children}
    </div>
  );
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <ControlRow label={label}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '40px', height: '22px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      />
    </ControlRow>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
}) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
        <label style={{ color: '#aaa', fontSize: '11px' }}>{label}</label>
        <span style={{ color: '#64f4f4', fontSize: '11px' }}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%',
          height: '5px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '3px',
          outline: 'none',
          cursor: 'pointer'
        }}
      />
    </div>
  );
}
