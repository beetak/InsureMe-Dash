import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePrint } from '../../../context/PrinterProvider';
import jsPDF from "jspdf"
import "jspdf-autotable"
const telone = "/images/telone-logo.png"
const img = "/images/insureme-umbrella.png"

export default function Property({ sales }) {

  const { printData, setPrintData } = usePrint(); // Access print data

  useEffect(()=>{
    if(printData==="PROPERTY"){
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
    const headers = [["Description", "Details"]]

    const invoiceContent = {
      startY: 120,
      head: headers,
      headStyles: {
        fillColor: [31, 41, 55],
        textColor: [255, 255, 255],
        halign: "center",
        fontStyle: "bold",
        fontSize: 10,
        cellPadding: 1.5,
        lineWidth: 0.5,
        lineColor: [31, 41, 55],
      },
      body: [
        ["Insurance Category", sales.insuranceCategory],
        ["Payment Method", sales.paymentMethod],
        ["Payment Status", sales.paymentStatus],
        ["Amount", `${sales.currency} ${sales.amount.toFixed(2)}`],
        ["Reference Number", sales.referenceNumber],
        ["Payment Date", formatDate(sales.paymentDate)],
        ["Insurer Name", sales.insurerName],
        [
          "Premium",
          `${sales.transactionDescription.coverDetails.currency} ${sales.transactionDescription.coverDetails.premium.toFixed(2)}`,
        ],
        ["Rate", `${sales.transactionDescription.coverDetails.rate}%`],
        [
          "House Value",
          `${sales.transactionDescription.coverDetails.currency} ${sales.transactionDescription.houseDetails.value}`,
        ],
        ["Roof Type", sales.transactionDescription.houseDetails.roofType],
        ["House Description", sales.transactionDescription.houseDetails.houseDescription],
      ],
      bodyStyles: {
        fontSize: 9,
        cellPadding: 1,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: "auto", fontStyle: "bold" },
        1: { cellWidth: "auto" },
      },
      theme: "grid",
      tableWidth: "auto",
    }

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
    doc.text("Property Insurance Report", 105, 35, { align: "center" })

    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.text('Runhare House, 107 Kwame Nkrumah Avenue \nP. O. Box CY 331, Causeway Harare, Zimbabwe\nPhone: +263 (24) 279 8111 \nEmail: clientservices@telone.co.zw', 15, 50);


    // Add client details
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.text('Client Details', 15, 75)
    doc.setFont("helvetica", "normal")
    doc.text(`Client: ${sales.transactionDescription.user.fullName}`, 15, 80)
    doc.text(`ID Number: ${sales.transactionDescription.user.idNumber}`, 15, 85)
    doc.text(`Phone: ${sales.transactionDescription.user.phone}`, 15, 90)
    doc.text(`Email: ${sales.transactionDescription.user.email}`, 15, 95)

    // Add property address
    doc.setFont("helvetica", "bold")
    doc.text("Property Address:", 15, 105)
    doc.setFont("helvetica", "normal")
    doc.text(sales.transactionDescription.houseDetails.address, 15, 110)

    // Add table
    doc.autoTable(invoiceContent)

    // Add footer
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont("helvetica", "italic")
    doc.setFontSize(8)
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.text("Page " + String(i) + " of " + String(pageCount), 210 - 20, 297 - 10, { align: "right" })
    }

    // doc.save("property_insurance_report.pdf")
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
                      <span className="inline-block w-44">ID Number: </span><span className='uppercase'>{sales.transactionDescription.user.idNumber}</span>
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
                <span className="font-semibold">Property Details</span>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div className="flex-col w-full text-sm">
                    <p className="text-sm">
                      <span className="inline-block w-44">House Address: </span>{sales.transactionDescription.houseDetails.address}
                    </p>
                    <p className="text-sm">
                      <span className="inline-block w-44">House Value: </span>{sales.transactionDescription.houseDetails.value}
                    </p>
                    <p className="text-sm">
                      <span className="inline-block w-44">Roof Type: </span>{sales.transactionDescription.houseDetails.roofType}
                    </p>
                    {/* <p className="text-sm">
                      <span className="inline-block w-44">Cover Type: </span>{sales.transactionDescription.coverDetails.coverType}
                    </p> */}
                    {/* <p className="text-sm">
                      <span className="inline-block w-44">Start Date: </span>{formatDate(sales.transactionDescription.travelDetails.startDate)}
                    </p>
                    <p className="text-sm">
                      <span className="inline-block w-44">End Date: </span>{formatDate(sales.transactionDescription.travelDetails.endDate)}
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="flex flex-col">
            <div className=" bg-main-color text-white border-b-2 border-main-color py-3 px-6">
              <span className="font-semibold">Cover Details</span>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex-col w-full text-sm">
                  {/* <p className="text-sm">
                    <span className="inline-block w-44">Cover Type: </span>{sales.transactionDescription.coverDetails.coverType}
                  </p> */}
                  <p className="text-sm">
                    <span className="inline-block w-44">Currency: </span>{sales.transactionDescription.coverDetails.currency}
                  </p>
                  <p className="text-sm">
                    <span className="inline-block w-44">Rate: </span>{sales.transactionDescription.coverDetails.rate}%
                  </p>
                  <p className="text-sm">
                    <span className="inline-block w-44">Premium: </span>{sales.transactionDescription.coverDetails.premium}
                  </p>
                </div>
              </div>
          </div>
        </div>
      </motion.div>
    </div>
  </>
  )
}
