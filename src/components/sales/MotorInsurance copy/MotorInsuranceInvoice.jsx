import React, { useState } from 'react'
import jsPDF from 'jspdf'
import "jspdf-autotable";
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentDetails } from '../../../store/payments-store';
const img = "images/icon.png"

export default function MotorInsuranceInvoice() {

    const dispatch = useDispatch()

    const paymentDetails = useSelector(getPaymentDetails)

    const [firstname, setFirstname] = useState("Chengetai")
    const [surname, setLastname] = useState("Meraki")
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

    const displayQuote = () => {
        return (
            <>
                <div className="flex bg-gray-700 h-7 w-full text-white font-bold px-3">
                    Vehicle Details
                </div>
                <div className="flex-col w-full px-3 py-1 text-sm">
                    <p className='text-sm'><span className='inline-block w-44'>Vehicle Registration: </span>AEO7358</p>
                    <p className='text-sm'><span className='inline-block w-44'>Make: </span>Baic (Grand Tiger)</p>
                    <p className='text-sm'><span className='inline-block w-44'>Engine Number: </span>987654321</p>
                    <p className='text-sm'><span className='inline-block w-44'>Year Of Manufacture: </span>2015</p>
                    <p className='text-sm'><span className='inline-block w-44'>Usage: </span>Transport</p>
                </div>
                <div className="flex bg-gray-700 h-7 w-full text-white font-bold px-3 mt-3">
                    Owner Details
                </div>
                <div className="flex-col w-full px-3 py-1 text-sm">
                    <p className='text-sm'><span className='inline-block w-44'>Name: </span>Blessing Masiya</p>
                    <p className='text-sm'><span className='inline-block w-44'>Email Address: </span>blessing@gmail.com</p>
                    <p className='text-sm'><span className='inline-block w-44'>Phone Number: </span>0776153153</p>
                </div>
                <div className="flex bg-gray-700 h-7 w-full text-white font-bold px-3 mt-3">
                    Policy Details
                </div>
                <div className="flex-col w-full px-3 py-1 text-sm">
                    <p className='text-sm'><span className='inline-block w-44'>Policy: </span>Road Traffic Act - $35.00</p>
                    <p className='text-sm'><span className='inline-block w-44'>ZINARA: </span>$40.00</p>
                    <p className='text-sm'><span className='inline-block w-44'>ZBC: </span>$30.00</p>
                </div>
            </>
        )
    }

    function DateConverter(dateTo) {

        const date = new Date(dateTo);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
        
          const suffixes = ['th', 'st', 'nd', 'rd'];
          const day = date.getDate();
          const suffix = suffixes[(day % 100 - 20) % 10] || suffixes[day % 10] || 'th';
        
          return (
            <>{day}<span style={{ fontSize: '0.8em', verticalAlign: 'super' }}>{suffix} </span> {formattedDate.split(' ')[1]} {formattedDate.split(' ')[2]}</>
          );
    }

    const CalculatedDateDifference = () => {
        const start = new Date(paymentDetails.data.startDate);
        const end = new Date(paymentDetails.data.endDate);    
        const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        console.log("a",diffInDays)
    
        return diffInDays;
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
    
        // const DateConverter = (dateString) => {
        //     const date = new Date(dateString);
        //     return date.toLocaleDateString('en-GB', {
        //       day: 'numeric',
        //       month: 'short',
        //       year: 'numeric',
        //     });
        // };
          
        // const CalculatedDateDifference = (startDate, endDate) => {
        //     const start = new Date(startDate);
        //     const end = new Date(endDate);
        //     const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        //     return `${diffInDays} days`;
        // };
    
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
        doc.text(95, 180, `${DateConverter(paymentDetails.data.createdAt)}`+'\n'+bpNumber+'\n'+vatNumber+'\n'+`${paymentDetails.data.referenceNumber}`+'\n'+`${DateConverter(paymentDetails.data.startDate)}`+'\n'+`${DateConverter(paymentDetails.data.endDate)}`+'\n'+CalculatedDateDifference())
    
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

    const printSlimReceipt = (voucherDetails, orderID) => {
        
        var doc = new jsPDF()
    
        const current = new Date();
        const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
        var today = new Date(),
        curTime = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        const dateString = new Date(current);
        const formattedDate = dateString.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        const pageHeight = 260 + (voucherDetails.length * 12); // Calculate the required height based on voucherDetails length
        var doc = new jsPDF('portrait', 'px', [pageHeight, 160], 'false');

        doc.setFont('Times New Roman', 'bold')
        doc.setFontSize(12)
        doc.text(15, 40, 'Headquarters: Runhare House')
        doc.setFont('Times New Roman', 'regular')
        doc.setFontSize(10)
        doc.setTextColor(0,0,0);
        doc.text(15, 55, '107 Kwame Nkrumah Avenue, Harare, \nZimbabwe\nP.O Box CY 331, Causeway, Harare, \nZimbabwe\n24 Hour Call Center - +263 0242 700950')
        doc.setFont('Times New Roman', 'bold')
        doc.setFontSize(12)
        doc.setTextColor(0,0,0);
        doc.text(15, 105, 'Client Details')
        doc.setFont('Times New Roman', 'medium')
        doc.setFontSize(10)
        doc.setTextColor(0,0,0);
        doc.text(15, 120, 'Client Name:  '+"businessPartnerName"+ '\nClient Email:  ' +"businessPartnerEmail")
        doc.setFont('Times New Roman', 'bold')
        doc.setFontSize(12)
        doc.setTextColor(0,0,0);
        doc.text(15, 145, 'Receipt Details')
        doc.setFont('Times New Roman', 'medium')
        doc.setFontSize(10)
        doc.setTextColor(0,0,0);
        doc.text(15, 160, 'Receipt Number: ' + orderID )
        doc.text(15, 168, 'Date:\nUnit Price:\nVAT 15%:\nTotal Price:' )
        doc.text(60, 168, formattedDate + ' ' + curTime + '\n$'+ totalPrice + '\n$' + totalVat + '\n$' + netTotal )
        doc.setFont('Times New Roman', 'bold')
        doc.setFontSize(12)
        doc.setTextColor(0,0,0);
        doc.text(15, 210, 'Cashier Details')
        doc.setFont('Times New Roman', 'medium')
        doc.setFontSize(10)
        doc.setTextColor(0,0,0);
        doc.text(15, 225, 'Cashier Name: ' +firstname+ " "+surname+ '\nShop: TelOne Shop ' + "\n")
    
        doc.setTextColor(0,0,0);
        doc.setFontSize(10)
        doc.text(15, 250, 'Cashier Name: ' +firstname+ " "+surname+ '\nShop: TelOne Shop ' + "\n")

        doc.setTextColor(0,0,0);
        doc.setFontSize(10)
        doc.text(15, 260, 'Cashier Name: ' +firstname+ " "+surname+ '\nShop: TelOne Shop ' + "\n")
    
        doc.save('invoice.pdf')
        // dispatch(closeSale({
        //     orderId: orderID,
        //     status: true
        // })).finally(()=>{
        //     setSoldId([])
        // })
    }

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
                    <p className='flex text-xs'>Invoice Date : {DateConverter(paymentDetails.data.createdAt)}</p>
                    {/* <p className='flex text-xs'>Due Date : {DateConverter(paymentDetails.data.createdAt+2)}</p> */}
                    <p className='flex text-xs'>Reference Number : {paymentDetails.data.referenceNumber}</p>
                    <p className='flex text-xs'>Start Date : {DateConverter(paymentDetails.data.startDate)}</p>
                    <p className='flex text-xs'>End Date : {DateConverter(paymentDetails.data.endDate)}</p>
                    <p className='flex text-xs'>Period Insured : {CalculatedDateDifference()} Days</p>
                </div>
                <div className='overflow-auto rounded:xl shadow-md'>
                    {/* <table className='w-full'>
                        <thead className='bg-gray-700 border-b-2 text-white border-gray-300'>
                            <tr >{renderTableHeader()}</tr>
                        </thead>
                        <tbody >{renderTableRows()}</tbody>
                    </table> */}
                    {displayQuote()}
                </div>
                <div className='flex h-32 items-center border-b-2 border-gray-600'>
                    <div className='block w-full justify-end'>
                        <div className=' text-right'>
                            {/* <h5 className='font-bold'>Invoice to</h5> */}
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
