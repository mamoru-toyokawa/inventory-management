import { useState } from "react";
import { useAppData } from "../../../context/useAppData";
import { CATEGORIES } from "../../../constants/categories";
import { isValidQuantity } from "../../../utils/isValidQuantity";

function EditItemForm({ selectedItem, handleSave }){
    const { appData } = useAppData();
    const displayedItem = appData.items.find(item => item.id === selectedItem);
    const { name, storageId, category, expectedQuantity, replenishmentMethod, storageUnit } = displayedItem;

    const categories = CATEGORIES;

// The first value is the current registered information //
    const [userInput, setUserInput] = useState({
        name: name,
        storageId: storageId,
        category: category,
        expectedQuantity: String(expectedQuantity/10),
        replenishmentMethod: replenishmentMethod,
        storageUnit: storageUnit
    });

    const isZero = userInput.expectedQuantity === "0";

// Checks if these three inputs are valid, and is used to determine if the border should be colored //
    const errs = {
        name: userInput.name === "",
        storageUnit: userInput.storageUnit === "",
        expectedQuantity: isValidQuantity(userInput.expectedQuantity) || isZero ? false : true
    };

    const cannotSubmit = Object.keys(errs).some(key => errs[key] === true);

// Controls if the submission button is submittable //
    const isDisabled = 
        (userInput.name === name &&
        userInput.storageId === storageId &&
        Number(userInput.expectedQuantity * 10) === expectedQuantity && 
        userInput.replenishmentMethod === replenishmentMethod &&
        userInput.storageUnit === storageUnit)||
        cannotSubmit ;

    function handleChange(e){
        const { name, value } = e.target;

        setUserInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleSubmit(e){
        e.preventDefault();

        handleSave(userInput);
        return;
    }

    return (
        <form 
            className="edit-item-form"
            onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name_edit">名前</label>
                <input
                    id="name_edit"
                    type="text"
                    name="name"
                    className={`form-input ${errs.name ? "has-err" : ""}`}
                    value={userInput.name}
                    onChange={handleChange}
                ></input>
            </div>

            <div>
                <label htmlFor="place_edit">保管先ストレージ</label>
                <select
                    id="place_edit"
                    name="storageId"
                    className="selection"
                    value={userInput.storageId}
                    onChange={handleChange}
                >
                {appData.storages.map(storage => (
                    <option
                        key={storage.id}
                        value={storage.id}
                    >{storage.name}
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label htmlFor="category_edit">カテゴリー</label>
                <select
                    id="category_edit"
                    name="category"
                    className="selection"
                    value={userInput.category}
                    onChange={handleChange}
                >
                {categories.map(category => (
                    <option
                        key={category.type}
                        value={category.type}
                    >{category.word}
                    </option>
                ))}
                </select>
            </div>
            
            <div>
                <label htmlFor="storage-unit-edit">単位</label>
                <input
                    id="storage-unit-edit"
                    name="storageUnit"
                    className={`form-input ${errs.storageUnit ? "has-err" : ""}`}
                    type="text"
                    value={userInput.storageUnit}
                    onChange={handleChange}
                ></input>
            </div>

            <div>
                <label htmlFor="expected-quantity-edit">最低在庫数</label>
                <input
                    id="expected-quantity-edit"
                    name="expectedQuantity"
                    className={`form-input ${errs.expectedQuantity ? "has-err" : ""}`}
                    type="number"
                    value={userInput.expectedQuantity}
                    onChange={handleChange}
                ></input>
            </div>

            <fieldset className="replenishment-method-field">
                <legend>リストック方法</legend>

                <div>
                    <input
                        id="replenishmentmethod-order-edit"
                        name="replenishmentMethod"
                        className="replenishmentmethod-option"
                        type="radio"
                        value="ORDER"
                        checked={userInput.replenishmentMethod === "ORDER"}
                        onChange={handleChange}
                    />
                    <label htmlFor="replenishmentmethod-order-edit">オーダー</label>
                </div>

                <div>
                    <input
                        id="replenishmentmethod-purchase-edit"
                        name="replenishmentMethod"
                        className="replenishmentmethod-option"
                        type="radio"
                        value="PURCHASE"
                        checked={userInput.replenishmentMethod === "PURCHASE"}
                        onChange={handleChange}
                    />
                    <label htmlFor="replenishmentmethod-order-edit">買い出し</label>
                </div>                
            </fieldset>

            {cannotSubmit && (
                <p className="error-message">有効な値を入力してください。</p>
            )}

            <button
                className="clickable-button"
                type="submit"
                disabled={isDisabled}
            >変更
            </button>                
        </form>
    )
}

export default EditItemForm;