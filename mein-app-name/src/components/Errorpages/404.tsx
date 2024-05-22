import "./404.css";

export function Err404({ code }: { code: string }) {
  return (
    <div className="error-page">
      <div className="noise"></div>
      <div className="overlay"></div>
      <div className="terminal">
        <h1>Error <span className="errorcode">${code}$</span></h1>
        <p className="output">
          The page you are looking for might have been removed, had its name changed, you don´t have access, or is temporarily unavailable.
        </p>
        <p className="output">
          Please try to <a className="Link" href="/">go back</a>.
        </p>
        <p className="output">Good luck.</p>
      </div>
    </div>
  );
}
