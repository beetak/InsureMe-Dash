import React, { useState } from 'react';
import { HashLoader } from 'react-spinners';

export default function LogoModal(props) {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState([]);
    const [imageName, setImageName] = useState("");
    const [currentImage, setCurrentImage] = useState(false);
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [error, setError] = useState("");
    const isOpen = false

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                setImage(reader.result);
                setCurrentImage(true);
            };
            reader.readAsDataURL(file);
            setImageName(file.name);
        }
    };

    const fetchImageAsBase64 = async (url) => {
        setLoading(true);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Base64 string
                setCurrentImage(true);
                setImageName(url.split('/').pop());
                setLoading(false);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error("Error fetching image:", error);
            setError("Failed to load image from the URL.");
            setLoading(false);
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        if (url) {
            fetchImageAsBase64(url);
            setWebsiteUrl(url);
        } else {
            setImage("");
            setCurrentImage(false);
            setImageName("");
        }
    };

    const InputField = () => {
        return (
            <>
                <div className="sm:col-span-3 flex items-center">
                    <label htmlFor="file" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Image
                    </label>
                    <div className="mt-2 flex-1">
                        <input
                            type="file"
                            name="file"
                            id="file"
                            autoComplete="family-name"
                            className="opacity-0 absolute z-[-1] w-full h-full"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="file"
                            className="w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6 cursor-pointer flex items-center"
                        >
                            <span className='fas fa-upload text-gray-500 mr-2'></span>
                            <span>{imageName || 'Select from computer'}</span>
                        </label>
                    </div>
                </div>
                <p className='flex w-full justify-center py-1'>Optionally</p>
                <div className="sm:col-span-3 flex items-center">
                    <label htmlFor="websiteUrl" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        URL
                    </label>
                    <div className="mt-2 flex-1">
                        <input
                            type="text"
                            name="websiteUrl"
                            id="websiteUrl"
                            autoComplete="family-name"
                            placeholder='Website (Optional)'
                            value={websiteUrl}
                            onChange={handleUrlChange}
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
            </>
        );
    };

    const resizeImage = (url) => {
        return (
            <img
                src={url}
                alt="Resized"
                style={{
                    width: "150px", // Fixed width
                    height: "auto", // Maintain aspect ratio
                    objectFit: 'contain' // Ensure image fits within the set width
                }}
            />
        );
    };

    return (
        <>
            <div className='flex flex-col flex-1 h-screen justify-center bg-gray-200 bg-opacity-50 items-center fixed inset-0 z-50 top-0 left-0' 
                onClick={() => {
                    props.setLogoModal(false)
                    // props.setShow(true)
                }}
            >
                <div className='flex flex-col w-1/2 justify-center bg-white p-8 rounded-lg border border-gray-200' onClick={(e) => e.stopPropagation()}>
                    <div className='w-full flex justify-end'>
                        <a 
                            href="#"
                            onClick={() => {
                                props.setLogoModal(false)
                                // props.setShow(true)
                            }}
                            className='bg-gray-500 w-8 h-8 rounded-full flex justify-center items-center'
                        >
                            <i className='fas fa-times text-white'/>
                        </a>
                    </div>
                    <h2 className="text-lg font-semibold">{currentImage?imageName:"Upload Image or use image link"}</h2>
                    <div className='space-y-1 h-40'>
                        <div className={`flex flex-col flex-1 justify-center py-3 ${!loading && 'hidden'}`}>
                            <HashLoader
                                color={loading ? '#3B82F6' : '#DF3333'}
                                loading={loading}
                                cssOverride={override}
                                size={30}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                            {loading && <h1 className='flex text-blue-500 justify-center italic'>Loading</h1>}
                        </div>
                        {!currentImage ? (
                            <InputField />
                        ) : (
                            <div className="flex justify-center py-4">
                                {resizeImage(image)}
                            </div>
                        )}
                    </div>
                    <div className='flex space-x-2 pt-10'>
                        {currentImage && (
                            <>
                                <button
                                    onClick={() => {
                                        setCurrentImage(false)
                                        setImage("")
                                        setImageName("")
                                    }}
                                    className={`border border-gray-300 rounded-sm px-4 py-2 bg-green-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                                >
                                    <span className='fas fa-redo text-white-500 mr-2'></span>
                                    <span>Change Image</span>
                                </button>
                                <button
                                    onClick={() => {
                                        props.setImageDetails(image, imageName);
                                        // props.setShow(true)
                                        props.setLogoModal(false);
                                    }}
                                    className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                                >
                                    Save Image
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => {
                                props.setLogoModal(false)
                                // props.setShow(true)
                            }}
                            className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
};