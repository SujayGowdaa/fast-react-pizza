/* eslint-disable react-refresh/only-export-components */
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import { useState } from 'react';
import { formatCurrency } from '../../utilities/helpers.js';

import store from '../../store.js';

import Button from '../../ui/Button';
import EmptyCart from '../cart/EmptyCart';
import { fetchAddress } from '../user/userSlice.js';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [isPriority, setIsPriority] = useState(false);
  const navigation = useNavigation();
  const error = useActionData();
  const {
    userName,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const orderPrice = isPriority
    ? (totalCartPrice / 100) * 10 + totalCartPrice
    : totalCartPrice;
  const isSubmitting = navigation.state === 'submitting';
  const dispatch = useDispatch();
  const isLoading = addressStatus === 'loading';

  if (!cart.length) return <EmptyCart />;

  return (
    <div className=" px-4 py-6 ">
      <h2 className=" mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      <Form method="POST">
        <div className=" mb-5 flex flex-col gap-2 sm:flex-row sm:items-center ">
          <label className=" sm:basis-40">First Name</label>
          <input
            className="input grow"
            defaultValue={userName}
            type="text"
            name="customer"
            required
          />
        </div>

        <div className=" mb-5 flex flex-col gap-2 sm:flex-row sm:items-center ">
          <label className=" sm:basis-40">Phone number</label>
          <div className=" grow">
            <input className="input w-full" type="tel" name="phone" required />
            {error?.phone && (
              <p className=" mt-2 rounded-full   bg-red-100 px-2 py-1 text-xs text-red-700">
                {error.phone}
              </p>
            )}
          </div>
        </div>

        <div className=" relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center ">
          <label className=" sm:basis-40">Address</label>
          <div className=" grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              required
              disabled={isLoading}
              defaultValue={address}
            />
          </div>
          {!position.latitude && !position.longitude && (
            <span className=" absolute right-[3px] top-[3px] z-10 md:top-[5px]">
              <Button
                disabled={isLoading}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get Position
              </Button>
            </span>
          )}
          {addressStatus === 'error' && (
            <p className=" mt-2 rounded-full   bg-red-100 px-2 py-1 text-xs text-red-700">
              {errorAddress}
            </p>
          )}
        </div>

        <div className=" mb-12 flex items-center gap-5 ">
          <input
            className=" h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={isPriority}
            onChange={(e) => setIsPriority(e.target.checked)}
          />
          <label className=" font-medium " htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude}, ${position.longitude}`
                : 'null'
            }
          />
          <Button type="primary" disabled={isSubmitting}>
            {isSubmitting
              ? 'Placing order...'
              : `Order now ${formatCurrency(orderPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateOrder;

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    priority: data.priority === 'true',
    cart: JSON.parse(data.cart),
  };

  const error = {};

  if (!isValidPhone(order.phone))
    error.phone = 'Please give us valid phone number.';
  if (Object.keys(error).length > 0) return error;

  const newOrder = await createOrder(order);
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}
