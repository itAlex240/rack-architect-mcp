import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import {
  MCP_TOOL_DEFINITIONS,
  RACK_MCP_SERVER_NAME
} from '@rack-mcp/core-domain';
import { generateBomMarkdown } from '@rack-mcp/exporters';
import { generateAsciiElevation } from '../ascii-elevation.js';
import type { ProjectStateManager } from '../state-manager.js';
import {
  RackMcpToolHandlers,
  type ToolExecutionEnvelope
} from './tool-handlers.js';

function toCallToolResult(envelope: ToolExecutionEnvelope): CallToolResult {
  return {
    isError: false,
    content: [
      {
        type: 'text',
        text: JSON.stringify(envelope, null, 2)
      }
    ]
  };
}

export interface RackMcpServerInstance {
  readonly mcpServer: McpServer;
  readonly handlers: RackMcpToolHandlers;
  readonly stateManager: ProjectStateManager;
  connectStdio(): Promise<StdioServerTransport>;
  close(): Promise<void>;
}

/**
 * Creates and wires the official MCP server (`rack_architect_mcp`) with all 11 tools,
 * 4 resources, and 5 guided planning prompts.
 */
export function createRackMcpServer(
  stateManager: ProjectStateManager
): RackMcpServerInstance {
  const handlers = new RackMcpToolHandlers(stateManager);

  const mcpServer = new McpServer(
    {
      name: RACK_MCP_SERVER_NAME,
      version: '0.2.0'
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {}
      }
    }
  );

  // ---------------------------------------------------------------------------
  // 1. Register Canonical 11 MCP Tools from MCP_TOOL_DEFINITIONS
  // ---------------------------------------------------------------------------
  const tools = MCP_TOOL_DEFINITIONS;

  mcpServer.registerTool(
    tools.search_catalog.name,
    {
      description: tools.search_catalog.description,
      inputSchema: tools.search_catalog.inputSchema.shape,
      annotations: {
        readOnlyHint: tools.search_catalog.annotations.readOnlyHint
      }
    },
    async (args) => toCallToolResult(handlers.searchCatalog(args))
  );

  mcpServer.registerTool(
    tools.get_device_blueprint.name,
    {
      description: tools.get_device_blueprint.description,
      inputSchema: tools.get_device_blueprint.inputSchema.shape,
      annotations: {
        readOnlyHint: tools.get_device_blueprint.annotations.readOnlyHint
      }
    },
    async (args) => toCallToolResult(handlers.getDeviceBlueprint(args))
  );

  mcpServer.registerTool(
    tools.define_custom_blueprint.name,
    {
      description: tools.define_custom_blueprint.description,
      inputSchema: tools.define_custom_blueprint.inputSchema.shape,
      annotations: {
        readOnlyHint: tools.define_custom_blueprint.annotations.readOnlyHint
      }
    },
    async (args) => toCallToolResult(handlers.defineCustomBlueprint(args))
  );

  mcpServer.registerTool(
    tools.init_rack.name,
    {
      description: tools.init_rack.description,
      inputSchema: tools.init_rack.inputSchema.shape,
      annotations: {
        readOnlyHint: tools.init_rack.annotations.readOnlyHint,
        destructiveHint: Boolean(tools.init_rack.annotations.consequentialHint)
      }
    },
    async (args) => toCallToolResult(handlers.initRack(args))
  );

  mcpServer.registerTool(
    tools.mount_equipment.name,
    {
      description: tools.mount_equipment.description,
      inputSchema: tools.mount_equipment.inputSchema.shape,
      annotations: {
        readOnlyHint: tools.mount_equipment.annotations.readOnlyHint
      }
    },
    async (args) => toCallToolResult(handlers.mountEquipment(args))
  );

  mcpServer.registerTool(
    tools.modify_equipment.name,
    {
      description: tools.modify_equipment.description,
      inputSchema: tools.modify_equipment.inputSchema.shape,
      annotations: {
        readOnlyHint: tools.modify_equipment.annotations.readOnlyHint
      }
    },
    async (args) => toCallToolResult(handlers.modifyEquipment(args))
  );

  mcpServer.registerTool(
    tools.connect_cables.name,
    {
      description: tools.connect_cables.description,
      inputSchema: tools.connect_cables.inputSchema.shape,
      annotations: {
        readOnlyHint: tools.connect_cables.annotations.readOnlyHint
      }
    },
    async (args) => toCallToolResult(handlers.connectCables(args))
  );

  mcpServer.registerTool(
    tools.disconnect_cables.name,
    {
      description: tools.disconnect_cables.description,
      inputSchema: tools.disconnect_cables.inputSchema.shape,
      annotations: {
        readOnlyHint: tools.disconnect_cables.annotations.readOnlyHint
      }
    },
    async (args) => toCallToolResult(handlers.disconnectCables(args))
  );

  mcpServer.registerTool(
    tools.validate_rack.name,
    {
      description: tools.validate_rack.description,
      inputSchema: tools.validate_rack.inputSchema.shape,
      annotations: {
        readOnlyHint: tools.validate_rack.annotations.readOnlyHint
      }
    },
    async (args) => toCallToolResult(handlers.validateRack(args))
  );

  mcpServer.registerTool(
    tools.export_deliverables.name,
    {
      description: tools.export_deliverables.description,
      inputSchema: tools.export_deliverables.inputSchema.shape,
      annotations: {
        readOnlyHint: tools.export_deliverables.annotations.readOnlyHint
      }
    },
    async (args) => toCallToolResult(handlers.exportDeliverables(args))
  );

  mcpServer.registerTool(
    tools.undo_redo.name,
    {
      description: tools.undo_redo.description,
      inputSchema: tools.undo_redo.inputSchema.shape,
      annotations: {
        readOnlyHint: tools.undo_redo.annotations.readOnlyHint
      }
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
                'Follow these mandatory steps:',
                '1. Call `search_catalog` to discover compatible switches, routers, modular 3D-printed carriers, sub-modules, patch panels, and PDUs/UPS units.',
                '2. Call `init_rack` with the chosen standard, u_height, and rail_depth_mm.',
                '3. Mount heavy UPS/PDU hardware on U1/U2 (`mount_equipment`), modular carriers + compute sub-modules in the middle U slots, and patch panels/switches near the top.',
                '4. Inspect exact port IDs with `get_device_blueprint` and wire all power and data links using `connect_cables` (include a brush-panel if any cable crosses front-to-rear).',
                '5. Call `validate_rack` and follow every `remediation_suggestions` entry until 0 Errors remain.',
                '6. Call `export_deliverables` to generate `elevation.svg`, `wiring-schematic.svg`, `BOM.md`, and `rack-scene.glb`.'
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
                '1. Call `search_catalog({ form_factor: "19inch" })` to inspect available 19-inch gateways (`ubiquiti-udm-pro-max`, `mikrotik-ccr2004-16g-2s-plus`), switches (`ubiquiti-usw-pro-max-24-poe`, `mikrotik-crs326-24g-2s-plus-rm`), storage/NVR (`ubiquiti-unvr-pro`, `synology-rs822-plus`), and UPS/PDU units (`apc-smart-ups-1500va-2u`, `brennenstuhl-19inch-pdu-8way-c13`).',
                `2. Initialize the rack via \`init_rack({ project_name: "Enterprise 19-Inch Core Rack", standard: "19inch", u_height: ${uHeight}, rail_depth_mm: ${railDepth}, enclosure_type: "closed-mesh-doors" })\`.`,
                '3. Mount the heavy 2U UPS at U1 (`apc-smart-ups-1500va-2u`) and rear PDU so Center of Gravity stays below 50%.',
                '4. Mount NAS/NVR storage, core switches, brush panel, and 24-port keystone patch panel near the top.',
                '5. Wire 10G SFP+ DAC uplinks (`sfp-plus-dac`), Cat6A links, and IEC C13-C14 power cables (`connect_cables`), then validate (`validate_rack`) for 0 Errors.'
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
