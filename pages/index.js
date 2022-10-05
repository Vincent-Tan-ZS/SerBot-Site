import {Box, Button, styled, Typography} from "@mui/material";
import Link from "next/link";
import AppBody from "../components/AppBody";
import { ViewList as ViewListIcon } from "@mui/icons-material";

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
          <Link href="/commands" passHref>
            <Button variant={"contained"}>
              <ViewListIcon />
              Commands
            </Button>
          </Link>
        </HeaderBox>
      </AppBody>
    </>
  )
}

export default Home;