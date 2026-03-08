import React from "react";

const TransformListItem = (data, transformPredicate) => transformPredicate
    ? data.map(transformPredicate)
    : data;

// Pagination Methods
const GetNumberOfPages = (list, rowNo, colNo) => {
	return colNo === undefined 
		? Math.ceil(list.length / rowNo)
		: 0;
}

export default function usePagination(noOfRows, data, list, setList, filterText, transformListItem, filterPredicate, sortPredicate) {
    const [curPage, setCurPage] = React.useState(1);
    const [numberOfPages, setNumberOfPages] = React.useState(1);
    const [pageList, setPageList] = React.useState([]);
    
    React.useEffect(() => {
        let _list = [];
        let _numberOfPages = 0;

        if (data)
        {
            _list = TransformListItem(data, transformListItem);
            _numberOfPages = GetNumberOfPages(_list, noOfRows);
        }

        setList(_list);
        setNumberOfPages(_numberOfPages);
    }, [data]);
    
    React.useEffect(() => {
        if (list === undefined || list.length <= 0) return;

        let _pageList = GetPageList(list);
        setPageList(_pageList);
    }, [list, curPage]);

    React.useEffect(() => {
        if (data === undefined || data.length <= 0) return;

        let _filtered = data.filter(c => filterPredicate(c, filterText));

        if (sortPredicate)
        {
            _filtered = _filtered.sort(sortPredicate);
        }

        _filtered = TransformListItem(_filtered, transformListItem);

        let _pageList = GetPageList(_filtered, 1);
        let _numberOfPages = GetNumberOfPages(_filtered, noOfRows);

        setList(_filtered);
        setCurPage(1);
        setNumberOfPages(_numberOfPages);
        setPageList(_pageList);
    }, [filterText, sortPredicate]);

    const GetPageList = (_list, _page = curPage) => {
        return _list.slice((_page - 1) * noOfRows, _page * noOfRows);
    }

    return {
        curPage,
        setCurPage,
        numberOfPages,
        pageList
    }
}