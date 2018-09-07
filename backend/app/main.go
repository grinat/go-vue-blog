package app

import (
	"go-vue-blog/backend/blog"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"github.com/globalsign/mgo"
	"go-vue-blog/backend/user"
	"go-vue-blog/backend/common"
	"os"
	"go-vue-blog/backend/auth"
	"time"
	"fmt"
)

var dbConnectionRepeats = 0

const MAX_DB_RECONNECTS_ON_RUN = 60

func Run() {
	dbConnectionRepeats++
	con, err := GetDBConnection()
	if err != nil {
		// wait until docker mongo service was started
		if dbConnectionRepeats <= MAX_DB_RECONNECTS_ON_RUN {
			fmt.Println(err)
			fmt.Println("Cant connect to db, waiting... Repeat", dbConnectionRepeats, "of", MAX_DB_RECONNECTS_ON_RUN)
			time.Sleep(1 * time.Millisecond)
			Run()
			return
		} else {
			panic(err)
		}
	}

	router := httprouter.New()
	prefix := "/api"

	auth.SetDB(con)
	blog.RegisterPackage(prefix, router, con)
	user.RegisterPackage(prefix, router, con)

	router.OPTIONS(prefix+"/:module/:action", common.CORSHandler)
	router.OPTIONS(prefix+"/:module/:action/:id", common.CORSHandler)
	
	m := common.NewMiddleware(router, "")
	http.ListenAndServe(":9050", m)
	fmt.Println("Server run")
}

func GetDBConnection() (con *mgo.Database, err error) {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://bloger:Ismwo2137&2wnso@localhost:9051"
	}
	db := os.Getenv("MONGO_DB")
	if db == "" {
		db = "go-vue-blog"
	}
	session, err := mgo.Dial(mongoURI)
	if err != nil {
		return nil, err
	}
	session.SetMode(mgo.Monotonic, true)
	con = session.Clone().DB(db)
	return con, nil
}
