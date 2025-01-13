import React, { useCallback, useContext } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '/images/icon.png'; // Ensure this path is correct
import { motion } from 'framer-motion';
import { StepperContext } from '../../../context/StepperContext';
import vehicleClasses from './../../vehicleClass.json'
import insuranceTypes from '../../insuranceTypes.json'
import useAuth from '../../../hooks/useAuth';

const CoverNotePrinter = (quoteData) => {
  const { user } = useAuth()
  const { travelData } = useContext(StepperContext);
  console.log("cnote data ",travelData)

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
    const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24 + 1));

    // Return the number of days, ensuring it's not negative
    return days < 0 ? 0 : days;
  };

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
    addText(130, 160, `123456\n${quoteData.data[0].quotationId}\n${formattedDate}`, 10, 'normal');

    const secondLineY = 190;
    doc.setDrawColor(0, 0, 0); 
    doc.line(45, secondLineY, doc.internal.pageSize.width - 35, secondLineY);

    // Add policy details
    addText(45, 200, 'Certificate of Motor Insurance', 12, 'bold');
    addText(45, 210, `Insurer:\nAgent:\nInsurance Type:\nVehicle Type\nPassangers`, 10, 'normal');
    addText(130, 210, `${quoteData.data[0].insurerName.charAt(0).toUpperCase() + quoteData.data[0].insurerName.slice(1)}\n${user.firstname} ${user.surname}\n${travelData.planName}\n${formattedDate}`, 10, 'normal');

    addText(45, 260, 'Policy Rate', 10, 'bold');
    addText(45, 270, `Start Date\nEnd Date:\nPeriod:`, 10, 'normal');
    addText(130, 260, `${travelData.currency}${quoteData.data[0].amount} per annum per seat\n${dateFormatter(travelData.fromDate)}\n${dateFormatter(travelData.toDate)}\n${calculateDaysBetweenDates(travelData.fromDate, travelData.toDate)} Days`, 10, 'normal');

    addText(45, 295, `Policy:`, 10, 'bold');
    addText(130, 295, `ZWG${quoteData.data[0].amount}`, 10, 'normal');

    const thirdLineY = 310;
    doc.setDrawColor(0, 0, 0);
    doc.line(45, thirdLineY, doc.internal.pageSize.width - 35, thirdLineY);

    // Certificate details
    addText(45, 320, 'Insured Details', 12, 'bold');
    addText(45, 330, `Passport Number\nName:\nAge:\nPhone:\nEmail:`, 10, 'normal');
    const formattedPhone = formatPhoneNumber(travelData.phoneNumber);
    addText(130, 320, `${travelData.travelers[0].passportNumber.toUpperCase()}\n${travelData.travelers[0].fullName}\n${travelData.travelers[0].age}\n${formattedPhone}\n${travelData.email}`, 10, 'normal');

    let currentY = 370;

    if (travelData.travelers.length > 1) {
      for (let i = 1; i < travelData.travelers.length; i++) {
        currentY += 10;
        addText(45, currentY, `Passport Number\nName:\nAge:`, 10, 'normal');
        addText(130, currentY, `${travelData.travelers[i].passportNumber.toUpperCase()}\n${travelData.travelers[i].fullName}\n${travelData.travelers[i].age}`, 10, 'normal');
        currentY += 20;
      }
    }

    const fifthLineY = 510;
    doc.setDrawColor(0, 0, 0);
    doc.line(45, fifthLineY, doc.internal.pageSize.width - 35, fifthLineY);

    // Cover Notes
    addText(45, 520, 'Notes', 12, 'bold');
    addText(45, 530, `MEMBERS TO NOTIFY FBC INSURANCE OF ANY LOSS OR INJURY WITHIN 3 DAYS OF INCIDENCE.`);
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