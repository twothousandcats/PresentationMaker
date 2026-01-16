import { useState, useRef, useEffect } from 'react';
import { FONT_METADATA_URL } from '../../store/utils/config.ts';
import { LANGUAGES } from '../../store/utils/langs.ts';

type FontSelectorProps = {
  value: string;
  onChange: (family: string) => void;
};

export const FontSelector = ({ value, onChange }: FontSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fonts, setFonts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const loadFonts = async () => {
      try {
        const res = await fetch(FONT_METADATA_URL);
        const text = await res.text();
        const jsonStr = text.replace(/^\)\]\}'/, '');
        const data = JSON.parse(jsonStr);
        if (isMounted) {
          const fontList = data.familyMetadata.map((f: any) => f.family);
          setFonts(fontList);
        }
      } catch (err) {
        console.error(LANGUAGES.ru.fonts.fetchError, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadFonts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (family: string) => {
    onChange(family);
    setIsOpen(false);
  };

  const displayValue = value || '— Font —';

  return (
    <div
      className="font-selector"
      ref={dropdownRef}
      style={{ position: 'relative' }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '6px 10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          minWidth: '120px',
          backgroundColor: '#fff',
        }}
      >
        {displayValue}
      </div>

      {isOpen && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff',
            zIndex: 1000,
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {loading ? (
            <li style={{ padding: '8px' }}>Loading...</li>
          ) : (
            fonts.map((family) => (
              <li
                key={family}
                onClick={() => handleSelect(family)}
                style={{
                  padding: '6px 10px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#f0f0f0')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '')
                }
              >
                {family}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
