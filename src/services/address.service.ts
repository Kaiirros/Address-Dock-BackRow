import { get } from "http";
import loggerService from "./logger.service";

class AddressService {
    private static fetchUrl = 'https://ischool.gccis.rit.edu/addresses/';

    constructor() { }

    public async count(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.request(addressRequest)
                .then((response) => {
                    resolve({
                        "count": response.length
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    public async request(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            fetch(AddressService.fetchUrl, {
                method: "POST",
                body: JSON.stringify(addressRequest.body)
            })
                .then(async (response) => {
                    resolve(await response.json());
                })
                .catch((err) => {
                    loggerService.error({ path: "/address/request", message: `${(err as Error).message}` }).flush();
                    reject(err);
                });
        });
    }

    public async distance(addressRequest?: any): Promise<any> {
        const { lat1, lon1, lat2, lon2, unit} = addressRequest.body;
        if (!lat1 || !lon1 || !lat2 || !lon2) {
            throw new Error("Missing required coordinates");
        }

        let distance = null;
        if ( unit == "KM" ) {
            distance = await this.getKilometerDistance(lat1, lon1, lat2, lon2);
        } else if ( unit == "Mi" ) {
            distance = await this.getMilesDistance(lat1, lon1, lat2, lon2);
        } else {
            throw new Error("Invalid unit");
        }

        return new Promise<any>(async (resolve, reject) => {
            fetch(AddressService.fetchUrl, {
                method: "POST",
                body: JSON.stringify({distance})
            })
                .then(async (response) => {
                    resolve({distance});
                })
                .catch((err) => {
                    loggerService.error({ path: "/address/distance", message: `${(err as Error).message}` }).flush();
                    reject(err);
                });
        });
    }

    private async getKilometerDistance(lat1: string, lon1: string, lat2: string, lon2: string) {
        // Defining this function inside of this private method means it's
        // not accessible outside of it, which is perfect for encapsulation.
        const toRadians = (degrees: number) => {
            return degrees * (Math.PI / 180);
        }

        // Radius of the Earth in KM
        const R = 6371;

        // Convert Lat and Longs to Radians
        const dLat = toRadians(parseFloat(lat2) - parseFloat(lat1));
        const dLon = toRadians(parseFloat(lon2) - parseFloat(lon1));

        // Haversine Formula to calculate the distance between two locations
        // on a sphere.
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
             Math.cos(toRadians(parseFloat(lat1))) * Math.cos(toRadians(parseFloat(lat2))) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

         // convert and return distance in KM
        return parseFloat((R * c).toFixed(4));
    }

    private async getMilesDistance(lat1: string, lon1: string, lat2: string, lon2: string) {
        const kilometers = await this.getKilometerDistance(lat1, lon1, lat2, lon2);
        const milesPerKilometer = 0.621371;
        return parseFloat((kilometers * milesPerKilometer).toFixed(4));
    }


}

export default new AddressService();