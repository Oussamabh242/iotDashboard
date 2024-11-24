package mongodb

import (

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Average struct {
	HumiditeAir   float64       `json:"humidite_air"`
	HumiditeSol   float64       `json:"humidite_sol"`
	Lumiere       float64       `json:"lumiere"`
	NiveauNutrimets NutrientLevelsAvg `json:"niveau_nutrimets"`
	PHSol         float64       `json:"pH_sol"`
	TemperatureAir float64      `json:"temperature_air"`
	TemperatureSol float64      `json:"temperature_sol"`
}

type NutrientLevelsAvg struct {
	Nitrogen  []Level `json:"nitrogen"`
	Phosphorus []Level `json:"phosphorus"`
	Potassium []Level `json:"potassium"`
}

type Level struct {
  Value float64 `json:"value"`
  Date  string `json:"date"`
}


func Avregages(data []SensorData)(Average , error) {
  
  classByDate := make(map[string][]NutrientLevels)
  
  avgs := Average{

  }
  for _ ,obj := range data {
    id, err := primitive.ObjectIDFromHex(obj.ID)
    if err != nil {

      return Average{} ,err
    }

    // Get the timestamp from the ObjectId
    timestamp := id.Timestamp()

    // Print the timestamp
    date := timestamp.Format("02-01-2006")
    _ , ok := classByDate[date]
    if !ok {
      classByDate[date] = []NutrientLevels{obj.NiveauNutrimets} 
    }else {
      classByDate[date] = append(classByDate[date], obj.NiveauNutrimets)
    }
    avgs.HumiditeAir += obj.HumiditeAir/float64(len(data))
    avgs.HumiditeSol += obj.HumiditeSol/float64(len(data))
    avgs.TemperatureAir += obj.TemperatureAir/float64(len(data))
    avgs.TemperatureSol += obj.TemperatureSol/float64(len(data))
    avgs.Lumiere += obj.Lumiere/float64(len(data))
    avgs.PHSol += obj.PHSol/float64(len(data))
  } 
  
  for key , val := range classByDate {
    var N float64 = 0
    var P float64= 0
    var Ph float64 = 0
    for i := range val {
      N+=val[i].Nitrogen/float64(len(val))
      P+=val[i].Potassium/float64(len(val))
      Ph+=val[i].Phosphorus/float64(len(val))
    }
    avgs.NiveauNutrimets.Nitrogen = append(avgs.NiveauNutrimets.Nitrogen, Level{
      Value: N,
      Date: key,
    })
    avgs.NiveauNutrimets.Potassium = append(avgs.NiveauNutrimets.Potassium, Level{
      Value: P,
      Date: key,
    })
    avgs.NiveauNutrimets.Phosphorus = append(avgs.NiveauNutrimets.Phosphorus, Level{
      Value: Ph,
      Date: key,
    })
  }
  
  return avgs , nil
}
