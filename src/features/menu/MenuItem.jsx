import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency } from '../../utilities/helpers';
import { addItem, getQuantityById } from '../cart/cartSlice';

import Button from '../../ui/Button';
import DeleteItem from '../cart/DeleteItem';
import UpdateItemQuantity from '../cart/UpdateItemQuantity';

/* eslint-disable react/prop-types */
function MenuItem({ pizza }) {
  const {
    id: pizzaId,
    name,
    unitPrice,
    ingredients,
    soldOut,
    imageUrl,
  } = pizza;
  const dispatch = useDispatch();
  const currentQuantity = useSelector(getQuantityById(pizzaId));
  const isInCart = currentQuantity > 0;

  function handleAddToCart() {
    const newItem = {
      pizzaId,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice * 1,
    };
    dispatch(addItem(newItem));
  }

  return (
    <li className=" flex gap-4 py-2 ">
      <img
        className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
        src={imageUrl}
        alt={name}
      />
      <div className=" flex grow flex-col">
        <p className="font-medium ">{name}</p>
        <p className=" text-sm capitalize  text-stone-500">
          {ingredients.join(' | ')}
        </p>
        <div className=" mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className=" text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className=" text-sm font-medium uppercase text-stone-500">
              Sold out
            </p>
          )}

          {!soldOut &&
            (isInCart ? (
              <div className=" flex items-center gap-4 sm:gap-8">
                <UpdateItemQuantity pizzaId={pizzaId} />
                <DeleteItem pizzaId={pizzaId} />
              </div>
            ) : (
              <Button onClick={handleAddToCart} type="small">
                Add to Cart
              </Button>
            ))}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
