package user

import (
	"net/http"
	"github.com/julienschmidt/httprouter"
	"go-vue-blog/backend/common"
	"encoding/json"
	"github.com/globalsign/mgo/bson"
	"errors"
	"go-vue-blog/backend/auth"
)

func UserRegister(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	identify := auth.GetIdentify(r)
	if identify.IsGuest() == false {
		common.HandleError(errors.New("You registred"), w, 403)
		return
	}

	model := auth.User{}
	code, err := common.CreateByReq(r, &model)
	if err != nil {
		common.HandleError(err, w, code)
	} else {
		model.Scenario = auth.ScenarioOwnerEdit
		common.Out(model, w, r)
	}
}

func UserLogin(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	form := auth.User{}
	model:= auth.User{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&form)
	if err != nil {
		common.HandleError(err, w, 500)
		return
	}

	err = common.FindBy(&model, bson.M{"email": form.Email})
	if err != nil {
		common.HandleError(errors.New("Wrong email"), w, 422)
		return
	}

	form.GreatePassword()
	if form.Password != model.Password {
		common.HandleError(errors.New("Wrong pass"), w, 422)
		return
	}

	model.Scenario = auth.ScenarioOwnerEdit
	common.Out(&model, w, r)
}

func UserProfile(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	model := auth.User{}
	err := common.FindById(&model, ps.ByName("id"))
	if err != nil {
		common.HandleError(err, w, 404)
	} else {
		identify := auth.GetIdentify(r)
		if identify.Id == model.Id {
			model.Scenario = auth.ScenarioOwnerEdit
		}
		common.Out(model, w, r)
	}
}