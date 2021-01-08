import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import Card from "../components/card";
import { Heading, Flex, Text } from "rebass";

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const formatAmount = (amount) =>
  `${amount}`.split(/(?=(?:\d{3})+(?:\.|$))/g).join(" ");
const formatDate = (date) =>
  `${new Date(date).toLocaleDateString("fr-FR", options)}`;

function HomePage() {
  const [kissKissAmount, setKissKissAmount] = useState(0);
  const [ululeAmount, setUluleAmount] = useState(0);
  const [kickstarterAmount, setKickstarterAmount] = useState(0);
  const [kissKissUpdate, setKissKissUpdate] = useState("");
  const [ululeUpdate, setUluleUpdate] = useState("");
  const [kickstarterUpdate, setKickstarterUpdate] = useState("");
  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then(({ kisskissbankbank, ulule, kickstarter }) => {
        setKissKissAmount(formatAmount(kisskissbankbank));
        setUluleAmount(formatAmount(ulule));
        setKickstarterAmount(formatAmount(kickstarter));
      });
  }, []);
  useEffect(() => {
    const evtSource = new EventSource("/sse");
    evtSource.onopen = (e) => console.log("open", e);
    evtSource.onerror = (e) => console.error("error", e);
    evtSource.addEventListener("kisskissbankbank", (e) => {
      const { amount, update } = JSON.parse(e.data);
      setKissKissAmount(formatAmount(amount));
      setKissKissUpdate(formatDate(update));
    });
    evtSource.addEventListener("ulule", (e) => {
      const { amount, update } = JSON.parse(e.data);
      setUluleAmount(formatAmount(amount));
      setUluleUpdate(formatDate(update));
    });
    evtSource.addEventListener("kickstarter", (e) => {
      const { amount, update } = JSON.parse(e.data);
      setKickstarterAmount(formatAmount(amount));
      setKickstarterUpdate(formatDate(update));
    });
  }, []);
  return (
    <Layout>
      <Heading fontSize={[5, 6, 7]}>Temps réel</Heading>
      <Text color="primary" fontWeight="bold">
        Argent collecté en temps réel sur les 16 premiers projets populaires du
        moment
      </Text>
      <Text color="primary" sx={{ fontStyle: "italic" }}>
        Seuls les projets français sont pris en compte sur Kickstarter
      </Text>
      <Flex pt={5}>
        <Card
          src="/KissKiss.png"
          amount={kissKissAmount}
          update={kissKissUpdate}
        />
        <Card src="/ulule.png" amount={ululeAmount} update={ululeUpdate} />
        <Card
          src="/kickstarter.png"
          amount={kickstarterAmount}
          update={kickstarterUpdate}
        />
      </Flex>
    </Layout>
  );
}

export default HomePage;
