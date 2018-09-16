package blog

import (
	"github.com/julienschmidt/httprouter"
	"github.com/globalsign/mgo"
	)

var db *mgo.Database = nil

func RegisterPackage(prefix string, r *httprouter.Router, con *mgo.Database)  {
	db = con
	r.GET(prefix + "/blog/main", ArticleMain)
	r.GET(prefix + "/blog/articles", ArticleList)
	r.GET(prefix + "/blog/article/:id", ArticleRead)
	r.POST(prefix + "/blog/article", ArticleCreate)
	r.PATCH(prefix + "/blog/article/:id", ArticleUpdate)
	r.DELETE(prefix + "/blog/article/:id", ArticleDelete)
	r.GET(prefix + "/blog/articles-from-user/:userId", ArticleFromUserList)
}
