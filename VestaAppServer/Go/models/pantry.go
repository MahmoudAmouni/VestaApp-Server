package models

type PantryItemName struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name"`
}

func (PantryItemName) TableName() string { return "pantry_item_names" }

type Unit struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	Name      string `json:"name"`
	Abbreviation string `json:"abbreviation"`
}

func (Unit) TableName() string { return "units" }

type PantryItem struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	OwnerUserID  uint           `json:"owner_user_id"`
	ItemNameID   uint           `json:"item_name_id"`
	ItemName     PantryItemName `json:"item_name" gorm:"foreignKey:ItemNameID"`
	Quantity     int            `json:"quantity"`
	UnitID       *uint          `json:"unit_id"`
	Unit         *Unit          `json:"unit" gorm:"foreignKey:UnitID"`
	ExpiryDate   *string        `json:"expiry_date"`
}

func (PantryItem) TableName() string { return "pantry_items" }
