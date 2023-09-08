import { Link } from 'react-router-dom';
import { BiCreditCardAlt } from "react-icons/bi"
import { MdHowToVote, MdOutlineAccountBalanceWallet } from "react-icons/md"
import { AppstoreOutlined } from '@ant-design/icons';

const root = "/";

export const data = [
    { key: "home", icon: <AppstoreOutlined />, label: <Link to={root} className="text-decoration-none fontFamily">Home</Link> },
    { key: "balance", icon: <MdOutlineAccountBalanceWallet />, label: <Link to={root + "balance"} className="text-decoration-none fontFamily">Balance</Link> },
    { key: "vote", icon: <MdHowToVote />, label: <Link to={root + "check-balance"} className="text-decoration-none fontFamily">Vote</Link> },
    { key: "buy-tao", icon: <BiCreditCardAlt />, label: <Link to={root + "buy-tao"} className="text-decoration-none fontFamily">Buy Tao</Link> },
    // {
    //     key: "buy-tao",
    //     icon: <BiCreditCardAlt />,
    //     label: (
    //         <Dropdown
    //             overlay={
    //                 <Menu>
    //                     <Menu.Item key="1">
    //                         <Link to={root + "buy-tao"} className="text-decoration-none fontFamily">Option 1</Link>
    //                     </Menu.Item>
    //                     <Menu.Item key="2">
    //                         <Link to={root + "buy-tao"} className="text-decoration-none fontFamily">Option 2</Link>
    //                     </Menu.Item>
    //                 </Menu>
    //             }
    //         >
    //             <span className="text-decoration-none fontFamily">
    //                 Buy Tao <DownOutlined />
    //             </span>
    //         </Dropdown>
    //     ),
    // },
]
