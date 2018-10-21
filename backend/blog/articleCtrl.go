package blog

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
	"github.com/globalsign/mgo/bson"
	"go-vue-blog/backend/common"
	"go-vue-blog/backend/auth"
	"errors"
)

func ArticleCreate(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	identify := auth.GetIdentify(r)
	if identify.IsGuest() {
		common.HandleError(nil, w, 401)
		return
	}
	if !identify.IsAdmin() {
		common.HandleError(nil, w, 403)
		return
	}

	model := Article{}
	model.CreatedBy = identify.Id
	code, err := common.CreateByReq(r, &model)
	if err != nil {
		common.HandleError(err, w, code)
	} else {
		common.Out(model, w, r)
	}
}

func ArticleUpdate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	identify := auth.GetIdentify(r)

	model := Article{}

	err := common.FindById(&model, ps.ByName("id"))
	if err != nil {
		common.HandleError(err, w, 404)
	}

	errCode := identify.CheckAccessToMaterialOf(model.CreatedBy)
	if errCode > 0 {
		common.HandleError(nil, w, errCode)
		return
	}

	code, err := common.UpdateByReq(r, &model, ps.ByName("id"))
	if err != nil {
		common.HandleError(err, w, code)
	} else {
		common.Out(model, w, r)
	}
}

func ArticleDelete(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	identify := auth.GetIdentify(r)

	model := Article{}

	err := common.FindById(&model, ps.ByName("id"))
	if err != nil {
		common.HandleError(err, w, 404)
	}

	errCode := identify.CheckAccessToMaterialOf(model.CreatedBy)
	if errCode > 0 {
		common.HandleError(nil, w, errCode)
		return
	}

	code, err := common.RemoveByReq(&model, ps.ByName("id"))
	if err != nil {
		common.HandleError(err, w, code)
	} else {
		w.WriteHeader(204)
	}
}

func ArticleRead(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	identify := auth.GetIdentify(r)
	model := Article{}
	err := common.FindById(&model, ps.ByName("id"))
	if err == nil {
		err = model.FillCreatedUser()
	}
	if err != nil {
		common.HandleError(err, w, 404)
	} else if model.IsDraft == true && model.CreatedBy != identify.Id {
		common.HandleError(errors.New("You can't view draft"), w, 403)
	} else {
		common.Out(model, w, r)
	}
}

func ArticleMain(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	model := Article{}
	err := common.FindBy(&model, bson.M{"onMainPage": true})
	if err != nil {
		common.HandleError(err, w, 404)
	} else if model.IsDraft == true {
		common.HandleError(errors.New("Can't show draft on main page"), w, 422)
	} else {
		model.FillCreatedUser()
		common.Out(model, w, r)
	}
}

func ArticleList(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	model := Article{}
	list := Articles{}
	q := &bson.M{"excludeFromArticlesList": false, "isDraft": false}
	err := common.FindAllByReq(q, r, &model, &list.Data, &list.Meta)
	if err == nil {
		err = model.FillCreatedUsers(list.Data)
	}
	if err != nil {
		common.HandleError(err, w, 500)
		return
	}

	common.Out(list, w, r)
}

func ArticleFromUserList(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	identify := auth.GetIdentify(r)
	model := Article{}
	list := Articles{}
	userId := bson.ObjectIdHex(ps.ByName("userId"))
	q := &bson.M{"isDraft": false, "createdBy": userId}
	if identify.Id == userId {
		q = &bson.M{"createdBy": userId}
	}
	err := common.FindAllByReq(q, r, &model, &list.Data, &list.Meta)
	if err == nil {
		model.FillCreatedUsers(list.Data)
	}
	if err != nil {
		common.HandleError(err, w, 500)
		return
	}

	common.Out(list, w, r)
}
