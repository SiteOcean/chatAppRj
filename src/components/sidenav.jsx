import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../userAuth/authContextJs";

export default function Sidenav({sidebar, sidebarHandle, loginuser}){

    const navigate = useNavigate();
    const { dispatch } = useAuth();
   function clearLocalStore(){
    localStorage.clear();
    dispatch({ type: 'LOGOUT' });
    // navigate('/', { replace: true })
   }

    return (
    <div onMouseLeave={sidebarHandle} className={`bg-[#f14cc8] ${sidebar ? "left-0" : "-left-[300px]" } fixed top-0 duration-500 z-40 h-[95vh] sm:h-[100vh] w-[45%] sm:w-[20%] space-y-5 pt-[20px]`}>
        <button onClick={sidebarHandle} className="absolute top-0 right-0 text-[red] text-[36px] bg-white z-50 "><MdClose /></button>
        <h1 className="h-[60px] w-[60px] hover:bg-gray-100 duration-300 bg-slate-200 rounded-full ml-8"></h1>
        <ul className="space-y-3 text-left pl-6 ">
            <li className="text-[20px] cursor-pointer duration-300 font-bold hover:text-gray-200 text-white">{loginuser.username}</li>
            <li onClick={clearLocalStore} className="cursor-pointer duration-300 hover:text-gray-200 text-[20px] font-bold text-white">Logout</li>
          
        </ul>

    </div>)
}