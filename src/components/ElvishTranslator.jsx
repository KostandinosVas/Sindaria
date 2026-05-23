import { useState, useEffect } from 'react';
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

const ElvishTranslator = () => {
    const [inputPhrase, setInputPhrase] = useState('');
    const [translation, setTranslation] = useState([]);
    const [isEnglishToElvish, setIsEnglishToElvish] = useState(false);
    const [dicts, setDicts] = useState(null);

    useEffect(() => {
        import('../data.js').then(({ englishToSindarin, sindarinToEnglish }) => {
            const engToSin = buildFlatMap(englishToSindarin);
            const sinToEng = buildFlatMap(sindarinToEnglish);
            setDicts({
                engToSin,
                sinToEng,
                // pre-sort once so handleTranslate never re-sorts
                engKeys: Object.keys(engToSin).sort((a, b) => b.split(' ').length - a.split(' ').length),
                sinKeys: Object.keys(sinToEng).sort((a, b) => b.split(' ').length - a.split(' ').length),
            });
        });
    }, []);

    const handleTranslate = () => {
        if (!dicts) return;
        const words = inputPhrase.toLowerCase().split(' ');
        let translatedWords = [];
        let index = 0;

        const lookupDict = isEnglishToElvish ? dicts.engToSin : dicts.sinToEng;
        const sortedKeys = isEnglishToElvish ? dicts.engKeys : dicts.sinKeys;

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
                <span className='text-xs tracking-[0.25em] uppercase lang-label'>
                    {isEnglishToElvish ? 'English' : 'Sindarin'}
                </span>
                <button
                    onClick={toggleTranslationDirection}
                    className='w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer swap-btn'
                    title='Swap languages'
                    aria-label='Swap languages'
                >
                    <FontAwesomeIcon icon={faRepeat} className='text-sm' />
                </button>
                <span className='text-xs tracking-[0.25em] uppercase lang-label-dim'>
                    {isEnglishToElvish ? 'Sindarin' : 'English'}
                </span>
            </div>

            {/* Main card */}
            <div className='rounded-2xl border overflow-hidden translator-card'>

                {/* Two panels */}
                <div className='grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:min-h-52 panels'>

                    {/* Input panel */}
                    <div className='flex flex-col p-5 gap-2'>
                        <label
                            htmlFor='translator-input'
                            className='text-[10px] tracking-[0.3em] uppercase panel-label'
                        >
                            {isEnglishToElvish ? 'English' : 'Sindarin'}
                        </label>
                        <textarea
                            id='translator-input'
                            rows={4}
                            className='flex-1 bg-transparent text-base resize-none leading-relaxed translator-input'
                            value={inputPhrase}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            placeholder={isEnglishToElvish ? 'Enter English text…' : 'Enter Sindarin text…'}
                        />
                    </div>

                    {/* Output panel */}
                    <div
                        role='region'
                        aria-label={`${isEnglishToElvish ? 'Sindarin' : 'English'} translation output`}
                        className='flex flex-col p-5 gap-2 relative output-panel'
                    >
                        <span className='text-[10px] tracking-[0.3em] uppercase panel-label'>
                            {isEnglishToElvish ? 'Sindarin' : 'English'}
                        </span>
                        <div aria-live='polite' aria-atomic='true' className='flex-1 text-base leading-relaxed'>
                            {translation.length > 0 ? (
                                translation.map((token, i) => (
                                    <span key={i}>
                                        {i > 0 ? ' ' : ''}
                                        {token.found ? (
                                            <span className='token-found'>{token.text}</span>
                                        ) : (
                                            <span
                                                className='token-missing cursor-help'
                                                title='Word not found in dictionary'
                                            >
                                                {token.text}
                                            </span>
                                        )}
                                    </span>
                                ))
                            ) : (
                                <span className='token-missing'>Translation appears here…</span>
                            )}
                        </div>
                        {translation.length > 0 && (
                            <button
                                onClick={copyToClipboard}
                                className='absolute bottom-4 right-4 transition-colors duration-200 cursor-pointer copy-btn'
                                title='Copy to clipboard'
                                aria-label='Copy translation to clipboard'
                            >
                                <FontAwesomeIcon icon={faCopy} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Translate button */}
                <div className='border-t p-4 translate-bar'>
                    <button
                        onClick={handleTranslate}
                        className='w-full py-3 text-xs tracking-[0.4em] uppercase font-semibold border rounded-xl transition-all duration-300 cursor-pointer translate-btn'
                        disabled={!dicts}
                    >
                        {dicts ? 'Translate' : 'Loading…'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ElvishTranslator;
