import { useEffect, useRef, useState } from "react";
import canvasImages from "./canvasimages";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Canvas({ details, sectionId }) {
  const { startIndex, numImages, duration, size, top, left, zIndex } = details;
  
  
  const isOnSides = left <= 20 || left >= 80;
  
  const isInHeroSection = !sectionId || sectionId.includes('background');
  
  const shouldReduceSaturation = isOnSides && isInHeroSection;

  const [index, setIndex] = useState({ value: startIndex });
  const canvasRef = useRef(null);

  useGSAP(() => {
    gsap.to(index, {
      value: startIndex + numImages - 1,
      duration: duration,
      repeat: -1,
      ease: "linear",
      onUpdate: () => {
        setIndex({ value: Math.round(index.value) });
      },
    });

    gsap.from(canvasRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
    });
  });

  useEffect(() => {
    const scale = window.devicePixelRatio;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = canvasImages[index.value];
    img.onload = () => {
      canvas.width = canvas.offsetWidth * scale;
      canvas.height = canvas.offsetHeight * scale;
      canvas.style.width = canvas.offsetWidth + "px";
      canvas.style.height = canvas.offsetHeight + "px";

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      
      if (shouldReduceSaturation) {
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        
        for (let i = 0; i < data.length; i += 4) {
          
          const r = data[i] / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;
          
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h, s, l = (max + min) / 2;
          
          if (max === min) {
            h = s = 0; 
          } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
          }
          
          
          s = s * 0.6;
          
          
          if (s === 0) {
            data[i] = data[i + 1] = data[i + 2] = l * 255;
          } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            data[i] = hue2rgb(p, q, h + 1/3) * 255;
            data[i + 1] = hue2rgb(p, q, h) * 255;
            data[i + 2] = hue2rgb(p, q, h - 1/3) * 255;
          }
        }
        
        
        ctx.putImageData(imageData, 0, 0);
      }
    };
  }, [index, shouldReduceSaturation]);
  
  
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }

  return (
    <canvas
      data-scroll
      data-scroll-speed={Math.random().toFixed(1)}
      ref={canvasRef}
      className="absolute"
      style={{
        width: `${size * 1.8}px`,
        height: `${size * 1.8}px`,
        top: `${top}%`,
        left: `${left}%`,
        zIndex: `${zIndex}`,
        filter: shouldReduceSaturation ? 'brightness(0.95)' : 'none', 
      }}
      id="canvas"
    ></canvas>
  );
}

export default Canvas;
