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
  const { vehicleData, policyData, userData } = useContext(StepperContext);
  console.log("cnote data ",quoteData.data[0])

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

  const getInsuranceType = useCallback((type) => {
    const typeInt = parseInt(type, 10)
    const insurance = insuranceTypes.find(item => item.InsuranceType === typeInt)
    return insurance ? insurance.Code : "Not found"
  }, [])

  const getVehicleClass = (taxClass) => {
    const vehicleClass = vehicleClasses.find(item => item.TaxClass === taxClass);
    return vehicleClass ? vehicleClass.TaxClassDescription : "Tax class not found";
  }

  const getVehicleType = (type) => {
    const typeInt = parseInt(type, 10);
    const vehicleType = vehicleClasses.find(item => item.VehicleType === typeInt);
    return vehicleType ? vehicleType.Type : "Type not found";
  };

  const dateFormatter = (dateString) => {
    if (typeof dateString !== 'string' || dateString.length !== 8) {
      return "Invalid date format";
    }
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  const calculateMonthsBetweenDates = (startDate, endDate) =>{
    if (typeof startDate !== 'string' || startDate.length !== 8 ||
      typeof endDate !== 'string' || endDate.length !== 8) {
      throw new Error("Invalid date format. Expected YYYYMMDD.");
    }

    const start = new Date(
      parseInt(startDate.substring(0, 4)),
      parseInt(startDate.substring(4, 6)) - 1,
      parseInt(startDate.substring(6, 8))
    );

    const end = new Date(
      parseInt(endDate.substring(0, 4)),
      parseInt(endDate.substring(4, 6)) - 1,
      parseInt(endDate.substring(6, 8))
    );

    let months = (end.getFullYear() - start.getFullYear()) * 12 + 1;
    months -= start.getMonth();
    months += end.getMonth();
    if (end.getDate() < start.getDate()) {
      months--;
    }

    return months <= 0 ? 0 : months;
  }

  const getVehicleUse = (taxClass) => {
    const vehicleUse = vehicleClasses.find(item => item.TaxClass === taxClass);
    return vehicleUse ? vehicleUse.Use : "Usage not found";
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
    doc.addImage(quoteData.data[0].insurerLogo || logo, 'PNG', xPosition, 40, imageWidth, imageHeight);

    // TelOne details
    addText(45, 80, 'TelOne Private Limited', 12, 'bold', 'left');
    addText(45, 95, 'Runhare House, 107 Kwame Nkrumah Avenue \nP. O. Box CY 331, Causeway Harare, Zimbabwe\nPhone: +263 (24) 279 8111 \nEmail: clientservices@telone.co.zw', 10, 'normal', 'left', [112, 112, 112]);

    // Add company details
    addText(410, 80, `${quoteData.data[0].insurerName.charAt(0).toUpperCase() + quoteData.data[0].insurerName.slice(1)}`, 12, 'bold', 'right');
    addText(410, 95, `${quoteData.data[0].insurerAddress}\nPhone: +1 234 567 8900\nEmail: ${quoteData.data[0].insurerEmail}`, 10, 'normal', 'right', [112, 112, 112]);

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
    addText(130, 210, `${quoteData.data[0].insurerName.charAt(0).toUpperCase() + quoteData.data[0].insurerName.slice(1)}\n${user.firstname} ${user.surname}\n${getInsuranceType(quoteData.data[0].Policy.InsuranceType)}\n${formattedDate}`, 10, 'normal');

    addText(45, 260, 'Policy Rate', 10, 'bold');
    addText(45, 270, `Start Date\nEnd Date:\nPeriod:`, 10, 'normal');
    addText(130, 260, `ZWG291.60 per annum per seat\n${dateFormatter(quoteData.data[0].Policy.StartDate)}\n${dateFormatter(quoteData.data[0].Policy.EndDate)}\n${calculateMonthsBetweenDates(quoteData.data[0].Policy.StartDate, quoteData.data[0].Policy.EndDate)} Months`, 10, 'normal');

    addText(45, 300, `Policy\nStamp Duty:`, 10, 'normal');
    addText(130, 300, `ZWG${quoteData.data[0].Policy.CoverAmount}\nZWG${quoteData.data[0].Policy.StampDuty}`, 10, 'normal');
    addText(45, 318, `Premium:`, 10, 'bold');
    addText(130, 318, `ZWG${quoteData.data[0].Policy.PremiumAmount}`, 10, 'bold');

    const thirdLineY = 330;
    doc.setDrawColor(0, 0, 0);
    doc.line(45, thirdLineY, doc.internal.pageSize.width - 35, thirdLineY);

    // Certificate details
    addText(45, 340, 'Insured Details', 12, 'bold');
    addText(45, 350, `ID Number\nName:\nAddress:\nPhone:\nEmail:`, 10, 'normal');
    const formattedPhone = formatPhoneNumber(userData.phoneNumber);
    addText(130, 350, `${userData.idNumber}\n${userData.fullname}\n${userData.address}\n${formattedPhone}\n${userData.email}`, 10, 'normal');

    const forthLineY = 400;
    doc.setDrawColor(0, 0, 0);
    doc.line(45, forthLineY, doc.internal.pageSize.width - 35, forthLineY);

    // Add vehicle details
    addText(45, 410, 'Vehicle Details', 12, 'bold');
    addText(45, 420, `Registration:\nVehicle:\nTax Class:`, 10, 'normal');
    addText(130, 420, `${vehicleData.VRN}\n${vehicleData.make} ${vehicleData.model}\n${vehicleData.taxClass}`, 10, 'normal');

    const fifthLineY = 450;
    doc.setDrawColor(0, 0, 0);
    doc.line(45, fifthLineY, doc.internal.pageSize.width - 35, fifthLineY);

    // Add vehicle details
    addText(45, 460, 'Insurance Details', 12, 'bold');
    addText(45, 470, `Vehicle Type:\nInsurance Type:\nStart Date:\nExpiry Date:`, 10, 'normal');
    addText(130, 470, `${getVehicleType(vehicleData.vehicleTypeId)}\n${vehicleData.make} ${formattedDate}\n${vehicleData.YearManufacture}`, 10, 'normal');

    // Cover Notes
    addText(45, 520, 'Notes', 12, 'bold');
    addText(45, 530, `YOUR PROOF OF INSURANCE DISC, WHICH NEEDS TO BE AFFIXED TO YOUR VEHICLE'S \nWINDSCREEN, WILL BE PRINTED WHEN YOU OBTAIN YOUR LICENCE DISC.`);
    addText(45, 550, `* Stamp Duty has been charged in terms of the Stamp Duty Act`, 8, 'italic');
    addText(45, 560, `* This Policy Schedule is issued in terms of the Insurer's Policy Terms and Conditions`, 8, 'italic');

    // Add coverage details
    // const coverageHeaders = [["Coverage", "Limit", "Premium"]];
    // const coverageData = policyData.coverages.map(coverage => [
    //   coverage.type,
    //   `$${coverage.limit.toFixed(2)}`,
    //   `$${coverage.premium.toFixed(2)}`
    // ]);

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