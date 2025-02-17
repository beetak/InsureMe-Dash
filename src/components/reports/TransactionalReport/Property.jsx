import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Property({ sales }) {
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number)
    const date = new Date(year, month - 1, day)
  
    const options = { day: "numeric", month: "short", year: "numeric" }
    return new Intl.DateTimeFormat("en-US", options).format(date)
  }



  const handlePrint = () => {
    const headers = [
      ["#", "Policy Name", "Revenue Collections", ""],
      ["", "", "ZWG", "USD"],
    ]

    // Calculate totals
    const totals = sales.reduce(
      (acc, item) => {
        acc.ZWG += Number.parseFloat(item.amounts.ZWG) || 0
        acc.USD += Number.parseFloat(item.amounts.USD) || 0
        return acc
      },
      { ZWG: 0, USD: 0 },
    )

    const invoiceContent = {
      startY: 170,
      head: headers,
      headStyles: {
        fillColor: [31, 41, 55],
        textColor: [255, 255, 255],
        halign: "start",
        fontStyle: "bold",
        fontSize: 7,
        cellPadding: 3,
        lineWidth: 0.5,
        lineHeight: 0.5,
        lineColor: [31, 41, 55],
        borderRadius: 5,
      },
      margin: { left: 45, right: 35 },
      body: [
        ...sales.map((item, index) => [
          index + 1,
          item.insuranceCategory,
          item.amounts.ZWG || "",
          item.amounts.USD || "",
        ]),
        // Add totals row
        ["", "Total", totals.ZWG.toFixed(2), totals.USD.toFixed(2)],
      ],
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 7,
        halign: "left",
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" },
        1: { cellWidth: 245 },
        2: { cellWidth: 50, halign: "right" },
        3: { cellWidth: 50, halign: "right" },
      },
      theme: "grid",
      styles: {
        tableWidth: "auto",
        overflow: "linebreak",
        cellPadding: 4,
        fontSize: 9,
        lineWidth: 0.5,
        lineColor: [220, 220, 220],
      },
      didDrawCell: (data) => {
        // Style the totals row
        if (data.section === "body" && data.row.index === sales.length) {
          doc.setFont("Times New Roman", "bold")
          doc.setFillColor(240, 240, 240)
        }
      },
    }

    const current = new Date()
    const formattedDate = current.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

    var doc = new jsPDF("portrait", "px", "a4", "false")

    const pageHeight = doc.internal.pageSize.height
    const footerY = pageHeight - 40
    const pageWidth = doc.internal.pageSize.width
    const text =
      "107 Kwame Nkrumah Avenue, Harare, Zimbabwe\nP.O Box CY 331, Causeway, Harare, Zimbabwe\n24 Hour Call Center - +263 0242 700950"
    const textWidth = doc.getTextWidth(text)
    const centerX = (pageWidth - textWidth) / 2
    const textX = centerX - textWidth / -2

    doc.addImage(telone, "PNG", 45, 40, 72, 28)
    doc.addImage(img, "PNG", 340, 40, 72, 28)
    doc.setFont("Times New Roman", "bold")
    doc.setFontSize(16)
    doc.setTextColor(15, 145, 209)
    doc.text(410, 95, "Agent Sales Report", { align: "right" })

    doc.setLineWidth(0.5)
    doc.line(45, 110, 410, 110)

    doc.setFont("Times New Roman", "bold")
    doc.setFontSize(12)
    doc.setTextColor(15, 145, 209)
    doc.text(45, 125, formattedDate)

    doc.setFont("Times New Roman", "medium")
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(9)
    doc.text(45, 140, `Agent: ${selectedUser?.name || user.name}`)
    doc.text(45, 155, `Date Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`)

    doc.autoTable(invoiceContent)

    doc.setLineWidth(0.5)
    doc.line(45, footerY - 10, 410, footerY - 10)

    doc.setFontSize(9)
    doc.setTextColor(112, 112, 112)
    doc.setFont("Times New Roman", "regular")
    doc.text(textX, footerY, text, { align: "center" })

    doc.save("property_sales_report.pdf")
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
              <span className="font-semibold">Cover Travelers</span>
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
