import {DeleteItem} from "./delete-item.js";

export class Popup {
    constructor(text,urlRoute,itemId) {
        this.text = text;
        this.urlRoute = urlRoute;
        this.itemId = itemId;
        this.showPopup();
    }

    async showPopup() {
        const popup = document.getElementById('popup');
        const popupText = document.getElementById('popupText');
        const popupAgreeButton = document.getElementById('popupAgreeButton');
        const popupCancelButton = document.getElementById('popupCancelButton');
        popupText.innerText = this.text;
        popup.classList.add('popup-active');

        popupAgreeButton.onclick = () => {
            popup.classList.remove('popup-active');
            new DeleteItem(this.urlRoute,this.itemId);
        }

        popupCancelButton.addEventListener('click', () => {
            popup.classList.remove('popup-active');
        })
    }
}
