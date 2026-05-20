import { render, screen, fireEvent } from '@testing-library/react';
import ElvishTranslator from '../components/ElvishTranslator';

describe('ElvishTranslator', () => {
  it('renders without crashing', () => {
    render(<ElvishTranslator />);
    expect(screen.getByRole('button', { name: /translate/i })).toBeInTheDocument();
  });

  it('shows the correct default direction labels (Sindarin → English)', () => {
    render(<ElvishTranslator />);
    expect(screen.getByPlaceholderText(/enter sindarin text/i)).toBeInTheDocument();
  });

  it('renders the swap languages button', () => {
    render(<ElvishTranslator />);
    expect(screen.getByTitle('Swap languages')).toBeInTheDocument();
  });

  it('shows placeholder text in the output panel before any translation', () => {
    render(<ElvishTranslator />);
    expect(screen.getByText('Translation appears here…')).toBeInTheDocument();
  });

  it('toggles to English → Sindarin on swap button click', () => {
    render(<ElvishTranslator />);
    fireEvent.click(screen.getByTitle('Swap languages'));
    expect(screen.getByPlaceholderText(/enter english text/i)).toBeInTheDocument();
  });

  it('clears input and translation when direction is toggled', () => {
    render(<ElvishTranslator />);
    const swapBtn = screen.getByTitle('Swap languages');
    fireEvent.click(swapBtn); // → English→Sindarin

    const textarea = screen.getByPlaceholderText(/enter english text/i);
    fireEvent.change(textarea, { target: { value: 'and' } });
    fireEvent.click(screen.getByRole('button', { name: /translate/i }));

    // Toggle again — input and translation should clear
    fireEvent.click(swapBtn);
    expect(screen.getByPlaceholderText(/enter sindarin text/i).value).toBe('');
    expect(screen.getByText('Translation appears here…')).toBeInTheDocument();
  });

  it('translates a known English word to Sindarin', () => {
    render(<ElvishTranslator />);
    fireEvent.click(screen.getByTitle('Swap languages')); // → English→Sindarin

    fireEvent.change(screen.getByPlaceholderText(/enter english text/i), {
      target: { value: 'and' },
    });
    fireEvent.click(screen.getByRole('button', { name: /translate/i }));

    // "and" → "a, ah, ar" → primary value is "a"
    expect(screen.getByText('a')).toBeInTheDocument();
  });

  it('translates a known Sindarin word to English', () => {
    render(<ElvishTranslator />);
    // Default is Sindarin → English

    fireEvent.change(screen.getByPlaceholderText(/enter sindarin text/i), {
      target: { value: 'car' },
    });
    fireEvent.click(screen.getByRole('button', { name: /translate/i }));

    expect(screen.getByText('make')).toBeInTheDocument();
  });

  it('marks an unknown word as not found', () => {
    render(<ElvishTranslator />);
    fireEvent.click(screen.getByTitle('Swap languages'));

    fireEvent.change(screen.getByPlaceholderText(/enter english text/i), {
      target: { value: 'xyznotaword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /translate/i }));

    expect(screen.getByTitle('Word not found in dictionary')).toBeInTheDocument();
  });

  it('shows the copy button only after a translation is produced', () => {
    render(<ElvishTranslator />);
    expect(screen.queryByTitle('Copy to clipboard')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Swap languages'));
    fireEvent.change(screen.getByPlaceholderText(/enter english text/i), {
      target: { value: 'and' },
    });
    fireEvent.click(screen.getByRole('button', { name: /translate/i }));

    expect(screen.getByTitle('Copy to clipboard')).toBeInTheDocument();
  });

  it('copies translation to clipboard when copy button is clicked', async () => {
    render(<ElvishTranslator />);
    fireEvent.click(screen.getByTitle('Swap languages'));

    fireEvent.change(screen.getByPlaceholderText(/enter english text/i), {
      target: { value: 'and' },
    });
    fireEvent.click(screen.getByRole('button', { name: /translate/i }));
    fireEvent.click(screen.getByTitle('Copy to clipboard'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('a');
  });

  it('clears the translation when the textarea is emptied', () => {
    render(<ElvishTranslator />);
    fireEvent.click(screen.getByTitle('Swap languages'));

    const textarea = screen.getByPlaceholderText(/enter english text/i);
    fireEvent.change(textarea, { target: { value: 'and' } });
    fireEvent.click(screen.getByRole('button', { name: /translate/i }));

    fireEvent.change(textarea, { target: { value: '' } });
    expect(screen.getByText('Translation appears here…')).toBeInTheDocument();
  });

  it('triggers translation on Enter key press', () => {
    render(<ElvishTranslator />);
    fireEvent.click(screen.getByTitle('Swap languages'));

    const textarea = screen.getByPlaceholderText(/enter english text/i);
    fireEvent.change(textarea, { target: { value: 'and' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(screen.getByText('a')).toBeInTheDocument();
  });
});
