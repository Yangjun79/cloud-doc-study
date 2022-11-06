const {app,BrowserWindow} =require('electron');
const path = require('path')
const isDev=require('electron-is-dev')
//let mainWindows;

app.on('ready',()=>{
    let mainWindow=new BrowserWindow({
        width:1024,
        height:680,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation:false,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    const urlLocation = isDev?'http://localhost:3000':'dummyurl'
    mainWindow.loadURL(urlLocation)
})