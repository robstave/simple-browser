import { useState, useEffect, useCallback } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { ImageFile } from '@simple-browser/shared';
import { api, ApiError } from '../services/api';
import { Thumbnail } from './Thumbnail';
import { DensitySelector } from './DensitySelector';
import type { ThumbnailDensity } from './DensitySelector';
import './ThumbnailGrid.css';

interface ThumbnailGridProps {
  selectedPath: string | null;
  onImageClick: (image: ImageFile) => void;
}

export function ThumbnailGrid({ selectedPath, onImageClick }: ThumbnailGridProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [density, setDensity] = useState<ThumbnailDensity>(5);

  // Load images when selectedPath changes
  useEffect(() => {
    if (!selectedPath) {
      setImages([]);
      return;
    }

    let isMounted = true;

    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getImages(selectedPath);
        if (isMounted) {
          setImages(response.images);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof ApiError 
            ? err.message 
            : 'Failed to load images';
          setError(errorMessage);
          setLoading(false);
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [selectedPath]);

  // Keyboard navigation handler
  const handleThumbnailKeyDown = useCallback((event: ReactKeyboardEvent, image: ImageFile) => {
    const currentIndex = images.indexOf(image);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        newIndex = Math.min(currentIndex + 1, images.length - 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        newIndex = Math.min(currentIndex + density, images.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = Math.max(currentIndex - density, 0);
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = images.length - 1;
        break;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      // Focus the thumbnail
      const thumbnails = document.querySelectorAll('.thumbnail');
      const thumbnail = thumbnails[newIndex] as HTMLElement;
      thumbnail?.focus();
    }
  }, [images, density]);

  if (!selectedPath) {
    return (
      <div className="thumbnail-grid-empty">
        <span className="thumbnail-grid-empty-icon">📂</span>
        <span className="thumbnail-grid-empty-text">
          Select a directory to view images
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="thumbnail-grid-loading">
        <div className="thumbnail-grid-spinner" />
        <span className="thumbnail-grid-loading-text">Loading images...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="thumbnail-grid-error">
        <span className="thumbnail-grid-error-icon">⚠</span>
        <span className="thumbnail-grid-error-text">{error}</span>
        <button 
          className="thumbnail-grid-retry-button"
          onClick={() => {
            setError(null);
            // Trigger reload by resetting selectedPath state
            if (selectedPath) {
              const path = selectedPath;
              setImages([]);
              api.getImages(path)
                .then(response => setImages(response.images))
                .catch(err => {
                  const errorMessage = err instanceof ApiError 
                    ? err.message 
                    : 'Failed to load images';
                  setError(errorMessage);
                });
            }
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="thumbnail-grid-empty">
        <span className="thumbnail-grid-empty-icon">🖼️</span>
        <span className="thumbnail-grid-empty-text">
          No images in this directory
        </span>
      </div>
    );
  }

  return (
    <div className="thumbnail-grid-container">
      <div className="thumbnail-grid-header">
        <div className="thumbnail-grid-info">
          <span className="thumbnail-grid-path">{selectedPath}</span>
          <span className="thumbnail-grid-count">{images.length} images</span>
        </div>
        <DensitySelector density={density} onDensityChange={setDensity} />
      </div>
      <div 
        className="thumbnail-grid"
        style={{
          gridTemplateColumns: `repeat(${density}, 1fr)`,
        }}
        role="grid"
        aria-label="Image thumbnail grid"
      >
        {images.map((image) => (
          <Thumbnail
            key={image.path}
            image={image}
            onClick={onImageClick}
            onKeyDown={handleThumbnailKeyDown}
          />
        ))}
      </div>
    </div>
  );
}
