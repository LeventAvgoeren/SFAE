import "./LoadingIndicator.css";


type StyleSheet = {
  name: string;
  href: string;
};

type Icon = {
  name: string;
  glyph: string;
};

type Size = {
  icon: string;
  title: string;
};

// Vorgegebene Werte für Stylesheets, Icons und Sizes
const stylesheets: StyleSheet[] = [
  { name:"Darkly",   href:"//maxcdn.bootstrapcdn.com/bootswatch/3.3.0/darkly/bootstrap.min.css" },
  // Fügen Sie hier weitere Stylesheets hinzu
];

const icons: Icon[] = [
  { name:"Gear",    glyph:"cog" },
  // Fügen Sie hier weitere Icons hinzu
];

const sizes: Size[] = [
  { icon:'4x', title:'h2' },
  // Fügen Sie hier weitere Größen hinzu
];

function LoadingIndicator() {


  return (
    <>
    <div id="CON">
      <div className="animation-container">
    <div className="lightning-container">
      <div className="lightning white"></div>
      <div className="lightning red"></div>
    </div>
    <div className="boom-container">
      <div className="shape circle big white"></div>
      <div className="shape circle white"></div>
      <div className="shape triangle big yellow"></div>
      <div className="shape disc white"></div>
      <div className="shape triangle blue"></div>
    </div>
    <div className="boom-container second">
      <div className="shape circle big white"></div>
      <div className="shape circle white"></div>
      <div className="shape disc white"></div>
      <div className="shape triangle blue"></div>
    </div>
    </div>
    <div className="L">
         LOADING
     </div>
  </div>
  </>
  );
}

export default LoadingIndicator;
