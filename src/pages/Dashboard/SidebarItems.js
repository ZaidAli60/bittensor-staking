import { Link } from 'react-router-dom';
import { IoAnalyticsOutline } from "react-icons/io5"
import { MdHowToVote } from "react-icons/md"
import { AppstoreOutlined } from '@ant-design/icons';

const root = "/";

export const items = [
    { key: "home", icon: <AppstoreOutlined />, label: <Link to={root} className="text-decoration-none">Home</Link> },
    { key: "social", icon: <IoAnalyticsOutline />, label: <Link to={root + "tao-stake"} className="text-decoration-none">Stake Tao</Link> },
    { key: "vote", icon: <MdHowToVote />, label: <Link to={root + "vote"} className="text-decoration-none">Vote</Link> },
]