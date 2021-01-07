import React, { useEffect, useState } from "react";
import { Box, Image, Heading, Text } from "rebass";
import classNames from "classnames";

const Card = ({ src, amount, update }) => {
  const [changing, isChanging] = useState(false);
  const [newColor, changeColor] = useState(false);
  useEffect(() => {
    changeColor(true);
    setTimeout(() => {
      isChanging(true);
      setTimeout(() => {
        isChanging(false);
      }, 1100);
    }, 100);
    setTimeout(() => {
      changeColor(false);
    }, 200);
  }, [amount]);
  return (
    <Box variant="card">
      <Image
        bg="white"
        p={50}
        src={src}
        sx={{
          borderRadius: 10,
        }}
      />
      <Heading
        color="secondary"
        className={classNames({
          "text-transition-apply": newColor,
          "text-transition": changing,
        })}
      >
        {amount} €
      </Heading>
      <Text fontStyle="italic" fontSize={[1]}>
        Mis à jour le
      </Text>
      <Text>{update}</Text>
    </Box>
  );
};

export default Card;
