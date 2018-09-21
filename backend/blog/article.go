package blog

import (
	"time"
	"github.com/globalsign/mgo/bson"
	"github.com/globalsign/mgo"
	"errors"
	"go-vue-blog/backend/common"
	"go-vue-blog/backend/auth"
)

type Article struct {
	Id                      bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Title                   string        `json:"title" bson:"title"`
	Slug                    string        `json:"slug" bson:"slug"`
	Description             string        `json:"description" bson:"description"`
	LastUpdated             int32         `json:"lastUpdated" bson:"lastUpdated"`
	CreatedBy               bson.ObjectId `json:"createdBy" bson:"createdBy,omitempty"`
	OnMainPage              bool          `json:"onMainPage" bson:"onMainPage"`
	ExcludeFromArticlesList bool          `json:"excludeFromArticlesList" bson:"excludeFromArticlesList"`
	DisableHTMLEditor       bool          `json:"disableHTMLEditor" bson:"disableHTMLEditor"`
	IsDraft                 bool          `json:"isDraft" bson:"isDraft"`
	CreatedUser             auth.User     `json:"createdUser,omitempty" bson:"-"`
}

type Articles struct {
	Data []Article `json:"data"`
	Meta common.ModelMeta `json:"_meta"`
}

func (model *Article) updateTime() {
	model.LastUpdated = int32(time.Now().Unix())
}

func (model *Article) Validate() error {
	if model.Title == "" || len(model.Title) < 1 {
		return errors.New("To short title")
	}
	if model.Description == "" || len(model.Description) < 10 {
		return errors.New("To short desc")
	}
	if model.OnMainPage {
		q := bson.M{"onMainPage": true}
		if model.Id != "" {
			q = bson.M{"_id": bson.M{"$ne": model.Id}, "onMainPage": true}
		}
		found := Article{}
		common.FindBy(&found, q)
		if found.Id != "" {
			return errors.New("Only one article can be on main page")
		}
	}
	return nil
}

func (model Article) GetCollection() string {
	return "blog_article"
}

func (model Article) GetDB() *mgo.Database {
	return db
}

func (model *Article) BeforeCreate() error  {
	model.Id = bson.NewObjectId()
	model.updateTime()
	model.Slug = model.Title
	return nil
}

func (model *Article) BeforeUpdate() error  {
	model.updateTime()
	model.Slug = model.Title
	return nil
}

func (model *Article) FillCreatedUser() error {
	relation := auth.User{}
	inQ := &bson.M{"_id": model.CreatedBy}

	db := relation.GetDB()
	err := db.C(relation.GetCollection()).Find(inQ).One(&relation)

	model.CreatedUser = relation
	return err
}

func (model *Article) FillCreatedUsers(list []Article) error {
	relation := auth.User{}
	relations := []auth.User{}
	ids := []bson.ObjectId{}
	for i := 0; i < len(list);i++ {
		ids = append(ids, list[i].CreatedBy)
	}
	inQ := &bson.M{"_id": bson.M{"$in": ids}}

	db := relation.GetDB()
	err := db.C(relation.GetCollection()).Find(inQ).All(&relations)

	for i := 0; i < len(list);i++ {
		for rIdx := 0; rIdx < len(relations);rIdx++ {
			if relations[rIdx].Id == list[i].CreatedBy {
				list[i].CreatedUser = relations[rIdx]
				break
			}
		}
	}

	return  err
}
