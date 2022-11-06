import React,{useEffect, useState, useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit,faRemove,faTimes,faTrash } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from "../hooks/useKeyPress";

const FileList =({files,onFileClick,onFileSaveEdit,onFileDelete})=>{
    const [editStatus,setEditStatus] = useState(false)
    const [value,setValue] = useState('')
    const node=useRef(null)
    const enterPressed=useKeyPress(13)
    const escPressed=useKeyPress(27)

    const closeEdit=(file,esc)=>{
        //e.preventDefault()
        setEditStatus(false)
        setValue('')
        if (file.isNew && esc){
            onFileDelete(file.id)
        }
    }
    useEffect(()=>{
        const editItem=files.find(file=>file.id===editStatus)
        if (enterPressed && editStatus && value.trim()!==''){
            onFileSaveEdit(editItem.id, value,editItem.isNew)
            closeEdit(editItem,false)
        } else if (escPressed && editStatus){
            closeEdit(editItem,true)
        }
        // const handleInputEvent=(event)=>{
        //     const {keyCode}=event 
        //     if (keyCode===13 && editStatus){
        //         const editItem=files.find(file=>file.id===editStatus)
        //         onFileSaveEdit(editItem.id, value)
        //     } else if (keyCode===27 && editStatus){
        //         closeEdit(event)
        //     }
        // }
        // document.addEventListener('keyup',handleInputEvent)
        // return()=>{
        //     document.removeEventListener('keyup',handleInputEvent)
        // }
    })
    useEffect(()=>{
        const newFile=files.find(file=>file.isNew)
        console.log(newFile)
        if (newFile){
            setEditStatus(newFile.id)
            setValue(newFile.title)
        }
    },[files])
    useEffect(()=>{
        if (editStatus){
            node.current.focus()
            node.current.select()
        }
    },[editStatus])
    return(
        <ul className="list-group list-group-flush file-list">
            {
                files.map(file=>(
                    <li 
                        key={file.id}
                        className="list-group-item bg-light d-flex align-items-center file-item"
                    >
                    { (file.id !== editStatus && !file.isNew) &&
                        <>
                            <span className="col-2">
                            <FontAwesomeIcon 
                                icon={faMarkdown}
                                size='lg' />
                            </span>
                            <span className="col-8 c-link" onClick={()=>{onFileClick(file.id)}}>
                                {file.title}
                            </span>
                            <button 
                                className="icon-button col-1"
                                onClick={()=>{
                                    setEditStatus(file.id)
                                    setValue(file.title)
                                }}
                            >
                                <FontAwesomeIcon 
                                title="编辑"
                                icon={faEdit}
                                size='lg' />
                            </button>
                            <button 
                                className="icon-button col-1"
                                onClick={()=>{onFileDelete(file.id)}}
                            >
                                <FontAwesomeIcon 
                                title="删除"
                                icon={faTrash}
                                size='lg' />
                            </button>
                        </>
                    }
                    { (file.id === editStatus || file.isNew) &&
                        <div className="d-flex justify-content-between align-items-center col-10">
                            <div className="col-10">
                            <input className="form-control"
                                value={value}
                                ref={node}
                                placeholder="请输入文件名称"
                                onChange={(e)=>{setValue(e.target.value)}}
                            />
                            </div>
                            <button 
                                className="icon-button col-2" 
                                onClick={()=>closeEdit({file},true)}>
                                <FontAwesomeIcon 
                                    title="关闭"
                                    icon={faTimes} 
                                    size='lg' />
                            </button>
                        </div>
                    }
                    </li>
                ))
            }
        </ul>
    )
}

FileList.propTypes = {
    files:PropTypes.array,
    onFileClick:PropTypes.func.isRequired,
    onFileSaveEdit:PropTypes.func.isRequired,
    onFileDelete:PropTypes.func.isRequired
}
export default FileList