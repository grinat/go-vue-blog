package upload

import (
	"net/http"
	"github.com/julienschmidt/httprouter"
	"go-vue-blog/backend/common"
)

func ImageUpload(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	image := Image{}
	err := image.Proceed(r)
	if err != nil {
		common.HandleError(err, w, 500)
		return
	}
	common.Out(image, w, r)
}
