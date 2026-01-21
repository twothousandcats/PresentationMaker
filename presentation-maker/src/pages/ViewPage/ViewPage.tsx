import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPresentation } from '../../lib/presentationService.ts';
import { Loader } from '../../components/Loader/Loader.tsx';
import type { Presentation, Selection } from '../../store/types/types.ts';
import SlideContent from '../../components/SlideContent/SlideContent.tsx';
import style from './ViewPage.module.css';
import { LANGUAGES } from '../../store/utils/langs.ts';
import IconLeft from '../../components/Icons/IconLeft.tsx';
import IconRight from '../../components/Icons/IconRight.tsx';
import IconClose from '../../components/Icons/IconClose.tsx';
import {
  PAGES_URL,
} from '../../store/utils/config.ts';
import { concatClassNames } from '../../store/utils/functions.ts';
import { useDocumentTitle } from '../../store/hooks/useDocumentTitle.ts';

export const ViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleBack = useCallback(() => {
    if (id) {
      navigate(PAGES_URL.editorPage + id);
    }
    // navigate(-1);
  }, [id, navigate]);

  // Загрузка
  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError(true);
        setLoading(false);

        return;
      }

      try {
        const data = await getPresentation(id);
        setPresentation(data);
      } catch (err) {
        console.error('Failed to load presentation:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    if (!presentation) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Escape') {
        handleBack();
      }
    };

    const goToNext = () => {
      if (currentSlideIndex < presentation.slides.length - 1) {
        setIsTransitioning(true);
        setCurrentSlideIndex((prev) => prev + 1);
      }
    };

    const goToPrev = () => {
      if (currentSlideIndex > 0) {
        setIsTransitioning(true);
        setCurrentSlideIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentation, currentSlideIndex, isTransitioning, handleBack]);

  // завершение перехода
  useEffect(() => {
    if (isTransitioning) {
      setIsTransitioning(false);
    }
  }, [isTransitioning]);

  useDocumentTitle(LANGUAGES.ru.pages.viewer);

  if (loading) {
    return <Loader />;
  }
  if (error || !presentation) {
    return <div className={style.error}>{LANGUAGES.ru.sliderErrorMessage}</div>;
  }

  const currentSlide = presentation.slides[currentSlideIndex];
  const selection: Selection = {
    selectedSlideIds: [],
    selectedElementIds: [],
  };
  const slideClasses = concatClassNames([
    style.slide,
    isTransitioning && style.slideEntering,
  ]);
  const closeClasses = concatClassNames([
    style.closeBtn,
  ]);
  const prevClasses = concatClassNames([
    style.navBtn,
    !(currentSlideIndex > 0) && style.navBtnDisabled,
  ]);
  const nextClasses = concatClassNames([
    style.navBtn,
    !(currentSlideIndex < presentation.slides.length - 1) &&
      style.navBtnDisabled,
  ]);
  // fade
  return (
    <div className={style.container}>
      <button className={closeClasses} onClick={handleBack}>
        <IconClose />
      </button>
      <div className={style.slider}>
        <div key={currentSlide.id} className={slideClasses}>
          <SlideContent
            slide={currentSlide}
            selection={selection}
            isEditable={false}
            isPreview={true}
          />
        </div>
      </div>

      <div className={style.handlers}>
        <button
          className={prevClasses}
          onClick={() => {
            if (!isTransitioning) {
              setIsTransitioning(true);
              setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
            }
          }}
          aria-label={LANGUAGES.ru.sliderToPrev}
        >
          <IconLeft />
        </button>
        <div className={style.indicator}>
          {currentSlideIndex + 1} / {presentation.slides.length}
        </div>
        <button
          className={nextClasses}
          onClick={() => {
            if (!isTransitioning) {
              setIsTransitioning(true);
              setCurrentSlideIndex((prev) =>
                Math.min(prev + 1, presentation.slides.length - 1)
              );
            }
          }}
          aria-label={LANGUAGES.ru.sliderToNext}
        >
          <IconRight />
        </button>
      </div>
    </div>
  );
};
