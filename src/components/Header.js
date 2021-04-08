import React from 'react';

const Header = props => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">          
                <div>
                    <input type="text" className="border-0 bg-transparent h3 text-white w-100" defaultValue="Covid Prevention Project" />              
                    <input type="text" className="border-0 bg-transparent h6 text-light text-truncate w-100" defaultValue="Edit Me or My Description" />
                </div>
                <div className="navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        {/* <li className="nav-item active">
                            <a className="nav-link" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Home</a>
                        </li> */}
                    </ul>
                    {props.children}
                </div>
        </nav>
    )
}

export default Header;