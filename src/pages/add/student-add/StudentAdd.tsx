import { Button, DatePicker, Form, Input, Select, Skeleton } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAddService } from "@/src/services/addServices";
import moment from "moment";
import { useManageService } from "@/src/services/manageServices";
import { SchoolType } from "@/src/types/school.type";

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

export default function StudentAdd() {
  const [form] = Form.useForm();
  const { query } = useRouter();

  let { id } = query;
  id = typeof id === "string" ? id : "";
  const isAddStudentPage = id.includes("add") || id === "";
  const studentAddService = useAddService("student", "student", "students", id);

  // Update
  const studentQuery = studentAddService.useDataDetailQuery(isAddStudentPage);

  useEffect(() => {
    if (studentQuery.isSuccess || studentQuery.data) {
      form.setFieldsValue({
        ...studentQuery.data,
        dateOfBirth: moment(studentQuery.data?.dateOfBirth),
        schoolId: studentQuery.data?.school?.id
      });
    }
  }, [studentQuery.data, studentQuery.isSuccess]);

  const updateStudentMutation = studentAddService.useUpdateDataMutation(
    form,
    id,
    "/manage/student"
  );

  // Add
  const addStudentMutation = studentAddService.useAddDataMutation(form);

  const onFinish = () => {
    if (isAddStudentPage) {
      addStudentMutation.mutate();
    } else {
      updateStudentMutation.mutate();
    }
  };

  const schoolsQuery = useManageService(
    "school",
    "school-select",
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
        <h2>{isAddStudentPage ? "Add Student" : "Edit Student"}</h2>
      </div>
      {!isAddStudentPage && studentQuery.isLoading ? (
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
            label="First Name"
            name="firstName"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
              { type: "email", message: "Invalid email address" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
              {
                pattern: /^(\+84|0[3|5|7|8|9])+([0-9]{7,13})\b/,
                message: "Invalid phone number format",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date of birth"
            name="dateOfBirth"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Select>
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="enrollmentStatus"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">InActive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="School"
            name="schoolId"
            rules={[
              {
                required: true,
                pattern: /^\S.*$/,
                message: "Không để trống",
              },
            ]}
          >
            {!schoolsQuery.isLoading && (
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: "100%", marginBottom: "10px" }}
                filterOption={filterOption}
                options={schoolsQuery.data?.data.map(
                  (children: SchoolType) => ({
                    value: children.id,
                    label: children.schoolName,
                  })
                )}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Level"
            name="level"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Không để trống" },
            ]}
          >
            <Select>
              <Select.Option value={1}>Tiểu học</Select.Option>
              <Select.Option value={2}>Trung học</Select.Option>
              <Select.Option value={3}>Trung học phổ thông</Select.Option>
              <Select.Option value={4}>Đại học</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={
                isAddStudentPage
                  ? addStudentMutation.isPending
                  : updateStudentMutation.isPending
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
