'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
} from 'reactflow';
import { useParams } from 'next/navigation';
import { useData } from './DataProvider';

import 'reactflow/dist/style.css';

// Custom Screenshot Node Component
function ScreenshotNode({ data }: { data: any }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="p-2 bg-brand-50 flex flex-row gap-2">
        <p className="text-xs text-brand-500 font-semibold">Variant A</p>
        <p className="text-xs text-brand-500 font-semibold">Desktop</p>
        <p className="text-xs text-brand-500">Successful</p>
      </div>
      
      <div className="h-full rounded overflow-hidden" >
        {data.screenshot ? (
          <img 
            src={data.screenshot} 
            alt={data.title || data.url}
            className="h-full"
          />
        ) : (
          <div className="text-gray-400 text-sm">Loading screenshot...</div>
        )}
      </div>
    </div>
  );
}

// Define custom node types
const nodeTypes: NodeTypes = {
  screenshot: ScreenshotNode,
};

export default function Canvas() {
  const params = useParams();
  const experimentId = params.experimentId as string;
  const { experiments } = useData();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Use a ref to track the last processed canvas nodes to avoid unnecessary updates
  const lastCanvasNodesRef = useRef<string>('');

  const experiment = useMemo(() => 
    experiments.find((exp) => exp.id === experimentId), 
    [experiments, experimentId]
  );

  const canvasNodes = useMemo(() => 
    experiment?.canvas_nodes || [], 
    [experiment?.canvas_nodes]
  );

  // Update nodes only when canvas nodes actually change
  useEffect(() => {
    const currentCanvasNodesString = JSON.stringify(canvasNodes);
    
    // Only update if the canvas nodes have actually changed
    if (currentCanvasNodesString !== lastCanvasNodesRef.current) {
      const reactFlowNodes: Node[] = canvasNodes.map((dbNode) => ({
        id: dbNode.id,
        type: dbNode.type,
        position: { x: dbNode.x, y: dbNode.y },
        data: dbNode.data,
        ...(dbNode.width && dbNode.height && {
          style: { width: dbNode.width, height: dbNode.height }
        })
      }));
      
      setNodes(reactFlowNodes);
      lastCanvasNodesRef.current = currentCanvasNodesString;
    }
  }, [canvasNodes, setNodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className='h-full w-full'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#F5F5F5" />
        {/* <Controls />
        <MiniMap /> */}

      </ReactFlow>
    </div>
  );
}