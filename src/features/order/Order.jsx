/* eslint-disable no-unused-vars */
// Test ID: IIDSAT CQE92U
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from '../../utilities/helpers';
import { getOrder } from '../../services/apiRestaurant';
import { useFetcher, useLoaderData } from 'react-router-dom';

import OrderItem from './OrderItem';
import { useEffect } from 'react';
import UpdateOrder from './UpdateOrder';

// const order = {
//   id: 'ABCDEF',
//   customer: 'Jonas',
//   phone: '123456789',
//   address: 'Arroios, Lisbon , Portugal',
//   priority: true,
//   estimatedDelivery: '2027-04-25T10:00:00',
//   cart: [
//     {
//       pizzaId: 7,
//       name: 'Napoli',
//       quantity: 3,
//       unitPrice: 16,
//       totalPrice: 48,
//     },
//     {
//       pizzaId: 5,
//       name: 'Diavola',
//       quantity: 2,
//       unitPrice: 16,
//       totalPrice: 32,
//     },
//     {
//       pizzaId: 3,
//       name: 'Romana',
//       quantity: 1,
//       unitPrice: 15,
//       totalPrice: 15,
//     },
//   ],
//   position: '-9.000,38.000',
//   orderPrice: 95,
//   priorityPrice: 19,
// };

function Order() {
  const order = useLoaderData();
  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    cart,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);
  const fetcher = useFetcher();

  useEffect(() => {
    if (!fetcher.data && fetcher.state === 'idle') {
      fetcher.load('/menu');
    }
  }, [fetcher]);

  return (
    <div className=" space-y-8 px-4 py-6 ">
      <div className=" flex flex-wrap items-center justify-between gap-6">
        <h2 className=" text-xl font-semibold ">Order #{id} status</h2>

        <div className=" space-x-2 ">
          {priority && (
            <span className=" rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50 ">
              Priority
            </span>
          )}
          <span className=" rounded-full bg-green-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-green-50 ">
            {status} order
          </span>
        </div>
      </div>

      <div className=" flex flex-wrap items-center justify-between gap-6 bg-stone-200 px-6 py-5 ">
        <p className=" font-medium ">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : 'Order should have arrived'}
        </p>
        <p className=" text-xs text-stone-500 ">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className=" divide-y divide-stone-200 border-b border-t ">
        {cart.map((item) => {
          return (
            <OrderItem
              isLoadingIngredients={fetcher.state === 'loading'}
              ingredients={fetcher.data
                ?.find((el) => el.id === item.pizzaId)
                ?.ingredients.join(', ')}
              key={item.pizzaId}
              item={item}
            />
          );
        })}
      </ul>

      <div className=" space-y-2 bg-stone-200 px-6 py-5 ">
        <p className=" text-sm font-medium text-stone-600">
          Price pizza: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className=" text-sm font-medium text-stone-600">
            Price priority: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="  font-bold">
          To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>
      {!priority && <UpdateOrder />}
    </div>
  );
}

export default Order;

export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}
