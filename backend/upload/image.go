package upload

import (
	"net/http"
	"mime/multipart"
	"go-vue-blog/backend/common"
	"github.com/disintegration/imaging"
	"os"
	"image"
	_ "image/gif"
	_ "image/png"
	"image/jpeg"
	"github.com/corona10/goimagehash"
	"strconv"
	"path/filepath"
)

const (
	SaveFolder = "/uploads/"
	ImageWidth = 800
	ImageThumbWidthAndHeight = 96
	ImageQuality = 80
)

type Image struct {
	Id       string         `json:"id"`
	Url      string         `json:"url"`
	UrlThumb string         `json:"urlThumb"`
}

// parse image from form, convert and save
func (model *Image) Proceed(r *http.Request) error {
	file, err := common.ParseMultipartFile(r, "image")
	if err != nil {
		return err
	}

	err = model.Convert(file)
	if err != nil {
		return err
	}

	return nil
}

// convert multipart file to image
func (model *Image) Convert(file multipart.File) error {
	srcImage, _, err := image.Decode(file)
	if err != nil {
		return err
	}

	hash, err := goimagehash.PerceptionHash(srcImage)
	if err != nil {
		return err
	}
	model.Id = strconv.FormatUint(hash.GetHash(), 16)

	path, url, err := model.getUrlAndPath("_" + strconv.FormatInt(ImageWidth, 10) + ".jpg")
	if err != nil {
		return err
	}
	dstImage := imaging.Resize(srcImage, ImageWidth, 0, imaging.Lanczos)
	f, err := os.Create(path)
	defer f.Close()
	if err != nil {
		return err
	}

	err = jpeg.Encode(f, dstImage, &jpeg.Options{Quality: ImageQuality})
	if err != nil {
		return err
	}

	pathThumb, urlThumb, err := model.getUrlAndPath("_" + strconv.FormatInt(ImageThumbWidthAndHeight, 10) + ".jpg")
	if err != nil {
		return err
	}
	dstImageThumb := imaging.Fill(srcImage, ImageThumbWidthAndHeight, ImageThumbWidthAndHeight, imaging.Center, imaging.Lanczos)
	fT, err := os.Create(pathThumb)
	defer fT.Close()
	if err != nil {
		return err
	}

	err = jpeg.Encode(fT, dstImageThumb, &jpeg.Options{Quality: ImageQuality})
	if err != nil {
		return err
	}

	model.Url = url
	model.UrlThumb = urlThumb

	return err
}

func (model *Image) getFoldersFromId() string {
	path := ""
	for i := 0; i < len(model.Id) ;i++ {
		if i % 4 == 0 {
			path = path + "/"
		}
		path = path + model.Id[i:i+1]
	}
	return path
}

// return path and url for image based on image id
func (model *Image) getUrlAndPath(postfix string) (absPath string, url string, err error) {
	domain := os.Getenv("UPLOADS_DOMAIN")
	if domain == "" {
		domain = "http://localhost:9052"
	} else if domain == "relative" {
		domain = ""
	}

	rootDir, err := os.Getwd()
	if err != nil {
		return  "", "", err
	}

	foldersPath := model.getFoldersFromId()
	absPath = filepath.Join(rootDir, SaveFolder, foldersPath)
	relPath := filepath.Join(SaveFolder, foldersPath)
	err = os.MkdirAll(absPath, 0777)
	if err != nil {
		return  "", "", err
	}

	relPath = filepath.Join(relPath, model.Id + postfix)
	absPath = filepath.Join(absPath, model.Id + postfix)
	url = domain + relPath

	return absPath, url, nil
}
