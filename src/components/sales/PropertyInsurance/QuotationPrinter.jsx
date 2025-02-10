'use client'

import React, { useCallback, useContext, useState } from 'react'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { motion } from 'framer-motion'
import { StepperContext } from '../../../context/StepperContext'
import insuranceTypes from '../../insuranceTypes.json'

const QuotationPrinter = ({ data }) => {
  const { travelData } = useContext(StepperContext)
  const [isPrinting, setIsPrinting] = useState(false)

  const formatPhoneNumber = useCallback((phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '')
    if (cleaned.length !== 12) {
      return phoneNumber // Return original if invalid
    }
    const countryCode = cleaned.slice(0, 3)
    const areaCode = cleaned.slice(3, 5)
    const firstPart = cleaned.slice(5, 8)
    const secondPart = cleaned.slice(8)
    return `+${countryCode} (${areaCode}) ${firstPart} ${secondPart}`
  }, [])

  const getInsuranceType = useCallback((type) => {
    const typeInt = parseInt(type, 10)
    const insurance = insuranceTypes.find(item => item.InsuranceType === typeInt)
    return insurance ? insurance.Description : "Not found"
  }, [])

  const formattedStampDuty = useCallback((stampDuty) => {
    return (typeof stampDuty === 'number' ? stampDuty.toFixed(2) : parseFloat(stampDuty).toFixed(2)) || '0.00'
  }, [])

  const getDates = useCallback((date) => {
    const current = new Date(date)
    return current.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  }, [])

  const printCoverNote = useCallback(() => {
    setIsPrinting(true)
    const doc = new jsPDF('portrait', 'px', 'a4', 'false')
    const pageHeight = doc.internal.pageSize.height
    const pageWidth = doc.internal.pageSize.width

    const addText = (x, y, text, fontSize = 10, font = 'normal', align = 'left', color = [0, 0, 0]) => {
      doc.setFont('helvetica', font)
      doc.setFontSize(fontSize)
      doc.setTextColor(color[0], color[1], color[2])
      doc.text(text, x, y, { align })
    }

    // Header
    doc.setDrawColor(0, 0, 0)
    doc.line(45, 40, pageWidth - 35, 40)

    // Add logo
    doc.addImage('/images/icon.png', 'PNG', 50, 40, 70, 25)

    // Company details
    addText(50, 80, 'TelOne Private Limited', 12, 'bold')
    addText(50, 90, 'Runhare House, 107 Kwame Nkrumah Avenue \nP. O. Box CY 331, Causeway Harare, Zimbabwe\nPhone: +263 (24) 279 8111 \nEmail: clientservices@telone.co.zw', 10, 'normal', 'left', [112, 112, 112])

    // Divider
    doc.setDrawColor(0, 0, 0)
    doc.line(45, 120, pageWidth - 35, 120)
    doc.line(45, 122, pageWidth - 35, 122)

    // Current date and time
    const current = new Date()
    const curTime = current.toLocaleTimeString('en-GB')
    const formattedDate = current.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    const borderX = 45; // X position for the border
    const borderY = 130; // Y position for the border
    const borderWidth = doc.internal.pageSize.width - 80; // Width of the border
    const borderHeight = 140; // Height of the border
    const cornerRadius = 5; // Radius for rounded corners
    // Draw rounded rectangle for border
    doc.setDrawColor(0, 0, 0); // Set border color
    doc.roundedRect(borderX, borderY, borderWidth, borderHeight, cornerRadius, cornerRadius); // Draw rectangle

    // Policy details
    addText(50, 140, 'Policy Details', 12, 'bold')
    addText(50, 150, `Travel Plan:\nIssue Date:`, 10, 'normal')
    addText(130, 150, `${getInsuranceType(data[0].planName)}\n${formattedDate} ${curTime}}`, 10, 'normal')

    // Insured details
    addText(50, 180, 'Insured Details', 12, 'bold')
    addText(50, 190, `Name:\nAddress:\nPhone:\nEmail:`, 10, 'normal')
    addText(130, 190, `${travelData.fullname}\n123 Harare\n${formatPhoneNumber(travelData.phoneNumber)}\n${travelData.email}`, 10, 'normal')

    // Vehicle details
    addText(50, 230, 'Vehicle Details', 12, 'bold')
    addText(50, 240, `Make:\nModel:\nYear:\nRegistration:`, 10, 'normal')
    addText(130, 240, `${travelData.make}\n${travelData.model}\n${travelData.YearManufacture}\n${travelData.VRN}`, 10, 'normal')

    // Notes
    addText(45, 280, 'Notes', 12, 'bold')
    addText(45, 290, `Vehicle Registration Number: ${travelData.VRN} is hereby insured against loss subject to the usual conditions of the \nFTP Cover until 31 December 2024 unless Notice of cancellation has been given`, 10, 'normal')

    // Coverage data
    let lastY = 300
    data.forEach((coverage, index) => {
      // Calculate positions and dimensions
      const borderY = lastY + 5
      const borderWidth = pageWidth - 80
      const borderHeight = 35  // Increased for better spacing
      const cornerRadius = 5
      const logoUrl = coverage.insurerLogo || '/images/questionmark.png'
    
      // Draw rounded rectangle for the coverage
      doc.setDrawColor(0, 0, 0)
      doc.roundedRect(45, borderY, borderWidth, borderHeight, cornerRadius, cornerRadius)
    
      // Add insurer logo
      doc.addImage(logoUrl, 'PNG', 55, borderY + 7.5, 35, 25)  // Adjusted size and position
    
      // Add coverage details
      const textX = 120  // Adjusted for better alignment with logo
      const lineHeight = 10
      addText(textX, borderY + 10, `${coverage.insurerName}`, 10, 'bold')
      addText(textX, borderY + 10 + lineHeight, `Cover Period: \n${coverage.Policy.DurationMonths} months`, 10, 'normal')
    
      // Add financial details
      const columnWidth = 70
      const financialDetailsY = borderY + 10 + lineHeight
      addText(textX + columnWidth, financialDetailsY, `Stamp Duty:\n$${formattedStampDuty(coverage.Policy.StampDuty)}`, 10, 'normal')
      addText(textX + columnWidth * 2, financialDetailsY, `Govt Levy:\n$${formattedStampDuty(coverage.Policy.GovernmentLevy)}`, 10, 'normal')
      addText(textX + columnWidth * 3, financialDetailsY, `Premium:\n$${formattedStampDuty(coverage.Policy.PremiumAmount)}`, 10, 'normal')
    
      // Update lastY for the next iteration
      lastY = borderY + borderHeight
    })

    // Footer
    const footerText = `This document is computer generated and does not require a signature.`
    const footerWidth = doc.getTextWidth(footerText)
    const footerX = (pageWidth - footerWidth) / 2
    addText(footerX, pageHeight - 40, footerText, 8, 'italic')

    doc.save('insurance_cover_note.pdf')
    setIsPrinting(false)
  }, [data, travelData, travelData, formatPhoneNumber, getInsuranceType, formattedStampDuty, getDates])

  return (
    <motion.div variants={buttonVariants}>
      <button 
        className='py-1 px-3 rounded-full w-full border border-gray-300 bg-gray-600 text-white mt-2 hover:bg-gray-700 transition-colors duration-200'
        onClick={printCoverNote}
        disabled={isPrinting}
      >
        {isPrinting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Printing...
          </span>
        ) : (
          <>
             <i className='fa fa-print mr-2' />
            Print Quotation
          </>
        )}
      </button>
    </motion.div>
  )
}

export default QuotationPrinter

const buttonVariants = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -50, opacity: 0 },
};