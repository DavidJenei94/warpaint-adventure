import React, { Dispatch, SetStateAction } from 'react';
import Button from '../../UI/Button';

const colors: string[] = ['blue', 'red', 'purple', 'green', 'yellow', 'orange'];

interface ColorSelectionProps {
  selectedColor: string;
  setSelectedColor: Dispatch<SetStateAction<string>>;
  onClose?: () => void;
};

const ColorSelection = ({
  selectedColor,
  setSelectedColor,
  onClose,
}: ColorSelectionProps) => {
  const selectColorHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button: HTMLButtonElement = event.currentTarget;

    setSelectedColor(button.value);
  };

  const doubleClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    selectColorHandler(event);

    onClose && onClose();
  };

  return (
    <>
      {colors.map((color) => (
        <Button
          key={color}
          style={
            color === selectedColor
              ? { color, margin: '8px', fontSize: '18px' }
              : { color, margin: '8px' }
          }
          onClick={selectColorHandler}
          onDoubleClick={doubleClickHandler}
          value={color}
        >
          ██
        </Button>
      ))}
    </>
  );
};

export default ColorSelection;
