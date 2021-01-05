import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import { Heading } from "rebass";

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
  const [kissKissUpdate, setKissKissUpdate] = useState("");
  const [ululeUpdate, setUluleUpdate] = useState("");
  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then(({ kisskissbankbank, ulule }) => {
        setKissKissAmount(formatAmount(kisskissbankbank));
        setUluleAmount(formatAmount(ulule));
      });
  }, []);
  useEffect(() => {
    const evtSource = new EventSource("/sse");
    evtSource.onopen = (e) => console.log("open", e);
    evtSource.onerror = (e) => console.error("error", e);
    evtSource.addEventListener("kisskissbankbank", (e) => {
      console.log(e.data);
      const { amount, update } = JSON.parse(e.data);
      setKissKissAmount(formatAmount(amount));
      setKissKissUpdate(formatDate(update));
    });
    evtSource.addEventListener("ulule", (e) => {
      const { amount, update } = JSON.parse(e.data);
      setUluleAmount(formatAmount(amount));
      setUluleUpdate(formatDate(update));
    });
  }, []);
  return (
    <Layout>
      <Heading fontSize={[5]}>Projets populaires</Heading>
      <Heading color="secondary">Argent collecté en temps réel</Heading>
      <ul>
        <li>
          KissKissBankBank : <span>{kissKissAmount}</span>€ -{" "}
          <span>{kissKissUpdate}</span>
        </li>
        <li>
          Ulule : <span>{ululeAmount}</span>€ - <span>{ululeUpdate}</span>
        </li>
      </ul>
    </Layout>
  );
}

export default HomePage;
