import type {
  CableFilterMode,
  CameraPresetMode,
} from '../../state/useRackState.js';

export interface FloatingHudToolbarProps {
  readonly xrayMode: boolean;
  readonly explodeZMm: number;
  readonly cableFilter: CableFilterMode;
  readonly cameraPreset: CameraPresetMode;
  readonly showClearanceBoxes: boolean;
  readonly doorOpen: boolean;
  readonly onToggleXray: (enabled: boolean) => void;
  readonly onChangeExplodeZ: (mm: number) => void;
  readonly onSelectCableFilter: (filter: CableFilterMode) => void;
  readonly onSelectCameraPreset: (preset: CameraPresetMode) => void;
  readonly onToggleClearanceBoxes: (show: boolean) => void;
  readonly onToggleDoorOpen: (open: boolean) => void;
}

const CAMERA_PRESETS: ReadonlyArray<{
  readonly id: CameraPresetMode;
  readonly label: string;
}> = [
  { id: 'isometric', label: 'Isometric' },
  { id: 'front', label: 'Front (Ortho)' },
  { id: 'rear', label: 'Rear (Ortho)' },
  { id: 'side-cutaway', label: 'Side Cutaway' },
  { id: 'top', label: 'Top' },
];

const CABLE_FILTERS: ReadonlyArray<{
  readonly id: CableFilterMode;
  readonly label: string;
}> = [
  { id: 'all', label: 'All' },
  { id: 'network', label: 'Network/Data' },
  { id: 'power', label: 'Power (AC/DC)' },
  { id: 'poe', label: 'PoE Only' },
  { id: 'none', label: 'Hide Cables' },
];

export function FloatingHudToolbar({
  xrayMode,
  explodeZMm,
  cableFilter,
  cameraPreset,
  showClearanceBoxes,
  doorOpen,
  onToggleXray,
  onChangeExplodeZ,
  onSelectCableFilter,
  onSelectCameraPreset,
  onToggleClearanceBoxes,
  onToggleDoorOpen,
}: FloatingHudToolbarProps) {
  return (
    <div
      data-testid="floating-3d-hud"
      style={{
        position: 'absolute',
        top: '14px',
        left: '14px',
        right: '14px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '10px 14px',
        borderRadius: '10px',
        background: 'rgba(15, 23, 42, 0.90)',
        border: '1px solid #334155',
        backdropFilter: 'blur(8px)',
        zIndex: 15,
      }}
    >
      {/* Left: Camera Presets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span
          className="mono"
          style={{
            fontSize: '10.5px',
            fontWeight: 700,
            color: '#94A3B8',
            marginRight: '4px',
          }}
        >
          CAMERA:
        </span>
        {CAMERA_PRESETS.map((preset) => {
          const active = cameraPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              data-testid={`hud-camera-${preset.id}`}
              onClick={() => onSelectCameraPreset(preset.id)}
              style={{
                padding: '4px 9px',
                borderRadius: '5px',
                border: active ? '1px solid #38BDF8' : '1px solid #334155',
                background: active ? '#082F49' : '#1E293B',
                color: active ? '#38BDF8' : '#CBD5E1',
                fontSize: '11px',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Center: Cable Layer Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span
          className="mono"
          style={{
            fontSize: '10.5px',
            fontWeight: 700,
            color: '#94A3B8',
            marginRight: '4px',
          }}
        >
          CABLES:
        </span>
        {CABLE_FILTERS.map((cf) => {
          const active = cableFilter === cf.id;
          return (
            <button
              key={cf.id}
              type="button"
              data-testid={`hud-cable-filter-${cf.id}`}
              onClick={() => onSelectCableFilter(cf.id)}
              style={{
                padding: '4px 9px',
                borderRadius: '5px',
                border: active ? '1px solid #10B981' : '1px solid #334155',
                background: active ? '#064E3B' : '#1E293B',
                color: active ? '#34D399' : '#CBD5E1',
                fontSize: '11px',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {cf.label}
            </button>
          );
        })}
      </div>

      {/* Right: X-Ray, Explode Z Slider, Clearance Boxes & Door Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="button"
          data-testid="hud-toggle-xray"
          onClick={() => onToggleXray(!xrayMode)}
          style={{
            padding: '5px 10px',
            borderRadius: '5px',
            border: xrayMode ? '1px solid #38BDF8' : '1px solid #334155',
            background: xrayMode ? '#0284C7' : '#1E293B',
            color: '#F8FAFC',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {xrayMode ? 'X-Ray Ghost: ON' : 'X-Ray Ghost: OFF'}
        </button>

        <button
          type="button"
          data-testid="hud-toggle-clearance"
          onClick={() => onToggleClearanceBoxes(!showClearanceBoxes)}
          style={{
            padding: '5px 10px',
            borderRadius: '5px',
            border: showClearanceBoxes
              ? '1px solid #F59E0B'
              : '1px solid #334155',
            background: showClearanceBoxes ? '#78350F' : '#1E293B',
            color: showClearanceBoxes ? '#FDE68A' : '#CBD5E1',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {showClearanceBoxes ? 'B_clearance: ON' : 'B_clearance: OFF'}
        </button>

        <button
          type="button"
          data-testid="hud-toggle-door"
          onClick={() => onToggleDoorOpen(!doorOpen)}
          style={{
            padding: '5px 10px',
            borderRadius: '5px',
            border: doorOpen ? '1px solid #38BDF8' : '1px solid #334155',
            background: doorOpen ? '#082F49' : '#1E293B',
            color: '#CBD5E1',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {doorOpen ? 'Glass Door: Open' : 'Glass Door: Closed'}
        </button>

        <label
          className="mono"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: '#E2E8F0',
          }}
        >
          <span>Explode Z: {explodeZMm}mm</span>
          <input
            type="range"
            data-testid="hud-explode-z-slider"
            min={0}
            max={250}
            step={5}
            value={explodeZMm}
            onChange={(e) => onChangeExplodeZ(Number(e.target.value))}
            style={{ width: '96px', accentColor: '#38BDF8' }}
          />
        </label>
      </div>
    </div>
  );
}
