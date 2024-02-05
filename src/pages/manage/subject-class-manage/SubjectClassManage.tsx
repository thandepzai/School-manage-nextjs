import { useState } from "react";
import { Button, Modal, Select, Skeleton, Table, Tag } from "antd";
import { SubjectClassGetType } from "../../../types/subject-class.type";
import moment from "moment";
import { TeacherType } from "../../../types/teacher.type";
import { SubjectType } from "@/src/types/subject.type";
import { useRouter } from "next/router";
import { useManageService } from "@/src/services/manageServices";
import { LIMIT } from "@/src/const/app-const";

interface IColumn {
  handleToEdit: (id: string) => void;
  handlecChangeModal: (id: string) => void;
}
const columns = ({ handlecChangeModal, handleToEdit }: IColumn) => [
  {
    title: "Subject Name",
    dataIndex: ["subject", "subjectName"],
  },
  {
    title: "Teacher Name",
    dataIndex: "teacher",
    render: (teacher: TeacherType) =>
      `${teacher?.firstName} ${teacher?.lastName}`,
  },
  {
    title: "Level",
    dataIndex: ["subject", "level"],
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
    title: "Max Quantity",
    dataIndex: "maxQuantity",
  },
  {
    title: "Min Quantity",
    dataIndex: "minQuantity",
  },
  {
    title: "Start At",
    dataIndex: "startAt",
    render: (record: Date) => moment(record).format("YYYY-MM-DD"),
  },
  {
    title: "End At",
    dataIndex: "endAt",
    render: (record: Date) => moment(record).format("YYYY-MM-DD"),
  },
  {
    title: "Name Class",
    dataIndex: "classRoom",
  },
  {
    title: "Acaemic Year",
    dataIndex: "academicYear",
  },
  {
    title: "Status",
    dataIndex: "classStatus", //active unactivate
    render: (record: string) => (
      <Tag color={`${record === "active" ? "green" : "gray"}`}>{record}</Tag>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (record: SubjectClassGetType) => (
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

export default function SubjectClassManage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idFocus, setIdFocus] = useState("");
  const [idFilter, setIdFilter] = useState({ teacherId: "", subjectId: "" });

  const router = useRouter();
  const page = Number(router.query.page) || 1;

  const subjectClassData = useManageService(
    "subjectclass",
    "subjectsClass",
    page,
    LIMIT,
    "teacherId",
    idFilter.teacherId,
    "subjectId",
    idFilter.subjectId
  );
  const subjectsClassQuery = subjectClassData.useDataQuery();
  const totalSubjecsClassCount = subjectsClassQuery.data?.count ?? 0;
  const deleteSubjectClassMutation = subjectClassData.useDeleteDataMutation(
    idFocus,
    setIsModalOpen
  );

  const handleToAdd = () => {
    router.push("subject-class/add");
  };

  const handleToEdit = (id: string) => {
    router.push(`subject-class/${id}`);
  };

  const handlecChangeModal = (id?: string) => {
    if (!isModalOpen && id) {
      setIdFocus(id);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = () => {
    deleteSubjectClassMutation.mutate();
  };

  // Filter
  const teachersQuery = useManageService(
    "teacher",
    "teacher-select",
    1,
    1000
  ).useDataQuery();
  const subjectsQuery = useManageService(
    "subject",
    "subject-select",
    1,
    1000
  ).useDataQuery();

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <div style={{ width: "100%", textAlign: "center", margin: "15px 0" }}>
        <h1>List Subject Class</h1>
      </div>
      <Button
        type="primary"
        style={{ margin: "10px 5px", fontWeight: "bold" }}
        onClick={handleToAdd}
      >
        Add Subject Class
      </Button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <h3>Filter: </h3>
        <Select
          showSearch
          style={{ minWidth: "200px" }}
          optionFilterProp="children"
          placeholder="Select Teacher"
          onChange={(e) => {
            router.push(`?page=1`);
            setIdFilter({ ...idFilter, teacherId: e });
          }}
          filterOption={filterOption}
          options={teachersQuery.data?.data.map((children: TeacherType) => ({
            value: children.id,
            label: `${children.firstName} ${children.lastName}`,
          }))}
        />
        <Select
          showSearch
          style={{ minWidth: "200px" }}
          optionFilterProp="children"
          placeholder="Select Subject"
          onChange={(e) => {
            router.push(`?page=1`);
            setIdFilter({ ...idFilter, subjectId: e });
          }}
          filterOption={filterOption}
          options={subjectsQuery.data?.data.map((children: SubjectType) => ({
            value: children.id,
            label: children.subjectName,
          }))}
        />
        <Button
          type="primary"
          style={{ margin: "10px 5px", fontWeight: "bold" }}
          onClick={() => setIdFilter({ teacherId: "", subjectId: "" })}
        >
          Clear Seleect
        </Button>
      </div>
      {subjectsClassQuery.isLoading ? (
        <Skeleton active />
      ) : (
        <Table
          style={{ opacity: `${subjectsClassQuery.isFetching ? "0.5" : "1"}` }}
          columns={columns({ handlecChangeModal, handleToEdit })}
          dataSource={subjectsClassQuery.data?.data.map(
            (item: SubjectClassGetType) => ({
              ...item,
              key: item.id,
            })
          )}
          pagination={{
            total: totalSubjecsClassCount,
            pageSize: LIMIT,
            onChange: (newPage: number) => {
              router.push(`?page=${newPage}`);
            },
          }}
        />
      )}

      <Modal
        title="Delete SubjectClass"
        open={isModalOpen}
        onOk={handleDelete}
        confirmLoading={deleteSubjectClassMutation.isPending}
        onCancel={() => handlecChangeModal()}
      >
        <p>Are you sure you want to delete this subject-class?</p>
      </Modal>
    </div>
  );
}
