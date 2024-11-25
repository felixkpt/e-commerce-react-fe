import { Link } from 'react-router-dom';

const PaypalCancelPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
      <h1 className="text-2xl font-bold text-red-600">Payment Cancelled</h1>
      <p className="text-gray-700">
        It looks like your payment was cancelled. Don’t worry, your cart is still saved.
      </p>
      <Link
        to="/shop/cart"
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        View Cart
      </Link>
    </div>
  );
};

export default PaypalCancelPage;
