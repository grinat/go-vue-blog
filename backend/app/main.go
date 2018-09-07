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
)

func Run() {
	router := httprouter.New()
	con := GetDB()
	prefix := "/api"

	auth.SetDB(con)
	blog.RegisterPackage(prefix, router, con)
	user.RegisterPackage(prefix, router, con)

	router.OPTIONS(prefix+"/:module/:action", common.CORSHandler)
	router.OPTIONS(prefix+"/:module/:action/:id", common.CORSHandler)
	
	m := common.NewMiddleware(router, "")
	http.ListenAndServe(":9050", m)
}

func GetDB() *mgo.Database {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://bloger:Ismwo2137&2wnso@localhost:9051"
	}
	db := os.Getenv("MONGO_DB")
	if db == "" {
		db = "go-vue-blog"
	}
	session, err := mgo.Dial(mongoURI)
	session.SetMode(mgo.Monotonic, true)
	if err != nil {
		panic(err)
	}
	return session.Clone().DB(db)
}
