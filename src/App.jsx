import ElvishTranslator from './components/ElvishTranslator';

function App() {
  return (
    <main>
      <div className='min-h-screen flex flex-col items-center justify-start md:justify-center px-4 pt-8 pb-12 md:py-12'>
        <header className='text-center mb-10'>
          <h1
            className='text-5xl md:text-6xl font-bold tracking-widest mb-3 app-title'
            style={{ fontFamily: "'Cinzel Decorative', cursive" }}
          >
            Sindarin
          </h1>
          <p
            className='tracking-[0.35em] uppercase text-xs app-subtitle'
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Elvish Language Translator
          </p>
        </header>

        <ElvishTranslator />

        <footer
          className='mt-10 text-xs tracking-widest app-footer'
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          &copy; 2024 Sindaria. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

export default App;
