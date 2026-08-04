/**
 * Converts numbers into Indian Rupee words (Lakhs, Crores, Thousands)
 * e.g. 154250 -> "Rupees One Lakh Fifty Four Thousand Two Hundred Fifty Only"
 */
export function numberToWordsINR(num: number): string {
  if (num === 0) return 'Rupees Zero Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teenDigits = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tensDigits = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertChunk = (n: number): string => {
    let str = '';
    if (n >= 100) {
      str += `${singleDigits[Math.floor(n / 100)]} Hundred `;
      n %= 100;
    }
    if (n >= 10 && n < 20) {
      str += `${teenDigits[n - 10]} `;
    } else {
      if (n >= 20) {
        str += `${tensDigits[Math.floor(n / 10)]} `;
        n %= 10;
      }
      if (n > 0) {
        str += `${singleDigits[n]} `;
      }
    }
    return str.trim();
  };

  const integerPart = Math.floor(Math.abs(num));
  const paisaPart = Math.round((Math.abs(num) - integerPart) * 100);

  let rupeesStr = '';
  let temp = integerPart;

  if (temp >= 10000000) {
    const crore = Math.floor(temp / 10000000);
    rupeesStr += `${convertChunk(crore)} Crore `;
    temp %= 10000000;
  }
  if (temp >= 100000) {
    const lakh = Math.floor(temp / 100000);
    rupeesStr += `${convertChunk(lakh)} Lakh `;
    temp %= 100000;
  }
  if (temp >= 1000) {
    const thousand = Math.floor(temp / 1000);
    rupeesStr += `${convertChunk(thousand)} Thousand `;
    temp %= 1000;
  }
  if (temp > 0) {
    rupeesStr += `${convertChunk(temp)} `;
  }

  rupeesStr = rupeesStr.trim();
  let result = `Rupees ${rupeesStr}`;

  if (paisaPart > 0) {
    result += ` and ${convertChunk(paisaPart)} Paisa`;
  }

  return `${result} Only`;
}
