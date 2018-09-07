package user

import (
	"github.com/globalsign/mgo"
	"github.com/julienschmidt/httprouter"
)

var db *mgo.Database = nil

func RegisterPackage(prefix string, r *httprouter.Router, con *mgo.Database)  {
	db = con
	r.POST(prefix + "/user/login", UserLogin)
	r.POST(prefix + "/user/register", UserRegister)
}
