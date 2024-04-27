/** @format */

import { useState, useEffect } from "react";
import { Table, Select, Input, Button } from "antd";
import { useHistory, useLocation } from "react-router-dom";
const { Option } = Select;
const { Search } = Input;

const PostsTable = ({ data, pagination, onChange, tags }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const filteredPosts = data.filter(
      (post) =>
        post.title.toLowerCase().includes(searchText.toLowerCase()) ||
        post.body.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filteredPosts);
  }, [data, searchText]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => tags.join(", "),
    },
    {
      title: "Reactions",
      dataIndex: "reactions",
      key: "reactions",
    },
  ];

  const handleTagFilter = (selectedTags) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete("page");
    selectedTags.forEach((tag) => {
      queryParams.append("tag", tag);
    });
    history.push({ search: queryParams.toString() });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  return (
    <>
      <Select
        mode="multiple"
        placeholder="Select tags"
        onChange={handleTagFilter}
        style={{ width: "100%", marginBottom: "16px" }}
      >
        {tags.map((tag) => (
          <Option key={tag}>{tag}</Option>
        ))}
      </Select>
      <Search
        placeholder="Search posts"
        onChange={(e) => setSearchText(e.target.value)}
        onClick={() => handleSearch(searchText)}
        style={{ width: "100%", marginBottom: "16px" }}
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={pagination}
        onChange={onChange}
      />
    </>
  );
};

export default PostsTable;
