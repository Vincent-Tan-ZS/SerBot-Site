import {Grid, Stack, Typography} from "@mui/material";
import AppBody from "../components/AppBody";
import WhatsNewBox from "../components/WhatsNewBox";
import useSWRImmutable from "swr/immutable";
import LoadingBox from "../components/LoadingBox";
import { ApiFetcher } from "../Utils";

function Home() {
	const { data, isValidating } = useSWRImmutable("/api/newupdates", ApiFetcher);

  return (
    <AppBody>
      {
        isValidating === true &&
        <LoadingBox />
      }
      {
        isValidating !== true &&
        <Stack gap={1}>
          <Typography variant={"h3"}>What&apos;s New</Typography>
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
        </Stack>
      }
    </AppBody>
  )
}

export default Home;