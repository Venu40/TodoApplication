import "./App.css";
import { useDebugValue, useEffect, useState } from "react";
import {
  Button,
  Modal,
  Table,
  Select,
  Input,
  DatePicker,
  Form,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import ButtonGroup from "antd/es/button/button-group";
function App() {
  useEffect(() => {
    fetch("https://my-json-server.typicode.com/venu40/FakeTodoAPI/todo")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSource(data);
      });
  }, []);
  const [source, setSource] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form] = Form.useForm();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchedText, setSeachedText] = useState("");
  const columns = [
    {
      title: "TimeStamp",
      dataIndex: "timestampCreated",
      key: "timestampCreated",
      sorter: (a, b) => {
        return new Date(a.timestampCreated) < new Date(b.timestampCreated)
          ? -1
          : 1;
      },
      render: (text, record) => {
        if (editRow === record.key) {
          return (
            <Form.Item name="timestampCreated">
              <Input value={record.timestampCreated}></Input>
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",

      sorter: (a, b) => (a.title > b.title ? 1 : -1),

      render: (text, record) => {
        if (editRow === record.key) {
          return (
            <Form.Item name="title">
              <Input></Input>
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",

      sorter: (a, b) => (a.description > b.description ? 1 : -1),
      render: (text, record) => {
        if (editRow === record.key) {
          return (
            <Form.Item name="description">
              <Input></Input>
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      // filteredValue: null,
      sortDirections: ["ascend", "descend"],
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        return new Date(a.dueDate) < new Date(b.dueDate) ? -1 : 1;
      },
      render: (text, record) => {
        if (editRow === record.key) {
          return (
            <Form.Item name="dueDate">
              <Input></Input>
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      filters: [
        {
          text: "Tag1",
          value: "Tag1",
        },
        {
          text: "Tag2",
          value: "Tag2",
        },
      ],

      onFilter: (value, record) => record.tags.indexOf(value) > -1,
      render: (text, record) => {
        if (editRow === record.key) {
          return (
            <Form.Item name="tags">
              <Input></Input>
            </Form.Item>
          );
        } else {
          return text.map((tag, i) => {
            console.log(tag);
            return (
              <Tag key={i} closable>
                {tag}
              </Tag>
            );
          });

          // return <p>{text}</p>;
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      //  filteredValue: "status" | null,
      // filteredValue: searchedText,
      filters: [
        {
          text: "open",
          value: "open",
        },
        {
          text: "closed",
          value: "closed",
        },
      ],

      onFilter: (value, record) => {
        // searchedText(value);
        console.log(value, record.status);
        return record.status === value;
      },

      render: (text, record) => {
        if (editRow === record.key) {
          return (
            <Form.Item name="status">
              <Input></Input>
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Actions",
      render: (_, record) => {
        return (
          <>
            <Button
              onClick={() => {
                setEditRow(record.key);
                form.setFieldsValue({
                  title: record.title,
                  description: record.description,
                  timestampCreated: record.timestampCreated,
                  dueDate: record.dueDate,
                  tags: record.tags,
                  status: record.status,
                });
              }}
            >
              Edit
            </Button>
            <Button type="link" htmlType="submit">
              Save
            </Button>
            <Button
              onClick={() => {
                onDelete(record);
              }}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  const status = ["open", "closed", "overdue"];

  function handler() {
    setFormOpen(true);
  }
  function onSubmit(e) {
    console.log(e);
    fetch("https://my-json-server.typicode.com/venu40/FakeTodoAPI/todo", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(e),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSource(data);
      });
    setFormOpen(false);
  }

  function onFinish(values) {
    if (editRow == null) return;
    console.log(values);
    const updated = [...source];
    console.log(values);
    console.log(editRow);
    updated.splice(editRow - 1, 1, { ...values, key: editRow });
    console.log(updated);
    setSource(updated);
    setEditRow(null);
  }

  function onDelete(record) {
    console.log(record.target);

    Modal.confirm({
      title: "Do you want to delete this Record?",
      onOk: () => {
        setSource((pre) =>
          pre.filter((item) => {
            console.log(item.key, record.key);
            return item.key !== record.key;
          })
        );
      },
    });

    console.log(source);
  }
  return (
    <div className="App">
      <h1>Todo List</h1>
      <Input.Search
        placeholder="search here"
        onSearch={(value) => {
          setSeachedText(value);
        }}
        onChange={(e) => setSeachedText(e.target.value)}
      ></Input.Search>
      <Button onClick={handler}>Add a new Todo</Button>

      {formOpen && (
        <Form className="form" onFinish={onSubmit}>
          <Form.Item name="title">
            <Input placeholder="title" maxLength={10}></Input>
          </Form.Item>
          <Form.Item name="description">
            <Input placeholder="description" maxLength={10}></Input>
          </Form.Item>
          <Form.Item name="tags">
            <Input placeholder="tags" maxLength={10}></Input>
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="status">
              {status.map((state, i) => {
                return (
                  <Select.Option key={i} value={state}>
                    {state}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="dueDate">
            <DatePicker placeholder="DueDate" picker="day"></DatePicker>
          </Form.Item>
          <br></br>

          <Input type="submit"></Input>
        </Form>
      )}
      <Form form={form} onFinish={onFinish}>
        <Table columns={columns} dataSource={source}></Table>
      </Form>
    </div>
  );
}

export default App;
