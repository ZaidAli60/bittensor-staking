import { Link } from 'react-router-dom';
import { AppstoreOutlined, BarChartOutlined, CommentOutlined, TransactionOutlined, ToolOutlined, UserOutlined, SettingOutlined, InboxOutlined, PlusSquareOutlined, RiseOutlined, StarOutlined } from '@ant-design/icons';
// import { FAIcon } from 'components/FAIcon'
import { FaUserFriends } from "react-icons/fa"

const root = "/dashboard";

export const items = [
    { key: "home", icon: <AppstoreOutlined />, label: <Link to={root} className="text-decoration-none">Home</Link> },
    { key: "social", icon: <CommentOutlined />, label: <Link to={root + "/social"} className="text-decoration-none">Stake Tao</Link> },
    { key: "vote", icon: <CommentOutlined />, label: <Link to={root + "/vote"} className="text-decoration-none">Vote</Link> },
    // {
    //     key: "leads", icon: <RiseOutlined />, label: "Leads",
    //     children: [
    //         { key: "leads-0", icon: <RiseOutlined />, label: <Link to={root + "/leads"} className="text-decoration-none">Leads Home</Link> },
    //         { key: "leads-1", icon: <RiseOutlined />, label: <Link to={root + "/leads/induction-orms"} className="text-decoration-none">Induction Forms</Link> },
    //     ]
    // },
    // {
    //     key: "transactions", icon: <TransactionOutlined />, label: "Transactions",
    //     children: [
    //         { key: "transactions-0", icon: <TransactionOutlined />, label: <Link to={root + "/transactions"} className="text-decoration-none">Main Transactions</Link> },
    //         { key: "transactions-1", icon: <PlusSquareOutlined />, label: <Link to={root + "/transactions"} className="text-decoration-none">Create Transaction</Link> },
    //         // { key: "transactions-2", icon: <FAIcon className="fa-solid fa-wand-magic-sparkles" />, label: <Link to={root + "/templates"} className="text-decoration-none">Templates/Checklists</Link> },
    //         { key: "transactions-3", icon: <InboxOutlined />, label: <Link to={root + "/transactions/archives"} className="text-decoration-none">Archives</Link> },
    //     ]
    // },
    // // { label: <Link to={root + "/transactions"} className="text-decoration-none">Transactions</Link>, key: "transactions", icon: <TransactionOutlined /> },
    // // { label: <Link to={root + "/templates"} className="text-decoration-none">Templates</Link>, key: "templates", icon: <FAIcon className="fa-solid fa-wand-magic-sparkles" /> },
    // { key: "collaborations", icon: <FaUserFriends />, label: <Link to={root + "/collaborations"} className="text-decoration-none">Collaborations</Link> },
    // {
    //     key: "assign", icon: <StarOutlined />, label: "Assign",
    //     children: [
    //         { key: "assign-0", icon: <StarOutlined />, label: <Link to={root + "/tasks-and-appointments"} className="text-decoration-none">Tasks & Appointments</Link> },
    //     ]
    // },
    // { key: "compliance", icon: <CommentOutlined />, label: <Link to={root + "/compliance"} className="text-decoration-none">Compliance</Link> },
    // { key: "growth", icon: <BarChartOutlined />, label: <Link to={root + "/growth"} className="text-decoration-none">Growth Dash</Link> },
    // {
    //     key: "tools", icon: <ToolOutlined />, label: "Tools",
    //     children: [
    //         { key: "tools-0", icon: <ToolOutlined />, label: <Link to={root + "/tools"} className="text-decoration-none">PDF Editor</Link> },
    //         { key: "tools-1", icon: <ToolOutlined />, label: <Link to={root + "/tools"} className="text-decoration-none">PivottPresents</Link> },
    //         { key: "tools-2", icon: <ToolOutlined />, label: <Link to={root + "/tools"} className="text-decoration-none">Calculators</Link> },
    //     ]
    // },
    // // { label: <Link to={root + "/tools"} className="text-decoration-none">Tools</Link>, key: "tools", icon: <ToolOutlined /> },
    // { key: "settings", icon: <SettingOutlined />, label: <Link to={root + "/settings"} className="text-decoration-none">Settings</Link> },
    // { key: "refer-friend", icon: <UserOutlined />, label: <Link to={root + "/refer-friend"} className="text-decoration-none">Refer a Friend</Link> },
]