import React, { useState } from "react";
import Doc from "./Doc";
const participants = [1, 2];
const App = () => {
    const [message, setMessage] = useState(
        Object.fromEntries(
            participants.map((siteId) => [siteId, { atom: [null, [[2, siteId]], 2], action: "delete" }])
        )
    );

    const emit = (siteId, message) => {
        setMessage((prev) => {
            const nextState = { ...prev };
            Object.keys(prev).forEach((key) => {
                if (+key !== +siteId) {
                    nextState[key] = message;
                }
            });
            return nextState;
        });
    };

    return (
        <div className="doc-container">
            {participants.map((siteId) => {
                return <Doc key={siteId} siteId={siteId} message={message[siteId]} emit={emit} />;
            })}
        </div>
    );
};

export default App;
