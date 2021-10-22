import { useState } from 'react';
import { Button } from 'antd';
import { SketchPicker } from 'react-color';
import rgbHex from 'rgb-hex';

interface ColorPickerProps {
  setColor: any;
  color: string;
  text: string;
}

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const { color, setColor, text } = props;
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = (e: any) => {
    setIsVisible((v) => !v);
  };

  return (
    <div className='color-picker'>
      <Button className='button' onClick={(e) => handleClick(e)}>
        <div style={{ backgroundColor: color }} className='color-preview'></div>
        {text || 'Pick Color'}
      </Button>
      {isVisible && (
        <div className='popover'>
          <SketchPicker
            disableAlpha={false}
            color={color}
            onChange={(color) => setColor('#' + rgbHex(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a))}
          />
        </div>
      )}
    </div>
  );
};
export default ColorPicker;
