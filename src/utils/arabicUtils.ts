
/**
 * Convert Arabic numbers to English numbers
 */
export const convertArabicToEnglishNumbers = (str: string): string => {
  return str.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
};

/**
 * Convert English numbers to Arabic numbers
 */
export const convertEnglishToArabicNumbers = (str: string | number): string => {
  const persianDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.toString().replace(/[0-9]/g, (d: string) => persianDigits[parseInt(d)]);
};

/**
 * Calculate Sharia inheritance shares (simplified version)
 * This is a placeholder for the actual complex calculation that would comply with Islamic law
 */
export const calculateInheritanceShares = (
  heirs: { 
    relationship: string; 
    gender: 'male' | 'female'; 
    count: number 
  }[],
  totalAmount: number
): { relationship: string; share: number; percentage: number }[] => {
  // This is a simplified placeholder - in a real system, this would be a complex
  // implementation of Islamic inheritance law (Fara'id)
  
  // For demonstration purposes only
  const totalShares = heirs.reduce((acc, heir) => {
    let share = 0;
    if (heir.relationship === 'son') share = 2 * heir.count;
    else if (heir.relationship === 'daughter') share = heir.count;
    else if (heir.relationship === 'wife') share = 1/8;
    else if (heir.relationship === 'husband') share = 1/4;
    else if (heir.relationship === 'father') share = 1/6;
    else if (heir.relationship === 'mother') share = 1/6;
    return acc + share;
  }, 0);
  
  return heirs.map((heir) => {
    let share = 0;
    if (heir.relationship === 'son') share = 2 * heir.count;
    else if (heir.relationship === 'daughter') share = heir.count;
    else if (heir.relationship === 'wife') share = 1/8;
    else if (heir.relationship === 'husband') share = 1/4;
    else if (heir.relationship === 'father') share = 1/6;
    else if (heir.relationship === 'mother') share = 1/6;
    
    const percentage = (share / totalShares) * 100;
    const amountShare = (percentage / 100) * totalAmount;
    
    return {
      relationship: heir.relationship,
      share: amountShare,
      percentage
    };
  });
};

/**
 * Validate Arabic name format
 */
export const isValidArabicName = (name: string): boolean => {
  // Arabic letters and spaces only
  const arabicNameRegex = /^[\u0600-\u06FF\s]+$/;
  return arabicNameRegex.test(name);
};

/**
 * Validate Yemeni ID number
 */
export const isValidYemeniId = (id: string): boolean => {
  // This is a placeholder - implement actual validation logic based on Yemeni ID format
  return /^\d{9,12}$/.test(id);
};

/**
 * Get Arabic month name
 */
export const getArabicMonthName = (monthIndex: number): string => {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  return months[monthIndex];
};
