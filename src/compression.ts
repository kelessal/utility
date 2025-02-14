import { IUtility } from "./types"

export class Compression {
    private readonly $u:IUtility
    constructor(util: any) {
        this.$u = util
    }
    public async compressText(data: string): Promise<string> {
       const compressed = pako.deflate(text);
        return btoa(String.fromCharCode.apply(null, compressed));
    }
    public async decompressText(data: string): Promise<string> {
        return new Promise((resolve) => {
     
        resolve(decompressed)
        })
    }
}