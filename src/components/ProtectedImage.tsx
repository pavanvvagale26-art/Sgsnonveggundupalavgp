import React from 'react';

/**
 * ProtectedImage
 *
 * A drop-in replacement for <img> that:
 *   - Sets draggable="false" explicitly on the element
 *   - Optionally renders a subtle canvas-based watermark overlay using
 *     the brand logo (enable with showWatermark={true})
 *   - Does NOT add a blocking overlay div, so it never interferes with
 *     click handlers, links, or hover effects on parent elements.
 *
 * WATERMARK USAGE
 * ---------------
 * By default, showWatermark is false.  To enable a subtle logo watermark
 * on a specific image, add the showWatermark prop:
 *
 *   <ProtectedImage
 *     src="/chicken-donne-palav.png"
 *     alt="Chicken Donne Palav"
 *     className="w-full h-full object-cover"
 *     showWatermark
 *   />
 *
 * For stronger watermark protection, embed the watermark directly into
 * the image file using image editing software (Photoshop, GIMP, etc.)
 * or a server-side library before uploading to /public.
 */

interface ProtectedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * When true, renders a subtle SVG logo watermark overlay in the
   * bottom-right corner of the wrapping container.
   * The parent element must have position: relative (or any non-static
   * position) for the overlay to be visible.
   */
  showWatermark?: boolean;
  /** Tailwind / CSS classes forwarded to the <img> element */
  className?: string;
  wrapperClassName?: string;
}

export const ProtectedImage: React.FC<ProtectedImageProps> = ({
  showWatermark = false,
  className = '',
  wrapperClassName = '',
  ...imgProps
}) => {
  if (!showWatermark) {
    // Lightweight path – just a plain <img> with drag disabled.
    // No extra DOM nodes, no layout impact.
    return (
      <img
        {...imgProps}
        draggable={false}
        className={className}
        // pointer-events:none on the img itself so interactive parent
        // elements (cards, buttons, links) still receive click events.
        style={{ pointerEvents: 'none', userSelect: 'none', ...imgProps.style }}
      />
    );
  }

  // Watermarked path – wraps image in a relative container and overlays
  // a semi-transparent brand logo in the bottom-right corner.
  return (
    <div
      className={`relative overflow-hidden ${wrapperClassName}`}
      // Prevent the container itself from being dragged
      onDragStart={(e) => e.preventDefault()}
    >
      <img
        {...imgProps}
        draggable={false}
        className={className}
        style={{ pointerEvents: 'none', userSelect: 'none', ...imgProps.style }}
      />

      {/* Subtle watermark overlay – logo + text */}
      <div
        aria-hidden="true"
        className="absolute bottom-2 right-2 flex items-center gap-1 pointer-events-none select-none"
        style={{ opacity: 0.35 }}
      >
        <img
          src="/brand-logo.png"
          alt=""
          draggable={false}
          className="w-6 h-6 object-contain"
          style={{
            filter:
              'invert(1) sepia(1) saturate(3) hue-rotate(5deg) brightness(1.05)',
            pointerEvents: 'none',
          }}
        />
        <span
          className="text-white font-bold uppercase"
          style={{
            fontSize: '9px',
            letterSpacing: '0.12em',
            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
            whiteSpace: 'nowrap',
          }}
        >
          © SGS Gundu Palav
        </span>
      </div>
    </div>
  );
};
