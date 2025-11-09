import { useCallback } from 'react';
import { dispatch } from '../editor.ts';
import { setSelectedElements } from '../functions/functions.ts';
import type { SlideElement } from '../types/types.ts';
import * as React from 'react';

interface SelectElements {
  elements: SlideElement[];
  selection: string[];
}

export const useSelectElements = ({ elements, selection }: SelectElements) => {
  const handleSelectElement = useCallback(
    (event: React.MouseEvent, curElement: SlideElement) => {
      if (event.ctrlKey || event.metaKey) {
        const isSelectedElements = selection.includes(curElement.id);
        const newSelection = isSelectedElements
          ? selection.filter((id) => id !== curElement.id)
          : [...selection, curElement.id];

        dispatch(setSelectedElements, {
          elementsIds: newSelection,
        });
      } else {
        dispatch(setSelectedElements, {
          elementsIds: [curElement.id],
        });
      }
    },
    [elements, selection]
  );

  return { handleSelectElement };
};
