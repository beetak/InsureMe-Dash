import React, { useState } from 'react'
import Modal from '../modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, updateCategory } from '../../store/category-store';
import { HashLoader } from 'react-spinners';
import icons from './icons.json'

export default function IconsModal(props) {

    const dispatch = useDispatch()

    const [description, setDescription] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [isActive, setIsActive] = useState("");
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [close, setClose] = useState(false)

    const getModal =(isOpen)=>{
        props.setModal(isOpen)
    }

    return (
        <>
            <Modal setModal={getModal}>
                <h2 className="text-lg font-semibold">Insurance Category Icon</h2>
                <p className="text-xs mb-4">The selected Icon will be attached to the relative category</p>
                <div className="grid grid-cols-7 gap-4">
                    {icons.map((icon, index) => (
                        <div onClick={()=>{props.setIcon(icon.name, icon.class);props.setModal(close)}} className='flex flex-col justify-center items-center cursor-pointer'>
                            <i key={index} className={`${icon.class}`}></i>
                            <p className='bg-gray-300 px-2 rounded-xl w-20 text-center mt-2'>{icon.name}</p>
                        </div>
                    ))}
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
