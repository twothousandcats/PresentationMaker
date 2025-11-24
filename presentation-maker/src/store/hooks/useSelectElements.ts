import { useCallback } from 'react';
import { setSelectedElements } from '../slices/editorSlice.ts';
import type { SlideElement } from '../types/types.ts';
import * as React from 'react';
import { useDispatch } from 'react-redux';

interface SelectElements {
  elements: SlideElement[];
  selection: string[];
}

export const useSelectElements = ({ selection }: SelectElements) => {
  const dispatch = useDispatch();

  const handleSelectElement = useCallback(
    (event: React.MouseEvent, curElement: SlideElement) => {
      if (event.ctrlKey || event.metaKey) {
        const isSelectedElements = selection.includes(curElement.id);
        const newSelection = isSelectedElements
          ? selection.filter((id) => id !== curElement.id)
          : [...selection, curElement.id];

        dispatch(
          setSelectedElements({
            elementsIds: newSelection,
          })
        );
      } else {
        dispatch(
          setSelectedElements({
            elementsIds: [curElement.id],
          })
        );
      }
    },
    [dispatch, selection]
  );

  return { handleSelectElement };
};
