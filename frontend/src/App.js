import Landing from './pages/Landing';
import './css/main.css';
import './css/pages.css';

function App() {
  return (
    <main>
      <header>
          <h2>Vandsburger Lab</h2>
          <p className="header-subtitle">University of California, Berkeley</p>
      </header>
      <body>
        {<Landing/>}
      </body>
    </main>
  );
}

export default App;
