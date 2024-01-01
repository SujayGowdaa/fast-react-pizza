import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Menu, { loader as menuLoader } from './features/menu/Menu';
import { loader as orderLoader } from './features/order/Order';
import { action as createOrderAction } from './features/order/CreateOrder';
import { action as updateOrderAction } from './features/order/UpdateOrder';

import Home from './ui/Home';
import Error from './ui/Error';
import Cart from './features/cart/Cart';
import Order from './features/order/Order';
import CreateOrder from './features/order/CreateOrder';
import AppLayout from './ui/AppLayout';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'menu',
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'order/new',
        element: <CreateOrder />,
        errorElement: <Error />,
        action: createOrderAction,
      },
      {
        path: 'order/:orderId',
        element: <Order />,
        errorElement: <Error />,
        loader: orderLoader,
        action: updateOrderAction,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
