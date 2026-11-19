import { CATEGORIES } from "../constants/categories";
import { isValidQuantity } from "../utils/isValidQuantity";

function editItemInfo(appData, itemId, updatedInfo){
    const categories = CATEGORIES;
    const item = appData.items.find(item => item.id === itemId);

    if(!item){
        return {
            success: false,
            error: "NO_ITEM_FOUND"
        };
    }

    const result = {
        success: false,
        error: []
    }

    const { name, storageId, category, expectedQuantity, replenishmentMethod, storageUnit } = updatedInfo;

    // Validation for name //
    const normalizedName = name.trim().normalize("NFKC");

    if(normalizedName === ""){
        result.error.push("EMPTY_NAME");
    }

    if(normalizedName.length > 10){
        result.error.push("TOO_MANY_LETTERS_NAME");
    }

    const isDuplicate = appData.items.some(item => item.name.trim().normalize("NFKC") === normalizedName);

    if(isDuplicate){
        result.error.push("DUPLICATE_NAME");
    }

    // Validation for storageId //
    const doesStorageExist = appData.storages.some(storage => storage.id === storageId);

    if(!doesStorageExist){
        result.error.push("NO_STORAGE_FOUND");
    }

    // Validation for category //
    const deosCategoryExist = categories.some(cate => cate.type === category);

    if(!deosCategoryExist){
        result.error.push("NO_CATEGORY_FOUND");
    }

    // Validation for expectedQuantity //
    if(!isValidQuantity(expectedQuantity)){
        if(typeof expectedQuantity === "string"){
            if(expectedQuantity.trim() !== ""){
                result.error.push("INVALID_NUMBER"); // Exclude an empty input //
            }
        } else {
            result.error.push("INVALID_NUMBER");
        }
    } else if(Number(expectedQuantity) < 0 || Number(expectedQuantity) > 1000){
        result.error.push("INVALID_QUANTITY");
    }

    // Validation for replenishmentMethod //
    if(!["ORDER", "PURCHASE"].includes(replenishmentMethod)){
        result.error.push("INVALID_REPLENISHMENTMETHOD");
    }

    // Validation for storageUnit //
    if(storageUnit.trim() === ""){
        result.error.push("NO_STORAGE_UNIT");
    }

    if(storageUnit.trim().length > 8){
        result.error.push("TOO_MANY_LETTERS_UNIT");
    }

    if(result.error.length){
        return result;
    }

    const convertedExpectedQuantity =
        expectedQuantity.trim() === "" || Number(expectedQuantity) === 0 ?
        0 :
        Number(expectedQuantity) * 10;

    let tempUpdatedItem = {
        ...item,
        name: name.trim(),
        storageId: storageId,
        category: category,
        expectedQuantity: convertedExpectedQuantity,
        replenishmentMethod: replenishmentMethod,
        storageUnit: storageUnit.trim()
    };

    let updatedItem = {};


    if(Object.hasOwn(item, "pendingOrders") && replenishmentMethod === "PURCHASE"){
        const { pendingOrders, ...remaining } = tempUpdatedItem;
        updatedItem = remaining;
    } else if(!Object.hasOwn(item, "pendingOrders") && replenishmentMethod === "ORDER"){
        updatedItem = {
            ...tempUpdatedItem,
            pendingOrders: []
        };
    } else {
        updatedItem = tempUpdatedItem;
    }

    const newAppData = {
        ...appData,
        items: appData.items.map(item => {
            if(item.id === itemId){
                return updatedItem
            }
            return item;
        })
    };

    return {
        success: true,
        data: newAppData
    };
}

export default editItemInfo;