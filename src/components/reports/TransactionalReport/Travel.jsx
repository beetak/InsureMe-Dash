import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePrint } from '../../../context/PrinterProvider';
import jsPDF from "jspdf"
import "jspdf-autotable"
const telone = "/images/telone-logo.png"
const img = "/images/insureme-umbrella.png"

export default function Travel({sales}) {

    const { printData, setPrintData } = usePrint(); // Access print data
    
    useEffect(()=>{
        if(printData==="TRAVEL"){
          printDocument()
          return
        }
        return
    },[printData])

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-").map(Number)
        const date = new Date(year, month - 1, day)
      
        const options = { day: "numeric", month: "short", year: "numeric" }
        return new Intl.DateTimeFormat("en-US", options).format(date)
    }
      
    const printDocument = () => {
        const doc = new jsPDF()
    
        // Add header
        doc.setFillColor(31, 41, 55)
        doc.rect(0, 0, 210, 40, "F")
        doc.addImage(telone, "PNG", 15, 10, 50, 20)
        doc.addImage(img, "PNG", 150, 10, 50, 20)
    
        // Add title
        doc.setFont("helvetica", "bold")
        doc.setFontSize(18)
        doc.setTextColor(255, 255, 255)
        doc.text("Travel Insurance Report", 105, 35, { align: "center" })
    
        doc.setFont("helvetica", "normal")
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)
        doc.text(
          "Runhare House, 107 Kwame Nkrumah Avenue \nP. O. Box CY 331, Causeway Harare, Zimbabwe\nPhone: +263 (24) 279 8111 \nEmail: clientservices@telone.co.zw",
          15,
          50,
        )
    
        // Add client details
        doc.setFont("helvetica", "bold")
        doc.setFontSize(11)
        doc.text("Client Details", 15, 75)
        doc.setFont("helvetica", "normal")
        doc.text(`Fullname: ${sales.transactionDescription.user.fullName}`, 15, 80)
        doc.text(`Age: ${sales.transactionDescription.user.age}`, 15, 85)
        doc.text(`Passport Number: ${sales.transactionDescription.user.passportNumber}`, 15, 90)
        doc.text(`Phone Number: ${sales.transactionDescription.user.phone}`, 15, 95)
        doc.text(`Email: ${sales.transactionDescription.user.email}`, 15, 100)
    
        // Add travel details
        doc.setFont("helvetica", "bold")
        doc.text("Travel Details", 15, 110)
        doc.setFont("helvetica", "normal")
        doc.text(`Destination Country: ${sales.transactionDescription.travelDetails.destination}`, 15, 115)
        doc.text(`Residence Country: ${sales.transactionDescription.travelDetails.residence}`, 15, 120)
        doc.text(`Start Date: ${formatDate(sales.transactionDescription.travelDetails.startDate)}`, 15, 125)
        doc.text(`End Date: ${formatDate(sales.transactionDescription.travelDetails.endDate)}`, 15, 130)
    
        // Add insurance details
        const insuranceDetails = [
          ["Insurance Category", sales.insuranceCategory],
          ["Payment Method", sales.paymentMethod],
          ["Payment Status", sales.paymentStatus],
          ["Amount", `${sales.currency} ${sales.amount.toFixed(2)}`],
          ["Reference Number", sales.referenceNumber],
          ["Payment Date", formatDate(sales.paymentDate)],
          ["Insurer Name", sales.insurerName],
        ]
    
        doc.autoTable({
          startY: 140,
          head: [["Description", "Details"]],
          body: insuranceDetails,
          headStyles: {
            fillColor: [31, 41, 55],
            textColor: [255, 255, 255],
            halign: "center",
            fontStyle: "bold",
          },
          theme: "grid",
        })
    
        // Add additional travelers if any
        if (sales.transactionDescription.traveler && sales.transactionDescription.traveler.length > 1) {
          doc.addPage()
          doc.setFont("helvetica", "bold")
          doc.setFontSize(14)
          doc.text("Additional Travelers", 15, 20)
    
          const travelersData = sales.transactionDescription.traveler.map((traveler) => [
            traveler.fullName,
            traveler.passportNumber,
            traveler.age,
          ])
    
          doc.autoTable({
            startY: 30,
            head: [["Traveler's Name", "Passport Number", "Age"]],
            body: travelersData,
            headStyles: {
              fillColor: [31, 41, 55],
              textColor: [255, 255, 255],
              halign: "center",
              fontStyle: "bold",
            },
            theme: "grid",
          })
        }
    
        // Add footer
        const pageCount = doc.internal.getNumberOfPages()
        doc.setFont("helvetica", "italic")
        doc.setFontSize(8)
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.text("Page " + String(i) + " of " + String(pageCount), 210 - 20, 297 - 10, { align: "right" })
        }
    
        // doc.save("travel_insurance_report.pdf")
        const pdfBlob = doc.output('blob');

        // Create a URL for the Blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Open the PDF in a new window
        const printWindow = window.open(pdfUrl);

        // Wait for the PDF to load before calling print
        printWindow.onload = () => {
            printWindow.print();
            printWindow.onafterprint = () => {
            printWindow.close(); // Close the window after printing
            };
        };
        setPrintData(null)
    }

    return (
        <>
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex w-full space-x-6"
                >
                    <div className="bg-white rounded-xl shadow-md overflow-hidden md:w-1/2">
                        <div className="flex flex-col">
                            <div className="bg-main-color text-white border-b-2 border-main-color py-3 px-6">
                                <span className="font-semibold">Client Details</span>
                            </div>
                            <div className="py-4">
                                <div className="space-y-4">
                                    <div className="flex-col w-full py-1 px-6 text-sm">
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Fullname: </span>{sales.transactionDescription.user.fullName}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Age: </span>{sales.transactionDescription.user.age}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Passport Number: </span><span className='uppercase'>{sales.transactionDescription.user.passportNumber}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Phone Number: </span>{sales.transactionDescription.user.phone}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Email: </span>{sales.transactionDescription.user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden md:w-1/2">
                        <div className="flex flex-col">
                            <div className=" bg-main-color text-white border-b-2 border-main-cbg-main-color py-3 px-6">
                                <span className="font-semibold">Travel Details</span>
                            </div>
                            <div className="px-6 py-4">
                                <div className="space-y-4">
                                    <div className="flex-col w-full text-sm">
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Dest Country: </span>{sales.transactionDescription.travelDetails.destination}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Res Country: </span>{sales.transactionDescription.travelDetails.residence}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Start Date: </span>{formatDate(sales.transactionDescription.travelDetails.startDate)}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">End Date: </span>{formatDate(sales.transactionDescription.travelDetails.endDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                {
                    sales.transactionDescription.traveler && sales.transactionDescription.traveler.length > 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            <div className="flex flex-col">
                                <div className=" bg-main-color text-white border-b-2 border-main-color py-3 px-6">
                                        <span className="font-semibold">Additional Travelers</span>
                                </div>
                                <div className="px-6 py-4">
                                    <div className='overflow-auto rounded:xl shadow-md'>
                                        <div className="w-full border-main-color border-2 rounded-md overflow-hidden">
                                            <div className="bg-gray-100 border-b-2 border-gray-300 flex">
                                                <div className="flex-1 px-3 py-1">Traveler's Name</div>
                                                <div className="flex-1 px-3 py-1">Passport Number</div>
                                                <div className="flex-1 px-3 py-1">Age</div>
                                            </div>
                                            <div>
                                                {
                                                    sales.transactionDescription.traveler.map((traveler, index) => (
                                                        <div key={index} className='flex py-1 border-b border-gray-300'>
                                                            <div className="flex-1 px-3">{traveler.fullName}</div>
                                                            <div className="flex-1 px-3 uppercase">{traveler.passportNumber}</div>
                                                            <div className="flex-1 px-3">{traveler.age}</div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </div>
        </>
    )
}
