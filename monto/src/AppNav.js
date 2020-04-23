import React, { Component } from "react";
import { Nav, Navbar, NavbarBrand, NavItem, NavLink, UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from "reactstrap";
import { inject, observer } from "mobx-react";
import image from "./images/user.png"

class AppNav extends Component {
  state = {};

  render() {
    return (
      <div>
        <Navbar className="navbar-light bg-light" expand="md">
          <NavbarBrand href="/">Monto</NavbarBrand>
          <Nav className="ml-auto" navbar>
            {this.props.auth.authenticated ? (
                <>
                  <NavItem>
                    <NavLink href="/dashboard">Dashboard</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="/transactions">Transactions</NavLink>
                  </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                <img src={image}  height="25" width="25" alt="Options"/>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <NavLink href="/settings">
                    Settings
                  </NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink href="/" onClick={this.props.auth.logout}>
                    Logout
                  </NavLink>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
                </>) : (
                <>
                <NavItem>
                  <NavLink href="/">Home</NavLink>
                </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      <img src={image}  height="25" width="25" alt="Options"/>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        <NavLink href="/login">Log In</NavLink>
                      </DropdownItem>
                      <DropdownItem>
                        <NavLink href="/register">Sign Up</NavLink>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </>)}
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default inject("auth")(observer(AppNav));
