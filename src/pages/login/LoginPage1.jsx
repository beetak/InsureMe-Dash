import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { HashLoader } from 'react-spinners';
import { loginInsurerUser, loginUser } from '../../store/user-store';
import { useNavigate } from 'react-router-dom';
import { navActions } from '../../store/nav-store';
import { decodeToken } from './tokenUtils';
import useAuth from '../../hooks/useAuth';

export default function LoginPage(props) {

    const {setUser} = useAuth()
    
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [domain, setDomain] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState([])
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("success");

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isEmail = (value) => {
        // Regular expression for email validation
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (domain === "" && password === "") {
            showToastMessage("Please fill in all fields", "error");
        } else if (domain === "") {
            showToastMessage("Please provide the domain name", "error");
        } else if (password === "") {
            showToastMessage("Please provide the password", "error");
        } 
        else{
            setLoading(true);
            if(!isEmail(domain)){
                try {
                    const response = await dispatch(loginUser({ 
                        email: domain,
                        password
                    }));
                
                    if ( response.payload.success) {
                        console.log(response.payload)
                        if (response.payload && response.payload.data.code==="CREATED") {
                            const accessToken = response.payload.data.data.access_token
                            const role = response.payload.data.data.role
                            const userId = response.payload.data.data.id
                            const firstname = response.payload.data.data.firstName
                            const surname = response.payload.data.data.lastName
                            localStorage.setItem("refresh_token", response.payload.data.data.refresh_token)
                            localStorage.setItem("userNum", response.payload.data.data.id)
                            setUser({accessToken, user:true, role, userId, firstname, surname})                                      
                            if (response.payload.data.data.role === 'SUPER_ADMINISTRATOR' || response.payload.data.data.role === 'ADMIN') {
                                // dispatch(navActions.toggleNav('dashboard'))
                                navigate('/dashboard');
                            } else if (response.payload.data.data.role === 'SALES_AGENT') {
                                // dispatch(navActions.toggleNav('sales'))
                                navigate('/sales');
                            } else if (response.payload.data.data.role === 'SHOP_SUPERVISOR') {
                                navigate('/entities');
                            } else {
                                navigate('/login');
                            } 
                        } else if(response.payload.data.code==="UNAUTHORIZED"){
                            setMessage("Incorrect Email or Password")
                            setFailed(true);
                            setTimeout(()=>{
                                setMessage("")
                                setLoading(false)
                                setFailed(false);
                            },2000)
                        } else {
                            setTimeout(()=>{
                                setLoading(false)
                                setFailed(false);
                            },2000)
                        }
                    } else {
                        setTimeout(()=>{
                            setLoading(false)
                            setFailed(false);
                        },2000)
                    }
                } 
                catch (error) {
                    setTimeout(()=>{
                        setLoading(false)
                        setFailed(false);
                    },2000)
                }
            }
            else{
                try {
                    const response = await dispatch(loginInsurerUser({ 
                        email: domain,
                        password
                    }));
                    if (response.payload && response.payload.success) {
                        console.log(response.payload)
                        if (response.payload.data.code==="OK") {
                            const accessToken = response.payload.data.data
                            let decodedToken
                            try {
                                decodedToken = decodeToken(response.payload.data.data);
                                console.log("Decoded Token:", decodedToken);
                            } catch (error) {
                                console.error("Error decoding token:", error);
                            }
                            if(decodedToken.active){
                                const role = decodedToken.role
                                const userId = decodedToken.userId
                                const firstname = decodedToken.firstName
                                const surname = decodedToken.lastName
                                const companyId = decodedToken.companyId
                                const companyName = decodedToken.companyName
                                setUser({accessToken, user:true, role, userId, firstname, surname, companyId, companyName})
                                if (decodedToken.role === 'INSURER_ADMIN') {
                                    dispatch(navActions.toggleNav('dashboard'))
                                    navigate('/dashboard');
                                } else if (decodedToken.role === 'SALES_AGENT') {
                                    dispatch(navActions.toggleNav('sales'))
                                    navigate('/sales');
                                } else {
                                    navigate('/login');
                                }
                            }   
                        } 
                        else if(response.payload.data.code==="UNAUTHORIZED"){

                            {
                                setFailed(true);
                                setTimeout(()=>{
                                    setLoading(false)
                                    setFailed(false);
                                },2000)
                            }
                        }
                        else {
                            setFailed(true);
                            setTimeout(()=>{
                                setLoading(false)
                                setFailed(false);
                            },2000)
                        }
                    } else {
                        setFailed(true)
                        setTimeout(()=>{
                            setLoading(false)
                            setFailed(false);
                        },2000)
                    }
                } 
                catch (error) {
                    setFailed(false)
                    setTimeout(()=>{
                        setLoading(false)
                        setFailed(true);
                    },2000)
                }
            }
        }        
    };

    const handleTogglePassword = (value) => {
        setShowPassword(value);
    };

    const passwordInputType = showPassword ? 'text' : 'password';  const showToastMessage = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <>
            <div className='lg:flex block w-full h-screen'>
                <div className='w-full lg:w-1/2 flex flex-col justify-center items-center lg:h-screen'>
                    <div className='flex flex-col w-1/2'>
                        <img src="images/icon.png" alt="Logo" className="w-20 mb-7"/>
                        <h2 className='text-xl font-bold'>Welcome</h2>
                        <p className='text-sm mb-7'>Happy to see you!</p>
                        
                        <div className='space-y-4 w-full'>
                            <div className="sm:col-span-3 items-center">
                                <label htmlFor="last-name" className="block text-xs font-medium leading-6 text-gray-900">
                                Name
                                </label>
                                {
                                    error.err==="domain"&&
                                    <label htmlFor="last-name" className="block text-xs font-medium leading-6 text-red-500">
                                        {error.message}
                                    </label>
                                }
                                <div className="mt-2 w-full flex items-center p-0 overflow-hidden ring-1 ring-inset ring-gray-300 focus:ring-indigo-200 shadow-sm focus:ring-1 focus:ring-inset h-12">
                                    <span className="fas fa-user w-5 px-5" />
                                    <input
                                        type="text"
                                        name="domain"
                                        id="domain"
                                        autoComplete="family-name"
                                        placeholder="Username"
                                        value={domain}
                                        onChange={(e)=>setDomain(e.target.value)}
                                        className="flex-1 rounded-xs py-1.5 px-3 bg-transparent focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3 items-center">
                                <label htmlFor="last-name" className="block text-xs font-medium leading-6 text-gray-900">
                                Password
                                </label>
                                {
                                    error.err==="password"&&
                                    <label htmlFor="last-name" className="block text-xs font-medium leading-6 text-red-500">
                                        {error.message}
                                    </label>
                                }
                                <div className="mt-2 w-full flex items-center p-0 overflow-hidden ring-1 ring-inset ring-gray-300 focus:ring-indigo-200 shadow-sm focus:ring-1 focus:ring-inset h-12">
                                    <span className="fas fa-lock w-5 px-5" />
                                    <input
                                        type={passwordInputType}
                                        name="password"
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e)=>setPassword(e.target.value)}
                                        className="flex-1 rounded-xs py-1.5 px-3 bg-transparent focus:outline-none"
                                    />
                                    <span 
                                        onMouseDown={()=>handleTogglePassword(true)}
                                        onMouseUp={()=>handleTogglePassword(false)}
                                        onTouchStart={()=>handleTogglePassword(true)}
                                        onTouchEnd={()=>handleTogglePassword(false)} 
                                        className="fas fa-eye px-4" 
                                    />
                                </div>
                            </div>
                            <label htmlFor="last-name" className="block text-xs font-medium  text-gray-900 mt-6">
                                Forgot Password?
                            </label>
                            <button
                                onClick={handleLogin}
                                className={`border border-gray-300 rounded-sm py-2 w-full bg-blue-500 text-gray-100 hover:bg-blue-600 h-12`}
                            >LOGIN</button>
                        </div>
                        {
                            error.err==="empty"&&<h6 className='text-red-500'>{error.message}</h6>
                        }
                        <div className={`flex flex-col flex-1 justify-center py-3 ${!loading&&' hidden'}`}>
                            <HashLoader
                                color={loading&&failed&&!success?'#DF3333':'#3B82F6'}
                                loading={loading}
                                cssOverride={override}
                                size={30} // Adjust the size as needed
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                            {
                                loading&&!failed&&!success?<h1 className='flex text-blue-500 justify-center italic'>Logging in</h1>:
                                loading&&failed&&!success?<h1 className='flex text-red-500 justify-center italic'>Logging In Failed</h1>:
                                loading&&!failed&&success&&<h1 className='flex text-gray-500 justify-center italic'>Log In Success</h1>
                            }
                            
                        </div>
                        {
                            message&&<div className='sm:col-span-3 items-center bg-red-600 text-white rounded-md justify-center flex p-2'>
                                {message}
                            </div>
                        }
                    </div>
                </div>
                <div className='w-full lg:w-1/2 flex justify-center items-end lg:h-screen bg-cover bg-center' style={{backgroundImage: 'url(images/auth/login-bg.jpg)'}}>
                    <p className="text-white mb-5">Copyright © {new Date().getFullYear()} All rights reserved.</p>
                </div>
            </div>
        </>
    )
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}
