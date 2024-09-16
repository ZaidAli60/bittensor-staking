import { Link } from 'react-router-dom';
import { BiCreditCardAlt } from "react-icons/bi"
import { AppstoreOutlined } from '@ant-design/icons';
import { InfoCircleOutlined } from "@ant-design/icons"


const root = "/";

export const data = [
    { key: "home", icon: <AppstoreOutlined />, label: <Link to={root} className="text-decoration-none fontFamily">Home</Link> },
    { key: "faq", icon: <InfoCircleOutlined />, label: <Link to={root + "faq"} className="text-decoration-none fontFamily">FAQ's</Link> },
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
