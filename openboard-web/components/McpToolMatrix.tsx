'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TechnicalFrame, SectionFrame } from './ui/TechnicalFrame';
import { SectionHeader } from './ui/SectionHeader';
import { Badge } from './ui/Badge';
import { CodeSnippet } from './ui/CodeSnippet';

interface ToolItem {
  name: string;
  category: 'Lifecycle' | 'Mutation' | 'Inspection';
  signature: string;
  description: string;
  examplePrompt: string;
}

export function McpToolMatrix() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Lifecycle' | 'Mutation' | 'Inspection'>('All');
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
      category: 'Mutation',
      signature: 'create_shape(boardId, type, x, y, props)',
      description: 'Creates an individual shape (rectangle, ellipse, diamond, text, sticky note) with custom colors and labels.',
      examplePrompt: '"Add a blue rectangular service box labeled Payment Microservice at (200, 300)."'
    },
    {
      name: 'batch_create_shapes',
      category: 'Mutation',
      signature: 'batch_create_shapes(boardId, shapes[])',
      description: 'Executes an atomic batch transaction creating complex topologies, flowchart clusters, or system components in 1 call.',
      examplePrompt: '"Generate an entire 3-tier web architecture with frontend, API gateway, Redis, and Postgres in one shot."'
    },
    {
      name: 'update_shape',
      category: 'Mutation',
      signature: 'update_shape(boardId, shapeId, props)',
      description: 'Modifies shape properties, coordinates, dimensions, background colors, or label text.',
      examplePrompt: '"Change the color of the Database shape to green and update label to PostgreSQL 16 Cluster."'
    },
    {
      name: 'delete_shape',
      category: 'Mutation',
      signature: 'delete_shape(boardId, shapeId)',
      description: 'Removes a specific shape, connector, or text entity from the active canvas.',
      examplePrompt: '"Delete the obsolete legacy-cache shape from the board."'
    },
    {
      name: 'create_arrow_connection',
      category: 'Mutation',
      signature: 'create_arrow_connection(boardId, fromShapeId, toShapeId, label?)',
      description: 'Creates a directional connector binding two visual nodes with optional protocol label (e.g. gRPC, REST, SSE).',
      examplePrompt: '"Draw a directional arrow from API Gateway to Auth Service labeled /v1/auth/verify."'
    },
    {
      name: 'group_shapes',
      category: 'Mutation',
      signature: 'group_shapes(boardId, shapeIds[], title?)',
      description: 'Wraps related visual elements inside a named visual boundary container frame.',
      examplePrompt: '"Group all Redis cache and database nodes inside a container labeled Data Layer."'
    },
    {
      name: 'inspect_canvas',
      category: 'Inspection',
      signature: 'inspect_canvas(boardId, depth?: number)',
      description: 'Produces a semantic hierarchical tree of canvas elements for agent reasoning without browser rendering.',
      examplePrompt: '"Inspect the active board to understand the system dependencies before suggesting optimizations."'
    },
    {
      name: 'export_svg',
      category: 'Inspection',
      signature: 'export_svg(boardId, shapeIds?: string[])',
      description: 'Renders pixel-perfect vector SVG snapshots of the board directly on the local machine in sub-5ms.',
      examplePrompt: '"Export an SVG diagram of the active architecture board to include in our PR description."'
    },
    {
      name: 'export_json',
      category: 'Inspection',
      signature: 'export_json(boardId)',
      description: 'Exports the full serialized tldraw JSON schema for version control, backup, or CI/CD pipelines.',
      examplePrompt: '"Export board as JSON and commit it to docs/architecture/system.json."'
    }
  ];

  const filteredTools = activeCategory === 'All'
    ? tools
    : tools.filter((t) => t.category === activeCategory);

  const selectedTool = filteredTools[selectedToolIndex] || filteredTools[0] || tools[0];

  return (
    <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
      <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
        {/* Header Region */}
        <div className="px-6 py-10 sm:px-10 border-b border-white/[0.08]">
          <SectionHeader
            index="05 // SEMANTIC TOOLS"
            eyebrow="Model Context Protocol"
            eyebrowVariant="blue"
            title="13 Semantic Tools for Autonomous Diagramming"
            description="Coding agents aren't just given a blank canvas; they receive structured, high-level primitives to build, modify, and query architecture deterministically."
            align="left"
            action={
              <Link
                href="/docs/mcp-tools"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>Full Reference</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.08] bg-[#121318] text-xs">
          <div className="flex items-center gap-1">
            {(['All', 'Lifecycle', 'Mutation', 'Inspection'] as const).map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedToolIndex(0);
                  }}
                  type="button"
                  className={`px-3 py-1 font-mono text-xs rounded transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#181920] text-blue-300 font-semibold border border-blue-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat} {cat === 'All' ? `(${tools.length})` : `(${tools.filter(t => t.category === cat).length})`}
                </button>
              );
            })}
          </div>

          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            PROTOCOL: JSON-RPC 2.0
          </span>
        </div>

        {/* 2-Column Split Matrix View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#0c0d10]">
          {/* Left Column: Tool List */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/[0.08] max-h-[480px] overflow-y-auto divide-y divide-white/[0.06]">
            {filteredTools.map((tool, idx) => {
              const isSelected = selectedTool.name === tool.name;
              return (
                <button
                  key={tool.name}
                  onClick={() => setSelectedToolIndex(idx)}
                  type="button"
                  className={`w-full text-left p-4 transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#181920] border-l-2 border-l-blue-500'
                      : 'bg-[#121318] hover:bg-[#15161f]'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-mono text-xs font-bold text-zinc-200 truncate">
                      {tool.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {tool.description}
                    </div>
                  </div>
                  <Badge
                    variant={
                      tool.category === 'Lifecycle'
                        ? 'blue'
                        : tool.category === 'Mutation'
                        ? 'brand'
                        : 'success'
                    }
                    size="sm"
                  >
                    {tool.category}
                  </Badge>
                </button>
              );
            })}
          </div>

          {/* Right Column: Tool Detail Inspector */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 bg-[#0c0d10]">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div>
                <div className="font-mono text-base font-bold text-white">
                  {selectedTool.name}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  Category: <strong className="text-zinc-200">{selectedTool.category}</strong>
                </div>
              </div>
              <Badge variant="mono">
                JSON-RPC 2.0
              </Badge>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Function Signature:
              </div>
              <CodeSnippet code={selectedTool.signature} language="typescript" />
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Description:
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#121318] p-3.5 rounded border border-white/[0.08]">
                {selectedTool.description}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Natural Language Agent Prompt:
              </div>
              <div className="p-3.5 rounded bg-blue-600/10 border border-blue-500/30 text-xs text-blue-200 font-mono">
                {selectedTool.examplePrompt}
              </div>
            </div>
          </div>
        </div>
      </TechnicalFrame>
    </SectionFrame>
  );
}
