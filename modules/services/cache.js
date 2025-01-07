import NodeCache from "node-cache";

class UploaderService {
    constructor() {
        this.cache = new NodeCache({ stdTTL: 900, checkperiod: 300 });
        this.cache.on("expired", this.#onExpired);
    }

    setValue(value) {
        const startAt = value.indexOf("/assets");
        this.cache.set(value, value.substr(startAt));
    }

    getValue(value) {
        return this.cache.take(value);
    }

    #onExpired(key, value) {
        try {
            console.log(value);
            // if (existsSync(value)) {
            //     unlink(value, (err) => {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             console.log(`Deleted file: ${value}`);
            //         }
            //     });
            // }
        } catch (e) {
            console.log(e);
        }
    }
}

export default new UploaderService();
