package mongodb

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	// "go.mongodb.org/mongo-driver/bson/primitive"
)

type MDB struct {
  db *mongo.Collection
}

type SensorData struct {
	ID            string        `bson:"_id"`
	HumiditeAir   float64       `bson:"humidite_air"`
	HumiditeSol   float64       `bson:"humidite_sol"`
	Lumiere       float64       `bson:"lumiere"`
	NiveauNutrimets NutrientLevels `bson:"niveau_nutrimets"`
	PHSol         float64       `bson:"pH_sol"`
	TemperatureAir float64      `bson:"temperature_air"`
	TemperatureSol float64      `bson:"temperature_sol"`
	Timestamp     time.Time     `bson:"timestamp"`
}

type NutrientLevels struct {
	Nitrogen  float64 `bson:"nitrogen"`
	Phosphorus float64 `bson:"phosphorus"`
	Potassium float64 `bson:"potassium"`
}



func ConnectMongo(uri , db , coll string) MDB {
  
  client ,err := mongo.Connect(context.TODO() ,options.Client().ApplyURI(uri))
  if err != nil{
    panic(err)
  }

  collection := client.Database(db).Collection(coll) 
  return MDB{
    db: collection,
  }
}

func (mdb MDB) RealTimeData( ) ([]SensorData , error){

  // now := time.Now() 
  //
  // timeThreshold := now.Add(time.Duration(-threshold)*time.Hour) 
  // filter := bson.D{
  //   {"timestamp" , bson.D{{"$gte" , timeThreshold}}} ,
  // }
  
  opts := options.Find().
    SetSort(bson.D{{"_id", -1}}). // Sort by timestamp in ascending order
    SetLimit(25)
  cursor , err := mdb.db.Find(context.TODO(),bson.D{} , opts)
  if err != nil {
    return nil , err
  }

  defer cursor.Close(context.TODO()) 

  var results []SensorData 

  for cursor.Next(context.TODO()) {
    var result SensorData
    if err := cursor.Decode(&result) ; err != nil {
      return nil , err
    }
    results = append(results, result)
  }

  if err :=  cursor.Err() ;  err != nil {
    return nil ,err
  }
  
  return results , nil 

}

func (mdb MDB) OldData( threshold int ) (Average , error){

  now := time.Now().UTC() 

  timeThreshold := now.Add(-time.Duration(threshold)*24*time.Hour) 
  fmt.Println(timeThreshold)
  objectID := primitive.NewObjectIDFromTimestamp(timeThreshold)
  objectIDEnd := primitive.NewObjectIDFromTimestamp(now)
  filter := bson.M{
		"_id": bson.M{
			"$gte": objectID, 
      "$lte": objectIDEnd, 
		},
	}

  // opts := options.Find().
  //   SetSort(bson.D{{"_id", -1}}) // Sort by timestamp in ascending order
    
  cursor , err := mdb.db.Find(context.TODO(),filter )
  if err != nil {
    return Average{} , err
  }

  defer cursor.Close(context.TODO()) 

  var results []SensorData 

  for cursor.Next(context.TODO()) {
    var result SensorData
    if err := cursor.Decode(&result) ; err != nil {
      return Average{}, err
    }
    results = append(results, result)
  }

  if err :=  cursor.Err() ;  err != nil {
    return Average{},err
  }

  avg , err := Avregages(results)
  if err != nil {
    return Average{} , err
  }
  
  return avg , nil

}

