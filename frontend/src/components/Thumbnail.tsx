import { useState, useEffect } from 'react';
import type { ImageFile } from '@simple-browser/shared';
import { api, ApiError } from '../services/api';
import './Thumbnail.css';

interface ThumbnailProps {
  image: ImageFile;
  onClick: (image: ImageFile) => void;
  onKeyDown?: (event: React.KeyboardEvent, image: ImageFile) => void;
}

export function Thumbnail({ image, onClick, onKeyDown }: ThumbnailProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = await api.getImageContent(image.path);
        if (isMounted) {
          setImageUrl(url);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof ApiError 
            ? err.message 
            : 'Failed to load image';
          setError(errorMessage);
          setLoading(false);
        }
      }
    };

    loadImage();

    // Cleanup blob URL on unmount
    return () => {
      isMounted = false;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [image.path]);

  const handleClick = () => {
    if (!loading && !error) {
      onClick(image);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
    if (onKeyDown) {
      onKeyDown(event, image);
    }
  };

  return (
    <div
      className="thumbnail"
      role="button"
      tabIndex={0}
      aria-label={`Image: ${image.name}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="thumbnail-image-container">
        {loading && (
          <div className="thumbnail-loading">
            <div className="thumbnail-spinner" />
          </div>
        )}
        {error && (
          <div className="thumbnail-error">
            <span className="thumbnail-error-icon">⚠</span>
            <span className="thumbnail-error-text">Failed to load</span>
          </div>
        )}
        {imageUrl && !error && (
          <img
            src={imageUrl}
            alt={image.name}
            className="thumbnail-image"
            loading="lazy"
          />
        )}
      </div>
      <div className="thumbnail-info">
        <span className="thumbnail-name" title={image.name}>
          {image.name}
        </span>
      </div>
    </div>
  );
}
