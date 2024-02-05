import React, { useState } from "react";
import { SiSololearn } from "react-icons/si";
import { FaSchool } from "react-icons/fa6";
import { PiStudentBold, PiChalkboardTeacherFill } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { FaBook } from "react-icons/fa";
import { GiArchiveRegister } from "react-icons/gi";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    <Link href="/manage/school" style={{ fontWeight: "bold" }}>
      School Manage
    </Link>,
    "1",
    <FaSchool />
  ),
  getItem(
    <Link href="/manage/teacher" style={{ fontWeight: "bold" }}>
      Teacher Manage
    </Link>,
    "2",
    <PiChalkboardTeacherFill />
  ),
  getItem(
    <Link href="/manage/student" style={{ fontWeight: "bold" }}>
      Student Manage
    </Link>,
    "3",
    <PiStudentBold />
  ),
  getItem(
    <Link href="/manage/subject" style={{ fontWeight: "bold" }}>
      Subject Manage
    </Link>,
    "4",
    <FaBook />
  ),
  getItem(
    <Link href="/manage/subject-class" style={{ fontWeight: "bold" }}>
      Subject Class Manage
    </Link>,
    "5",
    <SiGoogleclassroom />
  ),
  getItem(
    <Link href="/manage/register-class" style={{ fontWeight: "bold" }}>
      Register Class Manage
    </Link>,
    "6",
    <GiArchiveRegister />
  ),
  getItem(
    <Link href="/manage/school-ssr-ssg" style={{ fontWeight: "bold" }}>
      School SSR & SSG
    </Link>,
    "7",
    <GiArchiveRegister />
  ),
  getItem(
    <Link href="/manage/school-isr-initial" style={{ fontWeight: "bold" }}>
      School ISR Initial
    </Link>,
    "8",
    <GiArchiveRegister />
  ),
];

interface layoutInterface {
  children: React.ReactNode;
}

const getDefaultSelectKey = (pathname: string) => {
  switch (true) {
    case pathname.includes("school-ssr"):
      return "7";
    case pathname.includes("school-isr-initial"):
      return "8";
    case pathname.includes("school"):
      return "1";
    case pathname.includes("teacher"):
      return "2";
    case pathname.includes("student"):
      return "3";
    case pathname.includes("subject-class"):
      return "5";
    case pathname.includes("subject"):
      return "4";
    case pathname.includes("register-class"):
      return "6";
    default:
      return "1";
  }
};

export default function MainLayout({ children }: layoutInterface) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  let { pathname, query } = useRouter();
  const { id } = query;
  const listPage = pathname.split("/");

  let linkPage = "";
  const itemNamePage = listPage.map((item, key) => {
    if (key !== 0) {
      const titleValue = item !== "[id]" ? item : id;
      linkPage = linkPage + "/" + titleValue;
      return {
        title: <Link href={linkPage}>{titleValue}</Link>,
      };
    }
    return {
      title: "",
    };
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            color: "white",
            display: "flex",
            margin: "20px 0px",
            justifyContent: "space-evenly",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          <SiSololearn />
          {!collapsed && "Admin School"}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[getDefaultSelectKey(pathname)]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <div
          style={{
            background: colorBgContainer,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <Breadcrumb items={itemNamePage} />
        </div>
        <Content
          style={{
            margin: "16px",
            height: "100%",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
