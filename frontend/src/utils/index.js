import { Deta } from "deta";

const env = {
    api_url: "https://erghiapi-1-p0166292.deta.app/"
}

const deta = Deta("c09jLVEPJUCr_FfpE4PWDt6rcveTWDdFxhphp4pXN3ox1")

const drive = deta.Drive("images")

async function get_image(filename) {
    try {
        const resp = await drive.get(filename)
        if (resp) 
            return resp
    } catch (error) {
        console.warn(`Image ${filename} not found!`)
    }
    return await drive.get("default.png")
}

async function list_images() {
    const resp = await drive.list()
    return resp
}

export {
    env,
    get_image,
    list_images,
}
