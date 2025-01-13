import React from 'react'
import jsPDF from 'jspdf'
import "jspdf-autotable";
const img = "images/icon.png"

const Print = () => {
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

export default Print