import React, {useEffect, useState} from "react";
import LockIcon from "../assets/icons/i-lock.svg";
import { useLocation, Link } from "react-router-dom";

function MenuItem({
  Icon,
  title,
  href,
  locked = false,
  active = true,
  rightIcon,
  className,
  group,
  parent,  
  onClick
}) {
  let location = useLocation();
  let currentParent = location.pathname.split("/")[1];

  const [isCurrent, setCurrent] = useState('');

  useEffect(()=>{
    //eslint-disable-next-line
    if(`/${currentParent}` === parent || location && href === location.pathname){
      setCurrent("active");
    }else{
      setCurrent("");
    }


    if(group && group.indexOf(location.pathname)>-1){
      setCurrent("active");
    }
  //eslint-disable-next-line
  },[location]);
 
  return (
    <Link
      to={href}
      className={`menu__item ${className||''} ${isCurrent}`
    }
      onClick={onClick}
    >
      <div className={`menu__item--icon`}>
        <span>
          <Icon
            fill={ isCurrent !== '' ? "#FFF": "#666" }
            size="lg"
          />
        </span>
      </div>
      <div
        className={`menu__item--txt`}
        style={!active ? { display: "none" } : {}}
      >
        <span>{title}</span>
        {locked ? <img src={LockIcon} alt="" /> : ""}
        {rightIcon || ''}
        {/* {locked ? <IconsSidebar.lock fill="#666" /> : ""} */}
      </div>
    </Link>
  );
}

export default MenuItem;
