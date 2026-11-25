import EditItemForm from "./EditItemForm";
import EditItemConfirmation from "./EditItemConfirmation";
import { useInventoryNavigation } from "../../../context/useInventoryNavigation";
import { useState } from "react";
import { useAppData } from "../../../context/useAppData";
import editItemInfo from "../../../operations/editItemInfo";
import { MoveLeft } from "lucide-react";
import "./EditItem.css";

function EditItem({ selectedItem }){
    const { setDeeperSection } = useInventoryNavigation();
    const [isConfirmationOpen, setIsCofirmationOpen] = useState(false);
    const { appData, setAppData } = useAppData();
    const [pendingChange, setPendingChange] = useState(null); // This preserves the userInput when the confirmation is needed before submission//

// This saves the input data //
    function applyChange(userInput){ 
        const result = editItemInfo(appData, selectedItem, userInput);    

        if(!result.success){
            result.error.forEach(err => console.error(err));
            return false;
        }        

        setAppData(result.data);
        return;        
    }

// This is called upon submission //
    function handleSave(userInput){ 
        const item = appData.items.find(item => item.id === selectedItem);

        if(!item) return; // Return if there's no item selected //

        const hasAnyOrders = Object.hasOwn(item, "pendingOrders") && item.pendingOrders?.length > 0;

        if(hasAnyOrders){
            if(userInput.replenishmentMethod === "PURCHASE"){
                setPendingChange(userInput);
                setIsCofirmationOpen(true);
                return;
            }
        }

        applyChange(userInput);
    }

// This handles the submission after confimation //
    function handleConfirm(){
        if(!pendingChange) return;

        if(applyChange(pendingChange)){
            setPendingChange(null);
            setIsCofirmationOpen(false);
        }
    }

// This is called when users cancel the submission //
    function handleCancel(){
        setPendingChange(null);
        setIsCofirmationOpen(false);
    }

    return (
        <>
            <div className="edit-item-section">
                <h4>登録情報の編集</h4>

                <EditItemForm
                    key={selectedItem} 
                    selectedItem={selectedItem}
                    handleSave={handleSave}
                />                

                <button
                    type="button"
                    className="back-to-previous-button"
                    onClick={() => setDeeperSection(null)}
                >
                    <MoveLeft size={18}/>
                </button>                
            </div>                               
                        
            <EditItemConfirmation
                isConfirmationOpen={isConfirmationOpen}
                handleConfirm={handleConfirm}
                handleCancel={handleCancel} 
            />                
        </>
    )
}

export default EditItem;