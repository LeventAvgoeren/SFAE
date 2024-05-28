import React, { useState } from 'react';
import './PageIntroduction.css'; // Stelle sicher, dass der Pfad korrekt ist
import Lottie from 'react-lottie';
import animationData from "./roboter.json";
import animationData1 from "./customer.json";
import animationData2 from "./worker.json";

type Direction = 'left' | 'right';

export function PageIntroduction() {
    const [currentSection, setCurrentSection] = useState(0);
    const sections = ["my-section1", "my-section2", "my-section3", "my-section4"];

    const scrollToSection = (direction: Direction) => {
        setCurrentSection(prevSection => {
            let newSection = direction === 'right' ? prevSection + 1 : prevSection - 1;
            if (newSection >= sections.length) newSection = 0;
            if (newSection < 0) newSection = sections.length - 1;
            return newSection;
        });
    };

    return (
        <div className="my-horizontal-scroll-container">
            {sections.map((section, index) => (
                <div key={section} className={`my-horizontal-section ${section} ${currentSection === index ? 'my-show' : ''}`}>
                    {index === 0 && (
                        <>
                            <h1 className="my-h1">Welcome to SfÆ</h1>
                            <p className="my-p">Study fast and efficient!</p>
                            <p className="my-p">Ein Projekt erstellt von Ahmad Sfarjalani, Eray Zor, Levent Avgören, Duc Dai Nguyen und Danyal Mahrous!</p>
                            <div className="animation-roboter">

                            <Lottie options={{
                                loop: true,
                                autoplay: true,
                                animationData: animationData,
                                rendererSettings: {
                                    preserveAspectRatio: 'xMidYMid slice'
                                }
                            }} height={350} width={350} />
                            </div>
                            <button onClick={() => scrollToSection('right')} className="my-arrow my-arrow-right">
                                <img src="/right.svg" alt="Next" />
                            </button>
                        </>
                    )}
                    {index === 1 && (
                        <>
                            <button onClick={() => scrollToSection('left')} className="my-arrow my-arrow-left">
                                <img src="/left.svg" alt="Previous" />
                            </button>
                            <h1 className="my-h1">SfÆ ist eine Dienstleistungswebsite, wo es zwei Rollen gibt:</h1>
                            <p className="my-p">Den Worker und den Customer!</p>
                            <p className="my-p">Folgendes Szenario:</p>

                            <div className="animation-container">
                                <div className="animation-worker">
                                    <Lottie options={{
                                        loop: true,
                                        autoplay: true,
                                        animationData: animationData2,
                                        rendererSettings: {
                                            preserveAspectRatio: 'xMidYMid slice'
                                        }
                                    }} height={400} width={400} />
                                    <p className="my-p">Das hier ist Eray, der am nächsten Tag Freunde erwartet und unbedingt seine Wand streichen muss, bevor sie kommen. Er kennt niemanden, der ihm helfen kann und findet SfÆ.</p>
                                </div>
                                <div className="animation-customer">
                                    <Lottie options={{
                                        loop: true,
                                        autoplay: true,
                                        animationData: animationData1,
                                        rendererSettings: {
                                            preserveAspectRatio: 'xMidYMid slice'
                                        }
                                    }} height={400} width={400} />
                                    <p className="my-p">Levent ist knapp bei Kasse! Er besucht SfÆ, um neben seiner eigentlichen Arbeit als Maler etwas Geld zu verdienen und hilft Eray bei seiner Wand!</p>
                                </div>
                            </div>
                            <button onClick={() => scrollToSection('right')} className="my-arrow my-arrow-right">
                                <img src="/right.svg" alt="Next" />
                            </button>
                        </>
                    )}
                    {index === 2 && (
                        <>
                            <button onClick={() => scrollToSection('left')} className="my-arrow my-arrow-left">
                                <img src="/left.svg" alt="Previous" />
                            </button>
                            <h1 className="my-h1">Und genau darum geht es in SfÆ</h1>
                            <p className="my-p">Eine Peer to Peer Dienstleistungswebsite wo jeder Dienste anfordern kann und jeder als diese Dienste ausführen kann!</p>
                            
                            <button onClick={() => scrollToSection('right')} className="my-arrow my-arrow-right">
                                <img src="/right.svg" alt="Next" />
                            </button>
                        </>
                    )}
                    {index === 3 && (
                        <>
                            <button onClick={() => scrollToSection('left')} className="my-arrow my-arrow-left">
                                <img src="/left.svg" alt="Previous" />
                            </button>
                            <h1 className="my-h1">Worauf wartest du noch?</h1>
                            <p className="my-p">Starte jetzt und finde die besten Fachkräfte für deine Projekte!</p>
                            <button className="my-cta-button" onClick={() => window.location.href = '/index'}>Starte jetzt</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
