package common

import (
	"net/http"
	"mime/multipart"
)

// grub file in req and return file
func ParseMultipartFile(r *http.Request, fileField string) (file multipart.File, err error) {
	r.ParseMultipartForm(32 << 20)
	file, _, err = r.FormFile(fileField)
	if err != nil {
		return file, err
	}
	defer file.Close()
	return file, err
}
