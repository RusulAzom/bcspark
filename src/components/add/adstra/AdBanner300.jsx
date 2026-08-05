'use client';

export default function AdBanner300() {
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
            'key' : 'fcbf1c856651ffe5e96210126af8dacf',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/fcbf1c856651ffe5e96210126af8dacf/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="my-2 flex justify-center items-center overflow-hidden w-full">
      <iframe
        title="Adsterra Sidebar Banner"
        srcDoc={adHtml}
        width="300"
        height="250"
        className="border-0 overflow-hidden"
        scrolling="no"
      />
    </div>
  );
}