package upload

import (
	"github.com/julienschmidt/httprouter"
	"github.com/globalsign/mgo"
)

func RegisterPackage(prefix string, r *httprouter.Router, _ *mgo.Database) {
	r.POST(prefix+"/upload/image", ImageUpload)
}
