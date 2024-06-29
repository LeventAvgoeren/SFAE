import React, { useState } from 'react';
import './PageIntroduction.css';
import Lottie from 'react-lottie';
import animationData from "./roboter.json";
import animationData1 from "./customer.json";
import animationData2 from "./worker.json";
import animationData3 from "./Rating.json";
import animationData4 from "./Price.json";
import animationData5 from "./Map.json";
import animationData6 from "./Distance.json";
import animationData7 from "./Worker_2.json";

type Direction = 'left' | 'right';

interface TeamMemberCardProps {
    name: string;
    role: string;
    imgSrc: string;
    frontContent: React.ReactNode;
    backContent: React.ReactNode;
}

function TeamMemberCard({ name, role, imgSrc, frontContent, backContent }: TeamMemberCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className={`team-member ${isFlipped ? 'flipped' : ''}`}>
            <div className="team-member-inner">
                <div className="team-member-front">
                    <img src={imgSrc} alt={`${name}`} className="team-img" />
                    <h2 className="team-name">{name}</h2>
                    {frontContent}
                    <button className="flip-button" onClick={handleFlip}>Show Stats</button>
                </div>
                <div className="team-member-back">
                    <h2 className="team-name">{name}</h2>
                    {backContent}
                    <button className="flip-button" onClick={handleFlip}>Back</button>
                </div>
            </div>
        </div>
    );
}

export function PageIntroduction() {
    const [currentSection, setCurrentSection] = useState(1); // Starten bei der Welcome-Sektion
    const sections = ["left-section", "my-section1", "my-section2", "my-section3", "my-section4", "my-section5"];

    const scrollToSection = (direction: Direction) => {
        setCurrentSection(prevSection => {
            let newSection = direction === 'right' ? prevSection + 1 : prevSection - 1;
            if (newSection >= sections.length) newSection = 0;
            if (newSection < 0) newSection = sections.length - 1;
            return newSection;
        });
    };

    return (
        <>
            <div className="my-horizontal-scroll-container">
                {sections.map((section, index) => (
                    <div key={section} className={`my-horizontal-section ${section} ${currentSection === index ? 'my-show' : ''}`}>
                        {index === 1 && (
                            <>
                                <h1 className="my-h1">Welcome to SfÆ</h1>
                                <p className="my-p">Service fast and efficient!</p>
                                <p className="my-p">Ein Projekt erstellt von Ahmad Sfarjalani, Eray Zor, Levent Avgören, Duc Dai Nguyen und Danyal Mahrous!</p>
                                <div className="animation-roboter">
                                    <Lottie options={{
                                        loop: true,
                                        autoplay: true,
                                        animationData: animationData,
                                        rendererSettings: {
                                            preserveAspectRatio: 'xMidYMid slice'
                                        }
                                    }} height={"60vh"} width={"60vh"} />
                                </div>
                                <button onClick={() => scrollToSection('right')} className="my-arrow my-arrow-right" style={{color:"white"}}>
                                   Erklärung <img src="/right.svg" alt="Next" />
                                </button>
                                <button onClick={() => scrollToSection('left')} className="my-arrow my-arrow-left" style={{color:"white"}}>
                                    <img src="/left.svg" alt="Previous" /> Über uns
                                </button>
                                <button className="skip-tutorial-button" onClick={() => window.location.href = '/index'}>Tutorial überspringen</button>

                            </>
                        )}
                        {index === 0 && (
                            <>
                                <button onClick={() => scrollToSection('right')} className="my-arrow my-arrow-right">
                                    <img src="/right.svg" alt="Next" />
                                </button>
                                <h1 className="my-h1">Über uns</h1>
                                <div className="team-container">
                                    <TeamMemberCard
                                        name="Ahmad Sfarjalani"
                                        role="Frontend-Head"
                                        imgSrc="./Ahmad.jpeg"
                                        frontContent={(
                                            <>
                                                <p className="team-role"><strong>Frontend Master</strong></p>
                                                <p className="team-role">Number 1 Telekom Hater</p>
                                                <p className="team-role">Fixed Duc's Bugs</p>
                                            </>
                                        )}
                                        backContent={(
                                            <>

                                                <div className="team-attributes">

                                                </div>
                                            </>
                                        )}
                                    />
                                    <TeamMemberCard
                                        name="Eray Zor"
                                        role="Fullstack"
                                        imgSrc="./Eray.jpg"
                                        frontContent={(
                                            <>
                                                <p className="team-role"><strong>Backend/Frontend</strong></p>
                                                <p className="team-role">Kann irgendwie alles</p>
                                                <p className="team-role">Fixed Duc's Bugs</p>
                                            </>
                                        )}
                                        backContent={(
                                            <>
                                                <div className="team-attributes">

                                                </div>
                                            </>
                                        )}
                                    />
                                    <TeamMemberCard
                                        name="Levent Avgören"
                                        role="Scrum Master"
                                        imgSrc="./Levent.jpeg"
                                        frontContent={(
                                            <>
                                                <p className="team-role"><strong>Backend /Scrum Master</strong></p>
                                                <p className="team-role">Pick-Me Boy</p>
                                                <p className="team-role">Fixed Duc's Bugs</p>
                                            </>
                                        )}
                                        backContent={(
                                            <>

                                                <div className="team-attributes">

                                                </div>
                                            </>
                                        )}
                                    />
                                    <TeamMemberCard
                                        name="Duc Dai Nguyen"
                                        role="Frontend"
                                        imgSrc="./Duc.jpg"
                                        frontContent={(
                                            <>                                                                                          <p className="team-role"><strong>Frontend</strong></p>

                                                <p className="team-role">"He created bugs he fixed – a never-ending cycle!"</p>
                                                <p className="team-role">Created Bugs</p>
                                            </>
                                        )}
                                        backContent={(
                                            <>

                                                <div className="team-attributes">
                                                    <p><strong>Bugs erstellt:</strong> 500</p>

                                                </div>
                                            </>
                                        )}
                                    />
                                    <TeamMemberCard
                                        name="Danyal Mahrous"
                                        role="Frontend"
                                        imgSrc="./Danyal.jpg"
                                        frontContent={(
                                            <>                                                                                        <p className="team-role"><strong>Frontend</strong></p>

                                                <p className="team-role">Late-Starter</p>
                                            </>
                                        )}
                                        backContent={(
                                            <>

                                                <div className="team-attributes">

                                                </div>
                                            </>
                                        )}
                                    />
                                </div>
                            </>
                        )}
                        {index === 2 && (
                            <>
                                <button onClick={() => scrollToSection('left')} className="my-arrow my-arrow-left">
                                    <img src="/left.svg" alt="Previous" />
                                </button>
                                <div className='containerframe100'>
                                <h1 className="my-h1">SfÆ ist eine Dienstleistungswebsite, wo es zwei Rollen gibt:</h1>
                                <p className="my-p">Den Worker und den Customer!</p>
                                <p className="my-p">Als Worker bist du in der Lage Dienstleistungen zu verrichten. Als Customer kannst du nach Dienstleistungen anfragen wenn du Hilfe bei einer Sache brauchst.</p>
                                <p className="my-p">Folgendes Szenario:</p>
                                <div className="animation-container-doener">
                                    <div className="animation-worker">
                                        <Lottie options={{
                                            loop: true,
                                            autoplay: true,
                                            animationData: animationData1,
                                            rendererSettings: {
                                                preserveAspectRatio: 'xMidYMid slice'
                                            }
                                        }} height={"50vh"} width={"50vh"} />
                                        <p className="my-p">Das hier ist Eray, der am nächsten Tag Freunde erwartet und unbedingt seine Wand streichen muss, bevor sie kommen. Er kennt niemanden, der ihm helfen kann und findet SfÆ.</p>
                                    </div>
                                    <div className="animation-customer">
                                        <Lottie options={{
                                            loop: true,
                                            autoplay: true,
                                            animationData: animationData2,
                                            rendererSettings: {
                                                preserveAspectRatio: 'xMidYMid slice'
                                            }
                                        }} height={"50vh"} width={"50vh"} />
                                        <p className="my-p">Levent ist knapp bei Kasse! Er besucht SfÆ, um neben seiner eigentlichen Arbeit als Maler etwas Geld zu verdienen und hilft Eray bei seiner Wand! Duc Dai ist dabei.</p>
                                    </div>
                                </div>
                                </div>
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
                                <div className='containerframe200'>
                                    <h1 className="my-h1">Als Customer musst du lediglich den Preis festlegen. SFAE übernimmt dann die Suche nach dem passenden Worker basierend auf drei Kriterien:</h1>
                                    {/* Bewertung */}
                                    <div className="animation-container-doener">
                                        <div className="animation-rating">
                                            <Lottie options={{
                                                loop: true,
                                                autoplay: true,
                                                animationData: animationData3,
                                                rendererSettings: {
                                                    preserveAspectRatio: 'xMidYMid slice'
                                                }
                                            }} height={"50vh"} width={"50vh"} />
                                            <p className="my-p">Die Sternebewertung, die der Dienstleister von früheren Kunden erhalten hat.</p>
                                        </div>
                                        {/* Preis */}
                                        <div className="animation-price">
                                            <Lottie options={{
                                                loop: true,
                                                autoplay: true,
                                                animationData: animationData4,
                                                rendererSettings: {
                                                    preserveAspectRatio: 'xMidYMid slice'
                                                }
                                            }} height={"50vh"} width={"50vh"} />
                                            <p className="my-p">Den Preis, der deinem Budget am nächsten kommt.</p>
                                        </div>
                                        {/* Standort */}
                                        <div className="animation-map">
                                            <Lottie options={{
                                                loop: true,
                                                autoplay: true,
                                                animationData: animationData5,
                                                rendererSettings: {
                                                    preserveAspectRatio: 'xMidYMid slice'
                                                }
                                            }} height={"50vh"} width={"50vh"} />
                                            <p className="my-p">Und die geografische Nähe zu deinem Standort.</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => scrollToSection('right')} className="my-arrow my-arrow-right">
                                    <img src="/right.svg" alt="Next" />
                                </button>
                            </>
                        )}
                        {index === 4 && (
                            <>
                                <button onClick={() => scrollToSection('left')} className="my-arrow my-arrow-left">
                                    <img src="/left.svg" alt="Previous" />
                                </button>
                                <div>
                                    <h1 className="my-h1">Als Worker musst du lediglich Folgendes tun: Gib an, wie viel du verdienen möchtest.</h1>
                                    {/* Bewertung */}
                                    <div className="animation-container-doener">
                                        <div className="animation-distance">
                                            <Lottie options={{
                                                loop: true,
                                                autoplay: true,
                                                animationData: animationData6,
                                                rendererSettings: {
                                                    preserveAspectRatio: 'xMidYMid slice'
                                                }
                                            }} height={"50vh"} width={"50vh"} />
                                            <p className="my-p">Leg fest, in welchem Umkreis du Jobs erhalten möchtest.</p>
                                        </div>
                                        {/* Preis */}
                                        <div className="animation-details">
                                            <Lottie options={{
                                                loop: true,
                                                autoplay: true,
                                                animationData: animationData7,
                                                rendererSettings: {
                                                    preserveAspectRatio: 'xMidYMid slice'
                                                }
                                            }} height={"50vh"} width={"50vh"} />
                                            <p className="my-p">SFAE sendet dir anschließend die Details zu den Auftrag.</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => scrollToSection('right')} className="my-arrow my-arrow-right">
                                    <img src="/right.svg" alt="Next" />
                                </button>
                            </>
                        )}
                        {index === 5 && (
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
        </>
    );
}
