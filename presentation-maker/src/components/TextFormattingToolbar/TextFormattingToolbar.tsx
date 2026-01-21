import style from './TextFormattingToolbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentSlideElements,
  selectUI,
} from '../../store/selectors/editorSelectors.ts';
import { useMemo } from 'react';
import {
  changeElementFontFamily,
  changeElementFontColor,
  changeElementFontSize,
} from '../../store/slices/editorSlice.ts';
import type {
  HEXColor,
  RGBColor,
  TextElement,
} from '../../store/types/types.ts';
import { FontSelector } from '../FontSelector/FontSelector.tsx';
import { ColorPicker } from '../ColorPicker/ColorPicker.tsx';
import { FontSizeControl } from '../FontSizeControl/FontSizeControl.tsx';

export default function TextFormattingToolbar() {
  const dispatch = useDispatch();
  const { selection } = useSelector(selectUI);

  const slideId = useMemo(() => {
    return selection.selectedSlideIds[selection.selectedSlideIds.length - 1];
  }, [selection.selectedSlideIds]);
  const selectedElementIds = selection.selectedElementIds;
  const slideElements = useSelector(selectCurrentSlideElements);
  const selectedTextElements = useMemo(() => {
    const elementMap = new Map(slideElements.map((el) => [el.id, el]));
    return selectedElementIds
      .map((id) => elementMap.get(id))
      .filter((el): el is TextElement => el?.type === 'text');
  }, [selectedElementIds, slideElements]);

  const commonFontFamily = useMemo(() => {
    if (selectedTextElements.length === 0) return '';
    const first = selectedTextElements[0].fontFamily;
    return selectedTextElements.every((el) => el.fontFamily === first)
      ? first
      : '';
  }, [selectedTextElements]);

  const commonFontSize = useMemo(() => {
    if (selectedTextElements.length === 0) {
      return 14;
    }
    const first = selectedTextElements[0].fontSize;
    return selectedTextElements.every((el) => el.fontSize === first)
      ? first
      : 0;
  }, [selectedTextElements]);

  const commonColor = useMemo(() => {
    if (selectedTextElements.length === 0) return '#000000';
    const first = selectedTextElements[0].color;
    return selectedTextElements.every((el) => el.color === first) ? first : '';
  }, [selectedTextElements]);

  const handleChangeFontSize = (size: number) => {
    console.log(selection.selectedElementIds);
    dispatch(
      changeElementFontSize({
        slideId,
        elementIds: selection.selectedElementIds,
        newFontSize: size,
      })
    );
  };

  const handleChangeFontFamily = (family: string) => {
    dispatch(
      changeElementFontFamily({
        slideId,
        elementIds: selection.selectedElementIds,
        newFF: family,
      })
    );
  };

  const handleColorChange = (color: string) => {
    dispatch(
      changeElementFontColor({
        slideId,
        elementIds: selection.selectedElementIds,
        newColor: color as HEXColor | RGBColor,
      })
    );
  };

  return (
    <>
      {selectedTextElements.length > 0 && (
        <div className={style.toolbar}>
          <FontSelector
            value={commonFontFamily}
            onChange={handleChangeFontFamily}
          />
          <FontSizeControl
            value={commonFontSize}
            onChange={handleChangeFontSize}
          />
          <ColorPicker value={commonColor} onChange={handleColorChange} />
        </div>
      )}
    </>
  );
}
