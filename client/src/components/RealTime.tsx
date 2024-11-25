import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import NutrChart from "./NutrChart";
import Something from "./something";

const RealTime = () => {
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
  const [lumiere , setLumiere] = useState<any>(null) ;
  const [ph, setPh] = useState<any>(null) ;
  useEffect(() => {
    // Create a new EventSource to listen to the server
    const eventSource = new EventSource("http://localhost:2020/realtime?diff=20");

    eventSource.onmessage = (event: any) => {
      const data = JSON.parse(event.data); // Parse the incoming JSON data
      console.log(data[0])
      setChartData(processData(data));
      setAirTemperature(Math.round(data[0].TemperatureAir));
      setSolTemperature(Math.round(data[0].TemperatureSol));
      setSoilMoisture((data[0].HumiditeSol).toFixed(1));
      setAirMoisture((data[0].HumiditeAir).toFixed(1)); 
      setLumiere((data[0].Lumiere).toFixed(1)); 
      setPh((data[0].PHSol).toFixed(1)); 
    };

    eventSource.onerror = (error) => {
      console.error("Error with EventSource:", error);
    };

    return () => {
      eventSource.close();
    };
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
          lumiere = {lumiere}
          ph={ph}
          />

      </div>

    </div>
  )
};

export default RealTime;

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
    const newTimestamps = data
      .map((item: any) => makeTime(new Date(item.Timestamp)))
      .reverse();
    const newNitrogenLevels = data
      .map((item: any) => item.NiveauNutrimets.Nitrogen)
      .reverse();
    const newPhosphoreLevels = data
      .map((item: any) => item.NiveauNutrimets.Phosphorus)
      .reverse();

    const newPotassiumLevels = data
      .map((item: any) => item.NiveauNutrimets.Potassium)
      .reverse();
    return {
      labels: newTimestamps,
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
  };

