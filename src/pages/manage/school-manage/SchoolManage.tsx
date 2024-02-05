import { useState } from "react";
import { Button, Modal, Skeleton, Table, Input } from "antd";
import { SchoolType } from "../../../types/school.type";
import { useRouter } from "next/router";
import { SearchProps } from "antd/es/input";
import { LIMIT } from "@/src/const/app-const";
import { useManageService } from "../../../services/manageServices";

const { Search } = Input;

interface IColumn {
  handleToEdit: (id: string) => void;
  handlecChangeModal: (id: string) => void;
}
const columns = ({ handlecChangeModal, handleToEdit }: IColumn) => [
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

export default function SchoolManage() {
  const [idFocus, setIdFocus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valueSearch, setValueSearch] = useState("");

  const router = useRouter();
  const page = Number(router.query.page) || 1;

  const schoolData = useManageService(
    "school",
    "schools",
    page,
    LIMIT,
    "schoolName",
    valueSearch
  );
  const schoolsQuery = schoolData.useDataQuery();
  const totalSchoolsCount = schoolsQuery.data?.count ?? 0;
  const deleteSchoolMutation = schoolData.useDeleteDataMutation(
    idFocus,
    setIsModalOpen
  );

  const onSearch: SearchProps["onSearch"] = (value, _e) => {
    router.push(`?page=1`);
    setValueSearch(value);
  };

  const handleToAdd = () => {
    router.push("school/add");
  };

  const handleToEdit = (id: string) => {
    router.push(`school/${id}`);
  };

  const handlecChangeModal = (id?: string) => {
    if (!isModalOpen && id) {
      setIdFocus(id);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = () => {
    deleteSchoolMutation.mutate();
  };

  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <div style={{ width: "100%", textAlign: "center", margin: "15px 0" }}>
        <h1>List School</h1>
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
        Add School
      </Button>
      {schoolsQuery.isLoading ? (
        <Skeleton active />
      ) : (
        <Table
          style={{ opacity: `${schoolsQuery.isFetching ? "0.5" : "1"}` }}
          columns={columns({ handlecChangeModal, handleToEdit })}
          dataSource={schoolsQuery.data?.data.map((item: SchoolType) => ({
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
      )}

      <Modal
        title="Delete School"
        open={isModalOpen}
        onOk={handleDelete}
        confirmLoading={deleteSchoolMutation.isPending}
        onCancel={() => handlecChangeModal()}
      >
        <p>Are you sure you want to delete this school?</p>
      </Modal>
    </div>
  );
}
