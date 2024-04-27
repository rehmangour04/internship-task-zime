/** @format */

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { fetchPosts } from "./components/api";
import PostsTable from "./components/PostsTable";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tags, setTags] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const skip = parseInt(queryParams.get("skip") || 0);
    const limit = 10;

    fetchPosts(skip, limit)
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
          setPagination({
            total: data.length, // Assuming the total count is available
            pageSize: limit,
            current: Math.floor(skip / limit) + 1,
          });

          const allTags = data.reduce((acc, post) => {
            post.tags.forEach((tag) => {
              if (!acc.includes(tag)) {
                acc.push(tag);
              }
            });
            return acc;
          }, []);
          setTags(allTags);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) => console.error(error));
  }, [location.search]);

  const handleTableChange = (pagination, filters, sorter) => {
    const skip = (pagination.current - 1) * pagination.pageSize;
    const limit = pagination.pageSize;

    // Update URL
    const searchParams = new URLSearchParams({
      ...queryParams,
      skip: skip,
      limit: limit,
    });

    window.history.pushState({}, "", `/?${searchParams}`);

    fetchPosts(skip, limit)
      .then((data) => {
        setPosts(data);
        setPagination(pagination);
      })
      .catch((error) => console.error(error));
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredPosts = posts.filter((post) =>
      post.body.toLowerCase().includes(value.toLowerCase())
    );
    setPosts(filteredPosts);
  };

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-4">Zime Task</h1>
      <PostsTable
        data={posts}
        pagination={pagination}
        onChange={handleTableChange}
        tags={tags}
        searchText={searchText}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default App;
