// components/Sidebar/Sidebar.tsx
import React, { useState, useContext, useEffect } from "react";
import { Menu } from "antd";
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import {
  DashboardOutlined,
  DesktopOutlined,
  FileOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./Sidebar.css";
import "./HoverMenu.css";
import { SignalRContext } from "../../helpers/SignalRProvider";
type SideBarProps = {
  sendSelectedIndex: (index: number) => void;
}
const Sidebar = (props: SideBarProps) => {

  const [selectedKey, setSelectedKey] = useState('0');
  const [isSubMenuVisible, setSubMenuVisible] = useState(false);
  const connection = useContext(SignalRContext);
  const handleMouseEnter = () => {
    setSubMenuVisible(true);
  };

  const handleMouseLeave = () => {
    setSubMenuVisible(false);
  };
  const handleMenuClick = (index: number) => {
    props.sendSelectedIndex(index);
  }
  useEffect(() => {
    const menuIndex = localStorage.getItem('menuIndex');
    setSelectedKey(menuIndex ? menuIndex : '5');
  }, [])
  return (
    <div className="sidebar">
      <div className="logo">
        <img src="./images/Logo.png" alt="Logo" />
      </div>
      <Menu
        mode="vertical"
        theme="light"
        className="menu"
      >
        <Menu.Item key='0' icon={<DashboardOutlined />}
          onClick={() => {
            localStorage.setItem('menuIndex', '0');
            handleMenuClick(0)
          }}
        >
          Dashboard
        </Menu.Item>
        {localStorage.getItem('userRole') != 'Doctor' ? 
        <>
          <Menu.Item key='1' icon={<DesktopOutlined />}
            onClick={() => {
              localStorage.setItem('menuIndex', '1');
              handleMenuClick(1)
              console.log(selectedKey)
            }}
          >
            Thiết bị
          </Menu.Item>
          <Menu.Item key="5" icon={<FileOutlined />}
            onClick={() => {
              localStorage.setItem('menuIndex', '5');
              handleMenuClick(5)
              console.log(selectedKey)
            }}
            // data-menu-id='5'
          >
            Dịch vụ
          </Menu.Item>
        </> : null}
        <Menu.Item key="6" icon={<FileOutlined />}
          onClick={() => {
            localStorage.setItem('menuIndex', '6');
            handleMenuClick(6)
            console.log(selectedKey)

          }}
        >
          Cấp số
        </Menu.Item>
        <div className="hover-container"
          onMouseOver={handleMouseEnter}
        >
          <Menu.Item key="8" icon={<SettingOutlined />} className="menu-item"
          >
            Cài đặt hệ thống
          </Menu.Item>
          {isSubMenuVisible && (
            <div className="submenu"
              onMouseOut={handleMouseLeave}
            >
              <Menu mode="vertical" theme="light" className="submenu-content">
                <Menu.Item key="7"
                  onClick={() => {
                    localStorage.setItem('menuIndex', '7');
                    handleMenuClick(7)
                  }}
                >Quản lý tài khoản</Menu.Item>
                <Menu.Item key="sub3">Nhật ký người dùng</Menu.Item>
              </Menu>
            </div>
          )}
        </div>
        <Menu.Item key="9" icon={<LogoutOutlined />}
          onClick={async () => {
            if (connection)
              if (connection.state == HubConnectionState.Connected) {
                connection.invoke("UserDisconnected", localStorage.getItem('userName'));
              }
            const userName = localStorage.getItem("userName");
            const response = await fetch(process.env.REACT_APP_API_URL + 'api/Authenticate/logout/' + userName, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" }
            });
            if (!response.ok) {
              console.error("Failed to refresh token:", response.status);
              //return false; // Return false if refreshing token fails
            }
            localStorage.clear();
            window.location.reload();
          }}
          className="logout">
          Đăng xuất
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
