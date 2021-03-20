import  fs from 'fs'
import util from 'util'
import path from 'path'

const dbPath = (file) => path.resolve(`data/${file}`)
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function write(item, file) {
    const data = JSON.stringify(item, null, 2);
    return writeFile(dbPath(file), data)
}

const getAll = async (file) => {
    try {
        let allItems = await readFile(dbPath(file))
        console.log(allItems);
        return JSON.parse(allItems)
    } catch (err) {
        console.error("module error", err)
        throw err
    }
}

const addItem = async (item, file) => {
    try {
        if (fs.existsSync(dbPath(file))) {
            let allItems = await getAll(file)
            allItems.push(item)
            await write(allItems, file)
        } else {
            const dbArray = [item]
            write(dbArray, file)
        }
    } catch (err) {
        console.error(err)
        throw err
    }
}

export {
    addItem,
    getAll
}