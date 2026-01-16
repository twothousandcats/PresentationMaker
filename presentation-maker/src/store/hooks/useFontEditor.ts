import { FONT_METADATA_URL, INITIAL_FONT } from '../utils/config.ts';
import { useCallback, useEffect, useState } from 'react';
import { LANGUAGES } from '../utils/langs.ts';

type Font = {
  family: string;
};

type Typography = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
};

export const useTypography = (initialFont: string = INITIAL_FONT) => {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(true);

  const [typography, setTypography] = useState<Typography>({
    fontFamily: initialFont,
    fontSize: 14,
    fontWeight: 400,
    fontStyle: 'normal',
  });

  useEffect(() => {
    let isMounted = true;

    const loadFonts = async () => {
      try {
        const res = await fetch(FONT_METADATA_URL);
        const text = await res.text();
        const jsonStr = text.replace(/^\)\]\}'/, '');
        const data = JSON.parse(jsonStr);

        if (isMounted) {
          const fontList: Font[] = data.familyMetadata.map((f: any) => ({
            family: f.family,
          }));
          setFonts(fontList);
        }
      } catch (err) {
        console.error(LANGUAGES.ru.fonts.fetchError, err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFonts();

    return () => {
      isMounted = false;
    };
  }, []);

  const setFontFamily = useCallback((family: string) => {
    setTypography((prev) => ({ ...prev, fontFamily: family }));
  }, []);

  const setFontSize = useCallback((size: number) => {
    setTypography((prev) => ({ ...prev, fontSize: size }));
  }, []);

  const toggleBold = useCallback(() => {
    setTypography((prev) => ({
      ...prev,
      fontWeight: prev.fontWeight === 800 ? 400 : 800,
    }));
  }, []);

  const toggleItalic = useCallback(() => {
    setTypography((prev) => ({
      ...prev,
      fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic',
    }));
  }, []);

  return {
    fonts,
    loading,
    typography,
    setFontFamily,
    setFontSize,
    toggleBold,
    toggleItalic,
  };
};
