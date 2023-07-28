import {Box, Grid, Stack} from "@mui/material";
import AppBody from "../components/AppBody";
import WhatsNewBox from "../components/WhatsNewBox";
import useSWRImmutable from "swr/immutable";
import LoadingBox from "../components/LoadingBox";

const fetcher = (...args) => fetch(...args).then(res => res.json());

function Home() {
	const { data, isValidating } = useSWRImmutable("/api/newupdates", fetcher);

  return (
    <AppBody>
      {
        isValidating === true &&
        <LoadingBox />
      }
      {
        isValidating !== true &&
        <>
          <Box height={'20%'}></Box>
          <Stack alignItems={'center'} justifyContent={'center'} direction={'column'} spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <WhatsNewBox title={"SerBot"} data={data === undefined ? [] : data.filter(d => d.FeatureType === "SerBot")} />
              </Grid>
              <Grid item xs={6}>
                <WhatsNewBox title={"Site"} data={data === undefined ? [] : data.filter(d => d.FeatureType === "Site")}  />
              </Grid>
            </Grid>
          </Stack>
        </>
      }
    </AppBody>
  )
}

export default Home;