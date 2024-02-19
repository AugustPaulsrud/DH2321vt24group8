import { Link, useMatch, useResolvedPath } from "react-router-dom";

// Navbar Functional Component
export default function Navbar() {
    return (
        <nav className="nav">
            <Link to="/Home" className="site-title">DH2321 - Group 8</Link>
            <ul>
                <CustomLink to="/Home">Home</CustomLink>
                <CustomLink to="/Visuals">Visuals</CustomLink>
            </ul>
        </nav>
    )
}

interface CustomLinkProps {
    to: string;
    children: React.ReactNode;
    [key: string]: any;
}

const CustomLink: React.FC<CustomLinkProps> = ({ to, children, ...props }) => {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        // If Active, add "active" class to highlight the link
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>{children}</Link>
        </li>
    );
};