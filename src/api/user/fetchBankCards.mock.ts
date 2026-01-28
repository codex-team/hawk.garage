/**
 * Mock bank cards for demo user
 */
const mockBankCards = {
  me: {
    bankCards: [
      {
        id: 'card-demo-1',
        cardNumber: '411111****1111',
        expiryDate: '12/25',
        cardHolder: 'Demo User',
        isDefault: true,
      },
      {
        id: 'card-demo-2',
        cardNumber: '511111****1111',
        expiryDate: '06/26',
        cardHolder: 'Demo User',
        isDefault: false,
      },
    ],
  },
};

export default mockBankCards;
