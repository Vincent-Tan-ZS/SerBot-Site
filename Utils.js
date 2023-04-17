export const GetNumberOfPages = (list, rowNo, colNo) => {
	return colNo === undefined 
		? Math.ceil(list.length / rowNo)
		: 0;
}

export const ChunkArray = (list, chunkSize) => {
	if (list === undefined || list.length <= 0) return [];
	
	return list.reduce((prev, cur, index) => {
		const chunkIndex = Math.floor(index/chunkSize);

		if (!prev[chunkIndex]) {
			prev[chunkIndex] = []
		};

		prev[chunkIndex].push(cur);
		return prev;
	}, []);
}