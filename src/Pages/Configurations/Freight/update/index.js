import React, { useState } from "react";
import { FreightProvider } from "./FreightContext";
import { FreightUpdate } from "./FreightUpdate";
import { LocationRanges } from "./LocationRanges";
import { useRouteMatch } from "react-router-dom";
import { useShowFreight } from "../../../../hooks-api/useFreight";
import { Loader } from "../../../../components";

export default ({ goBack }) => {
  //const [screen, setScreen] = useState("ranges");
  const [screen, setScreen] = useState("default");
  const [isNewRange, setIsNewRange] = useState({ isNew: true });

  let match = useRouteMatch("/configs/frete/:id");
  const { data, loading } = useShowFreight({ external_id: match?.params?.id });

  if (loading) {
    return <Loader active={loading} />;
  }

  return (
    <FreightProvider>
      {screen === "ranges" ? (
        <LocationRanges setScreen={setScreen} isNewRange={isNewRange} />
      ) : (
        <FreightUpdate
          data={data}
          setScreen={setScreen}
          setIsNewRange={setIsNewRange}
          goBack={goBack}
        />
      )}
    </FreightProvider>
  );
};
