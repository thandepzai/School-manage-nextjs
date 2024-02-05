import { useState } from "react";
import { Button, Input, Modal, Skeleton, Table, Tag } from "antd";
import { SearchProps } from "antd/es/input/Search";
import { TeacherType } from "../../../types/teacher.type";
import moment from "moment";
import { useRouter } from "next/router";
import { useManageService } from "@/src/services/manageServices";
import { LIMIT } from "@/src/const/app-const";

const { Search } = Input;

interface IColumn {
  handlecChangeModal: (id: string) => void;
  handleToEdit: (id: string) => void;
}
const columns = ({ handlecChangeModal, handleToEdit }: IColumn) => [
  {
    title: "Name",
    key: "name",
    render: (record: TeacherType) => `${record?.firstName} ${record?.lastName}`,
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
    title: "Year Start",
    dataIndex: "yearStartTeaching",
  },
  {
    title: "Status",
    dataIndex: "teachingStatus", //active unactivate
    render: (record: string) => (
      <Tag color={`${record === "active" ? "green" : "gray"}`}>{record}</Tag>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (record: TeacherType) => (
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

export default function TeacherManage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [idFocus, setIdFocus] = useState("");

  const router = useRouter();
  const page = Number(router.query.page) || 1;

  const teacherData = useManageService(
    "teacher",
    "teachers",
    page,
    LIMIT,
    "fullName",
    valueSearch
  );
  const teachersQuery = teacherData.useDataQuery();
  const totalTeachersCount = teachersQuery.data?.count ?? 0;
  const deleteTeacherMutation = teacherData.useDeleteDataMutation(
    idFocus,
    setIsModalOpen
  );

  const handleToAdd = () => {
    router.push("teacher/add");
  };

  const handleToEdit = (id: string) => {
    router.push(`teacher/${id}`);
  };

  const handlecChangeModal = (id?: string) => {
    if (!isModalOpen && id) {
      setIdFocus(id);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = () => {
    deleteTeacherMutation.mutate();
  };

  //Search
  const onSearch: SearchProps["onSearch"] = (value, _e) => {
    router.push(`?page=1`);
    setValueSearch(value);
  }

  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <div style={{ width: "100%", textAlign: "center", margin: "15px 0" }}>
        <h1>List Teacher</h1>
        <Search
          placeholder="Search"
          onSearch={onSearch}
          enterButton
          style={{ width: "80%", margin: "15px 0" }}
        />
      </div>
      <Button
        type="primary"
        style={{ margin: "10px 0px", fontWeight: "bold" }}
        onClick={handleToAdd}
      >
        Add Teacher
      </Button>

      {teachersQuery.isLoading ? (
        <Skeleton active />
      ) : (
        <Table
          style={{ opacity: `${teachersQuery.isFetching ? "0.5" : "1"}` }}
          columns={columns({ handlecChangeModal, handleToEdit })}
          dataSource={teachersQuery.data?.data.map((item: TeacherType) => ({
            ...item,
            key: item.id,
          }))}
          pagination={{
            total: totalTeachersCount,
            pageSize: LIMIT,
            onChange: (newPage: number) => {
              router.push(`?page=${newPage}`);
            },
          }}
        />
      )}

      <Modal
        title="Delete Teacher"
        open={isModalOpen}
        onOk={handleDelete}
        confirmLoading={deleteTeacherMutation.isPending}
        onCancel={() => handlecChangeModal()}
      >
        <p>Are you sure you want to delete this teacher?</p>
      </Modal>
    </div>
  );
}
