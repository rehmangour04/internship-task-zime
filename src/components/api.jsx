/** @format */

const api_url = "https://dummyjson.com/posts";

const fetchPosts = async (skip, limit) => {
  const response = await fetch(`${api_url}?skip=${skip}&limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const data = await response.json();
  return data.posts; // Extract the 'posts' array from the response
};

export { fetchPosts };
