import {
  deserializeRackScene,
  evaluateRackScene,
  serializeRackScene,
  type HardwareBlueprint,
  type RackProjectInput,
  type RackStandard,
  type SerializedRackScene,
} from '@rack-mcp/core-domain';
import {
  create10InchHomelabProjectInput,
  generateBomMarkdown,
  generateCableLabelsCsv,
  generateCableLabelsSvg,
  generateCarrierOpenScad,
  generateCarrierStl,
  generateCustomBracketOpenScad,
  generateCustomBracketStl,
  generateCustomCoverPanelOpenScad,
  generateCustomCoverPanelStl,
  generateElevationSvg,
  generateWiringSchematicSvg,
  renderCustomBracketPreviewSvg,
  renderCustomCoverPanelPreviewSvg,
  sanitizeCoverPanelLabel,
  validateCustomBracketOptions,
  type BomMarkdownOptions,
  type CableLabelsSvgOptions,
  type CoverPanelPatternType,
  type CoverPanelUHeight,
  type CustomBracketOptions,
  type CustomBracketValidation,
  type CustomCoverPanelOptions,
} from '@rack-mcp/exporters';
import { defaultCatalogRegistry } from '@rack-mcp/hardware-catalog';

export type {
  BomMarkdownOptions,
  CableLabelsSvgOptions,
  CoverPanelPatternType,
  CoverPanelUHeight,
  CustomBracketOptions,
  CustomBracketValidation,
  CustomCoverPanelOptions,
};

export {
  generateCustomBracketOpenScad,
  generateCustomBracketStl,
  generateCustomCoverPanelOpenScad as generateClientCustomCoverPanelOpenScad,
  generateCustomCoverPanelStl as generateClientCustomCoverPanelStl,
  renderCustomBracketPreviewSvg,
  renderCustomCoverPanelPreviewSvg as renderClientCustomCoverPanelPreviewSvg,
  sanitizeCoverPanelLabel as sanitizeClientCoverPanelLabel,
  validateCustomBracketOptions,
};

/**
 * Returns the canonical 8U 10-Inch Homelab reference `RackProjectInput` for Standalone / Demo mode.
 */
export function createStandaloneHomelabProjectInput(): RackProjectInput {
  return create10InchHomelabProjectInput();
}

/**
 * Evaluates and serializes a `RackProjectInput` using `@rack-mcp/core-domain` and `@rack-mcp/hardware-catalog`.
 */
export function evaluateStandaloneScene(
  projectInput: RackProjectInput = createStandaloneHomelabProjectInput(),
  catalogRecord: Readonly<Record<string, HardwareBlueprint>> = defaultCatalogRegistry.toRecord(),
): SerializedRackScene {
  const computed = evaluateRackScene(projectInput, catalogRecord);
  return serializeRackScene(computed);
}

/**
 * Renders the canonical 2D Elevation & Side-Profile Cutaway SVG via `@rack-mcp/exporters`.
 */
export function renderClientSideElevationSvg(scene: SerializedRackScene): string {
  return generateElevationSvg(deserializeRackScene(scene));
}

/**
 * Renders the canonical 2D Hierarchical Power/PoE DAG & Multi-Track Wiring SVG via `@rack-mcp/exporters`.
 */
export function renderClientSideWiringSvg(scene: SerializedRackScene): string {
  return generateWiringSchematicSvg(deserializeRackScene(scene));
}

/**
 * Renders the canonical 5-section BOM & Assembly Guide Markdown via `@rack-mcp/exporters`.
 */
export function renderClientSideBomMarkdown(
  scene: SerializedRackScene,
  options?: BomMarkdownOptions,
): string {
  return generateBomMarkdown(deserializeRackScene(scene), undefined, options);
}

/**
 * Renders the RFC-4180 cable-label CSV (`labels.csv`) via `@rack-mcp/exporters`.
 */
export function renderClientSideLabelsCsv(scene: SerializedRackScene): string {
  return generateCableLabelsCsv(deserializeRackScene(scene));
}

/**
 * Renders the vector wrap-around cable-label sheet SVG (`labels.svg`) via `@rack-mcp/exporters`.
 */
export function renderClientSideLabelsSvg(
  scene: SerializedRackScene,
  options?: CableLabelsSvgOptions,
): string {
  return generateCableLabelsSvg(deserializeRackScene(scene), options);
}

/**
 * Generates a parametric OpenSCAD (`.scad`) script for a rack carrier or cover panel.
 */
export function generateClientSideCarrierOpenScad(
  blueprint: HardwareBlueprint,
  rackStandard?: RackStandard,
): string {
  return generateCarrierOpenScad(blueprint, rackStandard);
}

/**
 * Generates a watertight 2-manifold ASCII `.stl` mesh for a rack carrier or cover panel.
 */
export function generateClientSideCarrierStl(
  blueprint: HardwareBlueprint,
  rackStandard?: RackStandard,
): string {
  return generateCarrierStl(blueprint, rackStandard);
}
