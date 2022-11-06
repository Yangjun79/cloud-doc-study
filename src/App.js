import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "easymde/dist/easymde.min.css";
import { v4 as uuidv4 } from 'uuid';
import {useState,useRef} from 'react';
import { flattenArr,objToArr } from './utils/helper';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import defaultFiles from'./utils/defaultFiles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,faFileImport } from '@fortawesome/free-solid-svg-icons'
import BottomButton from './components/BottomButton';
import TabList from './components/TabList';
import SimpleMDE from "react-simplemde-editor";
import fileHelper from './utils/fileHelper';
const {join} = window.require('path')
const {remote} = window.require('electron')

function App() {
  const [files,setFiles] = useState(flattenArr( defaultFiles ))
  const [searchFiles,setSearchFiles] = useState([])
  const [activeFileID,setActiveFileID] = useState('')
  const [openedFileIDs,setOpenedFileIDs] = useState([])
  const [unsavedFileIDs,setUnsavedFileIDs] = useState([])
  const node=useRef(null)
  const activeFile = files[activeFileID]
  const openedFiles = openedFileIDs.map(id=>{
    return files[id]
  })
  const fileArr=objToArr(files)
  const fileArray=searchFiles.length>0?searchFiles:fileArr
  const savedLocation = remote.app.getPath('documents')

  const fileClick = (id) =>{
    setActiveFileID(id)
    if (!openedFileIDs.includes(id)){
      setOpenedFileIDs([...openedFileIDs,id])
    }
  }
  const tabClick=(id)=>{
    setActiveFileID(id)
  }
  const tabClose=(id)=>{
    const tabsWithout = openedFileIDs.filter(fileID=>fileID!==id)
    setOpenedFileIDs(tabsWithout)
    if (tabsWithout.length>0){
      if (id===activeFileID){
        setActiveFileID(openedFileIDs[0])
      }
    }else{
      setActiveFileID('')
    }
  }
  const fileChange=(id,value)=>{
    //  const newFiles=files.map(file=>{
    //    if (file.id===id){
    //      file.body=value
    //    }
    //    return file
    //  })
    //  setFiles(newFiles)

     if (!unsavedFileIDs.includes(id))
       setUnsavedFileIDs([...unsavedFileIDs,id])
  }
  const deleteFile=(id)=>{
    delete files[id]
    setFiles(files)
    tabClose(id)
  }
  const updateFileName=(id,title,isNew)=>{
    const newFile={...files[id],title,isNew:false}
    if (isNew){
      //fileHelper.writeFile(join(savedLocation,`${title}.md`),files[id].body).then(()=>{
      //  setFiles({...files,[id]:newFile})
      //})
    }else{
      //fileHelper.renameFile(join(savedLocation,`${files[id].title}.md`),
      //  join(savedLocation,`${title}.md`)
      //)
    }
    setFiles({...files,[id]:newFile})
  }
  const fileSearch=(keyword)=>{
    const newFiles=fileArr.filter(file=>file.title.includes(keyword))
    setSearchFiles(newFiles)
  }
  const createFile=()=>{
    if (fileArr.filter(file=>file.isNew).length==0)
    {
      const newID = uuidv4()
      setFiles({...files,[newID]:{
        id:newID,
        title:'',
        body:'## 请输入MarkDown',
        createdAt: new Date().getTime(),
        isNew:true
      }})
    }
  }

  return (
    <div className="App container-fluid px-0">
      <div className='row g-0'>
        <div className='col-6 bg-light left-panel'>
          <FileSearch  onFileSearch={fileSearch} />
          <FileList 
            files={fileArray} 
            onFileClick={fileClick}
            onFileSaveEdit={updateFileName}
            onFileDelete={deleteFile}
          />
          <div className='row g-0 button-group'>
            <div className='col d-grid gap-2'>
              <BottomButton 
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onBtnClick={createFile}
              />
            </div>
            <div className='col d-grid gap-2'>
              <BottomButton 
                text="导入"
                colorClass="btn-success"
                icon={faFileImport}
              />
            </div>
          </div>
        </div>
        <div className='col-6 right-panel'>
          { !activeFile &&
            <div className='start-page'>
              选择或创建MarkDown文档
            </div>
          }
          { activeFile &&
            <>
              <TabList 
                files={openedFiles} activeId={activeFileID} unSaveIds={unsavedFileIDs}
                onTabClick={tabClick}
                onTabClose={tabClose}
              />
              <SimpleMDE
                ref={node}
                key={activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value)=>{fileChange(activeFile.id,value)}}
                options={{minHeight:'450px',autofocus: true,}}
              />
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
