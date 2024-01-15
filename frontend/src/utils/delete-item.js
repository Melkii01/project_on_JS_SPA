import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class DeleteItem {
    constructor(urlRoute, itemId) {
        this.urlRoute = urlRoute.split('/')[1];
        this.itemId = itemId;
        this.delete();
        console.log(this.urlRoute)
    }

    async delete() {
        try {
            const result = await CustomHttp.request(
                config.host + '/categories/' + this.urlRoute + '/' + this.itemId, 'DELETE'
            );

            if (result) {
                if (result.error) {
                    throw new Error(result.message);

                } else {
                    // Успешно, возвращаемся в откуда пришли
                    location.href = '#/' + this.urlRoute;
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }
}
