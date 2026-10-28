import type {
  CableFilterMode,
  CameraPresetMode,
} from '../../state/useRackState.js';
import { EyeXrayIcon } from './Icons.js';

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
  { id: 'isometric', label: 'Iso' },
  { id: 'front', label: 'Front' },
  { id: 'rear', label: 'Rear' },
  { id: 'side-cutaway', label: 'Side' },
  { id: 'top', label: 'Top' },
];

const CABLE_FILTERS: ReadonlyArray<{
  readonly id: CableFilterMode;
  readonly label: string;
}> = [
  { id: 'all', label: 'All' },
  { id: 'network', label: 'Data' },
  { id: 'power', label: 'Power' },
  { id: 'poe', label: 'PoE' },
  { id: 'none', label: 'Off' },
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
        bottom: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'calc(100% - 28px)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '7px 12px',
        borderRadius: '11px',
        background: 'rgba(16, 16, 20, 0.88)',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(14px)',
        zIndex: 15,
        whiteSpace: 'nowrap',
      }}
    >
      {/* 1. Segmented Camera Preset Group */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '2px',
          borderRadius: '7px',
          background: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: '#71717A',
            padding: '0 6px',
          }}
        >
          View
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
                padding: '4px 8px',
                borderRadius: '5px',
                border: 'none',
                background: active ? '#272730' : 'transparent',
                color: active ? '#F4F4F5' : '#A1A1AA',
                fontSize: '11px',
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
              }}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* 2. Segmented Cable Layer Filter Group */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '2px',
          borderRadius: '7px',
          background: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: '#71717A',
            padding: '0 6px',
          }}
        >
          Cables
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
                padding: '4px 8px',
                borderRadius: '5px',
                border: 'none',
                background: active ? '#272730' : 'transparent',
                color: active ? '#F4F4F5' : '#A1A1AA',
                fontSize: '11px',
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
              }}
            >
              {cf.label}
            </button>
          );
        })}
      </div>

      {/* 3. CAD Inspection Toggles & Explode Z Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          type="button"
          data-testid="hud-toggle-xray"
          onClick={() => onToggleXray(!xrayMode)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 9px',
            borderRadius: '6px',
            border: xrayMode
              ? '1px solid rgba(59, 130, 246, 0.45)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            background: xrayMode ? 'rgba(59, 130, 246, 0.16)' : '#16161B',
            color: xrayMode ? '#93C5FD' : '#D4D4D8',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <EyeXrayIcon size={12} />
          <span>{xrayMode ? 'X-Ray Ghost: ON' : 'X-Ray Ghost: OFF'}</span>
        </button>

        <button
          type="button"
          data-testid="hud-toggle-clearance"
          onClick={() => onToggleClearanceBoxes(!showClearanceBoxes)}
          style={{
            padding: '5px 9px',
            borderRadius: '6px',
            border: showClearanceBoxes
              ? '1px solid rgba(245, 158, 11, 0.45)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            background: showClearanceBoxes
              ? 'rgba(245, 158, 11, 0.14)'
              : '#16161B',
            color: showClearanceBoxes ? '#FDE68A' : '#D4D4D8',
            fontSize: '11px',
            fontWeight: 500,
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
            padding: '5px 9px',
            borderRadius: '6px',
            border: doorOpen
              ? '1px solid rgba(59, 130, 246, 0.4)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            background: doorOpen ? 'rgba(59, 130, 246, 0.12)' : '#16161B',
            color: doorOpen ? '#93C5FD' : '#D4D4D8',
            fontSize: '11px',
            fontWeight: 500,
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
            gap: '7px',
            padding: '3px 8px',
            borderRadius: '6px',
            background: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '10.5px',
            color: '#D4D4D8',
          }}
        >
          <span>Explode {explodeZMm}mm</span>
          <input
            type="range"
            data-testid="hud-explode-z-slider"
            min={0}
            max={250}
            step={5}
            value={explodeZMm}
            onChange={(e) => onChangeExplodeZ(Number(e.target.value))}
            style={{ width: '76px', accentColor: '#3B82F6', cursor: 'pointer' }}
          />
        </label>
      </div>
    </div>
  );
}
