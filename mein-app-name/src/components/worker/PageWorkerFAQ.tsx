import React, { useState , memo } from "react";
import {
  MDBCol,
  MDBCollapse,
  MDBContainer,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
  MDBTypography,
} from 'mdb-react-ui-kit';
import "./PageWorkerFAQ.css"


interface Question {
  icon: string;
  title: string;
  content: string;
}

interface QuestionItemProps {
  question: Question;
  index: number;
  toggleCollapse: (index: number) => void;
  isOpen: boolean;
}


export default function PageWorkerFAQ() {
  const [isOpen, setIsOpen] = useState<boolean[]>(Array(6).fill(false));

  const toggleCollapse = (index: number) => {
    const newState = [...isOpen];
    newState[index] = !newState[index];
    setIsOpen(newState);
  };

  const questions = [
    { icon: "user", title: "Was bedeutet die Rolle des 'Worker'?", content: "Die Rolle des 'Worker' bezieht sich auf registrierte Nutzer, die auf unserer Plattform Dienstleistungen anbieten. Sie sind selbstständige Unternehmer, die ihre Fähigkeiten und Zeit anbieten, um spezifische Aufgaben oder Projekte abzuschließen." },
    { icon: "file-signature", title: "Wie kann man sich als Worker registrieren?", content: "Zur Registrierung als Worker müssen Sie ein Anmeldeformular ausfüllen, Ihre Qualifikationen nachweisen und unsere Nutzungsbedingungen akzeptieren. Nach der Überprüfung Ihrer Angaben werden Sie zur Teilnahme freigeschaltet." },
    { icon: "question-circle", title: "Wie funktioniert die Auftragszuweisung?", content: "Aufträge werden basierend auf den angegebenen Fähigkeiten und der Verfügbarkeit automatisch an Worker vergeben. Worker können auch Aufträge aus einer Liste verfügbarer Projekte auswählen." },
    { icon: "dollar-sign", title: "Wie und wann erfolgt die Bezahlung?", content: "Worker erhalten ihre Bezahlung wöchentlich über PayPal oder Banküberweisung, basierend auf den abgeschlossenen Aufträgen der vorherigen Woche." },
    { icon: "book-reader", title: "Werden Schulungen für Workers angeboten?", content: "Ja, wir bieten regelmäßige Schulungen und Workshops an, um die Fähigkeiten unserer Worker zu verbessern und sie über neue Trends und Werkzeuge auf dem Laufenden zu halten." },
    { icon: "tools", title: "Wie können Workers techinsche Unterstützung erhalten?", content: "Technische Unterstützung ist über unser Support-Center per Telefon, E-Mail oder Live-Chat verfügbar. Unser Team steht bereit, um bei technischen Problemen oder Fragen zu helfen." }
  ];

  return (
    <div className="background-image">
      <MDBContainer className="mt-5" style={{ maxWidth: "1000px" }}>
        <MDBListGroup>
          {questions.map((question, index) => (
            <QuestionItem key={index} question={question} index={index} toggleCollapse={toggleCollapse} isOpen={isOpen[index]} />
          ))}
        </MDBListGroup>
      </MDBContainer>
    </div>
  );
}

const QuestionItem = memo(({ question, index, toggleCollapse, isOpen }: QuestionItemProps) => {
  return (
    <MDBListGroupItem tag="a" onClick={() => toggleCollapse(index)} action>
      <div className="d-flex w-100 justify-content-between">
        <MDBRow className="w-100">
          <MDBCol size="1" className="text-center d-flex align-items-center">
            <MDBIcon fas icon={question.icon} size="3x" />
          </MDBCol>
          <MDBCol size="10">
            <MDBTypography tag="h5">{question.title}</MDBTypography>
            <p className="mb-1">{question.content}</p>
            <small><u>Learn more</u></small>
          </MDBCol>
        </MDBRow>
      </div>
      <MDBCollapse open={isOpen}>
        <p>{question.content}</p>
      </MDBCollapse>
    </MDBListGroupItem>
  );
});

