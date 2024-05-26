import React, { useRef } from 'react';
import './PageIntroduction.css'; // Stelle sicher, dass der Pfad korrekt ist

type Direction = 'left' | 'right';

export function PageIntroduction() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const scrollToSection = (direction: Direction) => {
        const container = containerRef.current;
        if (container) {
            if (direction === 'left') {
                container.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
            } else if (direction === 'right') {
                container.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="horizontal-scroll-container" ref={containerRef}>
            <div className="horizontal-section section1">
                <h1>Über Uns</h1>
                <button onClick={() => scrollToSection('right')} className="arrow arrow-right">&#x2192;</button>
            </div>
            <div className="horizontal-section section2">
                <button onClick={() => scrollToSection('left')} className="arrow arrow-left">&#x2190;</button>
                <h1>Warum uns</h1>
                <button onClick={() => scrollToSection('right')} className="arrow arrow-right">&#x2192;</button>
            </div>
            <div className="horizontal-section section3">
                <button onClick={() => scrollToSection('left')} className="arrow arrow-left">&#x2190;</button>
                <h1>Willkommen</h1>
                <button onClick={() => scrollToSection('right')} className="arrow arrow-right">&#x2192;</button>
            </div>
            <div className="horizontal-section section4">
                <button onClick={() => scrollToSection('left')} className="arrow arrow-left">&#x2190;</button>
                <h1>Irgendwas</h1>
            </div>
        </div>
    );
}
