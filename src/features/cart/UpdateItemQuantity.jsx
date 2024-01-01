/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../ui/Button';
import { decItem, getQuantityById, incItem } from './cartSlice';

export default function UpdateItemQuantity({ pizzaId }) {
  const dispatch = useDispatch();
  const totalItemQuantity = useSelector(getQuantityById(pizzaId));

  return (
    <div className=" space-x-1 md:space-x-2">
      <Button type="round" onClick={() => dispatch(decItem(pizzaId))}>
        -
      </Button>
      <span className=" text-sm font-semibold">{totalItemQuantity}</span>
      <Button type="round" onClick={() => dispatch(incItem(pizzaId))}>
        +
      </Button>
    </div>
  );
}
