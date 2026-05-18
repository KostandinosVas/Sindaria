import ElvishTranslator from './components/ElvishTranslator';

function App() {
  return (
    <main>
      <div className='min-h-screen flex flex-col items-center justify-center px-4 py-12'>
        <header className='text-center mb-10'>
          <h1
            className='text-5xl md:text-6xl font-bold text-amber-200 tracking-widest mb-3'
            style={{ fontFamily: "'Cinzel Decorative', cursive" }}
          >
            Sindarin
          </h1>
          <p
            className='text-amber-400/60 tracking-[0.35em] uppercase text-xs'
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Elvish Language Translator
          </p>
        </header>

        <ElvishTranslator />

        <footer
          className='mt-10 text-amber-200/25 text-xs tracking-widest'
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          I·Phith o Edhellen &nbsp;·&nbsp; Words of the Elves
        </footer>
      </div>
    </main>
  );
}

export default App;
