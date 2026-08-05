'use client';

export default function AdBanner728() {
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : 'f2e1e1eeecc168e701a09eef94e66de6',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/f2e1e1eeecc168e701a09eef94e66de6/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="my-2 flex justify-center items-center overflow-hidden w-full">
      <iframe
        title="Adsterra Banner"
        srcDoc={adHtml}
        width="728"
        height="90"
        className="border-0 overflow-hidden"
        scrolling="no"
      />
    </div>
  );
}