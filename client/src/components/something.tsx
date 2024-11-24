
import * as React from 'react';
import { ArcGauge, ArcGaugeProps } from '@progress/kendo-react-gauges';

const colors = [
  {
    to: 25,
    color: '#0058e9'
  },
  {
    from: 25,
    to: 50,
    color: '#37b400'
  },
  {
    from: 50,
    to: 75,
    color: '#ffc000'
  },
  {
    from: 75,
    color: '#f31700'
  }
];

const Something = ({value , nameChart}) => {
  
  const arcOptions: ArcGaugeProps = {
    value: value,
    colors
  };

  // Center renderer to display the value in the middle of the gauge
 const arcCenterRenderer = (value: number, color: string , name: string) => {
    return (
      <div
        className={`text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          text-sm font-bold`} // Tailwind classes for positioning and styling
        style={{ color }}
      >
        {value}% <br/>
        {nameChart} 
      </div>
    );
  };

  return (
    <div className="relative mx-12 w-64 h-52"> {/* Tailwind classes to control the size of the gauge */}
      <ArcGauge {...arcOptions} arcCenterRender={arcCenterRenderer} />
    </div>
  );
};

export default Something;
