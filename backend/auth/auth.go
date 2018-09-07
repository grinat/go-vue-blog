package auth

import (
	"net/http"
	"regexp"
	"github.com/globalsign/mgo"
	)

var db *mgo.Database = nil

func SetDB(con *mgo.Database)  {
	db = con
}

func GetIdentify(r *http.Request) User {
	// id := r.Context().Value("ID").(string)
	token := GetToken(r)
	model := User{}
	err := model.FindByToken(token)
	if err != nil {
		return User{}
	}
	return model
}

func GetToken(r *http.Request) string {
	token := ""
	tokenHeader := r.Header.Get("Authorization")
	if tokenHeader != "" {
		r, err := regexp.Compile(`(?i)Bearer (.+)`)
		if err == nil {
			result := r.FindStringSubmatch(tokenHeader)
			if len(result) > 1 {
				token = result[1]
			}
		}
	}
	return token
}
