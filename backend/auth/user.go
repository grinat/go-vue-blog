package auth

import (
	"github.com/globalsign/mgo/bson"
	"time"
	"errors"
	"crypto/rand"
	"github.com/globalsign/mgo"
	"go-vue-blog/backend/common"
	"encoding/hex"
	"strings"
	"encoding/json"
)

type User struct {
	Id          bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Name        string        `json:"name" bson:"name"`
	Email       string        `json:"email" bson:"email"`
	Password    string        `json:"password" bson:"password"`
	Token       string        `json:"token" bson:"token"`
	LastUpdated int32         `json:"lastUpdated" bson:"lastUpdated"`
	Pass        string        `json:"pass" bson:"-"`
	PassRepeat  string        `json:"passRepeat" bson:"-"`
	Role        string        `json:"role" bson:"role"`
	Avatar      string        `json:"avatar" bson:"avatar"`
	AvatarBig   string        `json:"avatarBig" bson:"avatarBig"`
	Scenario    string        `bson:"-"`
}

const RoleUser = "user"
const RoleAdmin = "admin"

const ScenarioOwnerEdit = "ScenarioOwnerEdit"

const DefaultAvatar = "https://bulma.io/images/placeholders/96x96.png"
const DefaultAvatarBig = "https://bulma.io/images/placeholders/96x96.png"

func (model *User) updateTime() {
	model.LastUpdated = int32(time.Now().Unix())
}

func (model User) MarshalJSON() ([]byte, error) {
	if model.Scenario == ScenarioOwnerEdit {
		return json.Marshal(map[string]interface{}{
			"id": model.Id,
			"name": model.Name,
			"email": model.Email,
			"token": model.Token,
			"lastUpdated": model.LastUpdated,
			"role": model.Role,
			"avatar": model.Avatar,
			"avatarBig": model.AvatarBig,
		})
	}
	return json.Marshal(map[string]interface{}{
		"id": model.Id,
		"name": model.Name,
		"lastUpdated": model.LastUpdated,
		"role": model.Role,
		"avatar": model.Avatar,
		"avatarBig": model.AvatarBig,
	})
}

func (model *User) GenerateToken() {
	rB := make([]byte, 18)
	_, err := rand.Read(rB)
	if err != nil {
		panic("Failed user generate token")
		return
	}
	model.Token = hex.EncodeToString(rB)
}

func (model *User) GreatePassword() {
	model.Password = common.GetMD5Hash("salt:" + model.Pass)
}

func (model *User) Validate() error {
	if model.Email == "" || len(model.Email) < 6 {
		return errors.New("To short email")
	}
	user := User{}
	err := common.FindBy(&user, bson.M{"email":model.Email})
	if err == nil {
		return errors.New("Email is busy")
	}
	if model.Pass == "" || len(model.Pass) < 6 {
		return errors.New("To short pass")
	}
	if model.Name == "" || len(model.Name) < 1 {
		return errors.New("To short name")
	}
	if model.Pass != model.PassRepeat {
		return errors.New("Pass not ident")
	}
	return nil
}

func (model User) GetCollection() string {
	return "user_user"
}

func (model User) GetDB() *mgo.Database {
	return db
}

func (model *User) BeforeCreate() error {
	model.Id = bson.NewObjectId()
	model.GenerateToken()
	model.updateTime()
	model.GreatePassword()
	model.Role = RoleUser
	model.Name = common.PreventInjection(model.Name)
	model.Email = common.PreventInjection(model.Email)
	model.checkAndUpdateAvatar()
	user := User{}
	err := common.FindBy(&user, bson.M{"role":RoleAdmin})
	if err != nil {
		model.Role = RoleAdmin
	}
	return nil
}

func (model *User) BeforeUpdate() error {
	model.updateTime()
	model.checkAndUpdateAvatar()
	return nil
}

func (model *User) FindByToken(token string) error {
	err := common.FindBy(model, bson.M{"token": strings.Trim(token, " ")})
	return err
}

func (model *User) IsAdmin() bool {
	return model.Role == RoleAdmin
}

func (model *User) IsGuest() bool {
	return !(model.Role == RoleUser  || model.Role == RoleAdmin)
}

func (model *User) checkAndUpdateAvatar() {
	model.Avatar = common.PreventInjection(model.Avatar)
	model.AvatarBig = common.PreventInjection(model.AvatarBig)
	if model.Avatar == "" {
		model.Avatar = DefaultAvatar
	}
	if model.AvatarBig == "" {
		model.AvatarBig = DefaultAvatarBig
	}

}

func (model *User) UpdateProfile(form User) error {
	if form.Avatar != "" {
		model.Avatar = form.Avatar
	}
	if form.AvatarBig != "" {
		model.AvatarBig = form.AvatarBig
	}
	if form.Name != "" {
		model.Name = common.PreventInjection(form.Name)
	}

	err := model.BeforeUpdate()
	if err != nil {
		return err
	}

	err = db.C(model.GetCollection()).UpdateId(model.Id, model)
	if err != nil {
		return err
	}

	return nil
}

// check user can edit article/comment or not
func (model User) CheckAccessToMaterialOf(createdBy bson.ObjectId) int {
	if model.IsGuest() == true {
		return 401
	}
	if model.Id == createdBy || model.IsAdmin() == true {
		return 0
	}
	return 403
}

func (model *User) IsHasNotId() bool{
	return model.Id == ""
}
