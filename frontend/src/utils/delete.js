import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Delete {
    result;
    constructor(urlRoute, itemId) {
        this.urlRoute = urlRoute.split('/')[1];
        this.itemId = itemId;

        this.deleteItem();
    }

    // Удалить категорию или операцию
    async deleteItem() {
        try {
            if (this.urlRoute === 'operations') {
                this.result = await CustomHttp.request(
                    config.host +'/' + this.urlRoute + '/' + this.itemId, 'DELETE'
                )
            } else {
                this.result = await CustomHttp.request(
                    config.host + '/categories/' + this.urlRoute + '/' + this.itemId, 'DELETE'
                )
            }

            if (this.result) {
                if (this.result.error) {
                    throw new Error(this.result.message);

                } else {
                    // Успешно, возвращаемся откуда пришли
                    location.href = '#/' + this.urlRoute;
                }
            } else {
                throw new Error(this.result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }
}
