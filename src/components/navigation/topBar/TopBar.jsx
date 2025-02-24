import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi'

export default function TopBar({isOpen}) {

    const { user, setUser } = useAuth()

    const [dropdown, setDropdown] = useState(false)
    const [tab, setTab] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const navigate = useNavigate()
    const inputRef = useRef(null)
    const [userData, setUserData] = useState('')

    useEffect(() => {
        setupInterceptors(() => user, setUser)
        getUser()
    },[user, setUser])

    const getUser = async () => {
        const response = await InsuranceApi.get(`/users/userId/${user.userId}`)
        if(response.data.code==="OK"){
            setUserData(response.data.data)
        }
    }

    const onMouseEnter = (data) => {
        setTab(data)
        if (window.innerWidth < 960) {
            setDropdown(false)
        } else {
            setDropdown(true)
        }
    }

    const onMouseLeave = () => {
        setTab('')
        setDropdown(false)
    }

    const handleFocus = () => {
        setIsFocused(true)
    }

    const handleBlur = () => {
        setIsFocused(false)
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleSearch = () => {
        if(inputValue.trim()){
            navigate(`/reports?referenceId=${encodeURIComponent(inputValue.trim())}`)
        }
    }

    const isExpanded = isFocused || inputValue.length > 0

    const logout = () => {
        setUser(null)
        navigate('/login')
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setIsFocused(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const renderSearchBar = () => (
        <AnimatePresence>
            <motion.div
                initial={{ width: 300 }}
                animate={{ width: isExpanded ? 400 : 300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative"
                ref={inputRef}
            >
                <motion.input
                    type="text"
                    className="w-full px-4 py-2 rounded-full border focus:outline-none"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    value={inputValue}
                    placeholder="Search transaction by Reference ID"
                    animate={{
                        boxShadow: isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none"
                    }}
                    transition={{ duration: 0.2 }}
                />
                <motion.button
                    className="absolute right-0 top-0 h-full px-3 text-gray-500"
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSearch}
                >
                    <i className='fas fa-search' />
                </motion.button>
            </motion.div>
        </AnimatePresence>
    )

    return (
        <>
            {/* desktop view */}
            <nav className={`h-20 hidden lg:block transition-all duration-300 ease-in-out ${isOpen ? "ml-64" : " ml-16"}`}>
                <div className="mx-auto w-full px-6">
                    <div className="relative flex h-20 items-center justify-between">
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="hidden sm:ml-6 sm:block ">
                                <div className="flex space-x-4">
                                    {renderSearchBar()}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center text-sm">
                                {userData && userData.userRegions.length > 0 && (
                                    <span>Region: {userData.userRegions[0]}</span>
                                )}
                                {userData && userData.userTowns.length > 0 && (
                                    <span>Town: {userData.userTowns[0]}</span>
                                )}
                                {userData && userData.userShops.length > 0 && (
                                    <span>Shop: {userData.userShops[0]}</span>
                                )}
                                {userData && userData.userShops.length < 1 && userData.userTowns.length < 1 &&  userData.userRegions.length < 1 && (
                                    <span>National Access</span>
                                )}
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {/* <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">View notifications</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                            </button> */}
                            {/* Profile dropdown */}
                            <div className="relative ml-3">
                                <div
                                    onMouseEnter={() => onMouseEnter('profile')}
                                    onMouseLeave={onMouseLeave}
                                >
                                    <button
                                        type="button"
                                        className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        id="user-menu-button"
                                        aria-expanded="false"
                                        aria-haspopup="true"
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">Open user menu</span>
                                        <img className="h-8 w-8 rounded-full" src="images/user.png" alt="image" />
                                    </button>
                                    <div className={`absolute right-0 z-10 -mt-8 w-48 origin-top-right pt-9 ${tab === "profile" ? "" : "hidden"}`} role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                                        <div className=' bg-white shadow-lg ring-1 rounded-md ring-black ring-opacity-5 focus:outline-none pb-1'>
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-0">Your Profile</Link>
                                            {/* <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-1">Settings</a> */}
                                            <a href="#"
                                                className="block px-4 py-2 text-sm text-gray-700"
                                                role="menuitem"
                                                tabIndex={-1}
                                                id="user-menu-item-2"
                                                onClick={() => logout()}
                                            >Sign out</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {/* mobile view */}
            <nav className="flex h-20 flex-row lg:hidden items-center justify-between px-4">
                <div className="flex logo items-center justify-center h-20">
                    <img src={`${"images/insureme-umbrella.png"}`} alt="Logo" className={`w-14 duration-500`} />
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4">
                            {renderSearchBar()}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="absolute h-20 inset-y-0 right-0 flex items-center pr-2 mr-12 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                        </button>
                        {/* Profile dropdown */}
                        <div className="relative ml-3">
                            <div>
                                <button
                                    type="button"
                                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    id="user-menu-button"
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    onMouseEnter={() => onMouseEnter('profile')}
                                    onMouseLeave={onMouseLeave}
                                >
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="image" />
                                </button>
                            </div>
                            <div className={`absolute right-0 z-10 -mt-4 w-48 origin-top-right rounded-md bg-white pt-8 pb-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${tab === "profile" ? "" : "hidden"}`} role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-0">Your Profile</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-1">Settings</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-2" onClick={() => logout()}>Sign out</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='nav-items flex'>
                </div>
            </nav>
        </>
    )
}