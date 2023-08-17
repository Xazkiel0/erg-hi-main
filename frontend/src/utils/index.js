import { Deta } from "deta";

const env = {
    api_url: import.meta.env.VITE_API_URL
}

const deta = Deta(import.meta.env.VITE_DETA_DRIVE_KEY)

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
