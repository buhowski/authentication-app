import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./App.css";

const accessKey = "e2t7y8D9c1lJdoCzaZ5fsrX3UF0BFEq6XP0IGNPbTa0";
// const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export default function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getPhotos();
  }, [page]);

  function getPhotos() {
    let apiUrl = `https://api.unsplash.com/photos?`;
    if (query) apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;
    apiUrl += `&page=${page}`;
    apiUrl += `&client_id=${accessKey}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const imagesFromApi = data.results ?? data;

        // if page is 1, then we need a new array of images
        if (page === 1) setImages(imagesFromApi);

        // if page > 1, then we are adding for our infinite scroll
        setImages((images) => [...images, ...imagesFromApi]);
      });
  }

  function searchPhotos(e) {
    e.preventDefault();
    setPage(1);
    getPhotos();
  }

  // return an error if there is no access key
  if (!accessKey) {
    return (
      <a href="https://unsplash.com/developers" className="error">
        Required: Get Your Unsplash API Key First
      </a>
    );
  }
  return (
    <div className="app">
      <h1>Image Gallery</h1>

      <form onSubmit={searchPhotos}>
        <input
          type="text"
          placeholder="search ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>Search</button>
      </form>
      <InfiniteScroll
        dataLength={images.length} //This is important field to render the next data
        next={() => setPage((page) => page + 1)}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <div className="image-grid">
          {images.map((image, index) => (
            <a
              className="image"
              key={index}
              href={image.links.html}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={image.urls.regular} alt={image.alt_description} />
            </a>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
