import React, { useEffect, useState } from 'react'
import PageLoading from '../loadingStates/PageLoading';
import LogoModal from './LogoModal';
import companyIcecashId from './../companyIcecashId.json'
import InsuranceApi, { setupInterceptors } from '../api/InsuranceApi';
import useAuth from '../../hooks/useAuth';
import ColorPickerModal from '../modal/ColorPickerModal';

export default function InsurerForm() {

    const {user, setUser} = useAuth()

    useEffect(()=>{
        setupInterceptors(()=> user, setUser)
    })

    const [rows, setRows] = useState([]);
    const [addressRows, setAddressRows] = useState([]);
    const [phoneRows, setPhoneRows] = useState([]);
    const [emailRows, setEmailRows] = useState([]);
    const [count, setCount] = useState(1)
    const [ecount, setECount] = useState(1)
    const [pcount, setPCount] = useState(1)

    const [insurerName, setInsurerName] = useState("")
    const [address, setAddress] = useState("")
    const [secondAddress, setSecondAddress] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [officeNumber, setOfficeNumber] = useState("")
    const [email, setEmail] = useState("")
    const [websiteUrl, setWebsiteUrl] = useState("")
    const [isActive, setIsActive] = useState(true)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState([])
    const [image, setImage] = useState([])
    const [imageName, setImageName] = useState("")
    const [currentImage, setCurrentImage] = useState(false)
    const [iceCashId, setIceCashId] = useState('')
    const [mainColor, setMainColor] = useState("#000000")
    const [secondColor, setSecondColor] = useState("#FFFFFF")
    const [isColorModalOpen, setIsColorModalOpen] = useState(false)
    const [activeColorPicker, setActiveColorPicker] = useState('main')

    const handlePost = async (e) => {
        e.preventDefault()
        if(insurerName===""&&address===""&&officeNumber===""&&email===""&&iceCashId===""){
            const newError = { err: 'empty', message: 'Please provide all fields' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
        }
        else {
            if(insurerName===""){
                const newError = { err: 'name', message: 'Please provide the Company Name' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(address===""){
                const newError = { err: 'address', message: 'Please provide at least one physical address' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(officeNumber===""){
                const newError = { err: 'number', message: 'Please provide at least one Office Number' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(email===""){
                const newError = { err: 'email', message: 'Please provide at least one email' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(iceCashId===""){
                const newError = { err: 'icecash', message: 'Please select the icecash Id' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            else if(insurerName!==""&&address!==""&&officeNumber!==""&&email!==""&&iceCashId!==""){
                const insurerData = {
                    insurerName,
                    insurerLogo: image,
                    address,
                    secondAddress,
                    mobileNumber,
                    officeNumber,
                    email,
                    websiteUrl,
                    isActive,
                    iceCashId,
                    mainColor,
                    secondColor
                }
                setLoading(true)
                try{
                    const response = await InsuranceApi.post("/insurers", insurerData)
                    if(response){
                        setSuccess(true)
                    }
                }
                catch(err){
                    setFailed(true)
                }
                finally{
                    setTimeout(()=>{
                        setLoading(false)
                        setFailed(false)
                        setSuccess(false)
                    },2000)
                }
            }
        }
    }
    
    const decrement = (index) => {
        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows.splice(index, 1);
          return updatedRows;
        });
        setCount((prevCount) => prevCount - 1);
    };

    const increment = () => {
        setCount(prevCount=>prevCount+1)
    }
    const decrementE = (index) => {
        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows.splice(index, 1);
          return updatedRows;
        });
        setECount((prevCount) => prevCount - 1);
      };

    const incrementE = () => {
        setECount(prevCount=>prevCount+1)
    }

    const decrementP = (index) => {
        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows.splice(index, 1);
          return updatedRows;
        });
        setPCount((prevCount) => prevCount - 1);
      };

    const incrementP = () => {
        setPCount(prevCount=>prevCount+1)
    }

    const handleAddressChange = (e, index) => {
        const updatedRows = [...addressRows];
        updatedRows[index] = e.target.value;
        setAddress(updatedRows[0]);
        setSecondAddress(updatedRows[1]);
        setAddressRows(updatedRows);
    };
    const handlePhoneChange = (e, index) => {
        const updatedRows = [...phoneRows];
        updatedRows[index] = e.target.value;
        setOfficeNumber(updatedRows[0]);
        setMobileNumber(updatedRows[1]);
        setPhoneRows(updatedRows);
    };
    const handleEmailChange = (e, index) => {
        const updatedRows = [...emailRows];
        updatedRows[index] = e.target.value;
        setEmail(updatedRows[0]);
        setEmailRows(updatedRows);
    };

    const getModal =(isOpen)=>{
        setCurrentImage(isOpen)
    }

    const getImage =(image, imageName)=>{
        setImage(image)
        setImageName(imageName)
    }

    const openColorPicker = (colorType) => {
        setActiveColorPicker(colorType)
        setIsColorModalOpen(true)
    }

    const handleColorChange = (color) => {
        if (activeColorPicker === 'main') {
            setMainColor(color)
        } else {
            setSecondColor(color)
        }
    }

    return (
        <>
            {
                loading && <PageLoading loading={loading} success={success} failed={failed}/>
            }
            <ColorPickerModal
                isOpen={isColorModalOpen}
                onClose={() => setIsColorModalOpen(false)}
                initialColor={activeColorPicker === 'main' ? mainColor : secondColor}
                onColorChange={handleColorChange}
            />
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                {
                    loading && <PageLoading loading={loading} success={success} failed={failed}/>
                }
                <h2 className="text-lg font-semibold">Insurer Creation Form</h2>
                <p className="text-xs mb-4">For vehicle Insurance processing</p>
                <div className='space-y-1'>
                    {
                        Object.keys(error).length>0&&
                        error.map((error, index) => {
                            if (error.err === "empty") {
                                return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                            }
                            return null;
                        })
                    }
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Company Name
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "name") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="insurerName"
                                id="insurerName"
                                autoComplete="family-name"
                                placeholder='Insurer Name'
                                value={insurerName}
                                onChange={(e)=>setInsurerName(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Website
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="websiteUrl"
                                id="websiteUrl"
                                autoComplete="family-name"
                                placeholder='Website (Optional)'
                                value={websiteUrl}
                                onChange={(e)=>setWebsiteUrl(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="file" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Logo
                        </label>
                        <div className="mt-2 flex-1">
                            <div className="relative">
                                <label
                                    onClick={()=>setCurrentImage(true)}
                                    className="w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6 cursor-pointer flex items-center"
                                >
                                    <span className='fas fa-upload text-gray-500 mr-2'></span>
                                    <span>{imageName || 'Upload Logo'}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* Main Color Picker field */}
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="mainColor" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Main Color
                        </label>
                        <div className="mt-2 flex-1">
                            <div 
                                className="w-full h-10 rounded-md border border-gray-300 flex items-center justify-between px-3 cursor-pointer"
                                onClick={() => openColorPicker('main')}
                            >
                                <span>{mainColor}</span>
                                <div 
                                    className="w-6 h-6 rounded-full border border-gray-300" 
                                    style={{ backgroundColor: mainColor }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Second Color Picker field */}
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="secondColor" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Second Color
                        </label>
                        <div className="mt-2 flex-1">
                            <div 
                                className="w-full h-10 rounded-md border border-gray-300 flex items-center justify-between px-3 cursor-pointer"
                                onClick={() => openColorPicker('second')}
                            >
                                <span>{secondColor}</span>
                                <div 
                                    className="w-6 h-6 rounded-full border border-gray-300" 
                                    style={{ backgroundColor: secondColor }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {
                        currentImage && <LogoModal setLogoModal={getModal} setImageDetails={getImage}/>
                    }
                    {[...Array(count)].map((_, index) => (
                        <div key={index} className="sm:col-span-3 flex items-center">
                            <label htmlFor={`address-${index}`} className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                                Address {++index}
                            </label>
                            <div className="mt-2 block flex-1">
                                {
                                    index===1&&Object.keys(error).length>0&&
                                    error.map((error, index) => {
                                        if (error.err === "address") {
                                            return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                        }
                                        return null;
                                    })
                                }
                                <input
                                    type="text"
                                    name={`address-${--index}`}
                                    id={`address-${index}`}
                                    autoComplete="family-name"
                                    placeholder={`${index===0?"Address":"Optional Address"}`}
                                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                    value={addressRows[index]}
                                    onChange={(e) => handleAddressChange(e, index)}
                                />
                            </div>
                            {
                                index === count - 1 ? (
                                    count < 2 ? (
                                      <span onClick={increment} className="fas fa-plus px-3" />
                                    ) : (
                                      <span className="fas fa-plus px-3 disabled" />
                                    )
                                  ) : (
                                    <span onClick={() => decrement(index)} className="fas fa-minus px-3" />
                                  )
                            }
                        </div>
                    ))}
                    {[...Array(ecount)].map((_, index) => (
                        <div key={index} className="sm:col-span-3 flex items-center">
                        <label htmlFor={`email-${index}`} className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Email {++index}
                        </label>
                        <div className="mt-2 block flex-1">
                            {
                                index===1&&Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "email") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="email"
                                name={`email-${--index}`}
                                id={`email-${index}`}
                                autoComplete="family-name"
                                placeholder={`${index===0?"Email":"Optional Email"}`}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                value={emailRows[index]}
                                onChange={(e) => handleEmailChange(e, index)}
                            />
                        </div>
                        {index === ecount - 1 ? 
                            (<span onClick={incrementE} className="fas fa-plus px-3" />):(<span onClick={() => decrementE(index)} className="fas fa-minus px-3" />)}
                        </div>
                    ))}
                    {[...Array(pcount)].map((_, index) => (
                        <div key={index} className="sm:col-span-3 flex items-center">
                            <label htmlFor={`email-${index}`} className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                                Phone {++index}
                            </label>
                            <div className="mt-2 block flex-1">
                                {
                                    index===1&&Object.keys(error).length>0&&
                                    error.map((error, index) => {
                                        if (error.err === "number") {
                                            return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                        }
                                        return null;
                                    })
                                }
                                <input
                                    type="text"
                                    name={`phone-${--index}`}
                                    id={`phone-${index}`}
                                    autoComplete="family-name"
                                    placeholder={`${index===0?"Phone Number":"Optional Phone Number"}`}
                                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                    value={phoneRows[index]}
                                    onChange={(e) => handlePhoneChange(e, index)}
                                />
                            </div>
                            {index === pcount - 1 ? 
                            (<span onClick={incrementP} className="fas fa-plus px-3" />):(<span onClick={() => decrementP(index)} className="fas fa-minus px-3" />)}
                        </div>
                    ))}
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Icecash ID
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "icecash") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <select
                                id="iceCashId"
                                name="iceCashId"
                                value={iceCashId}
                                onChange={(e) => setIceCashId(e.target.value)}
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value="" className='font-bold italic'>Select Icecash ID</option>
                                <option  value={0}>No Icecash ID</option>
                                {companyIcecashId ? (
                                    companyIcecashId.map((item) => (
                                    <option key={item.Insurance_Company_ID} value={item.Insurance_Company_ID}>
                                        {item.Organisation}
                                    </option>
                                    ))
                                ) : (
                                    <option value="">No data found</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
                <div className='flex space-x-2 pt-10'>
                    <button
                        onClick={handlePost}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Submit
                    </button>
                    <button
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Cancel
                    </button>
                </div>
            </div>
        </>
    )
}
