import { useState } from "react";
import { Button, Input, Modal, Skeleton, Table, Tag } from "antd";
import { SearchProps } from "antd/es/input/Search";
import { StudentType } from "../../../types/student.type";
import moment from "moment";
import { LIMIT } from "@/src/const/app-const";
import { useRouter } from "next/router";
import { useManageService } from "@/src/services/manageServices";

const { Search } = Input;

interface IColumn {
  handleToEdit: (id: string) => void;
  handlecChangeModal: (id: string) => void;
}
const columns = ({ handlecChangeModal, handleToEdit }: IColumn) => [
  {
    title: "Name",
    key: "name",
    render: (record: StudentType) => `${record?.firstName} ${record?.lastName}`,
  },
  {
    title: "Gender",
    dataIndex: "gender",
  },
  {
    title: "Date of Birth",
    dataIndex: "dateOfBirth",
    render: (record: Date) => moment(record).format("YYYY-MM-DD"),
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
    title: "Phone",
    dataIndex: "phone",
  },
  {
    title: "Level",
    dataIndex: "level",
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
    title: "Status",
    dataIndex: "enrollmentStatus", //active unactivate
    render: (record: string) => (
      <Tag color={`${record === "active" ? "green" : "gray"}`}>{record}</Tag>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (record: StudentType) => (
      <>
        <Button
          type="link"
          onClick={() => handleToEdit(record.id)}
          style={{ fontWeight: "bold" }}
        >
          Edit
        </Button>
        <Button
          type="link"
          onClick={() => handlecChangeModal(record.id)}
          style={{ fontWeight: "bold" }}
          danger
        >
          Delete
        </Button>
      </>
    ),
  },
];

export default function StudentManage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [idFocus, setIdFocus] = useState("");

  const router = useRouter();
  const page = Number(router.query.page) || 1;

  const studentData = useManageService(
    "student",
    "students",
    page,
    LIMIT,
    "fullName",
    valueSearch
  );
  const studentsQuery = studentData.useDataQuery();
  const totalStudentsCount = studentsQuery.data?.count ?? 0;
  const deleteStudentMutation = studentData.useDeleteDataMutation(
    idFocus,
    setIsModalOpen
  );

  const onSearch: SearchProps["onSearch"] = (value, _e) =>{
    router.push(`?page=1`);
    setValueSearch(value);
  }
  const handleToAdd = () => {
    router.push("student/add");
  };

  const handleToEdit = (id: string) => {
    router.push(`student/${id}`);
  };

  const handlecChangeModal = (id?: string) => {
    if (!isModalOpen && id) {
      setIdFocus(id);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = () => {
    deleteStudentMutation.mutate();
  };

  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <div style={{ width: "100%", textAlign: "center", margin: "15px 0" }}>
        <h1>List Student</h1>
        <Search
          placeholder="Search"
          onSearch={onSearch}
          enterButton
          style={{ width: "80%", margin: "15px 0" }}
        />
      </div>
      <Button
        type="primary"
        style={{ margin: "10px 5px", fontWeight: "bold" }}
        onClick={handleToAdd}
      >
        Add Student
      </Button>
      {studentsQuery.isLoading ? (
        <Skeleton active />
      ) : (
        <Table
          style={{ opacity: `${studentsQuery.isFetching ? "0.5" : "1"}` }}
          columns={columns({ handlecChangeModal, handleToEdit })}
          dataSource={studentsQuery.data?.data.map((item: StudentType) => ({
            ...item,
            key: item.id,
          }))}
          pagination={{
            total: totalStudentsCount,
            pageSize: LIMIT,
            onChange: (newPage: number) => {
              router.push(`?page=${newPage}`);
            },
          }}
        />
      )}

      <Modal
        title="Delete Student"
        open={isModalOpen}
        onOk={handleDelete}
        confirmLoading={deleteStudentMutation.isPending}
        onCancel={() => handlecChangeModal()}
      >
        <p>Are you sure you want to delete this student?</p>
      </Modal>
    </div>
  );
}
