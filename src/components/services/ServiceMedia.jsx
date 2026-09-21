import { useEffect, useMemo, useState } from 'react';
import { getServiceImageFallbacks } from '../../utils/serviceImage';

/**
 * @param {'thumb' | 'card' | 'detail'} variant
 */
export default function ServiceMedia({ service, variant = 'card', className = '' }) {
  const fallbacks = useMemo(
    () => getServiceImageFallbacks(service),
    [service?.id, service?.image, service?.category],
  );
  const [fallbackIndex, setFallbackIndex] = useState(0);

  useEffect(() => {
    setFallbackIndex(0);
  }, [fallbacks.join('|')]);

  const src = fallbacks[Math.min(fallbackIndex, fallbacks.length - 1)] || '';
  const name = service?.name || 'Service';

  const handleError = () => {
    if (fallbackIndex < fallbacks.length - 1) {
      setFallbackIndex((i) => i + 1);
    }
  };

  if (variant === 'card') {
    return (
      <div
        className={`service-card-media aspect-[16/10] -mx-5 -mt-5 mb-4 overflow-hidden bg-[#f0e4c8] ${className}`}
      >
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          onError={handleError}
        />
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <img
        src={src}
        alt={name}
        className={className || 'w-full h-full object-cover'}
        onError={handleError}
      />
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={className || 'w-full h-full object-cover'}
      loading="lazy"
      onError={handleError}
    />
  );
}
