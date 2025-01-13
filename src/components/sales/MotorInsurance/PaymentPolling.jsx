import React, { useState, useEffect, useCallback } from 'react';
import PaymentsApi from '../../api/PaymentsApi';

const PaymentPolling = ({ merchantReference, onSuccess, onFailure, initialToken }) => {
  const [polling, setPolling] = useState(true);
  const [token, setToken] = useState(initialToken);

  const authenticate = useCallback(async () => {
    try {
      const authResult = await PaymentsApi.post(`/Authenticate/login`, {
        username: "InnovationEcocash",
        password: "InnoEco@15022023#"
      });

      if (authResult && authResult.data.token) {
        setToken(authResult.data.token);
        return authResult.data.token;
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }, []);

  const confirmPayment = useCallback(async (merchantReference, currentToken) => {
    try {
      const headers = {
        Authorization: `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      };

      const result = await PaymentsApi.post(`/Mobilemoney/CheckEcocashTransaction`, {
        merchantRef: merchantReference
      }, { headers });

      return result;
    } catch (error) {
      console.error("Error confirming payment:", error);
      return null;
    }
  }, []);

  const logPollingTime = useCallback(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    console.log(`Polling attempt at ${hours}:${minutes}:${seconds}`);
  }, []);

  useEffect(() => {
    let timeoutId;

    const pollPayment = async () => {
      let currentToken = token;
      if (!currentToken) {
        currentToken = await authenticate();
        if (!currentToken) {
          setPolling(false);
          onFailure();
          return;
        }
      }

      logPollingTime(); // Log the time of the polling attempt

      const result = await confirmPayment(merchantReference, currentToken);
      if (result && result.data.resultDescription === 'Successful') {
        setPolling(false);
        onSuccess();
      } else if (result && result.data.resultDescription === "FAILED") {
        setPolling(false);
        onFailure();
      } else {
        timeoutId = setTimeout(pollPayment, 10000); // Poll every 10 seconds
      }
    };

    if (polling) {
      pollPayment();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [polling, merchantReference, token, authenticate, confirmPayment, onSuccess, onFailure, logPollingTime]);

  return (
    <div className="text-center">
      {polling && <p>Confirming payment... Please wait.</p>}
    </div>
  );
};

export default PaymentPolling;