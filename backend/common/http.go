package common

import (
	"net/http"
	"github.com/julienschmidt/httprouter"
	"encoding/json"
	"context"
	"github.com/chilts/sid"
)

// parse model/models and return json response
func Out(data interface{}, w http.ResponseWriter, r *http.Request) {
	js, err := json.Marshal(data)
	id := r.Context().Value("ID")
	w.Header().Set("ID", id.(string))
	if err != nil {
		HandleError(err, w, 500)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.Write(js)
	}
}

// created Middleware
type Middleware struct {
	next    http.Handler
}

func NewMiddleware(next http.Handler, message string) *Middleware {
	return &Middleware{next: next}
}

// added context with id and alow orgigin header
func (m *Middleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	ctx := context.WithValue(r.Context(), "ID", sid.Id())
	m.next.ServeHTTP(w, r.WithContext(ctx))
}

// handler for options requests
func CORSHandler(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	w.Header().Set("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Origin", "*")
}
