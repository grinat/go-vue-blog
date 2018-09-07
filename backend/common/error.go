package common

import (
	"net/http"
	"fmt"
	"errors"
	"strconv"
	)

func HandleError(err error, w http.ResponseWriter, code int)  {
	fmt.Println("Error", err)
	if err == nil {
		err = errors.New("Error: " + strconv.Itoa(code))
	}
	http.Error(w, err.Error(), code)
}
