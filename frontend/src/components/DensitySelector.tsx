import './DensitySelector.css';

export type ThumbnailDensity = 3 | 5 | 7;

interface DensitySelectorProps {
  density: ThumbnailDensity;
  onDensityChange: (density: ThumbnailDensity) => void;
}

export function DensitySelector({ density, onDensityChange }: DensitySelectorProps) {
  const densities: ThumbnailDensity[] = [3, 5, 7];

  return (
    <div className="density-selector" role="group" aria-label="Thumbnail density selector">
      <span className="density-selector-label">Density:</span>
      {densities.map((d) => (
        <button
          key={d}
          className={`density-button ${density === d ? 'density-button-active' : ''}`}
          onClick={() => onDensityChange(d)}
          aria-label={`${d} thumbnails per row`}
          aria-pressed={density === d}
        >
          {d}
        </button>
      ))}
    </div>
  );
}
