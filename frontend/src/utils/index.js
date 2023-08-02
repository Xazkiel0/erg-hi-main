import { Deta } from "deta";

const env = {
    api_url: "https://erghimain-1-p7891851.deta.app/api"
}

const deta = Deta("c0XfD1m1bVor_Zry1g9L9qhW8Y5jMnVfR7wrkxWX4bcLq")

const drive = deta.Drive("images")

async function get_image(filename) {
    try {
        const resp = await drive.get(filename)
        return resp
    } catch (error) {
        console.warn(`Image ${filename} not found!`)
    }
    return await drive.get("default.jpeg")
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