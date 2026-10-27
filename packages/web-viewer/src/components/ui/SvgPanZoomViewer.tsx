import { useState } from 'react';

export interface SvgPanZoomViewerProps {
  readonly title: string;
  readonly filename: string;
  readonly svgMarkup: string;
}

export function SvgPanZoomViewer({
  title,
  filename,
  svgMarkup,
}: SvgPanZoomViewerProps) {
  const [zoom, setZoom] = useState<number>(0.9);
  const [pan, setPan] = useState<{ readonly x: number; readonly y: number }>({
    x: 0,
    y: 0,
  });
  const [dragging, setDragging] = useState<boolean>(false);
  const [dragOrigin, setDragOrigin] = useState<{
    readonly x: number;
    readonly y: number;
  }>({ x: 0, y: 0 });

  const handleDownloadSvg = () => {
    const blob = new Blob([svgMarkup], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      data-testid="svg-pan-zoom-viewer"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#090D16',
        overflow: 'hidden',
      }}
    >
      {/* Top Viewer Toolbar */}
      <div
        style={{
          height: '44px',
          padding: '0 16px',
          background: '#0F172A',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div
          className="mono"
          style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8' }}
        >
          {title} ({filename})
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            data-testid="svg-zoom-out"
            onClick={() => setZoom((z) => Math.max(0.35, Number((z - 0.15).toFixed(2))))}
            style={{
              padding: '4px 10px',
              borderRadius: '5px',
              border: '1px solid #334155',
              background: '#1E293B',
              color: '#F8FAFC',
              cursor: 'pointer',
              fontSize: '11.5px',
            }}
          >
            Zoom -
          </button>
          <span
            className="mono"
            style={{ fontSize: '11.5px', color: '#CBD5E1', minWidth: '52px', textAlign: 'center' }}
          >
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            data-testid="svg-zoom-in"
            onClick={() => setZoom((z) => Math.min(3.5, Number((z + 0.15).toFixed(2))))}
            style={{
              padding: '4px 10px',
              borderRadius: '5px',
              border: '1px solid #334155',
              background: '#1E293B',
              color: '#F8FAFC',
              cursor: 'pointer',
              fontSize: '11.5px',
            }}
          >
            Zoom +
          </button>
          <button
            type="button"
            data-testid="svg-zoom-reset"
            onClick={() => {
              setZoom(0.9);
              setPan({ x: 0, y: 0 });
            }}
            style={{
              padding: '4px 10px',
              borderRadius: '5px',
              border: '1px solid #334155',
              background: '#1E293B',
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: '11.5px',
            }}
          >
            Reset View
          </button>
          <button
            type="button"
            data-testid="svg-download-btn"
            onClick={handleDownloadSvg}
            style={{
              padding: '5px 12px',
              borderRadius: '5px',
              border: '1px solid #0284C7',
              background: '#082F49',
              color: '#38BDF8',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '11.5px',
            }}
          >
            Download {filename}
          </button>
        </div>
      </div>

      {/* Interactive Pan/Zoom Canvas Area */}
      <div
        onMouseDown={(e) => {
          setDragging(true);
          setDragOrigin({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }}
        onMouseMove={(e) => {
          if (!dragging) return;
          setPan({ x: e.clientX - dragOrigin.x, y: e.clientY - dragOrigin.y });
        }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        style={{
          flex: 1,
          overflow: 'auto',
          cursor: dragging ? 'grabbing' : 'grab',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'top center',
            transition: dragging ? 'none' : 'transform 120ms ease-out',
          }}
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      </div>
    </div>
  );
}
