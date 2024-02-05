import { useState } from "react";
import { Button, Modal, Select, Skeleton, Table } from "antd";
import { RegisterClassGetType } from "../../../types/register-class.type";
import { TeacherType } from "../../../types/teacher.type";
import { StudentType } from "../../../types/student.type";
import { useManageService } from "@/src/services/manageServices";
import { useRouter } from "next/router";
import { LIMIT } from "@/src/const/app-const";
import { SubjectClassGetType } from "@/src/types/subject-class.type";

interface IColumn {
  handleToEdit: (id: string) => void;
  handlecChangeModal: (id: string) => void;
}
const columns = ({ handlecChangeModal, handleToEdit }: IColumn) => [
  {
    title: "Student Name",
    dataIndex: ["student"],
    render: (studentId: StudentType) =>
      `${studentId?.firstName} ${studentId?.lastName}`,
  },
  {
    title: "Subject Name",
    dataIndex: ["subjectClass", "subject", "subjectName"],
  },
  {
    title: "Teacher Name",
    dataIndex: ["subjectClass", "teacher"],
    render: (teacher: TeacherType) =>
      `${teacher?.firstName} ${teacher?.lastName}`,
  },
  {
    title: "Action",
    key: "action",
    render: (record: RegisterClassGetType) => (
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

export default function RegisterClassManage() {
  const [idFocus, setIdFocus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idFilter, setIdFilter] = useState({
    studentId: "",
    subjectClassId: "",
  });

  const router = useRouter();
  const page = Number(router.query.page) || 1;

  const registerClassData = useManageService(
    "register_class",
    "registersClass",
    page,
    LIMIT,
    "studentId",
    idFilter.studentId,
    "subjectClassId",
    idFilter.subjectClassId
  );
  const registersClassQuery = registerClassData.useDataQuery();
  const totalRegistersClassCount = registersClassQuery.data?.count ?? 0;
  const deleteRegisterClassMutation = registerClassData.useDeleteDataMutation(
    idFocus,
    setIsModalOpen
  );

  const handleToAdd = () => {
    router.push("register-class/add");
  };

  const handleToEdit = (id: string) => {
    router.push(`register-class/${id}`);
  };

  const handlecChangeModal = (id?: string) => {
    if (!isModalOpen && id) {
      setIdFocus(id);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = () => {
    deleteRegisterClassMutation.mutate();
  };

  // Filter
  const studentsQuery = useManageService(
    "student",
    "student-select",
    1,
    1000
  ).useDataQuery();
  const subjectsCalssQuery = useManageService(
    "subjectclass",
    "subjectsclass-select",
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
        <h1>List Register Class</h1>
      </div>
      <Button
        type="primary"
        style={{ margin: "10px 5px", fontWeight: "bold" }}
        onClick={handleToAdd}
      >
        Add Register Class
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
          placeholder="Select Students"
          onChange={(e) => {
            router.push(`?page=1`);
            setIdFilter({ ...idFilter, studentId: e });
          }}
          filterOption={filterOption}
          options={studentsQuery.data?.data.map((children: StudentType) => ({
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
            setIdFilter({ ...idFilter, subjectClassId: e });
          }}
          filterOption={filterOption}
          options={subjectsCalssQuery.data?.data.map(
            (children: SubjectClassGetType) => ({
              value: children.id,
              label: `${children.subject.subjectName} - ${children.teacher.firstName} ${children.teacher.lastName}`,
            })
          )}
        />
        <Button
          type="primary"
          style={{ margin: "10px 5px", fontWeight: "bold" }}
          onClick={() => setIdFilter({ studentId: "", subjectClassId: "" })}
        >
          Clear Seleect
        </Button>
      </div>
      {registersClassQuery.isLoading ? (
        <Skeleton active />
      ) : (
        <Table
          style={{ opacity: `${registersClassQuery.isFetching ? "0.5" : "1"}` }}
          columns={columns({ handlecChangeModal, handleToEdit })}
          dataSource={registersClassQuery.data?.data.map(
            (item: RegisterClassGetType) => ({
              ...item,
              key: item.id,
            })
          )}
          pagination={{
            total: totalRegistersClassCount,
            pageSize: LIMIT,
            onChange: (newPage: number) => {
              router.push(`?page=${newPage}`);
            },
          }}
        />
      )}

      <Modal
        title="Delete RegisterClass"
        open={isModalOpen}
        onOk={handleDelete}
        confirmLoading={deleteRegisterClassMutation.isPending}
        onCancel={() => handlecChangeModal()}
      >
        <p>Are you sure you want to delete this register-class?</p>
      </Modal>
    </div>
  );
}
