

import React from 'react';
const TemperatureDisplay = ({ temperature }) => {

  // Data for the gauge chart
    // Conditionally changing text color based on the temperature
  const getTemperatureColor = (temp) => {
    if (temp <= 0) return "text-blue-500"; // Cold
    if (temp <= 20) return "text-blue-700"; // Cool
    if (temp <= 30) return "text-yellow-400"; // Warm
    return "text-red-500"; // Hot
  };

  return (
    <div className="flex">
      <span
        className={`text-2xl font-semibold ${getTemperatureColor(temperature)}`}
      >
        {temperature}°C
      </span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-6 h-6 ${getTemperatureColor(temperature)}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9 3a1 1 0 012 0v2.218l1.105-.553a1 1 0 111.79.989l-2 4a1 1 0 01-.847.553l1.847 3.693a1 1 0 11-1.79.988L11 13.218V16a1 1 0 01-2 0v-2.782l-1.105.553a1 1 0 01-1.79-.989l2-4a1 1 0 01.847-.553L8 6.218V4a1 1 0 012 0v2.218l1.105-.553a1 1 0 111.79.989l-2 4a1 1 0 01-.847.553l1.847 3.693a1 1 0 11-1.79.988L9 12.218V10a1 1 0 01-2 0v-2.782L5.895 6.753a1 1 0 11-1.79-.988l2-4a1 1 0 01.847-.553L7 3.218V4a1 1 0 012 0z" />
      </svg>


      
    </div>
  );
};

export default TemperatureDisplay;
