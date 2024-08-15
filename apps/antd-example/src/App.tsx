import { Flex, Space } from "antd";

import "./App.css";

function App() {
  return (
    // antd does not support polymorphism
    <Flex>
      <Space direction="horizontal"></Space>
    </Flex>
  );
}

export default App;
