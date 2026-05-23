"use client";

import { useEffect, useRef, memo } from "react";

const BRAIN_ASCII = `
                                    .';;';;;'.
                                 .';;';;'';;';;.
                               .';;';;' ;.; ;';;;'.
                             .';;';;; .;.;.;.;; ';;'.
                           .';;';;;.. ;.;.;.;.;.;.;';;;'.
                         .';;';;'  .;.;.;.;.;.;.;.;.;.;';.
                       .';;';;'    ;.;.;.;.;.;.;.;.;.;.;;'.
                     .';;';;'      ;.;.;.;.;.;.;.;.;.;.;;';;.
                   .';;';;;        ;.;.;.;.;.;.;.;.;.;.;;;';;.
                 .';;';;;          ;.;.;.;.;.;.;.;.;.;.;;;;'';;.
               .';;';;;            ;.;.;.;.;.;.;.;.;.;.;;;;' ;';;.
             .';;';;;              ;.;.;.;.;.;.;.;.;.;.;;;;' ;.;';;.
           .';;';;;                ;.;.;.;.;.;.;.;.;.;.;;;;'  ;.;.;';.
         .';;';;;                  ;.;.;.;.;.;.;.;.;.;.;;;;'   ;.;.;.;'.
       .';;';;;                    ;.;.;.;.;.;.;.;.;.;.;;;;'    ;.;.;.;.;.
     .';;';;;                      ;.;.;.;.;.;.;.;.;.;.;;;;'     ;.;.;.;.;.
   .';;';;;                        ;.;.;.;.;.;.;.;.;.;.;;;;'      ;.;.;.;.
 .';;';;;                          ;.;.;.;.;.;.;.;.;.;.;;;;'       ;.;.;.
';;';;;                            ;.;.;.;.;.;.;.;.;.;.;;;;'        ;.;.
';;';;.                             ;.;.;.;.;.;.;.;.;.;.;;;;'         ;;
';;';;                                ;.;.;.;.;.;.;.;.;.;.;;;;'         ;
';;';;                                 ;.;.;.;.;.;.;.;.;.;.;;;;
';;';;                                  ;.;.;.;.;.;.;.;.;.;;;;
 ';;';;                                  ;.;.;.;.;.;.;.;.;;;;
  ';;';;                                  ;.;.;.;.;.;.;.;;;;
   ';;';;                                  ;.;.;.;.;.;.;;;
    ';;';;                                  ;.;.;.;.;.;;;
     ';;';;                                  ;.;.;.;.;;;;
      ';;';;                                  ;.;.;.;;;;
       ';;';;                                  ;.;.;;;;
        ';;';;                                  ;.;;;;
         ';;';;                                  ;;;;
          ';;';;                                  ;;;
           ';;';;                                  ;;
            ';;';;                                  ;
             ';;';;                                  
              ';;';;                                
               ';;';;                               
                ';;';;                              
                 ';;';;                             
                  ';;';;                            
                   ';;';;                           
                    ';;';;                          
                     ';;';;                        
                      ';;';;                       
                       ';;';;                      
                        ';;';;                     
                         ';;';;                    
                          ';;';;                   
                           ';;';;                  
                            ';;';;                
                             ';;';;               
                              ';;';;              
                               ';;';;             
                                ';;';;            
                                 ';;';;           
                                  ';;';;          
                                   ';;';;         
                                    ';;';;        
                                     ';;';;       
                                      ';;';;      
                                       ';;';;     
                                        ';;';;    
                                         ';;';;   
                                          ';;';;  
                                           ';;';; 
                                            ';;';;
                                             ';;';
                                              ';;'
                                               ';'`;

function AsciiBrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawChar = (char: string, x: number, y: number, alpha: number) => {
      ctx.fillStyle = `rgba(243, 243, 243, ${alpha * 0.15})`;
      ctx.font = "10px JetBrains Mono, monospace";
      ctx.fillText(char, x, y);
    };

    const chars = BRAIN_ASCII.split("");
    let columns = Math.floor(canvas.width / 12);

    const animate = () => {
      ctx.fillStyle = "rgba(16, 16, 16, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const columnWidth = 12;
      const rowHeight = 12;

      for (let i = 0; i < chars.length; i++) {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const x = col * columnWidth + Math.sin(time * 0.5 + col * 0.1) * 2;
        const y = row * rowHeight + Math.cos(time * 0.3 + row * 0.1) * 2;

        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
          const alpha = 0.3 + Math.sin(time + col * 0.2 + row * 0.1) * 0.2;
          drawChar(chars[i], x, y, alpha);
        }
      }

      time += 0.01;
      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", () => {
      resize();
      columns = Math.floor(canvas.width / 12);
    });
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="ascii-canvas"
      aria-hidden="true"
    />
  );
}

export default memo(AsciiBrainCanvas);