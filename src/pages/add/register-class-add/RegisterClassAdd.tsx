import { Button, Form, Select, Skeleton } from "antd";
import { useEffect } from "react";
import { useAddService } from "@/src/services/addServices";
import { useManageService } from "@/src/services/manageServices";
import { StudentType } from "@/src/types/student.type";
import { SubjectClassGetType } from "@/src/types/subject-class.type";
import { useRouter } from "next/router";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

export default function RegisterClassAdd() {
  const [form] = Form.useForm();
  const { query } = useRouter();

  let { id } = query;
  id = typeof id === "string" ? id : "";
  const isAddRegisterClassPage = id.includes("add") || id === "";
  const registerClassAddService = useAddService(
    "register_class",
    "registerClass",
    "registersClass",
    id
  );

  //Update
  const registerClassQuery = registerClassAddService.useDataDetailQuery(
    isAddRegisterClassPage
  );

  useEffect(() => {
    if (registerClassQuery.isSuccess || registerClassQuery.data) {
      form.setFieldsValue({
        ...registerClassQuery.data,
        studentId: registerClassQuery.data?.student,
        subjectClassId: registerClassQuery.data?.subjectClass,
      });
    }
  }, [registerClassQuery.data, registerClassQuery.isSuccess]);

  const updateRegisterClassMutation =
    registerClassAddService.useUpdateDataMutation(
      form,
      id,
      "/manage/register-class"
    );

  // Add
  const addRegisterClassMutation =
    registerClassAddService.useAddDataMutation(form);

  const onFinish = () => {
    if (isAddRegisterClassPage) {
      addRegisterClassMutation.mutate();
    } else {
      updateRegisterClassMutation.mutate();
    }
  };

  // Select
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
    <div>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h2>
          {isAddRegisterClassPage ? "Add RegisterClass" : "Edit RegisterClass"}
        </h2>
      </div>
      {!isAddRegisterClassPage && registerClassQuery.isLoading ? (
        <Skeleton active />
      ) : (
        <Form
          {...formItemLayout}
          variant="filled"
          style={{ maxWidth: 800, margin: "0 auto", marginTop: "10px" }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Choose Class Subject"
            name="subjectClassId"
            rules={[
              {
                required: true,
                pattern: /^\S.*$/,
                message: "Không để trống",
              },
            ]}
          >
            {!subjectsCalssQuery.isLoading && (
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: "100%" }}
                filterOption={filterOption}
                options={subjectsCalssQuery.data?.data.map(
                  (children: SubjectClassGetType) => ({
                    value: children.id,
                    label: `${children.subject.subjectName} - ${children.teacher.firstName} ${children.teacher.lastName}`,
                  })
                )}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Choose Student"
            name="studentId"
            rules={[
              {
                required: true,
                pattern: /^\S.*$/,
                message: "Không để trống",
              },
            ]}
          >
            {!studentsQuery.isLoading && (
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: "100%" }}
                filterOption={filterOption}
                options={studentsQuery.data?.data.map(
                  (children: StudentType) => ({
                    value: children.id,
                    label: `${children.firstName} ${children.lastName}`,
                  })
                )}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">InActive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={
                isAddRegisterClassPage
                  ? addRegisterClassMutation.isPending
                  : updateRegisterClassMutation.isPending
              }
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
