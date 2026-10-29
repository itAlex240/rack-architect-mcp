import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import {
  MCP_TOOL_DEFINITIONS,
  RACK_MCP_SERVER_INSTRUCTIONS,
  RACK_MCP_SERVER_NAME,
  type McpToolAnnotations
} from '@rack-mcp/core-domain';
import { generateBomMarkdown } from '@rack-mcp/exporters';
import { generateAsciiElevation } from '../ascii-elevation.js';
import type { ProjectStateManager } from '../state-manager.js';
import {
  RackMcpToolHandlers,
  type RemoteToolSessionContext,
  type ToolExecutionEnvelope
} from './tool-handlers.js';

function toCallToolResult(envelope: ToolExecutionEnvelope): CallToolResult {
  return {
    isError: false,
    structuredContent: envelope as unknown as Record<string, unknown>,
    content: [
      {
        type: 'text',
        text: JSON.stringify(envelope, null, 2)
      }
    ]
  };
}

function toMcpAnnotations(title: string, annotations: McpToolAnnotations) {
  return {
    title,
    readOnlyHint: annotations.readOnlyHint,
    destructiveHint: Boolean(
      annotations.destructiveHint ?? annotations.consequentialHint ?? false
    ),
    idempotentHint: Boolean(annotations.idempotentHint ?? false),
    openWorldHint: Boolean(annotations.openWorldHint ?? false)
  };
}

export interface RackMcpServerInstance {
  readonly mcpServer: McpServer;
  readonly handlers: RackMcpToolHandlers;
  readonly stateManager: ProjectStateManager;
  connectStdio(): Promise<StdioServerTransport>;
  close(): Promise<void>;
}

export const RACK_MCP_SERVER_VERSION = '0.6.2';

export interface CreateRackMcpServerOptions {
  readonly remoteSession?: RemoteToolSessionContext | undefined;
}

/**
 * Creates and wires the official MCP server (`rack_architect_mcp`) with all 12 tools,
 * 4 resources, and 5 guided planning prompts.
 */
export function createRackMcpServer(
  stateManager: ProjectStateManager,
  options: CreateRackMcpServerOptions = {}
): RackMcpServerInstance {
  const handlers = new RackMcpToolHandlers(stateManager, options.remoteSession);

  const mcpServer = new McpServer(
    {
      name: RACK_MCP_SERVER_NAME,
      version: RACK_MCP_SERVER_VERSION
    },
    {
      instructions: RACK_MCP_SERVER_INSTRUCTIONS,
      capabilities: {
        tools: {},
        resources: {},
        prompts: {}
      }
    }
  );

  // ---------------------------------------------------------------------------
  // 1. Register Canonical 12 MCP Tools from MCP_TOOL_DEFINITIONS
  // ---------------------------------------------------------------------------
  const tools = MCP_TOOL_DEFINITIONS;

  mcpServer.registerTool(
    tools.search_catalog.name,
    {
      title: tools.search_catalog.title,
      description: tools.search_catalog.description,
      inputSchema: tools.search_catalog.inputSchema.shape,
      outputSchema: tools.search_catalog.outputSchema.shape,
      annotations: toMcpAnnotations(
        tools.search_catalog.title,
        tools.search_catalog.annotations
      )
    },
    async (args) => toCallToolResult(handlers.searchCatalog(args))
  );

  mcpServer.registerTool(
    tools.get_device_blueprint.name,
    {
      title: tools.get_device_blueprint.title,
      description: tools.get_device_blueprint.description,
      inputSchema: tools.get_device_blueprint.inputSchema.shape,
      outputSchema: tools.get_device_blueprint.outputSchema.shape,
      annotations: toMcpAnnotations(
        tools.get_device_blueprint.title,
        tools.get_device_blueprint.annotations
      )
    },
    async (args) => toCallToolResult(handlers.getDeviceBlueprint(args))
  );

  mcpServer.registerTool(
    tools.define_custom_blueprint.name,
    {
      title: tools.define_custom_blueprint.title,
      description: tools.define_custom_blueprint.description,
      inputSchema: tools.define_custom_blueprint.inputSchema.shape,
      outputSchema: tools.define_custom_blueprint.outputSchema.shape,
      annotations: toMcpAnnotations(
        tools.define_custom_blueprint.title,
        tools.define_custom_blueprint.annotations
      )
    },
    async (args) => toCallToolResult(handlers.defineCustomBlueprint(args))
  );

  mcpServer.registerTool(
    tools.init_rack.name,
    {
      title: tools.init_rack.title,
      description: tools.init_rack.description,
      inputSchema: tools.init_rack.inputSchema.shape,
      outputSchema: tools.init_rack.outputSchema.shape,
      annotations: toMcpAnnotations(
        tools.init_rack.title,
        tools.init_rack.annotations
      )
    },
    async (args) => toCallToolResult(handlers.initRack(args))
  );

  mcpServer.registerTool(
    tools.mount_equipment.name,
    {
      title: tools.mount_equipment.title,
      description: tools.mount_equipment.description,
      inputSchema: tools.mount_equipment.inputSchema.shape,
      outputSchema: tools.mount_equipment.outputSchema.shape,
      annotations: toMcpAnnotations(
        tools.mount_equipment.title,
        tools.mount_equipment.annotations
      )
    },
    async (args) => toCallToolResult(handlers.mountEquipment(args))
  );

  mcpServer.registerTool(
    tools.modify_equipment.name,
    {
      title: tools.modify_equipment.title,
      description: tools.modify_equipment.description,
      inputSchema: tools.modify_equipment.inputSchema.shape,
      outputSchema: tools.modify_equipment.outputSchema.shape,
      annotations: toMcpAnnotations(
        tools.modify_equipment.title,
        tools.modify_equipment.annotations
      )
    },
    async (args) => toCallToolResult(handlers.modifyEquipment(args))
  );

  mcpServer.registerTool(
    tools.connect_cables.name,
    {
      title: tools.connect_cables.title,
      description: tools.connect_cables.description,
      inputSchema: tools.connect_cables.inputSchema.shape,
      outputSchema: tools.connect_cables.outputSchema.shape,
      annotations: toMcpAnnotations(
        tools.connect_cables.title,
        tools.connect_cables.annotations
      )
    },
    async (args) => toCallToolResult(handlers.connectCables(args))
  );

  mcpServer.registerTool(
    tools.disconnect_cables.name,
    {
      title: tools.disconnect_cables.title,
      description: tools.disconnect_cables.description,
      inputSchema: tools.disconnect_cables.inputSchema.shape,
      outputSchema: tools.disconnect_cables.outputSchema.shape,
      annotations: toMcpAnnotations(
        tools.disconnect_cables.title,
        tools.disconnect_cables.annotations
      )
    },
    async (args) => toCallToolResult(handlers.disconnectCables(args))
  );

  mcpServer.registerTool(
    tools.plan_external_endpoints.name,
    {
      title: tools.plan_external_endpoints.title,
      description: tools.plan_external_endpoints.description,
      inputSchema: tools.plan_external_endpoints.inputSchema.shape,
      outputSchema: tools.plan_external_endpoints.outputSchema.shape,
      annotations: toMcpAnnotations(
        tools.plan_external_endpoints.title,
        tools.plan_external_endpoints.annotations
      )
    },
    async (args) => toCallToolResult(handlers.planExternalEndpoints(args))
  );

  mcpServer.registerTool(
    tools.validate_rack.name,
    {
      title: tools.validate_rack.title,
      description: tools.validate_rack.description,
      inputSchema: tools.validate_rack.inputSchema.shape,
      outputSchema: tools.validate_rack.outputSchema.shape,
      annotations: toMcpAnnotations(
        tools.validate_rack.title,
        tools.validate_rack.annotations
      )
    },
    async (args) => toCallToolResult(handlers.validateRack(args))
  );

  mcpServer.registerTool(
    tools.export_deliverables.name,
    {
      title: tools.export_deliverables.title,
      description: tools.export_deliverables.description,
      inputSchema: tools.export_deliverables.inputSchema.shape,
      outputSchema: tools.export_deliverables.outputSchema.shape,
      annotations: toMcpAnnotations(
        tools.export_deliverables.title,
        tools.export_deliverables.annotations
      )
    },
    async (args) => toCallToolResult(handlers.exportDeliverables(args))
  );

  mcpServer.registerTool(
    tools.undo_redo.name,
    {
      title: tools.undo_redo.title,
      description: tools.undo_redo.description,
      inputSchema: tools.undo_redo.inputSchema.shape,
      outputSchema: tools.undo_redo.outputSchema.shape,
      annotations: toMcpAnnotations(
        tools.undo_redo.title,
        tools.undo_redo.annotations
      )
    },
    async (args) => toCallToolResult(handlers.undoRedo(args))
  );

  // ---------------------------------------------------------------------------
  // 2. Register 4 MCP Resources
  // ---------------------------------------------------------------------------
  mcpServer.registerResource(
    'Current Rack Summary & ASCII Elevation',
    'rack://current/summary',
    {
      description:
        'Compact ASCII Front/Rear Elevation Plan, Power/PoE utilization, and validation summary of the active rack.',
      mimeType: 'text/plain'
    },
    async (uri) => {
      const text = generateAsciiElevation(
        stateManager.getScene(),
        stateManager.getCatalog()
      );
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'text/plain',
            text
          }
        ]
      };
    }
  );

  mcpServer.registerResource(
    'Current Bill of Materials (BOM)',
    'rack://current/bom',
    {
      description:
        'Live Markdown Bill of Materials including hardware, 3D-printable carriers, commercial cable SKU bins, and power budget.',
      mimeType: 'text/markdown'
    },
    async (uri) => {
      const md = generateBomMarkdown(
        stateManager.getScene(),
        stateManager.getCatalog().toRecord()
      );
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'text/markdown',
            text: md
          }
        ]
      };
    }
  );

  mcpServer.registerResource(
    'Current Validation Diagnostics Report',
    'rack://current/diagnostics',
    {
      description:
        'Structured JSON ValidationResult containing all ERROR, WARNING, and INFO issues with remediation_suggestions.',
      mimeType: 'application/json'
    },
    async (uri) => {
      const validation = stateManager.getScene().validation;
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(validation, null, 2)
          }
        ]
      };
    }
  );

  mcpServer.registerResource(
    'Current Declarative rack.yaml Source',
    'rack://current/yaml',
    {
      description: 'Raw declarative YAML source of the active RackProject.',
      mimeType: 'application/yaml'
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/yaml',
            text: stateManager.getProjectYaml()
          }
        ]
      };
    }
  );

  // ---------------------------------------------------------------------------
  // 3. Register 5 Guided MCP Prompts
  // ---------------------------------------------------------------------------
  mcpServer.registerPrompt(
    'plan-homelab-from-scratch',
    {
      title: 'Plan Homelab Rack from Scratch',
      description:
        'Guided step-by-step workflow to design, wire, and validate a 10-inch or 19-inch rack without guessing geometry.',
      argsSchema: {
        standard: z
          .enum(['10inch', '19inch', '6inch'])
          .optional()
          .describe('Target rack standard (default: 10inch).'),
        u_height: z
          .string()
          .optional()
          .describe('Target rack height in U (e.g. "8" or "12").'),
        requirements: z
          .string()
          .optional()
          .describe('Summary of required networking, compute, and power goals.')
      }
    },
    async (args) => {
      const std = args.standard ?? '10inch';
      const uHeight = args.u_height ?? '8';
      const reqs =
        args.requirements ??
        'Build a balanced homelab with UPS/PDU at the bottom, compute nodes in the middle, and patch panel/switch at the top.';
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Plan a complete ${std} rack (${uHeight}U) for the following requirements: ${reqs}`,
                '',
                'Collaboration Rule (User Sovereignty vs. Consultative Architecture):',
                '- If the user specified exact devices or U-positions, respect their wishes 100% without overriding them (only remediate hard physical/electrical validation errors).',
                '- If the user only gave a rough idea or use case, select a proven reference architecture (e.g. 8U 10" Silent Smart-Home/Media NAS Rack, 8U 10" Proxmox 2.5G HA Cluster, or 10U-12U 19" Smart-Building/Enterprise PoE Rack) and explain the role of each device.',
                '',
                'Follow these mandatory TIA-942 & Homelab steps:',
                '1. Call `search_catalog` to discover compatible switches, routers, modular 3D-printed carriers, sub-modules, patch panels, and PDUs/UPS units.',
                '2. Call `init_rack` with the chosen standard, u_height, and rail_depth_mm.',
                '3. Follow the 5-Zone Bottom-to-Top Elevation Blueprint: Zone 1 (U1-U2 front) heavy UPS (`CoG < 50%`); Zone 2 (U1-U2 rear) PDU; Zone 3 (U3-U5) 2U NAS & 3D-printed Mini-PC/RPi5 carriers; Zone 4 (middle U6) a SINGLE 1U brush panel + core gateway/firewall; Zone 5 (top U_max-1 & U_max) main PoE switch directly below the keystone patch panel.',
                '4. Inspect exact port IDs with `get_device_blueprint`. Route rear Mini-PC/Gateway RJ45 cables in the rear (`rear -> rear`) up to the rear of the Patch Panel (`p1..p6`), and connect Patch Panel front ports `pN` 1:1 vertically (`p1 -> eth1`, `p2 -> eth2`) to the adjacent switch. Use `plan_external_endpoints` for all external building drops (cameras, APs, rooms).',
                '5. Call `validate_rack` and follow every `remediation_suggestions` entry until 0 Errors remain.',
                '6. Call `export_deliverables` to generate `elevation.svg`, `wiring-schematic.svg`, `BOM.md`, `rack-scene.glb`, and `.scad`/`.stl` 3D-print files.'
              ].join('\n')
            }
          }
        ]
      };
    }
  );

  mcpServer.registerPrompt(
    'optimize-and-fix-rack',
    {
      title: 'Optimize and Fix Existing Rack',
      description:
        'Analyze all mechanical, depth-clearance, thermal, and PoE/power issues in the active rack and resolve them autonomously.',
      argsSchema: {
        focus: z
          .string()
          .optional()
          .describe('Optional optimization focus (e.g. "depth collisions", "poe budget", "center of gravity").')
      }
    },
    async (args) => {
      const scene = stateManager.getScene();
      const ascii = generateAsciiElevation(scene, stateManager.getCatalog());
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Analyze and fix the active rack project '${scene.project.project_name}'${args.focus !== undefined ? ` (Focus: ${args.focus})` : ''}.`,
                '',
                'Current Rack State & Diagnostics:',
                '```text',
                ascii,
                '```',
                '',
                'Instructions:',
                '1. Address all ERROR issues first by applying their `remediation_suggestions` via `modify_equipment`, `mount_equipment`, or `disconnect_cables` / `connect_cables`.',
                '2. Address WARNING issues (such as missing power connections, missing brush-panel for front-to-rear cables, or high Center of Gravity).',
                '3. Run `validate_rack` to verify that the rack achieves 0 Errors.'
              ].join('\n')
            }
          }
        ]
      };
    }
  );

  mcpServer.registerPrompt(
    'design-19inch-enterprise-rack',
    {
      title: 'Design 19-Inch Enterprise / Edge Rack',
      description:
        'Plan a 19-inch EIA-310 enterprise or prosumer rack with 10G/25G SFP28 switching, firewall/gateway, NVR/NAS storage, and redundant UPS/PDU power.',
      argsSchema: {
        u_height: z
          .string()
          .optional()
          .describe('Target rack height in U (default: "12").'),
        rail_depth_mm: z
          .string()
          .optional()
          .describe('Rail depth in millimeters (default: "450").')
      }
    },
    async (args) => {
      const uHeight = args.u_height ?? '12';
      const railDepth = args.rail_depth_mm ?? '450';
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Design a 19-inch Enterprise / Prosumer Rack (${uHeight}U, ${railDepth}mm depth) using RackArchitect MCP:`,
                '1. Respect any explicit user hardware or U-slot requests 100%. For open/consultative requests, apply the ANSI/TIA-942 5-Zone Elevation Standard.',
                '2. Call `search_catalog({ form_factor: "19inch" })` to inspect available 19-inch gateways (`ubiquiti-udm-pro`), switches (`ubiquiti-usw-pro-max-24-poe`, `ubiquiti-usw-aggregation`), storage (`ubiquiti-unas-pro-2u`), carriers (`3dprint-19inch-triple-mini-pc-carrier`), and UPS units (`apc-smart-ups-1500-2u`).',
                `3. Initialize the rack via \`init_rack({ project_name: "Enterprise 19-Inch Core Rack", standard: "19inch", u_height: ${uHeight}, rail_depth_mm: ${railDepth}, enclosure_type: "closed-vented-front" })\`.`,
                '4. Mount the heavy 2U UPS at U1-U2 (`CoG < 50%`), 2U NAS at U3-U4, compute carriers at U5, a single central 1U brush panel at U6 (leaving U7 free for thermal headroom), Firewall/UDM-Pro/Aggregation at U8-U10, the 24-Port PoE++ Switch at U11, and the 24-Port Patch Panel at the top (`U12`).',
                '5. If the user specifies external building or room drops (PoE cameras, Wi-Fi APs, office PCs, projectors, laptops, docking stations), call `plan_external_endpoints` to terminate them on the REAR of the patch panel (`U12`) and auto-create 1:1 vertically aligned (`pN -> ethN`) front patch cables to the switch (`U11`) — never waste a rack unit (`U`) on external room devices.',
                '6. Wire 10G SFP+ DAC uplinks (`sfp-plus-dac`), Cat6A links (with VLAN IDs: 10 Trusted, 20 Wi-Fi, 30 Cameras, 40 IoT/Door, 50 Storage), and IEC C13-C14 power cables (`connect_cables`), then validate (`validate_rack`) for 0 Errors.'
              ].join('\n')
            }
          }
        ]
      };
    }
  );

  mcpServer.registerPrompt(
    'design-3d-printed-carrier-bay',
    {
      title: 'Design 3D-Printable Modular Carrier & Sub-Modules',
      description:
        'Configure a 1U modular 3D-printed carrier shelf (TinyMiniMicro, Dual Mini-PC, RPi5, or JetKVM) and export parametric OpenSCAD (.scad) and watertight STL (.stl) files.',
      argsSchema: {
        carrier_type: z
          .string()
          .optional()
          .describe('Target sub-module family (e.g. "Lenovo M920q", "Minisforum MS-01", "Raspberry Pi 5", "JetKVM").')
      }
    },
    async (args) => {
      const target = args.carrier_type ?? 'TinyMiniMicro / Mini-PC / RPi5 + Keystone';
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Design and export a 3D-printable modular 1U carrier bay for: ${target}.`,
                '1. Call `search_catalog({ mount_type: "modular-carrier" })` and `search_catalog({ mount_type: "sub-module" })` to inspect available carriers (`3dprint-10inch-lenovo-tiny-plus-2keystone`, `3dprint-10inch-dual-minipc-carrier`, `3dprint-10inch-dual-rpi5-plus-4keystone`, `3dprint-10inch-jetkvm-plus-3keystone`) and sub-modules.',
                '2. Mount the chosen modular carrier onto a free rack unit (`mount_equipment`) and populate its `slots` (`parent_carrier_id` + `slot_id`) with compatible sub-modules and RJ45 keystones.',
                '3. Call `validate_rack` to confirm slot dimensions and depth clearances (`SLOT_INCOMPATIBLE` = 0).',
                '4. Call `export_deliverables({ formats: ["carrier-scad", "carrier-stl", "elevation-svg", "bom-md"] })` to generate print-ready `.scad` and binary/ASCII `.stl` files.'
              ].join('\n')
            }
          }
        ]
      };
    }
  );

  mcpServer.registerPrompt(
    'audit-poe-and-thermals',
    {
      title: 'Audit PoE Budget, Power Chain & Airflow',
      description:
        'Perform a complete electrical DAG, PoE+/PoE++ budget, UPS capacity, and front-to-rear thermal airflow audit on the active rack.',
      argsSchema: {}
    },
    async () => {
      const scene = stateManager.getScene();
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Perform a comprehensive Power, PoE, and Thermal Audit on '${scene.project.project_name}':`,
                '1. Call `validate_rack` and inspect `validation.power_summary` (total_system_watts, total_poe_watts, pse_budgets, ups_capacities, unpowered_devices) and `validation.issues`.',
                '2. Verify every consumer device has either an AC/DC power cable (`power-schuko-c13`, `power-schuko-c13-angled`, `power-c13-c14`, `usb-c-pd`) or an active PoE link (`poe-in-af`/`at`/`bt` connected to a PSE port with sufficient budget).',
                '3. Check for `THERMAL_AIRFLOW_CONFLICT` (opposing front-to-rear and rear-to-front fans on adjacent U slots) or `THERMAL_PASSIVE_ENCLOSED_WARNING`.',
                '4. Remediate any power/PoE/thermal findings and provide a concise engineering summary table.'
              ].join('\n')
            }
          }
        ]
      };
    }
  );

  return {
    mcpServer,
    handlers,
    stateManager,
    async connectStdio(): Promise<StdioServerTransport> {
      const transport = new StdioServerTransport();
      await mcpServer.connect(transport);
      return transport;
    },
    async close(): Promise<void> {
      await mcpServer.close();
    }
  };
}
