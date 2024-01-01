import { Link } from 'react-router-dom';
import SearchOrder from '../features/order/SearchOrder';
import UserName from '../features/user/UserName';

export default function Header() {
  return (
    <div className=" flex items-center justify-between border-b border-stone-500 bg-yellow-400 p-4 uppercase sm:px-6">
      <Link className=" tracking-widest" to="/">
        Fast React Pizza Co
      </Link>
      <SearchOrder />
      <UserName />
    </div>
  );
}
