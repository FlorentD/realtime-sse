import React from "react";
import Head from "next/head";
import { ThemeProvider } from "theme-ui";
import theme from "@rebass/preset";
import { Box } from "rebass";

const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <title>Kissbankule Realtime</title>
      </Head>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            maxWidth: 1024,
            mx: "auto",
            p: 10,
          }}
        >
          {children}
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default Layout;
