import { SquareExclamationPoint } from "lucide-react";
import { createPortal } from "react-dom";

function EditItemConfirmation({ isConfirmationOpen, handleConfirm, handleCancel }){

    return createPortal(
        <>
            {isConfirmationOpen && (
                <div 
                    className="backdrop-container edit-backdrop"
                    onClick={handleCancel}
                />
            )}
        
            <div className={`confirmation-modal edit-confirmation ${isConfirmationOpen ? "is-open" : ""}`}>
                <div>
                    <p className="on-the-same-line"><SquareExclamationPoint />未受取の注文があります。</p>
                    <p>変更すると削除されます。</p>
                    <p>本当に変更しますか？</p>
                </div>

                <div className="buttons">
                    <button
                        type="button"
                        className="clickable-button"
                        onClick={handleConfirm}
                    >確定
                    </button>

                    <button
                        type="button"
                        className="clickable-button"
                        onClick={handleCancel}
                    >キャンセル
                    </button>
                </div>            
            </div>        
            </>,
        document.body
    )
}

export default EditItemConfirmation;