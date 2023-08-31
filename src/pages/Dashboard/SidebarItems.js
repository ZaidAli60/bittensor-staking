import { Link } from 'react-router-dom';
import { BiCreditCardAlt } from "react-icons/bi"
import { MdHowToVote, MdOutlineAccountBalanceWallet } from "react-icons/md"
import { AppstoreOutlined } from '@ant-design/icons';

const root = "/";

export const items = [
    { key: "home", icon: <AppstoreOutlined />, label: <Link to={root} className="text-decoration-none fontFamily">Home</Link> },
    { key: "balance", icon: <MdOutlineAccountBalanceWallet />, label: <Link to={root + "balance"} className="text-decoration-none fontFamily">Balance</Link> },
    { key: "vote", icon: <MdHowToVote />, label: <Link to={root + "check-balance"} className="text-decoration-none fontFamily">Vote</Link> },
    { key: "buy-tao", icon: <BiCreditCardAlt />, label: <Link to={root + "buy-tao"} className="text-decoration-none fontFamily">Buy Tao</Link> },
]