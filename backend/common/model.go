package common

import (
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"net/http"
	"encoding/json"
	"strconv"
	"math"
)

type Model interface {
	Validate() error
	GetCollection() string
	GetDB() *mgo.Database
	BeforeCreate() error
	BeforeUpdate() error
}

type ModelMeta struct {
	TotalCount int `json:"totalCount"`
	PerPage int `json:"perPage"`
	CurrentPage int `json:"currentPage"`
	PageCount int `json:"pageCount"`
}

func CreateByReq(r *http.Request, model Model)  (code int, err error) {
	code = 500
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&model)
	if err != nil {
		return code, err
	}

	err = model.Validate()
	if err != nil {
		code = 422
		return code, err
	}

	err = CreateModel(model)
	if err != nil {
		return code, err
	}

	return code, nil
}

func CreateModel(model Model) error {
	err := model.BeforeCreate()
	if err != nil {
		return err
	}

	db := model.GetDB()
	c := db.C(model.GetCollection())
	err = c.Insert(model)
	return err
}

func FindById(model Model, id string) error {
	q := bson.M{"_id": bson.ObjectIdHex(id)}
	return FindBy(model, q)
}

func FindBy(model Model, q bson.M) error {
	db := model.GetDB()
	err := db.C(model.GetCollection()).Find(q).One(model)
	if err != nil {
		return err
	}

	return nil
}

func UpdateByReq(r *http.Request, model Model, id string) (code int, err error) {
	code = 500
	db := model.GetDB()
	q := bson.M{"_id": bson.ObjectIdHex(id)}
	err = db.C(model.GetCollection()).Find(q).One(model)
	if err != nil {
		code = 404
		return code, err
	}

	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&model)
	if err != nil {
		return code, err
	}

	err = model.Validate()
	if err != nil {
		code = 422
		return code, err
	}

	err = model.BeforeUpdate()
	if err != nil {
		return code, err
	}

	err = db.C(model.GetCollection()).UpdateId(bson.ObjectIdHex(id), model)
	if err != nil {
		return code, err
	}

	return code, nil
}

func RemoveByReq(model Model, id string) (code int, err error) {
	code = 500
	db := model.GetDB()
	q := bson.M{"_id": bson.ObjectIdHex(id)}
	err = db.C(model.GetCollection()).Find(q).One(model)
	if err != nil {
		code = 404
		return code, err
	}

	err = RemoveById(model, id)
	if err != nil {
		return code, err
	}

	return code, nil
}

func RemoveById(model Model, id string) error  {
	db := model.GetDB()
	q := bson.M{"_id": bson.ObjectIdHex(id)}
	err := db.C(model.GetCollection()).Remove(q)
	if err != nil {
		return err
	}

	return nil
}

func FindAllByReq(q *bson.M, r *http.Request, model Model, models interface{}, meta *ModelMeta) error {
	db := model.GetDB()
	perPage := 10
	sort := "-_id"
	page := 1
	for k, v := range r.URL.Query(){
		if k == "per-page" {
			perPage, _ = strconv.Atoi(v[0])
		}
		if k == "page" {
			page, _ = strconv.Atoi(v[0])
		}
		if k == "sort" {
			sort = PreventInjection(v[0])
		}
	}

	totalCount, err := db.C(model.GetCollection()).Find(q).Count()
	if err != nil {
		return err
	}

	pageCount := int(math.Ceil(float64(totalCount) / float64(perPage)))
	if page > pageCount {
		page = pageCount
	}

	skip := (page - 1) * perPage
	if skip < 0 {
		skip = 0
	}

	err = db.C(model.GetCollection()).Find(q).Limit(perPage).Skip(skip).Sort(sort).All(models)
	if err != nil {
		return err
	}

	meta.TotalCount = totalCount
	meta.PerPage = perPage
	meta.CurrentPage = page
	meta.PageCount = pageCount

	return nil
}