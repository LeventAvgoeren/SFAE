import React, { useState } from 'react';
import './PageIntroduction.css'; // Stelle sicher, dass der Pfad korrekt ist

type Direction = 'left' | 'right';

export function PageIntroduction() {
    const [currentSection, setCurrentSection] = useState(0);
    const sections = ["section1", "section2", "section3", "section4"];

    const scrollToSection = (direction: Direction) => {
        setCurrentSection(prevSection => {
            let newSection = direction === 'right' ? prevSection + 1 : prevSection - 1;
            if (newSection >= sections.length) newSection = 0;
            if (newSection < 0) newSection = sections.length - 1;
            return newSection;
        });
    };

    return (
        <div className="horizontal-scroll-container">
            {sections.map((section, index) => (
                <div key={section} className={`horizontal-section ${section} ${currentSection === index ? 'show' : ''}`}>
                    {index === 0 && (
                        <>
                            <h1>Welcome to SfÆ</h1>
                            <p>Experience innovation like never before</p>
                            <img src="/path-to-welcome-image.jpg" alt="Welcome" />
                            <button onClick={() => scrollToSection('right')} className="arrow arrow-right">
                                <img src="/right.svg" alt="Next" />
                            </button>
                        </>
                    )}
                    {index === 1 && (
                        <>
                            <button onClick={() => scrollToSection('left')} className="arrow arrow-left">
                                <img src="/left.svg" alt="Previous" />
                            </button>
                            <h1>Warum uns</h1>
                            <p>We provide the best solutions for your needs</p>
                            <ul>
                                <li>Erfahrung und Expertise</li>
                                <li>Innovative Lösungen</li>
                                <li>Hervorragender Kundenservice</li>
                            </ul>
                            <blockquote>
                                <p>"SfÆ hat unsere Erwartungen übertroffen!" - Zufriedener Kunde</p>
                            </blockquote>
                            <button onClick={() => scrollToSection('right')} className="arrow arrow-right">
                                <img src="/right.svg" alt="Next" />
                            </button>
                        </>
                    )}
                    {index === 2 && (
                        <>
                            <button onClick={() => scrollToSection('left')} className="arrow arrow-left">
                                <img src="/left.svg" alt="Previous" />
                            </button>
                            <h1>Willkommen</h1>
                            <p>Join us on our journey to excellence</p>
                            <div>
                                <h2>Unsere Dienstleistungen</h2>
                                <ul>
                                    <li>Beratung und Strategie</li>
                                    <li>Technologische Lösungen</li>
                                    <li>Support und Schulungen</li>
                                </ul>
                                <img src="/path-to-services-image.jpg" alt="Services" />
                            </div>
                            <button onClick={() => scrollToSection('right')} className="arrow arrow-right">
                                <img src="/right.svg" alt="Next" />
                            </button>
                        </>
                    )}
                    {index === 3 && (
                        <>
                            <button onClick={() => scrollToSection('left')} className="arrow arrow-left">
                                <img src="/left.svg" alt="Previous" />
                            </button>
                            <h1>Irgendwas</h1>
                            <p>Bereit für deinen ersten Auftrag?</p>
                            <button className="cta-button" onClick={() => window.location.href = '/index'}>Starte jetzt</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
