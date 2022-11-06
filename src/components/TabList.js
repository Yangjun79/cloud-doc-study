import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import classNames from "classnames";
import './TabList.scss'

const TabList=({files,activeId,unSaveIds,onTabClick,onTabClose})=>{
    return(
        <ul className="nav nav-pills tablist-comonpent">
            {
                files.map(file=>{
                    const withUnSavedMark=unSaveIds.includes(file.id)
                    const fClassName=classNames({
                        "nav-link":true,
                        "active":file.id===activeId,
                        "withUnsaved":withUnSavedMark
                    })
                    
                    return(
                        <li className="nav-item" key={file.id}>
                            <a 
                                href="#"
                                className={fClassName}
                                onClick={(e)=>{e.preventDefault(); onTabClick(file.id);}}
                            >
                                {file.title}
                                <span 
                                    className="ms-2 close-icon"
                                    onClick={(e)=>{e.stopPropagation(); onTabClose(file.id);}}
                                >
                                    <FontAwesomeIcon 
                                        icon={faTimes}
                                    />
                                </span>
                                { withUnSavedMark &&
                                    <span className="rounded-circle unsaved-icon"></span>

                                }
                            </a>                            
                        </li>
                    )
                })
            }
       
        </ul>
    )
}

TabList.propTypes={
    files:PropTypes.array,
    activeId:PropTypes.string,
    unSaveIds:PropTypes.array,
    onTabClick:PropTypes.func,
    onTabClose:PropTypes.func
}
TabList.defaultProps={
    unSaveIds:[]
}
export default TabList