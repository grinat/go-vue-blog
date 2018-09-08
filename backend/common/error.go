package common

import (
	"errors"
	"log"
	"net/http"
	"strconv"
)

func HandleError(err error, w http.ResponseWriter, code int)  {
	if err == nil {
		err = errors.New("Error: " + strconv.Itoa(code))
	}
	log.Println("Error", code, err)
	http.Error(w, err.Error(), code)
}
