import {Box, Button, Stack, styled, Typography} from "@mui/material";
import Link from "next/link";
import AppBody from "../components/AppBody";
import { ViewList as ViewListIcon, HourglassBottom as HourglassBottomIcon } from "@mui/icons-material";

const HeaderBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-contents: center;

  flex-direction: column;
`;

function Home() {
  return (
    <>
      <AppBody>
        <HeaderBox>
          <Typography variant={"h1"}>
            W.I.P.
          </Typography>
          <Typography variant={"h3"}>
            Sorry, this page is still a Work In Progress :(
          </Typography>
          <Stack gap={1} direction={"column"} justifyContent={"center"} alignItems={"center"}>
            <Link href="/commands" passHref>
              <Button variant={"contained"}>
                <ViewListIcon />
                &nbsp;Commands
              </Button>
            </Link>
            <Link href="/countdowns" passHref>
              <Button variant={"contained"}>
                <HourglassBottomIcon />
                &nbsp;Countdowns
              </Button>
            </Link>
          </Stack>
        </HeaderBox>
      </AppBody>
    </>
  )
}

export default Home;