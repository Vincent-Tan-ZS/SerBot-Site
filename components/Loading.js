import {Backdrop, styled} from "@mui/material";
import {useRouter} from "next/router";
import React from "react";
import LoadingIcon from "./LoadingIcon";

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
    const [nextURL, setNextURL] = React.useState("");

    const handleStart = (url) => {
        if (url === router.pathname) return;

        setNextURL(url);
        setLoading(true);
    }

    const handleComplete = (url) => setLoading(false);

    React.useEffect(() => {
        if (router.pathname === nextURL)
        {
            setNextURL("");
            setLoading(false);
        }

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeError', handleComplete)
        }
    }, [router]);

	return loading &&
	(
		<LoadingScreen open={true}>
            <LoadingIcon />
		</LoadingScreen>
	)
}

export default Loading;