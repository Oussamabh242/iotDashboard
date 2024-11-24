import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import NutrChart from "./NutrChart";

const OldData= () => {
  const [data , setData] = useState()
  const [chartData, setChartData] = useState({
    labels: [], // Timestamps for X-axis
    datasets: [
      {
        label: "Nitrogen Level",
        data: [], // Nitrogen values for Y-axis
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        tension: 0.1, // Line smoothing
        fill: false, // No filling under the line
      },
      {
        label: "Phosphorus Level",
        data: [], // Nitrogen values for Y-axis
        borderColor: "rgba(255, 99, 132, 1)", // Line color
        tension: 0.1, // Line smoothing
        fill: false, // No filling under the line
      },
      {
        label: "Potassium Level",
        data: [], // Nitrogen values for Y-axis
        borderColor: "rgba(54, 162, 235, 1)", // Line color
        tension: 0.1, // Line smoothing
        fill: false, // No filling under the line
      },
    ],
  });
  const [airTemperature, setAirTemperature] = useState<any>(null);
  const [solTemperature, setSolTemperature] = useState<any>(null);
  const [soilMoistrue, setSoilMoisture] = useState<any>(null) ;
  const [airMoistrue, setAirMoisture] = useState<any>(null) ;
  useEffect(() => {
    // Example API URL
    const url = 'http://localhost:2020/olddata?period=7'; // replace with your API URL

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        setSolTemperature( data.temperature_sol.toFixed(1))
        setAirTemperature(data.temperature_air.toFixed(1))
        setSoilMoisture(data.humidite_sol.toFixed(1))
        setAirMoisture(data.humidite_air.toFixed(1))
        setChartData(processData(data.niveau_nutrimets))
         // Set the fetched data in state
      })
      .catch((error) => {
        console.log(error)
      });
  }, []);

  return (
    <div className="felx">
      <SideBar/>
      <div className="ml-72 mt-4">
        <NutrChart 
          airTemperature={airTemperature} 
          chartData={chartData} 
          soilMoisture={soilMoistrue} 
          airMoisture={airMoistrue} 
          solTemperature={solTemperature}
          />

      </div>

    </div>
  )
};

export default OldData;

const makeTime = (date: any) => {
  let hours = date.getHours(); // Get the current hour
  let minutes = date.getMinutes(); // Get the current minute

  // Ensure the minutes are always two digits (e.g., 09 instead of 9)
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Format the time as HH:MM
  let timeString = hours + ":" + minutes;

  return timeString;
}

const processData = (data: any) => {
    const newTimestamps = data.nitrogen.map(elm=>elm.date);
      
    const newNitrogenLevels = data.nitrogen
      .map((item: any) => item.value)
    const newPhosphoreLevels = data.phosphorus
      .map((item: any) => item.value)
    const newPotassiumLevels = data.potassium
      .map((item: any) => item.value)
    const thing =  {
      labels: data.nitrogen.map(elm=> elm.date),
      datasets: [
        {
          label: "Nitrogen Level",
          data: newNitrogenLevels, // Nitrogen values for Y-axis
          borderColor: "rgba(75, 192, 192, 1)", // Line color
          tension: 0.1, // Line smoothing
          fill: false, // No filling under the line
        },
        {
          label: "Phosphorus Level",
          data: newPhosphoreLevels, // Nitrogen values for Y-axis
          borderColor: "rgba(255, 99, 132, 1)", // Line color
          tension: 0.1, // Line smoothing
          fill: false, // No filling under the line
        },
        {
          label: "Potassium Level",
          data: newPotassiumLevels, // Nitrogen values for Y-axis
          borderColor: "rgba(54, 162, 235, 1)", // Line color
          tension: 0.1, // Line smoothing
          fill: false, // No filling under the line
        },
      ],
    };
    console.log(thing)
    return thing
  };

//const fetchAvg = async (period : number)=>{
//  let res = await fetch("http://locahost:2020/olddata?period="+period) ;
//  res = await res.json()
//
//  res
//}

