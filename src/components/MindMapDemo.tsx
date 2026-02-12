import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { animate } from 'animejs';
import { X, Save, Trash2, GitBranch, Plus, MousePointer, Heart, Zap, Menu, Clock, MessageSquare } from 'lucide-react';

interface DemoNode {
  id: number;
  body: string;
  is_trunk: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface DemoConnection {
  parent_id: number;
  child_id: number;
}

interface D3Node extends d3.SimulationNodeDatum {
  id: number;
  body: string;
  is_trunk: boolean;
  fx?: number | null;
  fy?: number | null;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: D3Node | number;
  target: D3Node | number;
}

// Initial demo data - just a trunk node
const INITIAL_NODES: DemoNode[] = [
  { id: 1, body: 'Check discord and respond to messages', is_trunk: true },
];

const INITIAL_CONNECTIONS: DemoConnection[] = [];

// Example placeholders for node body
const EXAMPLE_PLACEHOLDERS = [
  "Look up the price of ETH and if it is below $1500, swap $100 USDC into ETH on base",
  "Clone the starkbot discord repo into your workspace, write a journal about a possible improvement to the skill system, and post a discussion on its github project discussion board",
  "Reply to a random message in the discord in #general and send a tweet saying 'gm'",
  "Check the latest mass on CoinGecko and post a summary to the #crypto channel on Discord",
  "Review the last 5 commits on the main branch and write a changelog entry",
  "Search Twitter for mentions of StarkBot and reply to one with a helpful tip",
];

export function MindMapDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<D3Node, D3Link> | null>(null);
  const nextIdRef = useRef(2);

  const [nodes, setNodes] = useState<DemoNode[]>(INITIAL_NODES);
  const [connections, setConnections] = useState<DemoConnection[]>(INITIAL_CONNECTIONS);

  // Modal state for editing node body
  const [editingNode, setEditingNode] = useState<DemoNode | null>(null);
  const [editBody, setEditBody] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  // Hover tooltip state
  const [hoveredNode, setHoveredNode] = useState<DemoNode | null>(null);

  // Heartbeat toggle state (toy - no backend)
  const [heartbeatEnabled, setHeartbeatEnabled] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [isPulsing, setIsPulsing] = useState(false);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<Array<{
    id: number;
    nodeId: number;
    nodeBody: string;
    time: string;
    messageCount: number;
  }>>([]);

  // Confetti animation on a node
  const triggerConfettiAnimation = useCallback((nodeId: number) => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const nodeGroup = svg.select(`g[data-node-id="${nodeId}"]`);
    if (nodeGroup.empty()) return;

    // Get node position and apply current zoom transform
    const transform = nodeGroup.attr('transform');
    const match = transform?.match(/translate\(([^,]+),([^)]+)\)/);
    if (!match) return;

    const nodeX = parseFloat(match[1]);
    const nodeY = parseFloat(match[2]);

    // Get the current zoom transform from main group
    const mainG = svg.select('g.main-group');
    const mainTransform = mainG.attr('transform');
    let tx = 0, ty = 0, scale = 1;
    if (mainTransform) {
      const translateMatch = mainTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      const scaleMatch = mainTransform.match(/scale\(([^)]+)\)/);
      if (translateMatch) {
        tx = parseFloat(translateMatch[1]);
        ty = parseFloat(translateMatch[2]);
      }
      if (scaleMatch) {
        scale = parseFloat(scaleMatch[1]);
      }
    }

    // Calculate screen position of node
    const screenX = tx + nodeX * scale;
    const screenY = ty + nodeY * scale;

    // Create container for animation elements
    const animContainer = document.createElement('div');
    animContainer.style.cssText = `
      position: absolute;
      left: ${screenX}px;
      top: ${screenY}px;
      pointer-events: none;
      z-index: 100;
    `;
    containerRef.current.appendChild(animContainer);

    // Monochrome confetti
    const colors = ['#ffffff', '#FBFBFB', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040'];

    // Create confetti sprinkles bursting from node
    const numSprinkles = 30;

    for (let i = 0; i < numSprinkles; i++) {
      const sprinkle = document.createElement('div');
      const color = colors[i % colors.length];
      const width = 4 + Math.random() * 3;
      const height = 12 + Math.random() * 8;
      const angle = Math.random() * 360;
      const distance = 80 + Math.random() * 120;
      const endX = Math.cos(angle * Math.PI / 180) * distance;
      const endY = Math.sin(angle * Math.PI / 180) * distance;
      const rotation = Math.random() * 360;

      sprinkle.style.cssText = `
        position: absolute;
        width: ${width}px;
        height: ${height}px;
        background: ${color};
        border-radius: ${width / 2}px;
        left: ${-width / 2}px;
        top: ${-height / 2}px;
        transform: rotate(${rotation}deg);
      `;

      animContainer.appendChild(sprinkle);

      // Animate sprinkle bursting outward
      animate(sprinkle, {
        translateX: [0, endX],
        translateY: [0, endY],
        rotate: [rotation, rotation + (Math.random() - 0.5) * 360],
        opacity: [1, 1, 0],
        scale: [0, 1, 0.5],
        duration: 800 + Math.random() * 400,
        delay: i * 15,
        ease: 'outExpo',
      });
    }

    // Central flash
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      left: -10px;
      top: -10px;
    `;
    animContainer.appendChild(flash);

    animate(flash, {
      scale: [0, 3, 0],
      opacity: [1, 0.8, 0],
      duration: 400,
      ease: 'outExpo',
    });

    // Pulse the actual SVG node
    const nodeCircle = nodeGroup.select('circle');
    const originalRadius = nodeCircle.attr('r');
    nodeCircle
      .transition()
      .duration(150)
      .attr('r', parseFloat(originalRadius) * 1.5)
      .transition()
      .duration(300)
      .attr('r', originalRadius);

    // Cleanup
    setTimeout(() => {
      animContainer.remove();
    }, 1500);
  }, []);

  // Handle pulse once button
  const handlePulseOnce = useCallback(() => {
    if (nodes.length === 0 || isPulsing) return;

    setIsPulsing(true);

    // Pick a random node
    const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    triggerConfettiAnimation(randomNode.id);

    // Add to execution history
    setExecutionHistory(prev => [{
      id: Date.now(),
      nodeId: randomNode.id,
      nodeBody: randomNode.body || 'Empty node',
      time: 'just now',
      messageCount: Math.floor(Math.random() * 8) + 2,
    }, ...prev].slice(0, 10)); // Keep only last 10

    // Disable button for 3 seconds
    setTimeout(() => setIsPulsing(false), 3000);
  }, [nodes, isPulsing, triggerConfettiAnimation]);

  // Fake countdown timer - counts down to next 30 min mark
  useEffect(() => {
    if (!heartbeatEnabled) {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Calculate time to next 30-min mark (0 or 30)
      const nextMark = minutes < 30 ? 30 : 60;
      const minsLeft = nextMark - minutes - 1;
      const secsLeft = 60 - seconds;

      const adjustedMins = secsLeft === 60 ? minsLeft + 1 : minsLeft;
      const adjustedSecs = secsLeft === 60 ? 0 : secsLeft;

      setCountdown(`${adjustedMins}m ${adjustedSecs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [heartbeatEnabled]);

  // Handle click on node to create child
  const handleNodeClick = useCallback((node: D3Node) => {
    const newId = nextIdRef.current++;
    const newNode: DemoNode = {
      id: newId,
      body: '',
      is_trunk: false,
      // Position near parent
      x: (node.x ?? 0) + (Math.random() - 0.5) * 80,
      y: (node.y ?? 0) + (Math.random() - 0.5) * 80,
    };

    setNodes(prev => [...prev, newNode]);
    setConnections(prev => [...prev, { parent_id: node.id, child_id: newId }]);
  }, []);

  // Handle right-click to edit node
  const handleNodeRightClick = useCallback((event: MouseEvent, node: D3Node) => {
    event.preventDefault();
    const nodeInfo = nodes.find(n => n.id === node.id);
    if (nodeInfo) {
      setEditingNode(nodeInfo);
      setEditBody(nodeInfo.body);
      // Pick a random placeholder example
      setPlaceholder(EXAMPLE_PLACEHOLDERS[Math.floor(Math.random() * EXAMPLE_PLACEHOLDERS.length)]);
    }
  }, [nodes]);

  // Handle save edit
  const handleSaveEdit = () => {
    if (!editingNode) return;
    // Use placeholder if body is empty
    const bodyToSave = editBody.trim() || placeholder;
    setNodes(prev => prev.map(n =>
      n.id === editingNode.id ? { ...n, body: bodyToSave } : n
    ));
    setEditingNode(null);
  };

  // Handle delete node
  const handleDeleteNode = () => {
    if (!editingNode || editingNode.is_trunk) return;

    // Get all descendant node IDs to delete
    const toDelete = new Set<number>([editingNode.id]);
    let changed = true;
    while (changed) {
      changed = false;
      connections.forEach(c => {
        if (toDelete.has(c.parent_id) && !toDelete.has(c.child_id)) {
          toDelete.add(c.child_id);
          changed = true;
        }
      });
    }

    setNodes(prev => prev.filter(n => !toDelete.has(n.id)));
    setConnections(prev => prev.filter(c => !toDelete.has(c.parent_id) && !toDelete.has(c.child_id)));
    setEditingNode(null);
  };

  // Handle drag to update position
  const handleDragEnd = useCallback((node: D3Node) => {
    if (node.x !== undefined && node.y !== undefined) {
      setNodes(prev => prev.map(n =>
        n.id === node.id ? { ...n, x: node.x, y: node.y, fx: node.fx, fy: node.fy } : n
      ));
    }
  }, []);

  // D3 visualization
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create main group for zoom/pan
    const g = svg.append('g').attr('class', 'main-group');

    // Setup zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Center the view initially
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2));

    // Prepare data for D3
    const d3Nodes: D3Node[] = nodes.map(n => ({
      id: n.id,
      body: n.body,
      is_trunk: n.is_trunk,
      x: n.x ?? undefined,
      y: n.y ?? undefined,
      fx: n.fx ?? null,
      fy: n.fy ?? null,
    }));

    const d3Links: D3Link[] = connections.map(c => ({
      source: c.parent_id,
      target: c.child_id,
    }));

    // Create simulation
    const simulation = d3.forceSimulation<D3Node, D3Link>(d3Nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(d3Links)
        .id(d => d.id)
        .distance(80)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(0, 0))
      .force('collide', d3.forceCollide().radius(35));

    simulationRef.current = simulation;

    // Draw links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(d3Links)
      .join('line')
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Draw nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(d3Nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .attr('data-node-id', d => d.id);

    // Helper to get node fill color based on trunk status and body content
    const getNodeFill = (d: D3Node, hovered = false) => {
      const hasBody = d.body.trim().length > 0;
      if (d.is_trunk) {
        return hovered
          ? (hasBody ? '#e5e5e5' : '#737373')
          : (hasBody ? '#FBFBFB' : '#525252');
      } else {
        return hovered
          ? (hasBody ? '#d4d4d4' : '#737373')
          : (hasBody ? '#a3a3a3' : '#404040');
      }
    };

    const getNodeStroke = (d: D3Node) => {
      const hasBody = d.body.trim().length > 0;
      if (d.is_trunk) {
        return hasBody ? '#FBFBFB' : '#404040';
      } else {
        return hasBody ? '#737373' : '#333';
      }
    };

    // Node circles
    node.append('circle')
      .attr('r', d => d.is_trunk ? 25 : 18)
      .attr('fill', d => getNodeFill(d))
      .attr('stroke', d => getNodeStroke(d))
      .attr('stroke-width', 2)
      .style('transition', 'r 0.2s ease, fill 0.2s ease');

    // Plus icon in center of node
    node.append('text')
      .text('+')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', d => d.is_trunk ? '#070707' : '#1a1a1a')
      .attr('font-size', d => d.is_trunk ? '18px' : '14px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none');

    // Node labels (body text preview)
    node.append('text')
      .text(d => d.body.slice(0, 12) + (d.body.length > 12 ? '...' : ''))
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.is_trunk ? 42 : 32)
      .attr('fill', '#6a6a6b')
      .attr('font-size', '10px')
      .style('pointer-events', 'none');

    // Hover effects
    node.on('mouseenter', function(_event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', d.is_trunk ? 30 : 22)
        .attr('fill', getNodeFill(d, true));
      const nodeInfo = nodes.find(n => n.id === d.id);
      if (nodeInfo) setHoveredNode(nodeInfo);
    })
    .on('mouseleave', function(_event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', d.is_trunk ? 25 : 18)
        .attr('fill', getNodeFill(d, false));
      setHoveredNode(null);
    });

    // Right-click handler for editing
    node.on('contextmenu', (event: MouseEvent, d: D3Node) => {
      handleNodeRightClick(event, d);
    });

    // Drag behavior with click detection
    // Track if mouse actually moved during drag
    let dragStartX = 0;
    let dragStartY = 0;
    let hasDragged = false;

    const drag = d3.drag<SVGGElement, D3Node>()
      .on('start', (event, d) => {
        dragStartX = event.x;
        dragStartY = event.y;
        hasDragged = false;
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        // Check if mouse moved more than 3 pixels (threshold for drag vs click)
        const dx = event.x - dragStartX;
        const dy = event.y - dragStartY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasDragged = true;
        }
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        if (hasDragged) {
          // Actually dragged - save position
          handleDragEnd(d);
        } else {
          // Just clicked - create child node
          handleNodeClick(d);
        }
      });

    (node as d3.Selection<SVGGElement, D3Node, SVGGElement, unknown>).call(drag);

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as D3Node).x ?? 0)
        .attr('y1', d => (d.source as D3Node).y ?? 0)
        .attr('x2', d => (d.target as D3Node).x ?? 0)
        .attr('y2', d => (d.target as D3Node).y ?? 0);

      node.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, connections, handleNodeClick, handleNodeRightClick, handleDragEnd]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Container - mimics the mind map UI */}
      <div className="bg-[#070707] rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <GitBranch className="w-5 h-5 text-[#FBFBFB]" />
            <span className="text-lg font-bold text-[#FBFBFB]">Mind Map</span>
            <div className="flex items-center gap-2 bg-white/[0.05] px-2 py-1 rounded">
              <span className="text-xs text-[#6a6a6b]">{nodes.length} nodes</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Heartbeat toggle */}
            <div className="flex items-center gap-2">
              {countdown && heartbeatEnabled && (
                <span className="text-xs text-[#6a6a6b] font-mono" title="Time to next pulse">
                  {countdown}
                </span>
              )}
              <div className="group cursor-pointer">
                <Heart
                  size={16}
                  className={`${heartbeatEnabled ? 'text-[#FBFBFB] fill-[#FBFBFB] animate-heartbeat' : 'text-[#6a6a6b] group-hover-heartbeat'} transition-colors group-hover:text-[#FBFBFB]/80 group-hover:fill-[#FBFBFB]/80 group-hover:animate-heartbeat`}
                />
              </div>
              <button
                onClick={() => setHeartbeatEnabled(!heartbeatEnabled)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  heartbeatEnabled ? 'bg-[#FBFBFB]' : 'bg-[#333]'
                } cursor-pointer`}
                title={heartbeatEnabled ? 'Disable heartbeat' : 'Enable heartbeat'}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform ${
                    heartbeatEnabled ? 'translate-x-5 bg-[#070707]' : 'translate-x-0 bg-[#6a6a6b]'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#6a6a6b]">
              <MousePointer className="w-3 h-3" />
              <span>Click to add</span>
              <span className="text-[#333]">|</span>
              <span>Right-click to edit</span>
            </div>

            {/* Hamburger menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-[#6a6a6b] hover:text-[#FBFBFB] hover:bg-white/[0.05] transition-colors"
              title="Execution History"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Main content with sidebar */}
        <div className="flex h-80">
          {/* Canvas */}
          <div ref={containerRef} className="relative flex-1 overflow-hidden">
            <svg
              ref={svgRef}
              className="w-full h-full"
              style={{ background: '#070707' }}
            />

            {/* Hover Tooltip */}
            {hoveredNode && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 max-w-sm px-3 py-2 bg-[#0a0a0a]/95 border border-white/[0.08] rounded-lg shadow-xl pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded ${hoveredNode.is_trunk ? 'bg-white/[0.08] text-[#FBFBFB]/70' : 'bg-white/[0.05] text-[#6a6a6b]'}`}>
                    {hoveredNode.is_trunk ? 'Trunk' : `Node #${hoveredNode.id}`}
                  </span>
                </div>
                <p className="text-xs text-[#FBFBFB] whitespace-pre-wrap break-words">
                  {hoveredNode.body || <span className="text-[#6a6a6b] italic">Empty node - right click to add content</span>}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div
            className={`border-l border-white/[0.08] bg-[#0a0a0a] flex flex-col transition-all duration-300 overflow-hidden ${
              sidebarOpen ? 'w-64' : 'w-0 border-l-0'
            }`}
          >
            {/* Sidebar Header */}
            <div className="p-3 border-b border-white/[0.08] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#6a6a6b]" />
                <span className="text-sm font-medium text-[#FBFBFB]">Execution History</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-[#6a6a6b] hover:text-[#FBFBFB]"
              >
                <X size={14} />
              </button>
            </div>

            {/* Execution List */}
            <div className="flex-1 overflow-y-auto">
              {executionHistory.length === 0 ? (
                <div className="p-4 text-center text-[#6a6a6b] text-xs">
                  No executions yet.<br />Click "Pulse Once" to trigger one.
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {executionHistory.map((execution) => (
                    <div
                      key={execution.id}
                      className="p-3 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          execution.nodeId === 1
                            ? 'bg-white/[0.08] text-[#FBFBFB]/70'
                            : 'bg-white/[0.05] text-[#6a6a6b]'
                        }`}>
                          {execution.nodeId === 1 ? 'Trunk' : `Node #${execution.nodeId}`}
                        </span>
                        <span className="text-xs text-[#6a6a6b]">{execution.time}</span>
                      </div>
                      <p className="text-xs text-[#6a6a6b] truncate mb-1">
                        {execution.nodeBody}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-[#6a6a6b]">
                        <MessageSquare size={10} />
                        <span>{execution.messageCount} messages</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="px-4 py-3 border-t border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs text-[#6a6a6b]">
              <div className="flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#FBFBFB]" />
                <span>Click node to add child</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 bg-white/[0.05] rounded text-[#6a6a6b] font-mono">Right-click</span>
                <span>Edit node content</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#6a6a6b]">Drag</span>
                <span>to reposition</span>
              </div>
            </div>
            <button
              onClick={handlePulseOnce}
              disabled={isPulsing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isPulsing
                  ? 'bg-white/[0.05] text-[#6a6a6b] cursor-not-allowed'
                  : 'bg-white/[0.08] hover:bg-white/[0.12] text-[#FBFBFB]'
              }`}
            >
              <Zap className={`w-4 h-4 ${isPulsing ? 'animate-pulse' : ''}`} />
              Pulse Once
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingNode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0a0a0a] rounded-lg p-6 w-full max-w-md mx-4 border border-white/[0.08]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#FBFBFB]">
                {editingNode.is_trunk ? 'Edit Trunk Node' : 'Edit Node'}
              </h2>
              <button
                onClick={() => setEditingNode(null)}
                className="text-[#6a6a6b] hover:text-[#FBFBFB]"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-[#6a6a6b] mb-3">
              Enter the action or prompt for the heartbeat to execute when this node is selected.
            </p>

            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full h-28 bg-white/[0.03] border border-white/[0.08] rounded-lg p-3 text-[#FBFBFB] placeholder-[#6a6a6b] focus:outline-none focus:ring-2 focus:ring-white/20 resize-none text-sm"
              placeholder={placeholder}
              autoFocus
            />

            <div className="flex items-center justify-between mt-4">
              {!editingNode.is_trunk && (
                <button
                  onClick={handleDeleteNode}
                  className="flex items-center gap-1.5 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
              <div className={`flex gap-2 ${editingNode.is_trunk ? 'ml-auto' : ''}`}>
                <button
                  onClick={() => setEditingNode(null)}
                  className="px-3 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-[#FBFBFB] rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#FBFBFB] hover:bg-white/90 text-[#070707] rounded-lg transition-colors text-sm"
                >
                  <Save size={14} />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MindMapDemo;
