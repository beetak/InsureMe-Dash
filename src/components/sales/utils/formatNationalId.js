export function formatNationalId(value) {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 8) {
      return `${cleaned.slice(0, 2)} - ${cleaned.slice(2)}`;
    } else if (cleaned.length === 9) {
      const lastChar = cleaned[8];
      if (isNaN(parseInt(lastChar, 10))) {
        // If the 9th character is a letter
        return `${cleaned.slice(0, 2)} - ${cleaned.slice(2, 8)} ${lastChar}`;
      } else {
        // If the 9th character is a number
        return `${cleaned.slice(0, 2)} - ${cleaned.slice(2, 9)}`;
      }
    } else if (cleaned.length <= 11 && isNaN(parseInt(cleaned[8], 10))) {
        const ninthChar = cleaned[8];
        // If the 9th character is a letter
        return `${cleaned.slice(0, 2)} - ${cleaned.slice(2, 8)} ${ninthChar} ${cleaned.slice(9)}`;
    } else if (cleaned.length <= 12 && isNaN(parseInt(cleaned[9], 10))) {
        const tenthChar = cleaned[9];
        // If the 9th character is a number and 10th is a letter
        return `${cleaned.slice(0, 2)} - ${cleaned.slice(2, 9)} ${tenthChar} ${cleaned.slice(10)}`;
    } else {
      // Limit to 10 characters
      return cleaned.slice(0, 13);
    }
  }
  
  