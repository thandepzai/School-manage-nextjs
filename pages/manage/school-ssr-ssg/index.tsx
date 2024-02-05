import { Button, Table } from "antd";
import { SchoolType } from "@/src/types/school.type";
import { useRouter } from "next/router";
import { LIMIT } from "@/src/const/app-const";
import { GetServerSideProps, GetServerSidePropsContext } from "next";


interface IColumn {
  handleToEdit: (id: string) => void;
}
const columns = ({ handleToEdit }: IColumn) => [
  {
    title: "Name",
    dataIndex: "schoolName",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Hotline",
    dataIndex: "hotline",
  },
  {
    title: "Founding year",
    dataIndex: "dateEstablished",
  },
  {
    title: "Type",
    dataIndex: "typeOfEducation",
    render: (record: number) => {
      if (record === 1) {
        return "Tiểu học";
      }
      if (record === 2) {
        return "Trung học";
      }
      if (record === 3) {
        return "Trung học phổ thông";
      }
      if (record === 4) {
        return "Đại học";
      }
    },
  },
  {
    title: "Description",
    dataIndex: "description",
  },
  {
    title: "Action",
    key: "action",
    render: (record: SchoolType) => (
      <>
        <Button
          type="link"
          onClick={() => handleToEdit(record.id)}
          style={{ fontWeight: "bold" }}
        >
          Detail
        </Button>
      </>
    ),
  },
];

export interface SchoolManageProps {
  count: number;
  data: SchoolType[];
}

export default function SchoolManage(props: SchoolManageProps) {
  const router = useRouter();

  const schoolData = props;
  const totalSchoolsCount = schoolData.count;
  const handleToAdd = () => {
    router.push("school/add");
  };

  const handleToEdit = (id: string) => {
    router.push(`school-ssr-ssg/${id}`);
  };

  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <div style={{ width: "100%", textAlign: "center", margin: "15px 0" }}>
        <h1>List School</h1>
      </div>
      <Button
        type="primary"
        style={{ margin: "10px 5px", fontWeight: "bold" }}
        onClick={handleToAdd}
      >
        Add School
      </Button>
      <Table
        columns={columns({ handleToEdit })}
        dataSource={schoolData.data.map((item: SchoolType) => ({
          ...item,
          key: item.id,
        }))}
        pagination={{
          total: totalSchoolsCount,
          pageSize: LIMIT,
          onChange: (newPage: number) => {
            router.push(`?page=${newPage}`);
          },
        }}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const query = context.query;
  const page = Number(query.page) || 1;

  const data = await fetch(
    `http://localhost:8080/v1/school?page=${page}&pageSize=10`
  );
  let myProps = await data.json();
  console.log('render')
  return {
    props: myProps.data,
  };
};
