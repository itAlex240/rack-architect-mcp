import {
  HardwareBlueprintSchema,
  normalizeHardwareBlueprint,
  type HardwareBlueprint,
  type HardwareCategory,
  type MountType,
} from '@rack-mcp/core-domain';
import { EMBEDDED_YAML_CATALOG } from './embedded-catalog.js';
import { parseAndValidateBlueprintYaml, validateBlueprintIntegrity } from './catalog-validator.js';

export type FormFactorFilter =
  | MountType
  | '10inch'
  | '19inch'
  | '6inch'
  | '10inch-rackmount'
  | '19inch-rackmount'
  | '6inch-rackmount';

export interface CatalogSearchFilter {
  readonly query?: string | undefined;
  readonly mount_type?: FormFactorFilter | undefined;
  readonly form_factor?: FormFactorFilter | undefined;
  readonly category?: HardwareCategory | undefined;
  readonly max_depth_mm?: number | undefined;
  readonly min_poe_budget_watts?: number | undefined;
  readonly accepted_slot_type?: string | undefined;
}

function normalizeMountFilter(filterValue: FormFactorFilter): MountType {
  switch (filterValue) {
    case '10inch':
    case '10inch-rackmount':
    case 'rackmount-10':
      return 'rackmount-10';
    case '19inch':
    case '19inch-rackmount':
    case 'rackmount-19':
      return 'rackmount-19';
    case '6inch':
    case '6inch-rackmount':
    case 'rackmount-6':
      return 'rackmount-6';
    case 'sub-module':
      return 'sub-module';
    case 'shelf-standing':
      return 'shelf-standing';
  }
}

/**
 * In-memory Hardware Catalog Registry supporting Node.js and Browser environments
 * with pre-expanded `port_groups` matrices and rich filtering.
 */
export class CatalogRegistry {
  private readonly blueprints = new Map<string, HardwareBlueprint>();

  public constructor(
    initialBlueprints?: readonly HardwareBlueprint[],
    prevalidatedMap?: ReadonlyMap<string, HardwareBlueprint>
  ) {
    if (prevalidatedMap !== undefined) {
      for (const [slug, bp] of prevalidatedMap.entries()) {
        this.blueprints.set(slug, bp);
      }
    } else if (initialBlueprints !== undefined) {
      for (const bp of initialBlueprints) {
        this.registerCustomBlueprint(bp);
      }
    } else {
      for (const entry of EMBEDDED_YAML_CATALOG) {
        const res = parseAndValidateBlueprintYaml(entry.rawYaml, entry.relativePath);
        if (!res.valid || res.blueprint === undefined) {
          const msg = res.issues.map((i) => `${i.code}: ${i.message}`).join('; ');
          throw new Error(`Invalid built-in catalog blueprint '${entry.relativePath}': ${msg}`);
        }
        this.blueprints.set(res.blueprint.slug, res.blueprint);
      }
    }
  }

  /**
   * Creates an O(N) isolated shallow clone of this pre-validated catalog registry
   * without re-parsing embedded YAML files on session initialization.
   */
  public clone(): CatalogRegistry {
    return new CatalogRegistry(undefined, this.blueprints);
  }

  /**
   * Returns all blueprints in the catalog with `port_groups` already expanded into flat `ports`.
   */
  public getAllBlueprints(): HardwareBlueprint[] {
    return [...this.blueprints.values()];
  }

  /**
   * Looks up a single hardware blueprint by its canonical slug.
   */
  public getBlueprintBySlug(slug: string): HardwareBlueprint | undefined {
    return this.blueprints.get(slug);
  }

  /**
   * Validates, expands `port_groups`, and registers a custom or user-defined blueprint.
   */
  public registerCustomBlueprint(blueprint: HardwareBlueprint): void {
    const parsed = HardwareBlueprintSchema.parse(blueprint);
    const integrity = validateBlueprintIntegrity(parsed, parsed.slug);
    if (!integrity.valid || integrity.blueprint === undefined) {
      const msg = integrity.issues.map((i) => `${i.code}: ${i.message}`).join('; ');
      throw new Error(`Cannot register invalid blueprint '${parsed.slug}': ${msg}`);
    }
    this.blueprints.set(integrity.blueprint.slug, normalizeHardwareBlueprint(integrity.blueprint));
  }

  /**
   * Searches the catalog by full-text query, form factor / mount_type, category,
   * maximum depth, minimum PoE budget, and slot compatibility.
   */
  public searchCatalog(filter: CatalogSearchFilter = {}): HardwareBlueprint[] {
    const normalizedQuery = filter.query?.trim().toLowerCase();
    const mountTypeTarget =
      filter.mount_type !== undefined
        ? normalizeMountFilter(filter.mount_type)
        : filter.form_factor !== undefined
          ? normalizeMountFilter(filter.form_factor)
          : undefined;

    return this.getAllBlueprints().filter((bp) => {
      if (normalizedQuery !== undefined && normalizedQuery.length > 0) {
        const haystack =
          `${bp.slug} ${bp.manufacturer} ${bp.model} ${bp.category}`.toLowerCase();
        const terms = normalizedQuery.split(/\s+/);
        if (!terms.every((term) => haystack.includes(term))) {
          return false;
        }
      }

      if (mountTypeTarget !== undefined && bp.mount_type !== mountTypeTarget) {
        return false;
      }

      if (filter.category !== undefined && bp.category !== filter.category) {
        return false;
      }

      if (
        filter.max_depth_mm !== undefined &&
        bp.geometry.depth_mm > filter.max_depth_mm
      ) {
        return false;
      }

      if (filter.min_poe_budget_watts !== undefined) {
        const poeBudget = bp.power_and_thermal.poe_budget_watts ?? 0;
        if (poeBudget < filter.min_poe_budget_watts) {
          return false;
        }
      }

      if (filter.accepted_slot_type !== undefined) {
        const matchesSubModuleSlot = bp.slot_compatibility === filter.accepted_slot_type;
        const matchesCarrierSlot = bp.slots.some(
          (slot) => slot.accepted_slot_type === filter.accepted_slot_type,
        );
        if (!matchesSubModuleSlot && !matchesCarrierSlot) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Returns a slug-indexed dictionary suitable for passing directly to
   * `computeRackScene(project, catalog.toRecord())` or `validateRackProject`.
   */
  public toRecord(): Record<string, HardwareBlueprint> {
    const record: Record<string, HardwareBlueprint> = {};
    for (const [slug, bp] of this.blueprints.entries()) {
      record[slug] = bp;
    }
    return record;
  }
}

export const defaultCatalogRegistry = new CatalogRegistry();

export function getAllBlueprints(): HardwareBlueprint[] {
  return defaultCatalogRegistry.getAllBlueprints();
}

export function getBlueprintBySlug(slug: string): HardwareBlueprint | undefined {
  return defaultCatalogRegistry.getBlueprintBySlug(slug);
}

export function registerCustomBlueprint(blueprint: HardwareBlueprint): void {
  defaultCatalogRegistry.registerCustomBlueprint(blueprint);
}

export function searchCatalog(filter?: CatalogSearchFilter): HardwareBlueprint[] {
  return defaultCatalogRegistry.searchCatalog(filter);
}
