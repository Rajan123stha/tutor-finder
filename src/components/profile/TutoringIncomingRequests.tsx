import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { getTutoringRequests, updateRequestStatus } from "../api";

const TutoringIncomingRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const data = await getTutoringRequests();
    setRequests(data);
  };

  const handleRequest = (status: "accepted" | "rejected") => {
    // ...existing code...
  };

  return (
    <View>
      {requests.map((request) => (
        <View key={request.id}>
          <Text>{request.name}</Text>
          <Button title="Accept" onPress={() => handleRequest("accepted")} />
          <Button title="Reject" onPress={() => handleRequest("rejected")} />
        </View>
      ))}
    </View>
  );
};

export default TutoringIncomingRequests;
