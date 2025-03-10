import React, { useContext } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '/images/icon.png'; // Ensure this path is correct
import { motion } from 'framer-motion';
import { StepperContext } from '../../../context/StepperContext';
import useAuth from '../../../hooks/useAuth';

const CoverNotePrinter = (quoteData) => {
  const { user } = useAuth()
  const { userData, propertyData } = useContext(StepperContext);
  console.log("cnote data ",quoteData)
  console.log("user ", propertyData)

  // Function to format phone number
  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters
    if (cleaned.length !== 12) {
      throw new Error('Invalid phone number length');
    }
    const countryCode = cleaned.slice(0, 3); // +263
    const areaCode = cleaned.slice(3, 5);    // 77
    const firstPart = cleaned.slice(5, 8);   // 777
    const secondPart = cleaned.slice(8);      // 7777
    return `+${countryCode} (${areaCode}) ${firstPart} ${secondPart}`;
  };

  const dateFormatter = (dateString) => {
    if (typeof dateString !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return "Invalid date format";
    }
    
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
  };

  const calculateDaysBetweenDates = (startDate, endDate) => {
    // Validate the format of the input dates
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormat.test(startDate) || !dateFormat.test(endDate)) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD.");
    }

    // Parse the start date
    const [startYear, startMonth, startDay] = startDate.split('-');
    const start = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));

    // Parse the end date
    const [endYear, endMonth, endDay] = endDate.split('-');
    const end = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay));

    // Calculate the difference in time
    const timeDifference = end - start;

    // Convert time difference from milliseconds to days
    const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24 + 2));

    // Return the number of days, ensuring it's not negative
    return days < 0 ? 0 : days;
  };

  function formatPolicyName(policy) {
    if(policy==="DOMESTIC_COMBINED_STANDARD_CONSTRUCTION")
      return "Domestic Combined Standard Construction"
    else if(policy==="DOMESTIC_COMBINED_NON_STANDARD_CONSTRUCTION")
      return "Domestic Combined Non Standard Construction"
    else{
      return policy
    }
  }

  const printCoverNote = () => {
    const doc = new jsPDF('portrait', 'px', 'a4', 'false');
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    // Helper function to add text
    const addText = (x, y, text, fontSize = 10, font = 'normal', align = 'left', color = [0, 0, 0]) => {
      doc.setFont('helvetica', font);
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(text, x, y, { align });
    };

    // Add logo
    const imageWidth = 70; // Width of the image
    const imageHeight = 25; // Height of the image
    const xPosition = doc.internal.pageSize.width - imageWidth - 35; // Right-aligned position
    doc.addImage(logo, 'PNG', 45, 40, imageWidth, imageHeight);
    doc.addImage(logo, 'PNG', xPosition, 40, imageWidth, imageHeight);

    // TelOne details
    addText(45, 80, 'TelOne Private Limited', 12, 'bold', 'left');
    addText(45, 95, 'Runhare House, 107 Kwame Nkrumah Avenue \nP. O. Box CY 331, Causeway Harare, Zimbabwe\nPhone: +263 (24) 279 8111 \nEmail: clientservices@telone.co.zw', 10, 'normal', 'left', [112, 112, 112]);

    // Add company details
    addText(410, 80, `${quoteData.data[0].insurerName.charAt(0).toUpperCase() + quoteData.data[0].insurerName.slice(1)}`, 12, 'bold', 'right');
    addText(410, 95, `${quoteData.data[0].insurerAddress}\nPhone: +1 234 567 8900\nEmail: info@insurance.com`, 10, 'normal', 'right', [112, 112, 112]);

    const lineY = 140; // Set the y position for the line
    doc.setDrawColor(0, 0, 0); // Set the color for the line (black)
    doc.line(45, lineY, doc.internal.pageSize.width - 35, lineY); // Draw line

    // Get current date and time
    const current = new Date();
    const pad = (number) => (number < 10 ? '0' + number : number);
    const hours = pad(current.getHours());
    const minutes = pad(current.getMinutes());
    const seconds = pad(current.getSeconds());
    const curTime = `${hours}:${minutes}:${seconds}`; // Format time as HH:MM:SS
    const formattedDate = current.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    // Add policy details
    addText(45, 150, `${quoteData.data[0].insurerName.charAt(0).toUpperCase() + quoteData.data[0].insurerName.slice(1)} Insurance`, 12, 'bold');
    addText(45, 160, `Cover Note #:\nTransaction Ref#:\nIssue Date:`, 10, 'normal');
    addText(130, 160, `${quoteData.data[0].quotationId}\n${quoteData.data[0].merchantRef}\n${formattedDate}`, 10, 'normal');

    const secondLineY = 190;
    doc.setDrawColor(0, 0, 0); 
    doc.line(45, secondLineY, doc.internal.pageSize.width - 35, secondLineY);

    // Add policy details
    addText(45, 200, 'Certificate of Travel Insurance', 12, 'bold');
    addText(45, 210, `Insurer:\nAgent:\nPolicy Name:\nPayment Date`, 10, 'normal');
    addText(130, 210, `${quoteData.data[0].insurerName.charAt(0).toUpperCase() + quoteData.data[0].insurerName.slice(1)}\n${user.firstname} ${user.surname}\n${formatPolicyName(quoteData.data[0].policy)}\n${formattedDate}}`, 10, 'normal');
    // Add policy details

    addText(45, 260, 'Policy Holder Details', 12, 'bold');
    addText(45, 270, `Name:\nID Number:\nEmail:\nPhone Number`, 10, 'normal');
    addText(130, 270, `${userData.fullName}\n${userData.idNumber}\n${userData.email}\n${userData.phoneNumber}`, 10, 'normal');   

    addText(45, 320, `Insured Details:`, 12, 'bold');
    addText(45, 330, `Property Address:\nValue:`, 10, 'normal');
    addText(130, 330, `${propertyData.homeAddress}\n${propertyData.value}`, 10, 'normal'); 

    const thirdLineY = 250;
    doc.setDrawColor(0, 0, 0);
    doc.line(45, thirdLineY, doc.internal.pageSize.width - 35, thirdLineY);

    const fifthLineY = 310;
    doc.setDrawColor(0, 0, 0);
    doc.line(45, fifthLineY, doc.internal.pageSize.width - 35, fifthLineY);

    const sixthLineY = 510;
    doc.setDrawColor(0, 0, 0);
    doc.line(45, sixthLineY, doc.internal.pageSize.width - 35, sixthLineY);

    // Cover Notes
    addText(45, 520, 'Notes', 12, 'bold');
    addText(45, 530, `MEMBERS TO NOTIFY ${quoteData.data[0].insurerName.toUpperCase()} INSURANCE OF ANY LOSS OR INJURY WITHIN 3 DAYS OF INCIDENCE.`);
    addText(45, 550, `* Stamp Duty has been charged in terms of the Stamp Duty Act`, 8, 'italic');
    addText(45, 560, `* This Policy Schedule is issued in terms of the Insurer's Policy Terms and Conditions`, 8, 'italic');

    doc.autoTable({
      startY: 370,
      // head: coverageHeaders,
      // body: coverageData,
      margin: { left: 45, right: 45 },
      columnStyles: {
        0: { cellWidth: 200 },
        1: { cellWidth: 100, halign: 'right' },
        2: { cellWidth: 100, halign: 'right' },
      },
    });

    // Add footer
    const footerY = pageHeight - 40;
    const footerText = `This document is computer generated and does not require a signature.`;
    const footerWidth = doc.getTextWidth(footerText);
    const footerX = (pageWidth - footerWidth) / 2;
    addText(footerX, footerY, footerText, 8, 'italic');

    // Save the PDF
    doc.save('insurance_cover_note.pdf');
  };

  return (
    <motion.div variants={buttonVariants}>
      <button 
        className='py-1 px-3 rounded-full w-full border border-gray-300 bg-blue-400 text-white mt-2 hover:bg-blue-500 transition-colors duration-200'
        onClick={printCoverNote}
      >
        <i className='fa fa-print mr-2' />
        Print Cover Note
      </button>
    </motion.div>
  );
};

export default CoverNotePrinter;

const buttonVariants = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -50, opacity: 0 },
};