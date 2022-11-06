const fs =window.require('fs').promises
const path=window.require('path')

const fileHelper = {
    readFile:(path)=>{
        return fs.readFile(path,{encoding:'utf-8'})
    },
    writeFile:(path,context)=>{
        return fs.writeFile(path,context,{encoding:'utf-8'})
    },
    renameFile:(path,newName)=>{
        return fs.renameFile(path,newName)
    },
    deleteFile:(path)=>{
        return fs.unlink(path)
    }
}

export default fileHelper