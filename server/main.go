package main

import (
	"context"
	"encoding/json"
	"fmt"
	"iotserver/db/mongodb"
	"iotserver/db/sqlite"
  "database/sql"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
  _ "embed"

	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
)

var mdb mongodb.MDB

type Fetch struct {
  Diff  int `json:"diff"`
}

func realTimeData(w http.ResponseWriter , r *http.Request)  {
  w.Header().Set("Content-Type", "text/event-stream")
  w.Header().Set("Cache-Control", "no-cache")
  w.Header().Set("Connection", "keep-alive")

  ticker := time.NewTicker(2*time.Second)
  defer ticker.Stop()

  for {

    select {
    case <- ticker.C : 
      x, err := mdb.RealTimeData()
      if err!= nil {
        log.Println(err)
        fmt.Fprintf(w ,"something went Wrong") 
        w.(http.Flusher).Flush()
        return 
      }
      data ,err := json.Marshal(x) 
      if err != nil {
        log.Println(err)
        fmt.Fprintf(w ,"something went Wrong") 
        w.(http.Flusher).Flush()
        return 
      }
      fmt.Fprintf(w, "data: %s\n\n" , data)

      w.(http.Flusher).Flush()
       
    case <- r.Context().Done() :
      return
    }
    
  }
  
}


func oldData(w http.ResponseWriter , r *http.Request){
  periodStr := r.URL.Query().Get("period") 
  period , err := strconv.Atoi(periodStr) 
  if err != nil{
    w.WriteHeader(http.StatusBadRequest)
    fmt.Fprintf(w , "%s/n/n", "something Went Wrong : you should provide a number") 
    log.Println(err)
  }

  avg , err := mdb.OldData(period)
  if err != nil{
    log.Println(err)
    w.WriteHeader(http.StatusInternalServerError)
    fmt.Fprintf(w , "%s/n/n", "something Went Wrong") 
  }
  json.NewEncoder(w).Encode(avg) 
  w.WriteHeader(http.StatusOK)
  return 
}

func main()  {
  fmt.Println("--------------")
  runSqlite()
  fmt.Println("----------------")

  if err := godotenv.Load(); err!= nil {
    log.Println("NO .env file found") 
  }

  uri := os.Getenv("MONGODB_URI") 
  db  := os.Getenv("DB_NAME")
  collection := os.Getenv("COLLECTION")
  if uri == "" || db == "" || collection == "" {
    log.Fatal("no uri provided")
  }

  mdb = mongodb.ConnectMongo(uri ,db ,collection) 
  // jsonData := mdb.FetchById("6720a1fffdd6ba9528b093f7")
  // fmt.Printf("%s\n", jsonData)
  
  corsHandler := cors.New(cors.Options{
    AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
  })


  _,err := mdb.OldData(7)
  if err != nil{
    log.Println(err)
  }
  fmt.Println("listenning on port 2020") 
  http.HandleFunc("GET /realtime" ,realTimeData )
  http.HandleFunc("GET /olddata" ,oldData)

  handler := corsHandler.Handler(http.DefaultServeMux)

  log.Fatal(http.ListenAndServe(":2020", handler))
}

var ddl string

func runSqlite()  {
  
  ctx := context.Background()
  db,err := sql.Open("sqlite3" , "dev.db") 
  if err != nil{
    fmt.Println(err)
  }
  if _ , err := db.ExecContext(ctx ,ddl); err != nil {
    fmt.Println(err)
  }
  queries:= sqlite.New(db) 
  // user ,err := queries.CreateUser(ctx ,sqlite.CreateUserParams{
  //   Name: "Oussama Ben Hassen",
  //   Email: "oussama@example.com",
  //   Password: "oussama",
  // })
  // if err != nil{
  //   fmt.Println("error while creating user" , err)
  // }
  // _ ,err = queries.CreateProject(ctx ,sqlite.CreateProjectParams{
  //   Name: "something 1",
  //   Owner: 1,
  // });
  // if err != nil{
  //   fmt.Println("error while creating project")
  // }
  // _ ,err = queries.CreateProject(ctx ,sqlite.CreateProjectParams{
  //   Name: "something 2",
  //   Owner: 1,
  // });
  // if err != nil{
  //   fmt.Println("error while creating project")
  // }
  // _ ,err = queries.CreateProject(ctx ,sqlite.CreateProjectParams{
  //   Name: "something 3",
  //   Owner: 2,
  // });
  // if err != nil{
  //   fmt.Println("error while creating project3", err)
  // }
  // fmt.Println("User created : " , user)
  projects  , err := queries.GetUserProjects(ctx,1)
  if err != nil{
    fmt.Println("getting a user : " , err)
  }
  fmt.Println(projects)
}
