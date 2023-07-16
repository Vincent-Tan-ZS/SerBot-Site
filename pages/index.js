import {Box, Grid, styled} from "@mui/material";
import AppBody from "../components/AppBody";
import WhatsNewBox from "../components/WhatsNewBox";
import useSWRImmutable from "swr/immutable";

const HeaderBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-contents: center;

  flex-direction: column;
`;

const fetcher = (...args) => fetch(...args).then(res => res.json());

function Home() {
	const { data, isValidating } = useSWRImmutable("/api/newupdates", fetcher);

  return (
    <>
      <AppBody>
        <HeaderBox>
          <Box sx={{height: '100px'}}></Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <WhatsNewBox title={"SerBot"} data={data === undefined ? [] : data.filter(d => d.FeatureType === "SerBot")} />
            </Grid>
            <Grid item xs={6}>
              <WhatsNewBox title={"Site"} data={data === undefined ? [] : data.filter(d => d.FeatureType === "Site")}  />
            </Grid>
          </Grid>
        </HeaderBox>
      </AppBody>
    </>
  )
}

export default Home;