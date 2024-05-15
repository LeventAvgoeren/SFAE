import React, { useState } from 'react';
import './PageWorkerFAQ.css';
import NavbarWComponent from './NavbarWComponent';

type FAQEntry = {
  id: number;
  question: string;
  answer: string;
};

const faqs: FAQEntry[] = [
    {
      id: 1,
      question: "Wie kann ich mich als Arbeiter auf Ihrer Plattform registrieren?",
      answer: "Um sich zu registrieren, klicken Sie einfach auf den 'Anmelden'-Button auf unserer Startseite, wählen die Option 'Arbeiter' und geben die erforderlichen Informationen einschließlich Ihrer Fähigkeiten und der Dienstleistungen, die Sie anbieten möchten, ein. Sobald Ihr Profil überprüft und genehmigt wurde, können Sie Jobbenachrichtigungen erhalten."
    },
    {
      id: 2,
      question: "Welche Qualifikationen benötige ich, um mich als Arbeiter anzumelden?",
      answer: "Wir verlangen von allen unseren Arbeitern eine berufliche Zertifizierung oder nachgewiesene Erfahrung in ihrem Dienstleistungsbereich. Die spezifischen Qualifikationen können je nach den angebotenen Dienstleistungen variieren."
    },
    {
      id: 3,
      question: "Gibt es eine Gebühr, um mich als Arbeiter auf Ihrer Plattform anzumelden?",
      answer: "Nein, die Anmeldung auf unserer Plattform ist für Arbeiter kostenlos. Wir glauben daran, allen qualifizierten Fachleuten die Möglichkeit zu geben, Arbeit zu finden und ihr Geschäft ohne Anfangskosten zu erweitern."
    },
    {
      id: 4,
      question: "Wie werde ich für meine Dienstleistungen bezahlt?",
      answer: "Die Zahlungen werden direkt über unsere sichere Plattform abgewickelt. Sobald ein Auftrag abgeschlossen und vom Kunden bestätigt wurde, werden die Gelder innerhalb weniger Geschäftstage auf Ihr verknüpftes Bankkonto oder Ihre gewählte Zahlungsmethode überwiesen."
    },
    {
      id: 5,
      question: "Kann ich ein Jobangebot ablehnen?",
      answer: "Ja, Sie können Jobangebote basierend auf Ihrer Verfügbarkeit, Ihrem Interesse und Ihren Tarifen annehmen oder ablehnen. Wir empfehlen eine klare Kommunikation mit den Kunden, um eine gegenseitige Verständigung und Erwartungshaltung sicherzustellen."
    },
    {
      id: 6,
      question: "Was passiert, wenn es zu einem Streit mit einem Kunden kommt?",
      answer: "Im Falle von Streitigkeiten wird unser engagiertes Support-Team eingreifen, um zu vermitteln und Probleme auf der Grundlage der Dienstleistungsbedingungen und der tatsächlichen Situation zu lösen. Wir sorgen für eine faire Lösung, um die Interessen beider Parteien zu schützen."
    },
    {
      id: 7,
      question: "Wie kann ich meine Sichtbarkeit auf der Plattform verbessern?",
      answer: "Sie können Ihre Sichtbarkeit verbessern, indem Sie Ihr Profil vollständig ausfüllen, hochwertige Fotos Ihrer Arbeit hinzufügen und positive Bewertungen von Ihren Kunden sammeln. Aktive und gut bewertete Profile werden höher eingestuft und erhalten mehr Sichtbarkeit."
    },
    {
      id: 8,
      question: "Kann ich meine Preise auf Ihrem Portal selbst festlegen?",
      answer: "Ja, auf unserer Plattform haben Sie die Freiheit, Ihre eigenen Preise festzulegen. Wir empfehlen, wettbewerbsfähige Preise anzusetzen, die der Qualität Ihrer Dienstleistungen entsprechen."
    },
    {
      id: 9,
      question: "Wie oft kann ich neue Jobs auf der Plattform finden?",
      answer: "Die Häufigkeit neuer Jobs hängt von der Nachfrage in Ihrem Fachbereich und Ihrer Region ab. Durch das Aktualisieren Ihres Profils und das Reagieren auf Jobanzeigen können Sie Ihre Chancen erhöhen, regelmäßig neue Aufträge zu erhalten."
    },
    {
      id: 10,
      question: "Bietet Ihre Plattform Schulungen oder Ressourcen für Arbeiter an?",
      answer: "Ja, wir bieten verschiedene Schulungen und Ressourcen an, um unsere Arbeiter in ihren Fachgebieten weiterzubilden und ihre Fähigkeiten zu erweitern. Diese Ressourcen sind darauf ausgelegt, Ihnen zu helfen, Ihre Dienstleistungen zu verbessern und Ihr Angebot zu erweitern."
    }
  ];
  
export function PageWorkerFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  

  return (
    <>
    <NavbarWComponent />
      <div className="background-image">
      <section className="faq-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="faq-title text-center pb-3">
                <h2>FAQ</h2>
              </div>
            </div>
            <div className="col-md-6 offset-md-3">
              <div className="faq" id="accordion">
                {faqs.map((faq) => (
                  <div className="card" key={faq.id}>
                    <div className="card-header" id={`faqHeading-${faq.id}`}>
                      <div className="mb-0">
                        <h5 className="faq-title" onClick={() => toggle(faq.id)}
                            data-toggle="collapse" data-target={`#faqCollapse-${faq.id}`}
                            aria-expanded={activeIndex === faq.id} aria-controls={`faqCollapse-${faq.id}`}>
                          <span className="badge">{faq.id}</span> {faq.question}
                        </h5>
                      </div>
                    </div>
                    <div id={`faqCollapse-${faq.id}`} className={`collapse ${activeIndex === faq.id ? 'show' : ''}`} aria-labelledby={`faqHeading-${faq.id}`} data-parent="#accordion">
                      <div className="card-body">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="my-6">
        <div className="grid sm:grid-cols-2 items-center gap-16 p-8 mx-auto max-w-4xl bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md text-[#333] font-[sans-serif]">
          <div>
            <h1 className="text-3xl font-extrabold">Let's Talk</h1>
            <div className="mt-12">
              <h2 className="text-lg font-extrabold">Email</h2>
              <ul className="mt-3">
                <li className="flex items-center">
                  <div className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                  </div>

                  <a href="mailto:info@example.com" className="text-[#007bff] text-sm ml-3">
                    <small className="block"></small>
                    <p>Support@sfae.com</p>
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-12">
              <h2 className="text-lg font-extrabold">Oder melde dich hier ganz bequem bei uns per Kontaktformular!</h2>
              <ul className="flex mt-3 space-x-4">
              </ul>
            </div>
          </div>
          <form className="ml-auto space-y-4">
            <input type='text' placeholder='Name' className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#007bff]" />
            <input type='email' placeholder='Email' className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#007bff]" />
            <input type='text' placeholder='Subject' className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#007bff]" />
            <textarea placeholder='Message' rows={6} className="w-full rounded-md px-4 border text-sm pt-2.5 outline-[#007bff]"></textarea>
            <button type='button' className="text-white bg-[#007bff] hover:bg-blue-600 font-semibold rounded-md text-sm px-4 py-2.5 w-full">Send</button>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}