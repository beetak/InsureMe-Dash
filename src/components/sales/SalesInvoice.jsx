import React, { useState } from 'react'
import jsPDF from 'jspdf'
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from 'react-redux';
import { navActions } from '../../store/nav-store';
import { getPaymentDetails } from '../../store/payments-store';
const img = "images/icon.png"

export default function SalesInvoice() {

    const dispatch = useDispatch()

    const paymentDetails = useSelector(getPaymentDetails)

    const [firstname, setFirstname] = useState("Chengetai")
    const [surname, setLastname] = useState("Meraki")
    const [businessPartnerName, setBusinessPartnerName] = useState("Kim")
    const [businessPartnerEmail, setBusinessPartnerEmail] = useState("Kim")
    const [businessPartnerAddress, setBusinessPartnerAddress] = useState("Kim")
    const [businessPartnerPhone, setBusinessPartnerPhone] = useState("Kim")
    const [bpNumber, setBPNumber] = useState(200001412)
    const [vatNumber, setVATNumber] = useState(10001509)
    const [refNumber, setRefNumber] = useState(10001509)
    const [vatPercentage, setVATPercentage] = useState(15)

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

    const vehicleDetails = { 
        vrn: "AE07358",
        vehicle: "NISSAN BLUEBIRD",
        taxClass: "LIGHT MOTOR VEHICLE (1-2300KG)"
    }

    const vehicleOwnerDetails = { 
        idNumber: "0123456A01",
        name: "NISSAN BLUEBIRD",
        email: "",
        mobile: "0776153153",
        address: "123 Harare St Harare"
    }

    const insuredPartyDetails = { 
        idNumber: "0123456A01",
        name: "NISSAN BLUEBIRD",
        email: "",
        mobile: "0776153153",
        address: "123 Harare St Harare"
    }
    

    const renderTableHeader = () => {
        const columns = [
          { key: 'item', label: '#' },
          { key: 'name', label: 'Description' },
          { key: 'qty', label: 'Quantity' },
          { key: 'unit-cost', label: 'Unit Cost' },
          { key: 'total', label: 'Total' },
        ];
    
        return columns.map((column) => (
          <th key={column.key} className={`p-3 text-sm font-bold tracking-wide ${(column.key === "unit-cost" || column.key === "total")?" text-right":" text-left"}`}>
            <span className="mr-2">{column.label}</span>
          </th>
        ));
    };
    
    const renderTableRows = () => {
    
        return  (
          <tr  className={` bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
            <td className='font-bold text-blue-500 justify-center w-24 pl-3'>{paymentDetails.data.propertyId}</td>
            <td className='pl-3'>{paymentDetails.data.productId}</td>
          </tr>
        )
    };

    const printVouchers = () => {
        // console.log("items lis ",itemsList)
        // let count = 1
        // // const data = Object.values(myVouchers).map(elt=> [count++, elt.bundle.name, elt.voucherCode]);
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

    const current = new Date();
    var today = new Date(),
    curTime = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    const dateString = new Date(current);
    const formattedDate = dateString.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <>
            <div className='block'>
                <div className='flex w-full h-24 items-center justify-end border-b-2 border-gray-600'>
                    <h1 className='font-bold text-2xl'>Invoice #123</h1>
                </div>
                <div className='flex justify-between my-3'>
                    <div className='justify-start'>
                        <h5 className='font-bold'>Cashier Name</h5>
                        <p className='flex text-xs' style={{ whiteSpace: 'pre-line' }}>
                            {formatAddress(addressFrom)}
                        </p>
                    </div>
                    <div className='justify-end text-right'>
                        <h5 className='font-bold'>Invoice to</h5>
                        <p className='flex text-xs' style={{ whiteSpace: 'pre-line' }}>
                            {formatAddress(addressTo)}
                        </p>
                    </div>
                </div>
                <div className='block mb-3'>
                    <p className='flex text-xs'>Invoice Date : {formattedDate}</p>
                    {/* <p className='flex text-xs'>Due Date : 25th Jan 2017</p> */}
                    <p className='flex text-xs'>Reference Number : {insuranceDetails.transactionRef}</p>
                    <p className='flex text-xs'>Start Date : {insuranceDetails.startDate}</p>
                    <p className='flex text-xs'>End Date : {insuranceDetails.endDate}</p>
                    <p className='flex text-xs'>Period : {insuranceDetails.period} Days</p>
                </div>
                <div className='overflow-auto rounded:xl shadow-md'>
                    <table className='w-full'>
                        <thead className='bg-gray-700 border-b-2 text-white border-gray-300'>
                            <tr >{renderTableHeader()}</tr>
                        </thead>
                        <tbody >{renderTableRows()}</tbody>
                    </table>
                </div>
                <div className='flex h-32 items-center border-b-2 border-gray-600'>
                    <div className='block w-full justify-end'>
                        <div className=' text-right'>
                            <h5 className='font-bold'>Invoice to</h5>
                            <p className='text-xs'>Sub - Total amount: $11,358</p>
                            <p className='text-xs'>vat (15%): $398</p>
                            <h1 className='font-bold text-2xl'>Total: {paymentDetails.data.amount.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}</h1>
                        </div>                    
                    </div>
                </div>
                <div className='flex w-full h-28 items-center justify-end border-b-2 border-gray-600 space-x-2'>
                    <button
                        onClick={()=>dispatch(navActions.toggleInvoice(false))}
                        className={`border space-x-2 border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white`}
                    >
                        <i className='fas fa-share'/>
                        <span>Send Invoice</span>
                    </button>
                    <button
                        onClick={
                            ()=>{
                                printVouchers()
                                dispatch(navActions.toggleInvoice(false))
                            }
                        }
                        className={`border space-x-2 border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                    >
                        <i className='fas fa-print'/>
                        <span>Print</span>
                    </button>                  
                </div>
            </div>
        </>
    )
}
