# Civic Auth Web3 Wallet Demo: [https://civic-dapp.vercel.app/]

A demonstration of Civic Auth integration with Web3 functionality, showcasing authentication and embedded wallet features. This project was built as part of Civic's alpha testing program.

## Features

- User Authentication with Civic Auth
- Embedded Ethereum Wallet Creation
- Wallet Management Features:
  - Display Wallet Address
  - QR Code Generation
  - Copy Address to Clipboard
  - Check ETH Balance
  - Send ETH Transactions
  - Connect/Disconnect Wallet

## Technologies Used

- React.js
- Civic Auth Web3
- Wagmi (Ethereum Hooks)
- Viem (Ethereum Library)
- React Query
- React Icons
- QR Code Generation

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd civic-auth-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Civic Client ID:
```env
REACT_APP_CIVIC_CLIENT_ID=your_civic_client_id_here
```

4. Start the development server:
```bash
npm start
```

## Project Structure

```
civic-auth-app/
├── src/
│   ├── components/
│   │   ├── WalletComponent.jsx
│   │   └── WalletComponent.css
│   ├── App.js
│   └── index.js
```

## Implementation Details

1. **Authentication**: Implemented using Civic Auth for secure user authentication
2. **Wallet Creation**: Automatic embedded wallet creation upon user authentication
3. **Transaction Handling**: Secure ETH transactions with proper error handling
4. **UI/UX**: Modern, responsive design with loading states and user feedback

## Environment Setup

1. Sign up at [auth.civic.com](https://auth.civic.com)
2. Create a new project and get your Client ID
3. Enable Web3 wallet functionality in your Civic dashboard
4. Add the Client ID to your environment variables

## Features Implemented

- [x] User Authentication
- [x] Embedded Wallet Creation
- [x] Wallet Address Display
- [x] Balance Checking
- [x] QR Code Generation
- [x] Send ETH Functionality
- [x] Copy Address to Clipboard
- [x] Transaction Status Updates
- [x] Error Handling
- [x] Loading States

## Feedback and Testing Notes

This implementation was created as part of Civic's alpha testing program to evaluate:
- Integration ease
- User experience
- Authentication flow
- Wallet functionality
- Overall developer experience

## Dependencies

```json
{
  "@civic/auth": "^0.2.1",
  "@civic/auth-web3": "^0.2.1",
  "@tanstack/react-query": "^5.64.1",
  "@wagmi/core": "^2.16.3",
  "qrcode.react": "^3.1.0",
  "react-icons": "^4.12.0",
  "viem": "^2.22.9",
  "wagmi": "^2.14.8"
}
```

## Contributing

This project is part of Civic's alpha testing program. Feel free to:
1. Test the implementation
2. Provide feedback
3. Report issues
4. Suggest improvements

## Resources

- [Civic Auth Documentation](https://docs.civic.com)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)

## Acknowledgments

Special thanks to the Civic team for providing the authentication and wallet infrastructure, and to the alpha testing community for their feedback and contributions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.