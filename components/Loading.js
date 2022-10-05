import {Backdrop, CircularProgress, styled} from "@mui/material";
import {useRouter} from "next/router";
import React from "react";

const LoadingScreen = styled(Backdrop)`
	z-index: 999999;
	background-color: rgba(0, 0, 0, 0.8);

	.MuiCircularProgress-root {
		width: 100%;
	}
`;

function Loading() {
    const router = useRouter();

    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const handleStart = (url) => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url) => (url === router.asPath) && setLoading(false);

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    });

	return loading &&
	(
		<LoadingScreen open={true}>
			<CircularProgress />
		</LoadingScreen>
	)
}

export default Loading;