import "./404.css";

export function Err404({ code }: { code: string }) {
  return (
    <div className="error-page">
      <div className="noise"></div>
      <div className="overlay"></div>
      <div className="terminal">
        <h1>Error <span className="errorcode">${code}$</span></h1>
        <p className="output">
        Die Seite, die Sie suchen, wurde möglicherweise entfernt oder ihr Name wurde geändert, Sie haben keinen Zugang oder sie ist vorübergehend nicht verfügbar.
        </p>
        <p className="output">
        Bitte gehen Sie  <a className="Link" href="/">zurück</a>.
        </p>
        <p className="output">Viel Glück.</p>
      </div>
    </div>
  );
}
