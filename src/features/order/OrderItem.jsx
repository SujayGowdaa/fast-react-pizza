/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { formatCurrency } from '../../utilities/helpers.js';

function OrderItem({ item, isLoadingIngredients, ingredients }) {
  const { quantity, name, totalPrice } = item;

  return (
    <li className=" space-y-1 py-3">
      <div className=" flex items-center justify-between gap-4 text-sm ">
        <p>
          <span className=" text-sm">{quantity}&times;</span> {name}
        </p>
        <p className="  font-bold">{formatCurrency(totalPrice)}</p>
      </div>
      <p className="  text-xs capitalize text-stone-500">
        {isLoadingIngredients ? 'Loading...' : ingredients}
      </p>
    </li>
  );
}

export default OrderItem;
