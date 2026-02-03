"use client";

import React, { useState } from "react";
import logo from "../../../images/logo.png";

export default function AdminLogo() {
  // Use the project's `images/logo.png` as the admin logo. If import fails or image errors, fall back to the inline SVG.
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="flex flex-col items-center text-center" aria-label="DPC IT Solutions logo">
      <div className="flex items-center justify-center h-16 w-16 rounded-lg overflow-hidden">
        {imgOk ? (
          <img
            src={typeof logo === 'string' ? logo : logo.src ?? ''}
            alt="DPC IT Solutions"
            className="h-full w-full object-contain"
            onError={() => setImgOk(false)}
          />
        ) : (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="0" y="0" width="40" height="40" rx="8" fill="none" />

            {/* simple laptop + globe motif */}
            <g transform="translate(0,0)" fill="none" stroke="#fff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <rect x="8" y="11" width="24" height="14" rx="1.5" stroke="rgba(255,255,255,0.95)" fill="rgba(255,255,255,0.04)" />
              <path d="M10 25h20l-2 3H12l-2-3z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.06)" />
              <circle cx="20" cy="18" r="3.2" stroke="#fff" />
              <path d="M20 15v1.2" stroke="#fff" />
              <path d="M18.3 16.5c-.4.5-.6 1.1-.6 1.7" stroke="#fff" />
              <path d="M21.7 16.5c.4.5.6 1.1.6 1.7" stroke="#fff" />
              <path d="M23 16l-3 3" stroke="#fff" />
            </g>

            {/* DPC text small */}
            <text x="50%" y="62%" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="Inter, Arial, sans-serif">DPC</text>
          </svg>
        )}
      </div>

      <div className="mt-2">
        <div className="text-lg font-bold text-gray-800 leading-tight">DPC IT Solutions</div>
      </div>
    </div>
  );
}