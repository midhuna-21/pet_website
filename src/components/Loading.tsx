import React from 'react';

export default function Loading() {
  return (
    <div className="overlay" role="status" aria-live="polite">
      <div>
        <div className="ring" />
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0; /* top:0; right:0; bottom:0; left:0 */
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000; /* black bg */
          z-index: 9999;
        }

        .ring {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid transparent;
          border-top-color: #ffffff; /* small white chunk */
          border-left-color: rgba(255,255,255,0.12);
          animation: spin 1s linear infinite;
          box-sizing: border-box;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Reduce motion respect */
        @media (prefers-reduced-motion: reduce) {
          .ring { animation: none; }
        }
      `}</style>
    </div>
  );
}
