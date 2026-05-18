import { useState } from 'react';
import { englishToSindarin, sindarinToEnglish } from '../data.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faRepeat } from '@fortawesome/free-solid-svg-icons';

// Flatten a dictionary: split comma-separated synonym keys, take primary value.
const buildFlatMap = (dict) => {
    const map = {};
    const addEntry = (subKey, value) => {
        if (!map[subKey]) map[subKey] = value;
    };
    for (const [key, rawValue] of Object.entries(dict)) {
        const primaryValue = rawValue.split(',')[0].trim();
        const subKeys = key.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
        for (const subKey of subKeys) {
            addEntry(subKey, primaryValue);
            if (subKey.includes(' ')) {
                for (const word of subKey.split(' ')) {
                    const clean = word.replace(/[^a-z0-9-]/gi, '').toLowerCase();
                    if (clean) addEntry(clean, primaryValue);
                }
            }
        }
    }
    return map;
};

const engToSinFlat = buildFlatMap(englishToSindarin);
const sinToEngFlat = buildFlatMap(sindarinToEnglish);

const ElvishTranslator = () => {
    const [inputPhrase, setInputPhrase] = useState('');
    const [translation, setTranslation] = useState([]);
    const [isEnglishToElvish, setIsEnglishToElvish] = useState(false);

    const handleTranslate = () => {
        const words = inputPhrase.toLowerCase().split(' ');
        let translatedWords = [];
        let index = 0;

        const lookupDict = isEnglishToElvish ? engToSinFlat : sinToEngFlat;

        const sortedKeys = Object.keys(lookupDict).sort((a, b) => b.split(' ').length - a.split(' ').length);

        while (index < words.length) {
            let matchFound = false;

            for (let key of sortedKeys) {
                const keyWords = key.split(' ');
                const slice = words.slice(index, index + keyWords.length).join(' ').replace(/[.,!?]/g, '');

                if (slice === key) {
                    translatedWords.push({ text: lookupDict[key], found: true });
                    index += keyWords.length;
                    matchFound = true;
                    break;
                }
            }

            if (!matchFound) {
                const cleanedWord = words[index].replace(/[.,!?]/g, '');
                if (lookupDict[cleanedWord]) {
                    translatedWords.push({ text: lookupDict[cleanedWord], found: true });
                } else {
                    translatedWords.push({ text: words[index], found: false });
                }
                index++;
            }
        }

        setTranslation(translatedWords);
    };

    const toggleTranslationDirection = () => {
        setIsEnglishToElvish(!isEnglishToElvish);
        setInputPhrase('');
        setTranslation([]);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputPhrase(value);
        if (!value) setTranslation([]);
    };

    const copyToClipboard = () => {
        if (translation.length > 0) {
            navigator.clipboard.writeText(translation.map(t => t.text).join(' ')).then(
                () => alert('Copied to clipboard!'),
                () => alert('Failed to copy!')
            );
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTranslate();
        }
    };

    return (
        <div className='w-full max-w-3xl' style={{ fontFamily: "'Cinzel', serif" }}>

            {/* Direction toggle bar */}
            <div className='flex items-center justify-center gap-6 mb-5'>
                <span className='text-xs tracking-[0.25em] uppercase text-slate-200'>
                    {isEnglishToElvish ? 'English' : 'Sindarin'}
                </span>
                <button
                    onClick={toggleTranslationDirection}
                    className='w-9 h-9 rounded-full border border-slate-600/50 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:bg-slate-700/50 hover:border-slate-400/70 hover:text-slate-200 transition-all duration-300 cursor-pointer'
                    title='Swap languages'
                >
                    <FontAwesomeIcon icon={faRepeat} className='text-sm' />
                </button>
                <span className='text-xs tracking-[0.25em] uppercase text-slate-600'>
                    {isEnglishToElvish ? 'Sindarin' : 'English'}
                </span>
            </div>

            {/* Main card */}
            <div className='rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl shadow-black/70 bg-slate-900'>

                {/* Two panels */}
                <div className='grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/50 min-h-52'>

                    {/* Input panel */}
                    <div className='flex flex-col p-5 gap-2'>
                        <span className='text-[10px] tracking-[0.3em] uppercase text-slate-500'>
                            {isEnglishToElvish ? 'English' : 'Sindarin'}
                        </span>
                        <textarea
                            rows={7}
                            className='flex-1 bg-transparent text-base text-slate-100 resize-none outline-none placeholder-slate-500 leading-relaxed'
                            value={inputPhrase}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            placeholder={isEnglishToElvish ? 'Enter English text…' : 'Enter Sindarin text…'}
                        />
                    </div>

                    {/* Output panel */}
                    <div className='flex flex-col p-5 gap-2 relative bg-slate-950'>
                        <span className='text-[10px] tracking-[0.3em] uppercase text-slate-500'>
                            {isEnglishToElvish ? 'Sindarin' : 'English'}
                        </span>
                        <div className='flex-1 text-base leading-relaxed'>
                            {translation.length > 0 ? (
                                translation.map((token, i) => (
                                    <span key={i}>
                                        {i > 0 ? ' ' : ''}
                                        {token.found ? (
                                            <span className='text-slate-100'>{token.text}</span>
                                        ) : (
                                            <span
                                                className='text-slate-600 cursor-help'
                                                title='Word not found in dictionary'
                                            >
                                                {token.text}
                                            </span>
                                        )}
                                    </span>
                                ))
                            ) : (
                                <span className='text-slate-600'>Translation appears here…</span>
                            )}
                        </div>
                        {translation.length > 0 && (
                            <button
                                onClick={copyToClipboard}
                                className='absolute bottom-4 right-4 text-slate-600 hover:text-slate-300 transition-colors duration-200 cursor-pointer'
                                title='Copy to clipboard'
                            >
                                <FontAwesomeIcon icon={faCopy} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Translate button */}
                <div className='border-t border-slate-700/50 p-4'>
                    <button
                        onClick={handleTranslate}
                        className='w-full py-3 text-xs tracking-[0.4em] uppercase font-semibold text-slate-300 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600/40 hover:border-slate-500/60 rounded-xl transition-all duration-300 cursor-pointer'
                    >
                        Translate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ElvishTranslator;
