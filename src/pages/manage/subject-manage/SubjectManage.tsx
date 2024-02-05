import { useState } from "react";
import { Button, Input, Modal, Skeleton, Table } from "antd";
import { SearchProps } from "antd/es/input/Search";
import { SubjectType } from "../../../types/subject.type";
import { useRouter } from "next/router";
import { LIMIT } from "@/src/const/app-const";
import { useManageService } from "@/src/services/manageServices";

const { Search } = Input;

interface IColumn {
  handleToEdit: (id: string) => void;
  handlecChangeModal: (id: string) => void;
}
const columns = ({ handlecChangeModal, handleToEdit }: IColumn) => [
  {
    title: "Name",
    dataIndex: "subjectName",
  },
  {
    title: "Credit Hours",
    dataIndex: "creditHour",
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
    title: "Action",
    key: "action",
    render: (record: SubjectType) => (
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

export default function SubjectManage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [idFocus, setIdFocus] = useState("");

  const router = useRouter();
  const page = Number(router.query.page) || 1;

  const subjectData = useManageService(
    "subject",
    "subjects",
    page,
    LIMIT,
    "subjectName",
    valueSearch
  );
  const subjectsQuery = subjectData.useDataQuery();
  const totalSubjectsCount = subjectsQuery.data?.count ?? 0;
  const deleteSubjectMutation = subjectData.useDeleteDataMutation(
    idFocus,
    setIsModalOpen
  );

  const onSearch: SearchProps["onSearch"] = (value, _e) => {
    router.push(`?page=1`);
    setValueSearch(value);
  }

  const handleToAdd = () => {
    router.push("subject/add");
  };

  const handleToEdit = (id: string) => {
    router.push(`subject/${id}`);
  };

  const handlecChangeModal = (id?: string) => {
    if (!isModalOpen && id) {
      setIdFocus(id);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = () => {
    deleteSubjectMutation.mutate();
  };

  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <div style={{ width: "100%", textAlign: "center", margin: "15px 0" }}>
        <h1>List Subject</h1>
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
        Add Subject
      </Button>
      {subjectsQuery.isLoading ? (
        <Skeleton active />
      ) : (
        <Table
          style={{ opacity: `${subjectsQuery.isFetching ? "0.5" : "1"}` }}
          columns={columns({ handlecChangeModal, handleToEdit })}
          dataSource={subjectsQuery.data?.data.map((item: SubjectType) => ({
            ...item,
            key: item.id,
          }))}
          pagination={{
            total: totalSubjectsCount,
            pageSize: LIMIT,
            onChange: (newPage: number) => {
              router.push(`?page=${newPage}`);
            },
          }}
        />
      )}

      <Modal
        title="Delete Subject"
        open={isModalOpen}
        onOk={handleDelete}
        confirmLoading={deleteSubjectMutation.isPending}
        onCancel={() => handlecChangeModal()}
      >
        <p>Are you sure you want to delete this subject?</p>
      </Modal>
    </div>
  );
}
