package app

import (
	"github.com/globalsign/mgo"
	"github.com/julienschmidt/httprouter"
	"go-vue-blog/backend/auth"
	"go-vue-blog/backend/blog"
	"go-vue-blog/backend/common"
	"go-vue-blog/backend/user"
	"log"
	"net/http"
	"os"
	"time"
	"go-vue-blog/backend/upload"
)

var dbConnectionRepeats = 0

const MAX_DB_RECONNECTS_ON_RUN = 60

func Run() {
	dbConnectionRepeats++
	con, err := GetDBConnection()
	if err != nil {
		// wait until docker mongo service was started
		if dbConnectionRepeats <= MAX_DB_RECONNECTS_ON_RUN {
			log.Println("Cant connect to db", err, "waiting... Repeat", dbConnectionRepeats, "of", MAX_DB_RECONNECTS_ON_RUN)
			time.Sleep(1 * time.Millisecond)
			Run()
			return
		} else {
			panic(err)
		}
	}

	// create route
	router := httprouter.New()
	prefix := "/api"
	// set panic handler
	router.PanicHandler = func(w http.ResponseWriter, _ *http.Request, p interface{}) {
		log.Panic(p)
		common.HandleError(nil, w, 500)
	}

	// register avalaible modules
	auth.SetDB(con)
	blog.RegisterPackage(prefix, router, con)
	user.RegisterPackage(prefix, router, con)
	upload.RegisterPackage(prefix, router, con)

	// set cors options
	router.OPTIONS(prefix+"/:module/:action", common.CORSHandler)
	router.OPTIONS(prefix+"/:module/:action/:id", common.CORSHandler)
	
	m := common.NewMiddleware(router, "")
	http.ListenAndServe(":9050", m)
	log.Println("Server run")
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
