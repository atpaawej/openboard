'use client';

import React, { useState } from 'react';
import { Layers, Box, Cpu, Eye, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

interface ToolItem {
  name: string;
  category: 'Lifecycle' | 'Canvas Mutation' | 'Headless & Inspection';
  signature: string;
  description: string;
  examplePrompt: string;
}

export function McpToolMatrix() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Lifecycle' | 'Canvas Mutation' | 'Headless & Inspection'>('All');
  const [selectedToolIndex, setSelectedToolIndex] = useState<number>(0);

  const tools: ToolItem[] = [
    {
      name: 'create_board',
      category: 'Lifecycle',
      signature: 'create_board(title: string, description?: string)',
      description: 'Creates a new whiteboard canvas document in the local SQLite database and returns the generated board ID.',
      examplePrompt: '"Create a new board called Auth Architecture for our upcoming OAuth2 migration."'
    },
    {
      name: 'list_boards',
      category: 'Lifecycle',
      signature: 'list_boards(filter?: string)',
      description: 'Returns all existing whiteboards with metadata, shape counts, favorite flags, and timestamps.',
      examplePrompt: '"List all whiteboards in OpenBoard to see which one contains our billing diagrams."'
    },
    {
      name: 'get_board',
      category: 'Lifecycle',
      signature: 'get_board(boardId: string)',
      description: 'Fetches the complete state, shapes, connectors, and metadata for a specific whiteboard.',
      examplePrompt: '"Fetch board board_941a to understand the current layout before modifying it."'
    },
    {
      name: 'delete_board',
      category: 'Lifecycle',
      signature: 'delete_board(boardId: string, permanent?: boolean)',
      description: 'Soft-deletes a board to the Trash or permanently purges it from SQLite.',
      examplePrompt: '"Move the deprecated temp-architecture board to Trash."'
    },
    {
      name: 'create_shape',
      category: 'Canvas Mutation',
      signature: 'create_shape(boardId, type, x, y, props)',
      description: 'Creates an individual shape (rectangle, ellipse, diamond, text, sticky note) with custom colors and labels.',
      examplePrompt: '"Add a blue rectangular service box labeled Payment Microservice at (200, 300)."'
    },
    {
      name: 'batch_create_shapes',
      category: 'Canvas Mutation',
      signature: 'batch_create_shapes(boardId, shapes[])',
      description: 'Executes an atomic batch transaction creating complex topologies, flowchart clusters, or system components in 1 call.',
      examplePrompt: '"Generate an entire 3-tier web architecture with frontend, API gateway, Redis, and Postgres in one shot."'
    },
    {
      name: 'update_shape',
      category: 'Canvas Mutation',
      signature: 'update_shape(boardId, shapeId, props)',
      description: 'Modifies shape properties, coordinates, dimensions, background colors, or label text.',
      examplePrompt: '"Change the color of the Database shape to green and update label to PostgreSQL 16 Cluster."'
    },
    {
      name: 'delete_shape',
      category: 'Canvas Mutation',
      signature: 'delete_shape(boardId, shapeId)',
      description: 'Removes a specific shape, connector, or text entity from the active canvas.',
      examplePrompt: '"Delete the obsolete legacy-cache shape from the board."'
    },
    {
      name: 'create_arrow_connection',
      category: 'Canvas Mutation',
      signature: 'create_arrow_connection(boardId, fromShapeId, toShapeId, label?)',
      description: 'Creates a directional connector binding two visual nodes with optional protocol label (e.g. gRPC, REST, SSE).',
      examplePrompt: '"Draw a directional arrow from API Gateway to Auth Service labeled /v1/auth/verify."'
    },
    {
      name: 'group_shapes',
      category: 'Canvas Mutation',
      signature: 'group_shapes(boardId, shapeIds[], title?)',
      description: 'Wraps related visual elements inside a named visual boundary container frame.',
      examplePrompt: '"Group all Redis cache and database nodes inside a container labeled Data Layer."'
    },
    {
      name: 'inspect_canvas',
      category: 'Headless & Inspection',
      signature: 'inspect_canvas(boardId, depth?: number)',
      description: 'Produces a semantic hierarchical tree of canvas elements for agent reasoning without browser rendering.',
      examplePrompt: '"Inspect the active board to understand the system dependencies before suggesting optimizations."'
    },
    {
      name: 'export_svg',
      category: 'Headless & Inspection',
      signature: 'export_svg(boardId, shapeIds?: string[])',
      description: 'Generates a pixel-perfect standalone vector SVG snapshot of the canvas in sub-5ms.',
      examplePrompt: '"Export an SVG snapshot of the architecture diagram to embed in our README.md."'
    },
    {
      name: 'search_canvas',
      category: 'Headless & Inspection',
      signature: 'search_canvas(query: string)',
      description: 'Searches across all whiteboards in the local SQLite database for specific node titles, labels, or keywords.',
      examplePrompt: '"Search for all boards that contain the phrase Stripe Webhook."'
    }
  ];

  const filteredTools = activeCategory === 'All'
    ? tools
    : tools.filter((t) => t.category === activeCategory);

  const selectedTool = tools[selectedToolIndex] || tools[0];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121318] p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Semantic Tool Matrix</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            13 High-Level Model Context Protocol (MCP) Tools
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Engineered so AI coding agents manipulate canvas diagrams with exact semantic understanding.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0c0d10] p-1 rounded-lg border border-white/5 text-xs">
          {(['All', 'Lifecycle', 'Canvas Mutation', 'Headless & Inspection'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Tool List */}
        <div className="lg:col-span-6 space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {filteredTools.map((tool) => {
            const actualIndex = tools.findIndex((t) => t.name === tool.name);
            const isSelected = selectedToolIndex === actualIndex;

            return (
              <button
                key={tool.name}
                onClick={() => setSelectedToolIndex(actualIndex)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#181a24] border-blue-500/50 shadow-md'
                    : 'bg-[#15161c] border-white/5 hover:border-white/10 hover:bg-[#1a1c24]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-blue-300">
                    {tool.name}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                    {tool.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                  {tool.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Tool Inspector */}
        <div className="lg:col-span-6 rounded-xl bg-[#0c0d10] border border-white/10 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400">
                MCP Tool Specification
              </span>
              <span className="text-[11px] font-mono text-gray-400">
                JSON-RPC 2.0
              </span>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white font-mono">{selectedTool.name}</h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                {selectedTool.description}
              </p>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase text-gray-500 mb-1">
                Signature &amp; Parameters
              </div>
              <div className="p-2.5 rounded-lg bg-[#14151a] border border-white/5 font-mono text-xs text-blue-300 overflow-x-auto">
                {selectedTool.signature}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase text-gray-500 mb-1">
                Sample AI Agent Prompt
              </div>
              <div className="p-2.5 rounded-lg bg-[#14151a] border border-white/5 text-xs text-gray-200 italic">
                {selectedTool.examplePrompt}
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-white/5 mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-mono">Status: Ready in openboard mcp</span>
            <Link
              href="/docs/mcp-tools"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              Full MCP Documentation →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
