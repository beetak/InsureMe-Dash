import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getDropdownStatus, getNavStatus, navActions } from '../../../store/nav-store'
import useAuth from '../../../hooks/useAuth'
import useTheme from '../../../hooks/useTheme'

export default function SideBar() {

    const {user} = useAuth()
    const { companyDetails } = useTheme()
    companyDetails && console.log("code",companyDetails)

    const userRole = user.role
    const firstname = user.firstname

    const [isOpen, setIsOpen] = useState(true)
    const [selectedTab, setSelectedTab] = useState("")
    const [userData, setUserData] = useState('')

    const navState = useSelector(getNavStatus)
    const dropdownState = useSelector(getDropdownStatus)
    const dispatch = useDispatch()
    
    const menus = [
        { title: "Dashboard", src: "/dashboard", icon: "fas fa-home", tab:"home" },
        { title: "Sales", src: "/sales", icon: "fas fa-dollar", tab:"sales" },
        { title: "Products", icon: "fab fa-wpforms", tab:"products", dropdown: true,
            submenuItems: [
                { title: "Category", src: "/insurance-type", icon: "fas fa-list", tab:"products"},
                { title: "Policy", src: "/policy", icon: "fas fa-ticket", tab:"products"},
                { title: "Insurance", src: "/insurance", icon: "fas fa-house-chimney-user", tab:"products"},
                // { title: "Leads Tracking", src: "/leads", icon: "fas fa-arrow-right", tab:"products"},
            ]
        },
        // { title: "Insurers", src: "/insurers", icon: "fas fa-users", tab:"partner"},
        { title: "Revenue", icon: "fas fa-bank", tab:"revenue", dropdown: true,
            submenuItems: [,
                { title: "Commisions", src: "/commissions", icon: "fas fa-user", tab:"revenue"},
                { title: "Reports", src: "/reports", icon: "fas fa-file-alt", tab:"revenue"},
                // { title: "Cover Notes", src: "/notes", icon: "fas fa-shield", tab:"revenue"},
                // { title: "Claims", src: "/claims", icon: "fas fa-chart-bar", tab:"revenue"},
            ]
        },
        { title: "Entities", icon: "fas fa-globe", tab:"entities", dropdown: true,
            submenuItems: [
                { title: "Regions", src: "/regions", icon: "fas fa-registered", tab:"entities"},
                { title: "Towns", src: "/towns", icon: "fas fa-t", tab:"entities"},
                { title: "Shops", src: "/shops", icon: "fas fa-store", tab:"entities"},
                { title: "Insurance Companies", src: "/insurers", icon: "fas fa-users", tab:"entities"},
            ]
        },
        { title: "User Management", icon: "fas fa-user", tab:"user-management", dropdown: true,
            submenuItems: [
                { title: "Internal Users", src: "/internal-users", icon: "fas fa-user", tab:"entities"},
                { title: "Insurer Users", src: "/insurer-users", icon: "fas fa-user", tab:"entities"},
                { title: "Customers", src: "/customers", icon: "fas fa-user", tab:"entities"},
            ]
        },
    ]

    const filteredMenus = menus.filter((menu) => {
        if (menu.title === "Dashboard" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN" || userRole === "INSURER_ADMIN" || userRole === "IT_ADMIN" || userRole === "PRODUCT_MANAGER" || userRole === "IT_SUPPORT" || userRole === "MANAGER" || userRole === "TREASURY_ACCOUNTANT")) {
            return true;
        } 
        if (menu.title === "Sales" && userRole === "SALES_AGENT") {
            return true;
        } 
        if (menu.title === "Products" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN" || userRole === "SALES_ADMIN" || userRole === "INSURER_ADMIN" || userRole === "IT_ADMIN" || userRole === "PRODUCT_MANAGER" || userRole === "IT_SUPPORT" || userRole === "MANAGER" || userRole === "TREASURY_ACCOUNTANT")) {
            const filteredSubmenuItems = menu.submenuItems.filter((submenu) => {
                // Submenu filtering logic based on userRole
                if (submenu.title === "Category" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
                    return true;
                }
                if (submenu.title === "Policy" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
                    return true;
                }
                if (submenu.title === "Insurance" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN" || userRole === "INSURER_ADMIN" || userRole === "IT_ADMIN" || userRole === "PRODUCT_MANAGER" || userRole === "IT_SUPPORT" || userRole === "MANAGER" || userRole === "TREASURY_ACCOUNTANT")) {
                    return true;
                }
                if (submenu.title === "Leads Tracking" && (userRole === "INSURER_ADMIN" || userRole === "IT_ADMIN" || userRole === "PRODUCT_MANAGER" || userRole === "IT_SUPPORT" || userRole === "MANAGER" || userRole === "TREASURY_ACCOUNTANT")) {
                    return true;
                }
    
                return false;
            });
            // Updated submenuItems with filtered submenus
            menu.submenuItems = filteredSubmenuItems;
            return true;
        } 
        if (menu.title === "Insurance" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
          return true;
        } 
        if (menu.title === "Revenue" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN" || userRole === "SALES_AGENT" || userRole === "INSURER_ADMIN" || userRole === "IT_ADMIN" || userRole === "PRODUCT_MANAGER" || userRole === "IT_SUPPORT" || userRole === "MANAGER" || userRole === "TREASURY_ACCOUNTANT")) {
            const filteredSubmenuItems = menu.submenuItems.filter((submenu) => {
                // Submenu filtering logic based on userRole
                if (submenu.title === "Commissions" &&(userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
                    return true;
                }
                if (submenu.title === "Reports" &&(userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN" || userRole === "INSURER_ADMIN" || userRole === "SALES_AGENT" || userRole === "IT_ADMIN" || userRole === "PRODUCT_MANAGER" || userRole === "IT_SUPPORT" || userRole === "MANAGER" || userRole === "TREASURY_ACCOUNTANT")) {
                    return true;
                }    
                if (submenu.title === "Cover Notes" &&(userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN" || userRole === "INSURER_ADMIN" || userRole === "IT_ADMIN" || userRole === "PRODUCT_MANAGER" || userRole === "IT_SUPPORT" || userRole === "MANAGER" || userRole === "TREASURY_ACCOUNTANT")) {
                    return true;
                }    
                if (submenu.title === "Claims" &&(userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN" || userRole === "INSURER_ADMIN" || userRole === "IT_ADMIN" || userRole === "PRODUCT_MANAGER" || userRole === "IT_SUPPORT" || userRole === "MANAGER" || userRole === "TREASURY_ACCOUNTANT")) {
                    return true;
                }    
                return false;
            });
            // Updated submenuItems with filtered submenus
            menu.submenuItems = filteredSubmenuItems;
            return true;
        } 
        if (menu.title === "Entities" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
          return true;
        } 
        if (menu.title === "User Management" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN" || userRole === "INSURER_ADMIN" || userRole === "IT_ADMIN" || userRole === "PRODUCT_MANAGER" || userRole === "IT_SUPPORT" || userRole === "MANAGER" || userRole === "TREASURY_ACCOUNTANT")) {
            const filteredSubmenuItems = menu.submenuItems.filter((submenu) => {
                // Submenu filtering logic based on userRole
                if (submenu.title === "Insurer Users" &&(userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN" || userRole === "INSURER_ADMIN" || userRole === "IT_ADMIN" || userRole === "PRODUCT_MANAGER" || userRole === "IT_SUPPORT" || userRole === "MANAGER" || userRole === "TREASURY_ACCOUNTANT")) {
                    return true;
                }
                if (submenu.title === "Internal Users" &&(userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
                    return true;
                }
                if (submenu.title === "Customers" &&(userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
                    return true;
                }    
                return false;
            });
            // Updated submenuItems with filtered submenus
            menu.submenuItems = filteredSubmenuItems;
            return true;
        }    
        return false;
    });    

    
    return (
        <>
            {/* Desktop View */}
            <div className={`${isOpen ? "w-64" : "w-16"} bg-gray-200 h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out`}>
                {/* Sidebar content */}
                <div className="items-center bg-contain bg-center absolute top-0 z-10 -right-11" style={{backgroundImage: 'url(images/dashpin.png)', width: '45px', height: "80px"}}>
                    {/* Dashboard Toggle Button */}
                    <button 
                        type="button" 
                        className="relative inline-flex h-[80px] items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 focus:outline-none" 
                        aria-controls="mobile-menu" 
                        aria-expanded="false"
                        onClick={()=>setIsOpen(!isOpen)}
                    >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {!isOpen ? <span className="fas fa-bars text-xl ms-1" /> : <span className="fas fa-times text-xl ms-1" />}
                    </button>
                </div>
                <div className="h-full overflow-y-auto">
                    <div className="logo flex items-center h-20 ps-4">
                        {userRole === "INSURER_ADMIN" 
                            ? <img src={`${companyDetails?.insurerLogo}`} alt="Logo" className={`w-28 duration-500`} />
                            : <img src={`${isOpen ? "images/icon.png" : "images/insureme-umbrella.png"}`} alt="Logo" className={`w-28 duration-500`} />
                        }
                    </div>
                    <div className={`logo flex items-center ps-1 ${!isOpen && "hidden"}`}>
                        {/* <img src={user.userLogo?user.userLogo:"images/user.png"} alt="Logo" className="w-10 rounded-full bg-gradient-to-b from-main-color to-secondary-color" /> */}
                        <div className="ml-4">
                            <h2 className="text-md font-bold h-6">Welcome <span className='text-main-color'>{firstname}</span></h2>
                            <p className="text-gray-600 text-xs">
                                {(userRole === "INSURER_ADMIN" || userRole==="IT_ADMIN" || userRole==="ADMIN")? "Administrator" :
                                 userRole === "SALES_AGENT" ? "Cashier" :
                                 userRole === "SUPER_ADMINISTRATOR" ? "Super User" :
                                 userRole === "TREASURY_ACCOUNTANT" ? "Accountant" :
                                 userRole === "PRODUCT_MANAGER" ? "Product Manager" :
                                 userRole === "MANAGER" ? "Finance Manager" : ""}
                            </p>
                        </div>
                    </div>
                    <ul className="space-y-2 mt-3">
                        {filteredMenus.map((menu) => (
                            <React.Fragment key={menu.title}>
                                <Link  
                                    className="relative block px-4 py-2 text-gray-500 hover:bg-main-color-20 hover:text-gray-700"
                                    onClick={() => {
                                        dispatch(navActions.toggleNav(menu.tab));
                                        if (navState === menu.tab && dropdownState) {
                                            dispatch(navActions.toggleDropdown({ state: false }));
                                        } else if (navState === menu.tab && !dropdownState) {
                                            dispatch(navActions.toggleDropdown({ state: true }));
                                        } else {
                                            dispatch(navActions.toggleDropdown({ state: true }));
                                        }
                                    }}
                                    to={menu.src && menu.src}
                                >
                                    <a className="">
                                        <i className={`${menu.icon} menu-icon text-lg w-4 ps-1 text-main-color`}></i>
                                        <span className={`menu-title ml-6 text-sm font-semibold ${!isOpen && "hidden"} text-main-color`}>{menu.title}</span>
                                    </a>
                                    <span className={`${navState !== menu.tab ? "hidden" : ""} absolute left-0 top-0 h-full bg-secondary-color w-1`}></span>
                                    <i className={`${!menu.dropdown && "hidden"} ${menu.dropdown && dropdownState && selectedTab === menu.tab ? "fas fa-chevron-up" : menu.dropdown && selectedTab !== menu.tab ? "fas fa-chevron-down" : menu.dropdown && !dropdownState && "fas fa-chevron-down"} ${!isOpen && "-rotate-90"} text-xs w-4 ps-1 absolute text-gray-700 right-2 mt-1.5`}></i>
                                </Link>
                                {menu.dropdown && dropdownState && isOpen && navState === menu.tab && (
                                    <ul className=''>
                                        {menu.submenuItems.map((item) => (
                                            <Link  
                                                className="relative block px-4 py-1 text-gray-500 hover:bg-gray-300 hover:text-gray-700"
                                                to={item.src}
                                                key={item.title}
                                            >
                                                <a className="ml-4">
                                                    <i className={`${item.icon} menu-icon text-sm w-4 ps-1 text-gray-700`}></i>
                                                    <span className={`menu-title ml-6 ${!isOpen && "hidden"} text-sm text-gray-700`}>{item.title}</span>
                                                </a>
                                            </Link>
                                        ))}
                                    </ul>
                                )}
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Mobile view */}
            <div className="w-64 fixed top-0 right-0 z-50 lg:hidden">
                {/* Sidebar content */}
                <div className="flex relative mr-4 justify-end items-center h-20">
                    <button 
                        type="button" 
                        className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 focus:outline-none" 
                        aria-controls="mobile-menu" 
                        aria-expanded="false"
                        onClick={()=>setIsOpen(!isOpen)}
                    >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {!isOpen ? <span className="fas fa-bars text-xl ms-1" /> : <span className="fas fa-times text-xl ms-1" />}
                    </button>
                </div>
                <div className={`bg-gray-200 h-screen ${!isOpen && "hidden"} transition-transform duration-300`}>
                    <ul className="space-y-2">
                        {filteredMenus.map((menu) => (
                            <Link  
                                className="relative block px-4 py-2 text-gray-500 hover:bg-blue-200 hover:text-gray-700"
                                onClick={() => setSelectedTab(menu.tab)}
                                to={menu.src}
                                key={menu.title}
                            >
                                <a className="" href="/">
                                    <i className={`${menu.icon} menu-icon text-lg w-4 ps-1 text-blue-900`}></i>
                                    <span className={`menu-title ml-6 text-blue-900`}>{menu.title}</span>
                                </a>
                                <span className={`${selectedTab !== menu.tab ? "hidden" : ""} absolute left-0 top-0 h-full bg-blue-900 w-1`}></span>
                            </Link>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}
