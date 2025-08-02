import React, { SetStateAction } from 'react'

type PagesType = {
    page1: number,
    page2: number,
    page3: number
}

type PaginationProps = {
    donationLenght: number,
    activePagination: number,
    setActivePagination: React.Dispatch<SetStateAction<number>>,
    pages: PagesType,
    setPages: React.Dispatch<SetStateAction<PagesType>>,
    startIndex: number,
    setStartIndex: React.Dispatch<SetStateAction<number>>,
    endIndex: number,
    setEndIndex: React.Dispatch<SetStateAction<number>>,
}


const Pagination = ({ 
    donationLenght, activePagination, setActivePagination, pages, setPages, startIndex, setStartIndex, endIndex, setEndIndex
}: PaginationProps) => {


    const handlePagination = (id: string, page?: number) => {
        if(id === 'prev') {
            setStartIndex(startIndex - 10);
            setEndIndex(endIndex - 10);

            if(activePagination > 1) {
                setActivePagination(activePagination - 1);
            }

            if(activePagination === 1 && pages.page1 > 1) {
                setPages(prev => ({
                    page1: prev.page1 - 1,
                    page2: prev.page2 - 1,
                    page3: prev.page3 - 1,
                }))
            }
        }

        if(id === '1') {
            const active = activePagination === 2 ? pages.page2 - page! 
                : activePagination === 3 ? pages.page3 - page!
                    : page!;

            switch (active) {
                case 1:
                    setStartIndex(startIndex - 10);
                    setEndIndex(endIndex - 10);
                    setActivePagination(activePagination - 1);
                    break;
                
                case 2:
                    setStartIndex(startIndex - 20);
                    setEndIndex(endIndex - 20);
                    setActivePagination(activePagination - 2);
                default:
                    break;
            }
        }

        if(id === '2') {
            const active = activePagination === 1 ? pages.page1 : pages.page3;
            
            if(active > page!) {
                setStartIndex(startIndex - 10);
                setEndIndex(endIndex - 10);
                setActivePagination(activePagination - 1);
            }

            if(active < page!) {
                setStartIndex(startIndex + 10);
                setEndIndex(endIndex + 10);
                setActivePagination(activePagination + 1);
            }
        }

        if(id === '3') {
            const active = activePagination === 1 ? page! - pages.page1 
                : activePagination === 2 ? page! - pages.page2
                    : page!;

            switch (active) {
                case 1:
                    setStartIndex(startIndex + 10);
                    setEndIndex(endIndex + 10);
                    setActivePagination(activePagination + 1);
                    break;
                
                case 2:
                    setStartIndex(startIndex + 20);
                    setEndIndex(endIndex + 20);
                    setActivePagination(activePagination + 2);
                default:
                    break;
            }
        }

        if(id === 'next') {
            setStartIndex(startIndex + 10);
            setEndIndex(endIndex + 10);

            if(activePagination < 3) {
                setActivePagination(activePagination + 1);
            }

            if(Number(activePagination) === 3) {
                setPages(prev => ({
                    page1: prev.page1 + 1,
                    page2: prev.page2 + 1,
                    page3: prev.page3 + 1,
                }))
            }
        }
    }


    
  return (
    <div className='flex items-center gap-[5px]'>
        {donationLenght > 0 && donationLenght <= 10 ? (

            <button 
                className={`page-btn ${activePagination === 1 ? 'active' : ''}`}
                onClick={() => handlePagination('1', pages.page1)}
            >{pages.page1}</button>

        ) : donationLenght > 10 && donationLenght <= 20 ? (
            <>
                {startIndex > 0 && (
                    <button 
                        className='page-btn'
                        onClick={() => handlePagination('prev', )}
                    >Previous</button>
                )}

                <button 
                    className={`page-btn ${activePagination === 1 ? 'active' : ''}`}
                    onClick={() => handlePagination('1', pages.page1)}
                >{pages.page1}</button>

                <button 
                    className={`page-btn ${activePagination === 2 ? 'active' : ''}`}
                    onClick={() => handlePagination('2', pages.page2)}
                >{pages.page2}</button>
            </>
        ) : donationLenght > 20 && donationLenght <= 30 ? (
            <>
                {startIndex > 0 && (
                    <button 
                        className='page-btn'
                        onClick={() => handlePagination('prev', )}
                    >Previous</button>
                )}

                <button 
                    className={`page-btn ${activePagination === 1 ? 'active' : ''}`}
                    onClick={() => handlePagination('1', pages.page1)}
                >{pages.page1}</button>

                <button 
                    className={`page-btn ${activePagination === 2 ? 'active' : ''}`}
                    onClick={() => handlePagination('2', pages.page2)}
                >{pages.page2}</button>

                <button 
                    className={`page-btn ${activePagination === 3 ? 'active' : ''}`}
                    onClick={() => handlePagination('3', pages.page3)}
                >{pages.page3}</button>
            </>
        ) : donationLenght > 30 ? (
            <>
                {startIndex > 0 && (
                    <button 
                        className='page-btn'
                        onClick={() => handlePagination('prev', )}
                    >Previous</button>
                )}

                <button 
                    className={`page-btn ${activePagination === 1 ? 'active' : ''}`}
                    onClick={() => handlePagination('1', pages.page1)}
                >{pages.page1}</button>

                <button 
                    className={`page-btn ${activePagination === 2 ? 'active' : ''}`}
                    onClick={() => handlePagination('2', pages.page2)}
                >{pages.page2}</button>

                <button 
                    className={`page-btn ${activePagination === 3 ? 'active' : ''}`}
                    onClick={() => handlePagination('3', pages.page3)}
                >{pages.page3}</button>

                {donationLenght > endIndex && (
                    <button 
                        className='page-btn'
                        onClick={() => handlePagination('next', )}
                    >Next</button>
                )}
            </>
        ) : <></>}
    </div>
  )
}

export default Pagination