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

    public async getCityByZip(zipcode: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            if (!zipcode || typeof zipcode !== "string") {
                reject(new Error("Invalid zip code provided."));
                return;
            }
    
            fetch(AddressService.fetchUrl, {
                method: "POST",
                body: JSON.stringify({ zipcode }),
                headers: { "Content-Type": "application/json" }
            })
                .then(async (response) => {
                    if (!response.ok) {
                        reject(new Error("Failed to fetch city for the provided zip code."));
                        return;
                    }
    
                    const data = await response.json() as { city: string }[];
                    if (data.length === 0) {
                        reject(new Error("No city found for the provided zip code."));
                        return;
                    }
    
                    resolve(data[0].city); // Assuming the API returns an array of results
                })
                .catch((err) => {
                    loggerService.error({ path: "/address/getCityByZip", message: err.message }).flush();
                    reject(err);
                });
        });
    }

    public async distance(addressRequest?: any): Promise<any> {
        // Complete this
    }

    // private async getDistance(lat1: string, lon1: string, lat2: string, lon2: string) {
    //     // Defining this function inside of this private method means it's
    //     // not accessible outside of it, which is perfect for encapsulation.
    //     const toRadians = (degrees: string) => {
    //         return degrees * (Math.PI / 180);
    //     }

    //     // Radius of the Earth in KM
    //     const R = 6371;

    //     // Convert Lat and Longs to Radians
    //     const dLat = toRadians(lat2 - lat1);
    //     const dLon = toRadians(lon2 - lon1);

    //     // Haversine Formula to calculate the distance between two locations
    //     // on a sphere.
    //     const a =
    //         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //         Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    //         Math.sin(dLon / 2) * Math.sin(dLon / 2);

    //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    //     // convert and return distance in KM
    //     return R * c;
    // }
}

export default new AddressService();