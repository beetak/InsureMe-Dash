import React, { useEffect, useState } from 'react'
import Modal from '../modal/HiddenModal';
import { HashLoader } from 'react-spinners';
import LogoModal from './LogoModal';
import companyIcecashId from './../companyIcecashId.json'
import useAuth from '../../hooks/useAuth';
import InsuranceApi, { setupInterceptors } from '../api/InsuranceApi';
import ColorPickerModal from '../modal/ColorPickerModal';

export default function InsurerModal({ data, refresh, setModal }) {

    const {user, setUser} = useAuth()

    useEffect(() => {
        setupInterceptors(()=>user, setUser)

        setInsurerName(data.insurerName)
        setAddress(data.address)
        setIsActive(data.isActive)
        setInsurerLogo(data.insurerLogo)
        setWebsiteUrl(data.websiteUrl)
        setSecondAddress(data.secondAddress)
        setOfficeNumber(data.officeNumber)
        setMobileNumber(data.mobileNumber)
        setEmail(data.email)
        setIceCashId(data.iceCashId)
        setMainColor(data.mainColor)
        setSecondColor(data.secondColor)
    }, [data])

    const userImage = data.insurerLogo

    const [insurerName, setInsurerName] = useState("")
    const [isActive, setIsActive] = useState("")
    const [address, setAddress] = useState("")
    const [secondAddress, setSecondAddress] = useState("")
    const [insurerLogo, setInsurerLogo] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [officeNumber, setOfficeNumber] = useState("")
    const [email, setEmail] = useState("")
    const [websiteUrl, setWebsiteUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [image, setImage] = useState('')
    const [imageName, setImageName] = useState("")
    const [currentImage, setCurrentImage] = useState(false)
    const [iceCashId, setIceCashId] = useState("")
    const [currentPage, setCurrentPage] = useState(true)
    const [mainColor, setMainColor] = useState("#000000")
    const [secondColor, setSecondColor] = useState("#FFFFFF")
    const [isColorModalOpen, setIsColorModalOpen] = useState(false)
    const [activeColorPicker, setActiveColorPicker] = useState('main')

    const close = false

    const handleUpdate = async (e) => {  
        const id = data.insurerId
        const insurerData = {
            insurerName,
            insurerLogo: image?image:insurerLogo,
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
        console.log("update data", insurerData)
        try{
            const response = await InsuranceApi.put(`/insurers/${id}`, insurerData)
            if(response){
                setSuccess(true)
            }
        }
        catch(err){
            console.log(err)
        }
        finally{
            setLoading(false)
            setFailed(false)
            setSuccess(false)
            refresh()
            setModal(close)
        }
    }

    const getImage =(image, imageName)=>{
        setImage(image)
        setImageName(imageName)
    }

    const getModal =(isOpen)=>{
        setModal(isOpen)
    }

    const getLogoModal =(isOpen)=>{
        setCurrentImage(isOpen)
        setCurrentPage(true)
    }

    const showModal = (showPage) => {
        setCurrentPage(showPage)
    }

    const decodedImage = (baseString) => {
        try {
          const binaryData = atob(baseString);
          const arrayBuffer = new ArrayBuffer(binaryData.length);
          const uint8Array = new Uint8Array(arrayBuffer);
      
          for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }
      
          return new Blob([uint8Array], { type: 'image/jpeg' });
        } catch (error) {
          console.error('Error decoding image:', error);
          return null;
        }
    };

    const decodedBlob = userImage 
    ? decodedImage(userImage.substring(userImage.indexOf(",") + 1)) 
    : null;

    const url = decodedBlob ? URL.createObjectURL(decodedBlob) : null;

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
                currentImage && <LogoModal setLogoModal={getLogoModal} setShow={showModal} setImageDetails={getImage}/>
            }
            <ColorPickerModal
                isOpen={isColorModalOpen}
                onClose={() => setIsColorModalOpen(false)}
                initialColor={activeColorPicker === 'main' ? mainColor : secondColor}
                onColorChange={handleColorChange}
            />
            <Modal setModal={getModal} hidden={currentPage}>
                <h2 className="text-lg font-semibold">Insurance Company Details Modification</h2>
                <p className="text-xs mb-4">Edit Fields</p>
                <div className='space-y-1'>
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
                            loading&&!failed&&!success?<h1 className='flex text-blue-500 justify-center italic'>Loading</h1>:
                            loading&&failed&&!success?<h1 className='flex text-red-500 justify-center italic'>Failed</h1>:
                            loading&&!failed&&success&&<h1 className='flex text-gray-500 justify-center italic'>Success</h1>
                        }                            
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Company Name
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="insurerName"
                                id="insurerName"
                                autoComplete="family-name"
                                placeholder={data.insurerName}
                                // value={insurerName}
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
                                placeholder={`${data.websiteUrl?data.websiteUrl:"Website (Optional)"}`}
                                // value={websiteUrl}
                                onChange={(e)=>setWebsiteUrl(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="file" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Logo
                        </label>
                        <img
                            className="h-8 rounded-full"
                            src={userImage? url : 'images/questionmark.png'}
                            alt="Insurance Company Logo"
                        />
                        <div className="mt-2 flex-1">
                            <div className="relative">
                                <label
                                    onClick={() => {
                                        setCurrentImage(true);
                                        setCurrentPage(false);
                                    }}
                                    className="w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6 cursor-pointer flex items-center"
                                >
                                    <span className='fas fa-upload text-gray-500 mr-2'></span>
                                    <span>{imageName || 'Upload Logo'}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Address 1
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="websiteUrl"
                                id="websiteUrl"
                                autoComplete="family-name"
                                placeholder={data.address}
                                // value={address}
                                onChange={(e)=>setAddress(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Address 2
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="websiteUrl"
                                id="websiteUrl"
                                autoComplete="family-name"
                                placeholder={`${data.secondAddress?data.secondAddress:"Second Address (Optional)"}`}
                                // value={secondAddress}
                                onChange={(e)=>setSecondAddress(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Telephone
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="websiteUrl"
                                id="websiteUrl"
                                autoComplete="family-name"
                                placeholder={data.officeNumber}
                                // value={officeNumber}
                                onChange={(e)=>setOfficeNumber(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Telephone 2
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="websiteUrl"
                                id="websiteUrl"
                                autoComplete="family-name"
                                placeholder={`${data.mobileNumber?data.mobileNumber:"Second Office Number (Optional)"}`}
                                // value={mobileNumber}
                                onChange={(e)=>setMobileNumber(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Email Address
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                            type="text"
                            name="websiteUrl"
                            id="websiteUrl"
                            autoComplete="family-name"
                            placeholder={data.email}
                            // value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
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
                        data.secondEmail&&
                        <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                                Address 2
                            </label>
                            <div className="mt-2 flex-1">
                                <input
                                type="text"
                                name="websiteUrl"
                                id="websiteUrl"
                                autoComplete="family-name"
                                placeholder={data.secondAddress}
                                // value={secondAddress}
                                onChange={(e)=>setSecondAddress(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    }

                    {/* <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Connection Type
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                            id="systemAdOns"
                            name="systemAdOns"
                            className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                            <option value="">Select Type</option>
                            <option value="Option 1">API Connection</option>
                            <option value="Option 2">Portal</option>
                            </select>
                        </div>
                    </div> */}
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Active State
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="isActive"
                                name="isActive"
                                value={isActive}
                                onChange={(e) => setIsActive(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            >
                                <option value="">{data.isActive?"Active":"Inactive"}</option>
                                <option value={"active"}>Active</option>
                                <option value={"inactive"}>Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Icecash ID
                        </label>
                        <div className="mt-2 flex-1">
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
                        onClick={handleUpdate}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Submit
                    </button>
                    <button
                        onClick={()=>setModal(close)}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Cancel
                    </button>
                </div>
            </Modal>
        </>
    )
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}
