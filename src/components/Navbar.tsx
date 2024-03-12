import React, { useState } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid'

/*
    This component was heavily inspired by the Header component from https://www.youtube.com/watch?v=7JGBGhuWxl0
    in order to create a responsive header design that can dynamically fit different screen sizes for desktop and mobile.
    The component was modified to fit with React Router to allow seamless navigation between pages. 
 */

// Navbar Functional Component
const Navbar = () => {
    const Links =[
        {name:"Home",link:"/"},
        {name:"Visualisation",link:"/"},
        {name:"About Us",link:"/"},
      ];

    let [open, setOpen] = useState(false);

    return (
        <div className='shadow-md w-full fixed top-0 left-0 z-10'>
            <div className='md:flex items-center justify-between bg-white py-6 md:px-10 px-7'>
            <div className='font-bold text-2xl cursor-pointer flex items-center gap-1 text-blue-900'>
                <span>4DMotion</span>
            </div>
            <div onClick={()=>setOpen(!open)} className='absolute right-8 top-6 cursor-pointer md:hidden w-7 h-7'>
                {
                    open ? <XMarkIcon/> : <Bars3BottomRightIcon />
                }
            </div>
            <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-12' : 'top-[-490px]'}`}>
                {
                    Links.map((link, index) => (
                        <CustomLink key={index} to={link.link + link.name} className='text-gray-800 hover:text-blue-400 duration-500'>{link.name}</CustomLink>
                    ))
                }
                
            </ul>
           </div>
        </div>
    );
};

export default Navbar;

// CustomLink Functional Component
interface CustomLinkProps {
    to: string;
    children: React.ReactNode;
    [key: string]: any;
}

const CustomLink: React.FC<CustomLinkProps> = ({ to, children, ...props }) => {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? "active md:ml-8 md:my-0 my-7 font-semibold" : "md:ml-8 md:my-0 my-7 font-semibold"} >
            <Link to={to} {...props}>{children}</Link>
        </li>
    );
};