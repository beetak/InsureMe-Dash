/* eslint-disable react/prop-types */
import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { usePrint } from '../../../context/PrinterProvider'
import jsPDF from "jspdf"
import "jspdf-autotable"
const telone = "/images/telone-logo.png"
const img = "/images/insureme-umbrella.png"

export default function Travel({sales}) {
    const { printData, setPrintData } = usePrint()

    function calculatedAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear() -1;
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Adjust age if the birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    // Parse the productDescription once when sales changes
    const parsedSales = useMemo(() => {
        if (!sales) return sales
        try {
            return {
                ...sales,
                productDescription: typeof sales.productDescription === 'string' 
                    ? JSON.parse(sales.productDescription)
                    : sales.productDescription
            }
        } catch (error) {
            console.error('Error parsing productDescription:', error)
            return sales
        }
    }, [sales])
    
    useEffect(() => {
        console.log(">>>>>>", parsedSales)
        if(printData === "TRAVEL"){
            printDocument()
            return
        }
    }, [printData, parsedSales])

    const formatDate = (dateString) => {
        if (!dateString || dateString === "N/A") {
            return "N/A"
        }
        // Handle ISO date strings
        const date = new Date(dateString)
        if (isNaN(date)) {
            // Try parsing YYYY-MM-DD format
            const [year, month, day] = dateString.split("-").map(Number)
            const parsedDate = new Date(year, month - 1, day)
            if (isNaN(parsedDate)) {
                return "N/A"
            }
            return new Intl.DateTimeFormat("en-US", { 
                day: "numeric", 
                month: "short", 
                year: "numeric" 
            }).format(parsedDate)
        }
        return new Intl.DateTimeFormat("en-US", { 
            day: "numeric", 
            month: "short", 
            year: "numeric" 
        }).format(date)
    }

    const getValue = (obj, keys, defaultValue = "N/A") => {
        if (!obj) return defaultValue
        
        for (const key of keys) {
            try {
                const value = key.split('.').reduce((o, k) => {
                    if (o === null || o === undefined) return undefined
                    return o[k]
                }, obj)
                if (value != null) {
                    return value
                }
            } catch (error) {
                console.error(`Error accessing path ${key}:`, error)
            }
        }
        return defaultValue
    }

    const getTravelerValue = (obj, key) => {
        const travelers = getValue(obj, ['productDescription.travelers', 'transactionDescription.traveler'], [])
        if (Array.isArray(travelers) && travelers.length > 0) {
            return travelers.map(traveler => traveler[key] ?? "N/A").join(', ')
        }
        return "N/A"
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
        doc.text(`Fullname: ${getTravelerValue(parsedSales, 'fullName')}`, 15, 80)
        doc.text(`Age: ${getTravelerValue(parsedSales, 'dob')}`, 15, 85)
        doc.text(`Passport Number: ${getTravelerValue(parsedSales, 'passportNumber')}`, 15, 90)
        doc.text(`Phone Number: ${getValue(parsedSales, ['transactionDescription.user.phone', 'mobileNumber'])}`, 15, 95)
        doc.text(`Email: ${getValue(parsedSales, ['transactionDescription.user.email', 'email'])}`, 15, 100)
    
        // Add travel details
        doc.setFont("helvetica", "bold")
        doc.text("Travel Details", 15, 110)
        doc.setFont("helvetica", "normal")
        doc.text(`Destination Country: ${getValue(parsedSales, ['transactionDescription.travelDetails.destination', 'productDescription.destination'])}`, 15, 115)
        doc.text(`Residence Country: ${getValue(parsedSales, ['transactionDescription.travelDetails.residence', 'productDescription.residence'])}`, 15, 120)
        doc.text(`Start Date: ${formatDate(getValue(parsedSales, ['transactionDescription.travelDetails.startDate', 'productDescription.dateRange.from']))}`, 15, 125)
        doc.text(`End Date: ${formatDate(getValue(parsedSales, ['transactionDescription.travelDetails.endDate', 'productDescription.dateRange.to']))}`, 15, 130)
    
        // Add insurance details
        const insuranceDetails = [
            ["Insurance Category", getValue(parsedSales, ['insuranceCategory'])],
            ["Payment Method", getValue(parsedSales, ['paymentMethod'])],
            ["Payment Status", getValue(parsedSales, ['paymentStatus'])],
            ["Amount", `${getValue(parsedSales, ['currency'])} ${getValue(parsedSales, ['amount'], 0).toFixed(2)}`],
            ["Reference Number", getValue(parsedSales, ['referenceNumber'])],
            ["Payment Date", formatDate(getValue(parsedSales, ['paymentDate']))],
            ["Insurer Name", getValue(parsedSales, ['insurerName'])],
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
        const travelers = getValue(parsedSales, ['productDescription.travelers', 'transactionDescription.traveler'], [])
        if (travelers.length > 1) {
            doc.addPage()
            doc.setFont("helvetica", "bold")
            doc.setFontSize(14)
            doc.text("Additional Travelers", 15, 20)
    
            const travelersData = travelers.map((traveler) => [
                traveler.fullName ?? "N/A",
                traveler.passportNumber ?? "N/A",
                traveler.dob ?? "N/A",
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
    
        const pdfBlob = doc.output('blob')
        const pdfUrl = URL.createObjectURL(pdfBlob)
        const printWindow = window.open(pdfUrl)
    
        printWindow.onload = () => {
            printWindow.print()
            printWindow.onafterprint = () => {
                printWindow.close()
                URL.revokeObjectURL(pdfUrl) // Clean up the URL object
            }
        }
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
                                            <span className="inline-block w-44">Fullname: </span>{getTravelerValue(parsedSales, 'fullName')}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Age/Dob: </span>{getTravelerValue(parsedSales, 'dob')}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Passport Number: </span><span className='uppercase'>{getTravelerValue(parsedSales, 'passportNumber')}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Phone Number: </span>{getValue(parsedSales, ['transactionDescription.user.phone', 'mobileNumber'])}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Email: </span>{getValue(parsedSales, ['transactionDescription.user.email', 'email'])}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden md:w-1/2">
                        <div className="flex flex-col">
                            <div className="bg-main-color text-white border-b-2 border-main-color py-3 px-6">
                                <span className="font-semibold">Travel Details</span>
                            </div>
                            <div className="px-6 py-4">
                                <div className="space-y-4">
                                    <div className="flex-col w-full text-sm">
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Dest Country: </span>{getValue(parsedSales, ['transactionDescription.travelDetails.destination', 'productDescription.destination'])}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Res Country: </span>{getValue(parsedSales, ['transactionDescription.travelDetails.residence', 'productDescription.residence'])}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Start Date: </span>{formatDate(getValue(parsedSales, ['transactionDescription.travelDetails.startDate', 'productDescription.dateRange.from']))}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">End Date: </span>{formatDate(getValue(parsedSales, ['transactionDescription.travelDetails.endDate', 'productDescription.dateRange.to']))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                {getValue(parsedSales, ['productDescription.travelers', 'transactionDescription.traveler'], []).length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                        <div className="flex flex-col">
                            <div className="bg-main-color text-white border-b-2 border-main-color py-3 px-6">
                                <span className="font-semibold">Additional Travelers</span>
                            </div>
                            <div className="px-6 py-4">
                                <div className='overflow-auto rounded:xl shadow-md'>
                                    <div className="w-full border-main-color border-2 rounded-md overflow-hidden">
                                        <div className="bg-gray-100 border-b-2 border-gray-300 flex">
                                            <div className="flex-1 px-3 py-1">Traveler{"'"}s Name</div>
                                            <div className="flex-1 px-3 py-1">Passport Number</div>
                                            <div className="flex-1 px-3 py-1">D.O.B</div>
                                        </div>
                                        <div>
                                            {getValue(parsedSales, ['productDescription.travelers', 'transactionDescription.traveler'], []).map((traveler, index) => (
                                                <div key={index} className='flex py-1 border-b border-gray-300'>
                                                    <div className="flex-1 px-3">{traveler.fullName ?? "N/A"}</div>
                                                    <div className="flex-1 px-3 uppercase">{traveler.passportNumber ?? "N/A"}</div>
                                                    <div className="flex-1 px-3">{traveler.dob ?? "N/A"}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    )
}