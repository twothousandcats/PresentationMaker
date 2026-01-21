import type { Presentation } from '../store/types/types.ts';

export const hashPresentation = (presentation: Presentation) => {
  const data = {
    title: presentation.title,
    slides: presentation.slides,
    size: presentation.size,
  };

  return JSON.stringify(data);
};
