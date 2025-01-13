import React, { useState } from 'react'
import jsPDF from 'jspdf'
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from 'react-redux';
import { navActions } from '../../../store/nav-store';
import { getVehicleInformation, postPayment, vehicleInfoActions } from '../../../store/payments-store';
import { getQuotation } from '../../../store/sales-store';
const img = "images/icon.png"

export default function TravelVehicleQuote() {

    const dispatch = useDispatch()

    const quotation = useSelector(getQuotation)
    const vehicleInfo = useSelector(getVehicleInformation)

    const [firstname, setFirstname] = useState("Chengetai")
    const [surname, setLastname] = useState("Meraki")
    const [bpNumber, setBPNumber] = useState(200001412)
    const [vatNumber, setVATNumber] = useState(10001509)
    const [refNumber, setRefNumber] = useState(10001509)
    const [vatPercentage, setVATPercentage] = useState(15)
    const [createdAt, setCreatedAt] = useState('2024-05-22T11:29:11.463Z')

    function formatAddress(address) {
        const parts = address.split(", ");
        return parts.join(",\n");
    }
    
    const addressTo = "Gaala & Sons, C-201, Beykoz-34800, Canada, K1A 0G9.";
    const addressFrom = "104, Minare SK, Canada, K1A 0G9.";

    const data = [
        { item: 1, name: 'Product A', qty: '1', price: '20', policyNumber: 'abc11' },
        { item: 2, name: 'Product B', qty: '1', price: '20', policyNumber: 'abc12' },
        { item: 3, name: 'Product A', qty: '1', price: '20', policyNumber: 'abc11' },
        { item: 4, name: 'Product D', qty: '1', price: '20', policyNumber: 'abc14' },
        { item: 5, name: 'Product E', qty: '1', price: '20', policyNumber: 'abc15' },
        { item: 6, name: 'Product F', qty: '1', price: '20', policyNumber: 'abc16' },
    ];

    const insuranceDetails = {
        name: "Zimnat Lion Insurance Company",
        coverNote: "ICZIM1234-987654",
        transactionRef: 123456,
        insuranceType: 'Road Traffic Act',
        vehicleType: 'Private Car - Private Use',
        policyRate: 'ZWL150000,50 per annum',
        startDate: "01 January 2024",
        endDate: "31 December 2024",
        period: 365,
        policy: "ZWL60000.00",
        gvtLevy: "ZWL5000.00",
        stampDuty: "ZWL3000.00",
        premiumDue: "ZWL68000.00"
    }

    const handlePayment = (item) => {
        dispatch(
        postPayment({
            insurerId: item.insurerId,
            productId: 1,
            createdAt,
            clientId: 1,
            salesAgentId: 1,
            propertyId: vehicleInfo.id,
            amount: item.totalPrice,
            method: 'CASH',
            currencyCode: 'USD',
            startDate: '2024-05-27',
            endDate: '2024-05-27',
            status: 'PENDING'
        })
        ).then((response) => {
        console.log('Response: ', response.payload);
        if (response.payload && response.payload.success) {
            dispatch(navActions.toggleQuote(false))
            dispatch(navActions.toggleInvoice(true))
        }
        });
    };

    const printVouchers = () => {
        const invoiceData = Object.values(data).map((elt, index)=>
            [  
                ++index,
                elt.policyNumber,
                elt.name,
                elt.qty, 
                elt.price, 
            ]
        );
    
        const headers = [["#", "Policy #", "Description", "Quantity", "Total Price"]];  
    
        let invoiceContent = {
            startY: 270, // Adjust the spacing as needed
            head: headers,
            headStyles: {
                fillColor: [31, 41, 55], // Set the fill color of the header cells to white
                textColor: [255, 255, 255], // Set the text color of the header cells to white
            },
            margin: { left: 45, right: 35},
            body: invoiceData,
            columnStyles: {
                0: { cellWidth: 20 }, // Width for the first column (empty column)
                1: { cellWidth: 50 }, // Width for the first column (empty column)
                2: { cellWidth: 180 }, // Width for the "Description" column
                3: { cellWidth: 50, align: 'right' }, // Width for the "Quantity" column
                4: { cellWidth: 65, align: 'right' }, // Width for the "Unit Price" column
            },
        };
    
        const insurerHeaders = insuranceDetails.name;  
    
        let insurerContent = {
            startY: 270, // Adjust the spacing as needed
            head: insurerHeaders,
            headStyles: {
                fillColor: [31, 41, 55], // Set the fill color of the header cells to white
                textColor: [255, 255, 255], // Set the text color of the header cells to white
            },
            margin: { left: 45, right: 35},
            body: invoiceData,
            columnStyles: {
                0: { cellWidth: 20 }, // Width for the first column (empty column)
                1: { cellWidth: 50 }, // Width for the first column (empty column)
            },
        };
    
        // const contentHeight = invoiceContent.head.length * 10 + invoiceContent.body.length * 15;
        const contentHeight = invoiceContent.head.length * 10 + invoiceContent.body.length * 15;
    
        const current = new Date();
        var today = new Date(),
        curTime = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    
        const dateString = new Date(current);
        const formattedDate = dateString.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    
        var doc = new jsPDF('potrait', 'px', 'a4', 'false')
        
        const pageHeight = doc.internal.pageSize.height;
        const footerY = pageHeight - 40; // Adjust the spacing as needed
        const pageWidth = doc.internal.pageSize.width;
        const text = "107 Kwame Nkrumah Avenue, Harare, Zimbabwe\nP.O Box CY 331, Causeway, Harare, Zimbabwe\n24 Hour Call Center - +263 0242 700950"
        const textWidth = doc.getTextWidth(text);
        const centerX = (pageWidth - textWidth) / 2;
        const textX = centerX - (textWidth / -2); // Adjust the horizontal position to align in the center
    
        doc.addImage(img, 'PNG', 340, 40, 72, 28)
        doc.setFont('Times New Roman', 'bold')
        doc.setFontSize(16)
        doc.text(410, 95, 'Invoice #1234456',{align: 'right'})

        doc.setLineWidth(0.5); // Set the width of the line
        doc.line(45, 110, 410, 110); // Draw the line from (340, 100) to (570, 100)

        doc.setFont('Times New Roman', 'bold');
        doc.setFontSize(12);
        doc.text(410, 125, 'Invoice To', { align: 'right' });

        doc.setFont('Times New Roman', 'regular');
        doc.setFontSize(9);
        doc.text(410, 135, formatAddress(addressTo), { align: 'right' });

        doc.setFont('Times New Roman', 'bold');
        doc.setFontSize(12);        
        doc.setTextColor(0,0,0);
        doc.text(45, 125, firstname +" "+ surname)
        
        doc.setFont('Times New Roman', 'medium')
        doc.setFontSize(9)
        doc.text(45, 135, formatAddress(addressFrom))

        doc.setFont('Times New Roman', 'medium')
        doc.setFontSize(9)
        doc.text(45, 180, 'Invoice Date:\nBP Number:\nVAT Number\nREF#:\nStart Date\nEnd Date\nPeriod')
        doc.text(95, 180, formattedDate+'\n'+bpNumber+'\n'+vatNumber+'\n'+refNumber+'\n'+insuranceDetails.startDate+'\n'+insuranceDetails.endDate+'\n'+insuranceDetails.period)
    
        doc.setTextColor(0,0,0);
        doc.setFontSize(9)
        
        doc.autoTable(invoiceContent);
        doc.text(380, invoiceContent.startY + contentHeight + 40, 'Sub - Total :\nVAT ' +vatPercentage+ '% :', { align: 'right' })
        doc.text(410, invoiceContent.startY + contentHeight + 40, '$15000.00'+ '\n' +'$1000.00', { align: 'right' })

        doc.setFont('Times New Roman', 'bold');
        doc.setFontSize(12);        
        doc.setTextColor(0,0,0);
        doc.text(410, invoiceContent.startY + contentHeight + 65, "Total: $17000.00", { align: 'right' })

        doc.setLineWidth(0.5); // Set the width of the line
        doc.line(45, footerY-10, 410, footerY-10); // Draw the line from (340, 100) to (570, 100)

        doc.setFontSize(9);
        doc.setTextColor(112,112,112);
        doc.setFont('Times New Roman', 'regular');
        doc.text(textX, footerY, text,  { align: "center" });
        
        // doc.autoPrint({variant: 'non-conform'});
        doc.save('insureme.pdf')
        // window.location = '/sales'
        
        // dispatch(closeSale(
        //   {
        //     orderId: orderID,
        //     status: true
        //   }
        // )).finally(()=>{
        //   setSoldId([])
        // })
    }

    const today = new Date()
    const date = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;

    return (
        <>
            <div className='block'>
                <div className='flex w-full h-12 items-center justify-between'>
                    <div className="flex space-x-2">
                        <button
                            onClick={()=>{
                                dispatch(navActions.toggleQuote(false))
                                dispatch(vehicleInfoActions.clearVehicleInfo())
                            }}
                            className={`border border-gray-300 py-2 rounded-sm px-4 bg-gray-700 hover:bg-gray-800 text-white w-40`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={()=>alert("exporting...")}
                            className={`border border-gray-300 py-2 rounded-sm px-4 bg-blue-700 hover:bg-blue-800 text-white w-40`}
                        >
                            Export PDF
                        </button>
                        <button
                            onClick={()=>alert("exporting...")}
                            className={`border border-gray-300 py-2 rounded-sm px-4 bg-blue-700 hover:bg-blue-800 text-white w-40`}
                        >
                            Email Quotation
                        </button>
                    </div>
                    <h1 className='font-bold text-2xl'>Quotation</h1>
                </div>
                <div className='flex justify-between my-1 pb-3 border-b-2 border-gray-600'>
                    <div className='justify-start'>
                        <h5 className='font-bold'>Customer Name: Blessing</h5>
                        <p className='flex text-xs'>Vehicle Reg : ABC2016</p>
                        <p className='flex text-xs'>Vehicle : Nissan NP200</p>
                        <p className='flex text-xs'>Tax Class : Light Motor Vehicle (1-2300KG)</p>
                        <p className='flex text-xs'>Policy Type : Road Traffic Act</p>
                        <p className='flex text-xs'>Start Date : {date}</p>
                        <p className='flex text-xs'>End Date : {date}</p>
                        <p className='flex text-xs'>Period : 1 day</p>
                    </div>
                </div>
                <div className='border-b mb-2 border-gray-600 space-y-2'>
                    {
                        quotation.length>0?quotation.map((item, index)=> {
                            return <>
                                <div className="px-5 py-1 bg-white rounded-md border border-gray-200 border-solid border-1 shadow-md">
                                    <div className="flex">
                                        <div className="flex flex-col items-center justify-center w-36">
                                            <img src="" alt="insurer-logo" className='h-12'/>
                                            <h2>{item.insurerName}</h2>
                                        </div>
                                        <div className="flex-1 flex items-center">
                                            <div className="flex justify-center items-center flex-1 space-x-1">
                                                <div className='flex-col flex items-end'>
                                                    <p className='font-semibold text-black text-sm'>Policy :</p>
                                                    <p className='font-semibold text-black text-sm'>ZINARA :</p>
                                                    <p className='font-semibold text-black text-sm'>ZBC :</p>
                                                    <p className='font-semibold text-black text-sm'>Gvt Levy :</p>
                                                    <p className='font-semibold text-black text-sm'>Stamp Duty :</p>
                                                </div>
                                                <div className='flex-col'>
                                                    <p className='flex text-sm text-indigo-600 font-bold'>${item.insurancePrice}</p>
                                                    <p className='flex text-sm text-indigo-600 font-bold'>${item.zinaraPrice}</p>
                                                    <p className='flex text-sm text-indigo-600 font-bold'>${item.zbcPrice}</p>
                                                    <p className='flex text-sm text-indigo-600 font-bold'>$3.65</p>
                                                    <p className='flex text-sm text-indigo-600 font-bold'>$5.00</p>
                                                </div>                                    
                                            </div>
                                            <div className="flex-col flex justify-center items-center flex-1">
                                                <p className='flex text-xs text-white mt-1 bg-gray-600 px-5 py-1 rounded-full'><span className='font-semibold'>Package Additionals</span></p>
                                                <p className='text-xs'>Free tyre Service?</p>
                                                <p className='text-xs'>Towing from accident seen</p>
                                            </div>
                                            <div className="flex-col flex justify-center items-center flex-1">
                                                <p className='flex-col flex justify-center items-center text-md text-white mt-1 bg-gray-600 px-5 py-1 rounded-full'><span className='font-semibold text-sm'>Total Payable</span>${item.totalPrice} USD</p>
                                            </div>
                                            <div className='flex-col w-48 my-1 space-y-2'>
                                                <button
                                                    onClick={()=>handlePayment(item)}
                                                    className={`border border-gray-300 rounded-sm px-4 text-xs h-8 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                                                >
                                                    Make Payment
                                                </button>
                                                {/* <button
                                                    className={`border border-gray-300 rounded-sm px-4 text-xs h-8 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                                                >
                                                    Email Quote
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }):
                        <div className="px-5 py-1 bg-white rounded-md border border-gray-200 border-solid border-1 shadow-md">
                            <div className="flex justify-center">
                                No results found for the search
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
