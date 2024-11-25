import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import TemperatureDisplay from "./Temperature";
import Something from "./something";
import Lumiere from "./Lumiere";
import Ph from "./Ph";

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);
const NutrChart = ({airTemperature , chartData , soilMoisture, airMoisture , solTemperature,lumiere,ph} ) => {
    
  
  

  return (
    
  <div className="flex-grow mt-10">





<table className="table-auto w-11/12 border-collapse border border-gray-200">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Temperature Air</th>
      <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Temperature Sol</th>

    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="px-4 py-2 text-center text-sm text-gray-700">
        <div className="flex justify-center items-center">
          <TemperatureDisplay temperature={airTemperature} />
        </div>
      </td>
      <td className="px-4 py-2 text-center text-sm text-gray-700">
        <div className="flex justify-center items-center">
          <TemperatureDisplay temperature={solTemperature} />
        </div>
      </td>
          </tr>
  </tbody>
</table>
<table className="table-auto mt-8 w-11/12 border-collapse border border-gray-200">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Luminosite</th>
      <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">PH</th>

    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="px-4 py-2 text-center text-sm text-gray-700">
        <div className="flex justify-center items-center">
          <Lumiere lumiere={lumiere} />
        </div>
      </td>
      <td className="px-4 py-2 text-center text-sm text-gray-700">
        <div className="flex justify-center items-center">
          <Ph ph={ph} />
        </div>
      </td>
          </tr>
  </tbody>
</table>    
    <div className="my-8">
      
          </div>


    <div className="flex justify-center">
      <div className="flex items-center justify-center w-full overflow-hidden">
        <Something value={airMoisture} nameChart={"Humidite Air"} />
        <Something value={soilMoisture} nameChart={"Humidite Sol"} />
      </div>
    </div>
   
    <div className="w-full h-[400px] overflow-hidden flex justify-center"> 
    <Line data={chartData} options={{ responsive: true }} />
    </div>
  </div>);
};

export default NutrChart;

;
