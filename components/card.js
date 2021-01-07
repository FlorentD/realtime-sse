import React from "react";
import { Box, Image, Heading, Text } from "rebass";

const Card = ({ src, amount, update }) => {
  return (
    <Box variant="card">
      <Image bg="white" p={50} src={src} />
      <Heading color="secondary">{amount} €</Heading>
      <Text fontStyle="italic">Mis à jour le</Text>
      <Text>{update}</Text>
    </Box>
  );
};

export default Card;
