import { useEffect, useState } from "react";

const RestFilter = (props: any) => {
  const { title, api, filter } = props;
  const [data, setData] = useState(0);

  const onFilter = async () => {
    console.log(filter);
    if (filter) {
      const resp = await fetch(api + "?id=1&id=3", {
        method: "get",
      });
      const data = await resp.json();
      setData(data);
    } else {
      const resp = await fetch(api, {
        method: "get",
      });
      const data = await resp.json();
      setData(data);
    }
  };

  return (
    <div>
      <h4>{title} Filter</h4>
      <button onClick={onFilter}>Filter</button>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
};

const RestClientTest = (props: any) => {
  const { title } = props;
  return (
    <div>
      <h3>{title}</h3>
      <RestFilter {...props} />
    </div>
  );
};

function App() {
  return (
    <>
      <RestClientTest title="Posts" api="/api/posts" />
      <RestClientTest title="Comments" api="/api/comments" />
      <RestClientTest title="Profile" api="/api/profile" />
    </>
  );
}

export default App;
