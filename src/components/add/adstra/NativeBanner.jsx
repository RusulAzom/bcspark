'use client';

import { useEffect, useRef } from 'react';

export default function NativeBanner() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Container চেক করা
    if (!containerRef.current) return;

    // পূর্বে Script লোড হয়ে থাকলে তা এড়ানোর জন্য ক্লিয়ার করা
    containerRef.current.innerHTML = '';

    // div container তৈরি
    const containerDiv = document.createElement('div');
    containerDiv.id = 'container-b7cd71d21104c3f1af6dc44664884f37';

    // script tag তৈরি
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl30534260.effectivecpmnetwork.com/b7cd71d21104c3f1af6dc44664884f37/invoke.js';

    // DOM-এ অ্যাপেন্ড করা
    containerRef.current.appendChild(containerDiv);
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="my-6 flex justify-center items-center w-full min-h-[100px]">
      <div ref={containerRef} className="w-full max-w-4xl flex justify-center" />
    </div>
  );
}