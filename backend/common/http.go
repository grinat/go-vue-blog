package common

import (
	"net/http"
	"github.com/julienschmidt/httprouter"
	"encoding/json"
	"context"
	"github.com/chilts/sid"
)

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

// The type of our middleware consists of the original handler we want to wrap and a message
type Middleware struct {
	next    http.Handler
	message string
}

// Make a constructor for our middleware type since its fields are not exported (in lowercase)
func NewMiddleware(next http.Handler, message string) *Middleware {
	return &Middleware{next: next, message: message}
}

func (m *Middleware) PanicHandler(w http.ResponseWriter, r *http.Request, err error) {
	HandleError(err, w, 500)
}

func (m *Middleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	ctx := context.WithValue(r.Context(), "ID", sid.Id())
	m.next.ServeHTTP(w, r.WithContext(ctx))
}

func CORSHandler(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	w.Header().Set("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Origin", "*")
}
