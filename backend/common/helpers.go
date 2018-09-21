package common

import (
	"crypto/md5"
	"encoding/hex"
	"html"
)

// created md hash by string
func GetMD5Hash(text string) string {
	hasher := md5.New()
	hasher.Write([]byte(text))
	return hex.EncodeToString(hasher.Sum(nil))
}

// clean string from xss
func PreventInjection(s string) string {
	return html.EscapeString(s)
}
