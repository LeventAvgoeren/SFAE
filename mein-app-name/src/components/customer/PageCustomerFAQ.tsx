import React, { useState } from 'react';
import './PageCustomerFAQ.css';
import NavbarComponent from '../navbar/NavbarComponent';
import { Footer } from 'react-bootstrap/lib/Modal';

type FAQEntry = {
  id: number;
  question: string;
  answer: string;
};

const faqs: FAQEntry[] = [
    {
      id: 1,
      question: "Wie finde ich einen qualifizierten Arbeiter für mein Projekt?",
      answer: "Um einen qualifizierten Arbeiter für Ihr Projekt zu finden, können Sie unsere Plattform durchsuchen und Profile von Arbeitern anzeigen, die Ihren Anforderungen entsprechen. Sie können auch eine Jobanzeige erstellen und qualifizierte Bewerber erhalten."
    },
    {
      id: 2,
      question: "Wie kann ich sicherstellen, dass ein Arbeiter zuverlässig ist?",
      answer: "Um die Zuverlässigkeit eines Arbeiters zu gewährleisten, können Sie Bewertungen und Feedbacks anderer Kunden überprüfen, die mit diesem Arbeiter zusammengearbeitet haben. Außerdem können Sie vor der Einstellung Referenzen anfordern und Interviews durchführen."
    },
    {
      id: 3,
      question: "Welche Zahlungsmethoden werden auf Ihrer Plattform akzeptiert?",
      answer: "Wir akzeptieren verschiedene Zahlungsmethoden, darunter Kreditkarten, Banküberweisungen und Online-Zahlungsdienste wie PayPal. Sie können die bevorzugte Zahlungsmethode wählen, die am besten zu Ihnen passt."
    },
    {
      id: 4,
      question: "Was passiert, wenn ich mit den erbrachten Dienstleistungen nicht zufrieden bin?",
      answer: "Wenn Sie mit den erbrachten Dienstleistungen nicht zufrieden sind, können Sie das Problem mit dem Arbeiter besprechen und eine Lösung suchen. Wenn keine zufriedenstellende Lösung gefunden wird, können Sie unseren Kundensupport kontaktieren, um weitere Unterstützung zu erhalten."
    },
    {
      id: 5,
      question: "Kann ich meine Projektdetails privat halten?",
      answer: "Ja, Sie können Ihre Projektdetails privat halten und nur ausgewählte Arbeiter einladen, Ihr Projekt einzusehen. Wir bieten Datenschutzoptionen, mit denen Sie die Privatsphäre Ihrer Projekte schützen können."
    },
    {
      id: 6,
      question: "Wie kann ich sicherstellen, dass mein Projekt termingerecht abgeschlossen wird?",
      answer: "Sie können sicherstellen, dass Ihr Projekt termingerecht abgeschlossen wird, indem Sie klare Projektziele und Fristen festlegen, regelmäßige Updates von Ihrem Arbeiter anfordern und bei Bedarf Meilensteine vereinbaren."
    },
    {
      id: 7,
      question: "Kann ich ein Projekt nach Beginn stornieren?",
      answer: "Die Möglichkeit, ein Projekt nach Beginn zu stornieren, hängt von den vereinbarten Bedingungen und den Richtlinien auf unserer Plattform ab. Sie sollten die Stornierungsbedingungen mit dem Arbeiter im Voraus besprechen und gegebenenfalls eine Stornoversicherung in Betracht ziehen."
    },
    {
      id: 8,
      question: "Wie kann ich sicherstellen, dass meine Zahlungen geschützt sind?",
      answer: "Um sicherzustellen, dass Ihre Zahlungen geschützt sind, sollten Sie die Zahlungen über unsere Plattform abwickeln, die sichere Zahlungsmethoden und Transaktionsschutz bietet. Sie können auch darauf achten, dass Zahlungen an Arbeitsfortschritte oder Meilensteine gebunden sind."
    },
    {
      id: 9,
      question: "Kann ich mehrere Projekte gleichzeitig auf Ihrer Plattform veröffentlichen?",
      answer: "Ja, Sie können mehrere Projekte gleichzeitig auf unserer Plattform veröffentlichen. Sie haben die Flexibilität, mehrere Projekte zu verwalten und verschiedene Arbeiter für unterschiedliche Aufgaben einzustellen."
    },
  ];
  
export function PageCustomerFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  

  return (
    <>
    <div className='Backg'>  
    <NavbarComponent />
       <section className="faq-section"> 
          <div className="row">
            <div className="col-md-6 offset-md-3">
            </div>
            <h2 style={{color:'black'}}>FAQ</h2>
              <div className="faq" id="accordion">
                {faqs.map((faq) => (
                  <div className="card" key={faq.id} style={{textAlign:"center"}}>
                    <div className="card-header" style={{textAlign:"center"}} id={`faqHeading-${faq.id}`}>
                      <div className="mb-0">
                        <h5 className="faq-title" onClick={() => toggle(faq.id)}
                            data-toggle="collapse" data-target={`#faqCollapse-${faq.id}`}
                            aria-expanded={activeIndex === faq.id} aria-controls={`faqCollapse-${faq.id}`}>
                          <span className="badge"style={{textAlign:"center"}}>{faq.id}</span> {faq.question}
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
      </section>
    
    </div>
   
   
    </>
  );
}