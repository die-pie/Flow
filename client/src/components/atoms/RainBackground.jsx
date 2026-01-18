import React, { useRef, useEffect } from 'react';

const RainBackground = ({ palette = ['#3b82f6', '#93c5fd'], isLightMode = false }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        // Mode-Adaptive Blending
        // Dark Mode: 'lighter' makes colors glow additively (Neon)
        // Light Mode: 'source-over' paints pixels normally (Ink)
        ctx.globalCompositeOperation = isLightMode ? 'source-over' : 'lighter';

        // Configuration
        const drops = [];
        const dropCount = 150;
        const speedBase = 2; 

        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Reset composite operation on resize as context might reset state depending on browser impl, 
            // though usually it persists. Good practice to ensure.
            ctx.globalCompositeOperation = isLightMode ? 'source-over' : 'lighter';
        };
        
        window.addEventListener('resize', resize);
        resize();

        // Helper to convert hex to rgba for depth/opacity handling
        const hexToRgba = (hex, alpha) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        class Drop {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * canvas.width;
                this.y = initial ? Math.random() * canvas.height : -20;
                this.z = Math.random() * 0.5 + 0.5; // Depth multiplier
                this.length = Math.random() * 50 + 30; // Significantly longer
                this.speed = (Math.random() * 5 + 5) * this.z * speedBase;
                this.color = this.getRandomColor();
            }

            getRandomColor() {
                const hex = palette[Math.floor(Math.random() * palette.length)];
                // Opacity scales with depth (z) - Increased density/brightness
                return hexToRgba(hex, 0.5 * this.z + 0.2);
            }

            update() {
                this.y += this.speed;
                this.x += this.speed * 0.2; 

                if (this.y > canvas.height + 20 || this.x > canvas.width + 20) {
                    this.reset();
                    this.x = Math.random() * canvas.width; 
                }
            }

            draw() {
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5 * this.z;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - (this.length * 0.2), this.y - this.length); 
                ctx.stroke();
            }
        }

        // Initialize
        for (let i = 0; i < dropCount; i++) {
            drops.push(new Drop());
        }

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            drops.forEach(drop => {
                drop.update();
                drop.draw();
            });

            animationFrameId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [palette, isLightMode]); 

    // Adjust blend mode: Screen for neon (dark bg), Multiply for ink (light bg)
    const blendClass = isLightMode ? 'mix-blend-multiply opacity-80' : 'mix-blend-screen opacity-60';

    return (
        <canvas 
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-0 ${blendClass}`}
        />
    );
};

export default RainBackground;
