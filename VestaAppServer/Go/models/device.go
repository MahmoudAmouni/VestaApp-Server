package models

type DeviceName struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name"`
}

func (DeviceName) TableName() string { return "device_names" }

type Device struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	HomeID       uint       `json:"home_id"`
	DeviceNameID uint       `json:"device_name_id"`
	DeviceName   DeviceName `json:"device_name" gorm:"foreignKey:DeviceNameID"`
	IsOn         int        `json:"is_on"`
}

func (Device) TableName() string { return "devices" }
