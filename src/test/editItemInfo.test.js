import { describe, expect, it } from "vitest";
import editItemInfo from "../operations/editItemInfo";
import { testAppData } from "./fixtures";

describe("editItemInfo", () => {
    const appData = testAppData;

    it("should update an item's properties when an input is valid", () => {
        const result = editItemInfo(
            appData,
            "item-1",
            {
                name: "Buns",
                storageId: "storage-2",
                category: "drink",
                expectedQuantity: "20",
                replenishmentMethod: "PURCHASE",
                storageUnit: "unit"
            }
        );

        expect(result.success).toBe(true);
        
        const editedItem = result.data.items.find(item => item.id === "item-1");
        expect(editedItem.name).toBe("Buns");
        expect(editedItem.storageId).toBe("storage-2");
        expect(editedItem.category).toBe("drink");
        expect(editedItem.expectedQuantity).toBe(200);
        expect(editedItem.replenishmentMethod).toBe("PURCHASE");
        expect(editedItem.storageUnit).toBe("unit");
        expect(Object.hasOwn(editedItem, "pendingOrders")).toBe(false);
    })

    it("should return an error object when an input is invalid", () => {
        const result = editItemInfo(
            appData,
            "item-1",
            {
                name: "  ",
                storageId: "storage-10",
                category: "fruit",
                expectedQuantity: "10.11",
                replenishmentMethod: "ORDERR",
                storageUnit: "AAAAAAAAAA"
            }
        );

        expect(result.success).toBe(false);
        const errors = result.error;
        expect(errors.includes("EMPTY_NAME")).toBe(true);
        expect(errors.includes("NO_STORAGE_FOUND")).toBe(true);
        expect(errors.includes("NO_CATEGORY_FOUND")).toBe(true);
        expect(errors.includes("INVALID_NUMBER")).toBe(true);
        expect(errors.includes("INVALID_REPLENISHMENTMETHOD")).toBe(true);
        expect(errors.includes("TOO_MANY_LETTERS_UNIT")).toBe(true);
    })

    it("should preserve pendingOrders when both the original and input for replenishmentMethod is ORDER", () => {
        const result = editItemInfo(
            appData,
            "item-1",
            {
                name: "Buns",
                storageId: "storage-2",
                category: "drink",
                expectedQuantity: "20",
                replenishmentMethod: "ORDER",
                storageUnit: "unit"
            }            
        );

        expect(result.success).toBe(true);

        const editedItem = result.data.items.find(item => item.id === "item-1");
        expect(Object.hasOwn(editedItem, "pendingOrders")).toBe(true);
        expect(editedItem.pendingOrders.length).toBe(2);
    })

    it("should add the pendingOrders when the original item does not contain it but the input is ORDER", () => {
        const result = editItemInfo(
            appData,
            "item-2",
            {
                name: "Buns",
                storageId: "storage-2",
                category: "drink",
                expectedQuantity: "30",
                replenishmentMethod: "ORDER",
                storageUnit: "unit"
            }
        );

        expect(result.success).toBe(true);

        const editedItem = result.data.items.find(item => item.id === "item-2");
        console.log(editedItem)
        expect(Object.hasOwn(editedItem, "pendingOrders")).toBe(true);
    })
})