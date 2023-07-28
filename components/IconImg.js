import {styled} from "@mui/material";
import icon from '../public/Icon.png';

const IconImgStyle = styled('img')`
  border: 4px solid #0E4686;
  border-radius: 50%;
`;

export default function IconImage(props)
{
	return (
		<IconImgStyle {...props} src={icon.src} alt={"SerBot icon. Credit: PhoenixFirebirb"} />
	)
}