'use client';

import Script from 'next/script';

export default function AdBanner728() {
  return (
    <div className="my-4 flex justify-center items-center text-center overflow-x-auto min-h-[90px]">
      {/* 1. Set global options for Adsterra */}
      <Script id="adsterra-728x90-config" strategy="afterInteractive">
        {`
          window.atOptions = {
            'key' : 'f2e1e1eeecc168e701a09eef94e66de6',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `}
      </Script>

      {/* 2. Load the external script */}
      <Script
        id="adsterra-728x90-invoke"
        strategy="afterInteractive"
        src="https://www.highperformanceformat.com/f2e1e1eeecc168e701a09eef94e66de6/invoke.js"
      />
    </div>
  );
}