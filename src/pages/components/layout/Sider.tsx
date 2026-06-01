import React, { useRef } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@arco-design/web-react";
import ScriptList from "@App/pages/options/routes/ScriptList";
import ScriptEditor from "@App/pages/options/routes/script/ScriptEditor";
import SubscribeList from "@App/pages/options/routes/SubscribeList";
import Logger from "@App/pages/options/routes/Logger";
import Tools from "@App/pages/options/routes/Tools";
import Setting from "@App/pages/options/routes/Setting";
import JoinVIP from "@App/pages/options/routes/JoinVIP";
import VIPShop from "@App/pages/options/routes/VIPShop";
import AboutDeveloper from "@App/pages/options/routes/AboutDeveloper";
import SiderGuide from "./SiderGuide";

const Sider: React.FC = () => {
  const guideRef = useRef<{ open: () => void }>(null);

  return (
    <>
      <SiderGuide ref={guideRef} />
      <Layout.Content
        style={{
          padding: 0,
          height: "auto",
          boxSizing: "border-box",
          position: "relative",
          width: "100%",
        }}
      >
        <div className="tw-absolute sc-inset-0 tw-m-[10px]">
          <Routes>
            <Route index element={<ScriptList />} />
            <Route path="/script/editor">
              <Route path=":uuid" element={<ScriptEditor />} />
              <Route path="" element={<ScriptEditor />} />
            </Route>
            <Route path="/subscribe" element={<SubscribeList />} />
            <Route path="/logger" element={<Logger />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/vip" element={<JoinVIP />} />
            <Route path="/shop" element={<VIPShop />} />
            <Route path="/developer" element={<AboutDeveloper />} />
          </Routes>
        </div>
      </Layout.Content>
    </>
  );
};

export default Sider;
